from __future__ import annotations

import getpass
import json
import mimetypes
import sqlite3
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


BACKEND_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_ROOT.parent
FRONTEND_ROOT = PROJECT_ROOT / "frontend"
DATABASE = BACKEND_ROOT / "catalog.sqlite3"
BUCKET = "catalog-images"


def request_json(url: str, service_key: str, method: str = "GET", payload=None):
    headers = {
        "apikey": service_key,
        "Authorization": f"Bearer {service_key}",
    }
    data = None
    if payload is not None:
        headers["Content-Type"] = "application/json"
        data = json.dumps(payload, ensure_ascii=False).encode("utf-8")
    request = Request(url, data=data, headers=headers, method=method)
    try:
        with urlopen(request, timeout=30) as response:
            body = response.read()
            return json.loads(body) if body else None
    except HTTPError as error:
        message = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Supabase returned HTTP {error.code}: {message}") from error
    except URLError as error:
        raise RuntimeError(f"Could not connect to Supabase: {error.reason}") from error


def main() -> int:
    if not DATABASE.is_file():
        print("backend/catalog.sqlite3 was not found. Run this from the ITECH Fix project folder.")
        return 1

    project_url = input("Supabase project URL: ").strip().rstrip("/")
    service_key = getpass.getpass("Supabase service_role key (input is hidden): ").strip()
    if not project_url.startswith("https://") or not service_key:
        print("Enter a valid HTTPS project URL and service_role key.")
        return 1

    api_url = f"{project_url}/rest/v1/catalog_items"
    try:
        existing = request_json(f"{api_url}?select=id&limit=1", service_key)
        if existing:
            print("The Supabase catalog is not empty; refusing to duplicate existing listings.")
            return 1

        with sqlite3.connect(DATABASE) as connection:
            connection.row_factory = sqlite3.Row
            rows = connection.execute(
                """
                SELECT category, title, description, price, model, part_category,
                       target, stock, image, visible
                FROM catalog_items
                ORDER BY id
                """
            ).fetchall()

        if not rows:
            print("The local catalog has no listings to migrate.")
            return 1

        items = []
        uploaded_images: dict[str, str] = {}
        for row in rows:
            item = dict(row)
            item["visible"] = bool(item["visible"])
            image = item["image"]
            if image and not image.startswith(("http://", "https://", "data:")):
                if image.startswith("/uploads/"):
                    image_file = (BACKEND_ROOT / "uploads" / image[len("/uploads/"):]).resolve()
                    allowed_root = (BACKEND_ROOT / "uploads").resolve()
                else:
                    image_file = (FRONTEND_ROOT / image.lstrip("/")).resolve()
                    allowed_root = FRONTEND_ROOT.resolve()
                if allowed_root not in image_file.parents:
                    raise RuntimeError(f"Catalog image path is outside its asset folder: {image}")
                if image_file.is_file():
                    source_path = image_file.relative_to(allowed_root).as_posix()
                    object_name = f"migrated/{source_path}"
                    public_url = (
                        f"{project_url}/storage/v1/object/public/{BUCKET}/"
                        f"{quote(object_name, safe='/')}"
                    )
                    if object_name not in uploaded_images:
                        content_type = mimetypes.guess_type(image_file.name)[0] or "application/octet-stream"
                        upload = Request(
                            f"{project_url}/storage/v1/object/{BUCKET}/{quote(object_name, safe='/')}",
                            data=image_file.read_bytes(),
                            headers={
                                "apikey": service_key,
                                "Authorization": f"Bearer {service_key}",
                                "Content-Type": content_type,
                                "x-upsert": "true",
                            },
                            method="POST",
                        )
                        try:
                            with urlopen(upload, timeout=60) as response:
                                response.read()
                        except (HTTPError, URLError) as error:
                            if isinstance(error, HTTPError):
                                detail = error.read().decode("utf-8", errors="replace")
                                raise RuntimeError(
                                    f"Image upload failed (HTTP {error.code}): {detail}"
                                ) from error
                            raise RuntimeError(f"Image upload failed: {error.reason}") from error
                        uploaded_images[object_name] = public_url
                    item["image"] = uploaded_images[object_name]
            items.append(item)

        request_json(f"{api_url}?select=id", service_key, "POST", items)
        print(f"Migrated {len(items)} catalog listings to Supabase.")
        print("The service_role key was used only for this run and was not saved.")
        return 0
    except (OSError, sqlite3.Error, RuntimeError, ValueError) as error:
        print(f"Migration failed: {error}")
        return 1


if __name__ == "__main__":
    sys.exit(main())
