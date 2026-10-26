from __future__ import annotations

import hashlib
import hmac
import json
import os
import secrets
import sqlite3
import time
from email import policy
from email.parser import BytesParser
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlparse


BACKEND_ROOT = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_ROOT.parent
FRONTEND_ROOT = PROJECT_ROOT / "frontend"
DATABASE = BACKEND_ROOT / "catalog.sqlite3"
UPLOADS = BACKEND_ROOT / "uploads"
HOST = "127.0.0.1"
PORT = 8765
MAX_REQUEST_BYTES = 12 * 1024 * 1024
MAX_IMAGE_BYTES = 8 * 1024 * 1024
ALLOWED_CATEGORIES = {
    "home-showcase",
    "phone-sales",
    "phone-repairs",
    "laptop-sales",
    "laptop-repairs",
    "gadgets",
    "phone-parts",
}
ALLOWED_PART_CATEGORIES = {
    "Displays",
    "Batteries",
    "Charging ports",
    "Cameras",
    "Flex cables",
    "Motherboards & ICs",
    "Audio",
    "Tools",
    "Accessories",
}
ALLOWED_TARGETS = {"phones", "repairs", "laptops", "gadgets"}
DEFAULT_CATALOG = [
    ("home-showcase", "Phone sales", "Quality phones for different budgets, from trusted brands and easy-to-check models.", "", "", "Accessories", "", "Phones for Sell.jpg", "phones"),
    ("home-showcase", "Phone repair", "Screen, charging, battery, software, and board-level fixes handled with careful diagnostics.", "", "", "Accessories", "", "Phone Repair.jpg", "repairs"),
    ("home-showcase", "Laptop sales", "Business, student, and gaming laptops to suit different needs and budgets.", "", "", "Accessories", "", "Laptop for sell.jpg", "laptops"),
    ("home-showcase", "Laptop repairs", "Screen, battery, keyboard, charging, software, and motherboard repairs, plus upgrades and spare parts.", "", "", "Accessories", "", "Laptop repair.jpg", "laptops"),
    ("home-showcase", "Accessories & gadgets", "Chargers, cables, tools, gaming gear, and other essential tech items that keep devices working.", "", "", "Accessories", "", "Assessories.jpg", "gadgets"),
    ("phone-sales", "iPhone", "Ask about available iPhone models, storage options, and new or pre-owned condition.", "Ask for current price", "", "Accessories", "Ask about availability", "Phones for Sell.jpg"),
    ("phone-sales", "Samsung Galaxy", "Ask about Galaxy S, A, and other series models, storage, and condition.", "Ask for current price", "", "Accessories", "Ask about availability", "Phones for Sell.jpg"),
    ("phone-sales", "Tecno Smartphones", "Ask about available Tecno models, storage options, and condition.", "Ask for current price", "", "Accessories", "Ask about availability", "Phones for Sell.jpg"),
    ("phone-sales", "Infinix Smartphones", "Ask about available Infinix models, storage options, and condition.", "Ask for current price", "", "Accessories", "Ask about availability", "Phones for Sell.jpg"),
    ("phone-sales", "Other Android Phones", "Ask about Google Pixel, Xiaomi, OnePlus, or another Android brand.", "Ask for current price", "", "Accessories", "Ask about availability", "Phones for Sell.jpg"),
    ("phone-repairs", "Screen replacement", "Cracked glass, display lines, touch faults, and damaged OLED or LCD assemblies.", "Quote by model", "", "Displays", "Available to book", "Phone Repair.jpg"),
    ("phone-repairs", "Charging-port repair", "Loose connectors, intermittent charging, port damage, and related flex faults.", "Quote by model", "", "Charging ports", "Available to book", "Phone Repair.jpg"),
    ("phone-repairs", "Software & OS repair", "System errors, update failures, boot loops, setup support, and software restoration.", "Quote by issue", "", "Accessories", "Available to book", "Phone Repair.jpg"),
    ("phone-repairs", "IC & motherboard repair", "Board diagnostics and component-level repair for no-power, no-charge, and related faults.", "After diagnosis", "", "Motherboards & ICs", "Available to book", "Phone Repair.jpg"),
    ("phone-repairs", "Network & unlock services", "Network troubleshooting and eligible device unlock support, subject to ownership checks.", "Quote by model", "", "Accessories", "Available to book", "Phone Repair.jpg"),
    ("phone-repairs", "Water-damage repair", "Prompt inspection, safe cleaning, and board-level assessment after liquid exposure.", "After inspection", "", "Motherboards & ICs", "Available to book", "Phone Repair.jpg"),
    ("phone-repairs", "Battery replacement", "Battery diagnostics and replacement for poor health, swelling, or short runtime.", "Quote by model", "", "Batteries", "Available to book", "Battery Replacement.jpg"),
    ("phone-repairs", "Specialized repairs", "Camera, speaker, microphone, flex cable, buttons, and other device-specific faults.", "Tell us the fault", "", "Accessories", "Available to book", "Phone Repair.jpg"),
    ("laptop-sales", "MacBook", "Ask about available MacBook Air and MacBook Pro models and configurations.", "Ask for current price", "", "Accessories", "Ask about availability", "Laptop for sell.jpg"),
    ("laptop-sales", "Dell, HP & Lenovo Laptops", "Ask about available business, student, and everyday laptop models.", "Ask for current price", "", "Accessories", "Ask about availability", "Dell Laptop for sell 2.jpg"),
    ("laptop-sales", "Gaming Laptops", "Ask about gaming laptop availability and configurations to match your needs.", "Ask for current price", "", "Accessories", "Ask about availability", "Laptop for sell.jpg"),
    ("laptop-repairs", "Retina & 4K Laptop Screen Replacement", "Repair shattered screens, distorted lines, backlight bleed, and display cable failures.", "From ₦133,500", "", "Displays", "Available to book", "Laptop repair.jpg"),
    ("laptop-repairs", "MacBook & PC Motherboard Logic Board Repair", "Micro-soldering for no power, shorted capacitors, liquid spills, and related faults.", "From ₦148,500", "", "Motherboards & ICs", "Available to book", "Motherboard Cleaning.jpg"),
    ("laptop-repairs", "Internal Battery Replacement & Calibration", "Replace swollen or worn laptop batteries and check fit and calibration.", "From ₦88,500", "", "Batteries", "Available to book", "Battery Replacement.jpg"),
    ("laptop-repairs", "Thermal Repaste & Fan Cleaning", "Clean fans and service thermal compounds to help address overheating and fan noise.", "From ₦58,500", "", "Accessories", "Available to book", "Dirty_Dusty & Cleaned Laptop Fan.jpg"),
    ("laptop-repairs", "SSD & RAM Upgrade", "Upgrade laptop storage and memory. Ask about compatible drives and cloning.", "From ₦82,500", "", "Accessories", "Available to book", "The missing drive.jpg"),
    ("laptop-repairs", "Keyboard & Trackpad Repair", "Fix sticky or unresponsive keys, backlights, and trackpad faults.", "From ₦73,500", "", "Accessories", "Available to book", "Laptop repair.jpg"),
    ("gadgets", "PS5 Consoles & Accessories", "Ask about PlayStation 5 consoles, controllers, headsets, and gaming accessories.", "Ask for availability", "", "Accessories", "Check stock", "Assessories.jpg"),
    ("gadgets", "Controllers, Headsets & More", "Ask about gaming controllers, headsets, and compatible accessories.", "Ask for availability", "", "Accessories", "Check stock", "Assessories.jpg"),
    ("gadgets", "iPhone 15 Pro OLED Assembly", "Super Retina XDR OLED replacement assembly with ProMotion 120Hz support.", "₦209,985", "", "Accessories", "Check stock", "Assessories.jpg"),
    ("gadgets", "Galaxy S24 Ultra AMOLED + Frame", "Ask about availability and compatibility for this display assembly.", "₦284,985", "", "Accessories", "Check stock", "Assessories.jpg"),
    ("gadgets", "ITECH GaN 100W Charger", "Dual USB-C and USB-A fast charger for compatible phones and laptops.", "₦67,485", "", "Accessories", "Check stock", "Assessories.jpg"),
    ("gadgets", "Rugged 240W USB-C Cable", "2-metre USB-C cable for compatible charging and data use.", "₦28,485", "", "Accessories", "Check stock", "Assessories.jpg"),
    ("gadgets", "64-in-1 Precision Screwdriver Set", "Precision repair toolkit for phones, laptops, gaming devices, and more.", "₦52,485", "", "Tools", "Check stock", "Assessories.jpg"),
    ("gadgets", "AirPods Pro Battery Renewal Service", "Battery renewal and service for a pair of AirPods Pro earbuds.", "₦67,500", "", "Accessories", "Available to book", "Assessories.jpg"),
    ("phone-parts", "Samsung A15 LCD Screen", "Replacement display for Samsung A15. Confirm exact model compatibility before order.", "34000", "Samsung A15", "Displays", "Available", ""),
    ("phone-parts", "iPhone 11 Battery", "Replacement battery for iPhone 11. Confirm condition and stock before purchase.", "18500", "iPhone 11", "Batteries", "Available", ""),
    ("phone-parts", "Redmi Note 12 Charging Port", "Replacement charging port for Redmi Note 12.", "9500", "Redmi Note 12", "Charging ports", "Check stock", ""),
    ("phone-parts", "Samsung A15 Charging Flex", "Replacement charging flex cable for Samsung A15.", "8500", "Samsung A15", "Flex cables", "Available", ""),
    ("phone-parts", "iPhone 11 Rear Camera", "Replacement rear camera for iPhone 11.", "22000", "iPhone 11", "Cameras", "Check stock", ""),
    ("phone-parts", "Redmi Note 12 Charging IC", "Charging IC replacement component for Redmi Note 12.", "12500", "Redmi Note 12", "Motherboards & ICs", "Check stock", ""),
    ("phone-parts", "Samsung A15 Motherboard", "Replacement motherboard for Samsung A15. Confirm exact part and stock.", "52000", "Samsung A15", "Motherboards & ICs", "Check stock", ""),
    ("phone-parts", "Precision Phone Repair Tool Set", "Universal precision toolkit for phone repair.", "14500", "Universal", "Tools", "Available", ""),
    ("phone-parts", "Universal Speaker & Microphone Parts", "Universal audio replacement parts. Confirm device compatibility.", "6500", "Universal", "Audio", "Check stock", ""),
    ("phone-parts", "Braided USB-C Cable", "Universal braided USB-C cable.", "4500", "Universal", "Accessories", "Available", ""),
]
ALLOWED_IMAGE_TYPES = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
    "image/gif": ".gif",
}
SESSIONS: dict[str, tuple[str, float]] = {}
SESSION_LIFETIME = 12 * 60 * 60
ADMIN_PASSWORD = "Itechfix"


class ClosingConnection(sqlite3.Connection):
    def __exit__(self, exc_type, exc_value, traceback):
        try:
            return super().__exit__(exc_type, exc_value, traceback)
        finally:
            self.close()


def connect_database() -> sqlite3.Connection:
    connection = sqlite3.connect(DATABASE, factory=ClosingConnection)
    connection.row_factory = sqlite3.Row
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS admin (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            salt BLOB NOT NULL,
            password_hash BLOB NOT NULL
        )
        """
    )
    admin_columns = {
        row["name"] for row in connection.execute("PRAGMA table_info(admin)")
    }
    if "username" not in admin_columns:
        connection.execute(
            "ALTER TABLE admin ADD COLUMN username TEXT NOT NULL DEFAULT 'adminowner'"
        )
    connection.execute(
        """
        CREATE TABLE IF NOT EXISTS catalog_items (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            category TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL DEFAULT '',
            price TEXT NOT NULL DEFAULT '',
            model TEXT NOT NULL DEFAULT '',
            part_category TEXT NOT NULL DEFAULT 'Accessories',
            target TEXT NOT NULL DEFAULT 'phones',
            stock TEXT NOT NULL DEFAULT '',
            image TEXT NOT NULL DEFAULT '',
            visible INTEGER NOT NULL DEFAULT 1,
            created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    connection.execute(
        "CREATE TABLE IF NOT EXISTS app_settings (key TEXT PRIMARY KEY, value TEXT NOT NULL)"
    )
    single_password_auth = connection.execute(
        "SELECT value FROM app_settings WHERE key = 'single_password_auth_v1'"
    ).fetchone()
    if not single_password_auth:
        salt = secrets.token_bytes(16)
        password_hash = hashlib.pbkdf2_hmac(
            "sha256", ADMIN_PASSWORD.encode("utf-8"), salt, 310_000
        )
        connection.execute(
            """
            INSERT INTO admin (id, salt, password_hash, username)
            VALUES (1, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
                salt = excluded.salt,
                password_hash = excluded.password_hash,
                username = excluded.username
            """,
            (salt, password_hash, "admin"),
        )
        connection.execute(
            "INSERT INTO app_settings (key, value) VALUES ('single_password_auth_v1', '1')"
        )
    seeded = connection.execute(
        "SELECT value FROM app_settings WHERE key = 'default_catalog_seeded'"
    ).fetchone()
    if not seeded:
        for entry in DEFAULT_CATALOG:
            category, title, description, price, model, part_category, stock, image, *target = entry
            page_target = target[0] if target else "phones"
            connection.execute(
                """
                INSERT INTO catalog_items
                (category, title, description, price, model, part_category, target, stock, image, visible)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
                """,
                (category, title, description, price, model, part_category, page_target, stock, image),
            )
        connection.execute(
            "INSERT INTO app_settings (key, value) VALUES ('default_catalog_seeded', '1')"
        )
    connection.commit()
    return connection


def public_item(row: sqlite3.Row) -> dict:
    return {key: row[key] for key in (
        "id", "category", "title", "description", "price", "model", "part_category", "target",
        "stock", "image", "visible"
    )}


class CatalogHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(FRONTEND_ROOT), **kwargs)

    def translate_path(self, path: str) -> str:
        requested_path = urlparse(path).path
        if requested_path.startswith("/uploads/"):
            relative_path = unquote(requested_path[len("/uploads/"):])
            return str((UPLOADS / relative_path).resolve())
        return super().translate_path(path)

    def log_message(self, format_string: str, *args) -> None:
        print("%s - %s" % (self.address_string(), format_string % args))

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Referrer-Policy", "same-origin")
        super().end_headers()

    def do_GET(self) -> None:
        path = urlparse(self.path).path
        if path == "/api/status":
            self.send_json({
                "setup_required": not self.admin_exists(),
                "authenticated": self.authenticated(),
                "role": self.session_role(),
            })
            return
        if path == "/api/items":
            with connect_database() as connection:
                rows = connection.execute(
                    "SELECT * FROM catalog_items WHERE visible = 1 ORDER BY id DESC"
                ).fetchall()
            self.send_json([public_item(row) for row in rows])
            return
        if path == "/api/admin/items":
            if not self.require_admin():
                return
            with connect_database() as connection:
                rows = connection.execute(
                    "SELECT * FROM catalog_items ORDER BY id DESC"
                ).fetchall()
            self.send_json([public_item(row) for row in rows])
            return
        if path == "/admin":
            self.path = "/admin.html"
        if path == "/":
            self.path = "/index.html"
        if path.startswith("/uploads/"):
            requested = (UPLOADS / unquote(path[len("/uploads/"):])).resolve()
            if UPLOADS.resolve() not in requested.parents or not requested.is_file():
                self.send_error(HTTPStatus.NOT_FOUND)
                return
        elif path not in {"/", "/admin"}:
            requested = (FRONTEND_ROOT / unquote(path.lstrip("/"))).resolve()
            if (
                requested.parent != FRONTEND_ROOT
                or requested.suffix.lower() not in {
                    ".html", ".css", ".js", ".jpg", ".jpeg", ".png", ".webp", ".gif"
                }
                or not requested.is_file()
            ):
                self.send_error(HTTPStatus.NOT_FOUND)
                return
        super().do_GET()

    def valid_local_origin(self) -> bool:
        host = self.headers.get("Host", "")
        server_host, server_port = self.server.server_address[:2]
        expected_host = f"{server_host}:{server_port}"
        if host not in {expected_host, f"localhost:{server_port}"}:
            self.send_json({"error": "Requests must use the local ITECH Fix address."}, HTTPStatus.FORBIDDEN)
            return False
        origin = self.headers.get("Origin")
        if origin and urlparse(origin).netloc != host:
            self.send_json({"error": "Cross-origin changes are not allowed."}, HTTPStatus.FORBIDDEN)
            return False
        return True

    def do_POST(self) -> None:
        if not self.valid_local_origin():
            return
        path = urlparse(self.path).path
        if path == "/api/login":
            self.login()
        elif path == "/api/logout":
            self.logout()
        elif path == "/api/upload":
            self.upload_image()
        elif path == "/api/items":
            self.save_item()
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

    def do_PUT(self) -> None:
        if not self.valid_local_origin():
            return
        if urlparse(self.path).path.startswith("/api/items/"):
            try:
                item_id = int(urlparse(self.path).path.rsplit("/", 1)[1])
            except ValueError:
                self.send_json({"error": "Invalid item ID."}, HTTPStatus.BAD_REQUEST)
                return
            self.save_item(item_id)
        else:
            self.send_error(HTTPStatus.NOT_FOUND)

    def do_DELETE(self) -> None:
        if not self.valid_local_origin():
            return
        if not urlparse(self.path).path.startswith("/api/items/"):
            self.send_error(HTTPStatus.NOT_FOUND)
            return
        if not self.require_admin():
            return
        try:
            item_id = int(urlparse(self.path).path.rsplit("/", 1)[1])
        except ValueError:
            self.send_json({"error": "Invalid item ID."}, HTTPStatus.BAD_REQUEST)
            return
        with connect_database() as connection:
            result = connection.execute("DELETE FROM catalog_items WHERE id = ?", (item_id,))
            if result.rowcount == 0:
                self.send_json({"error": "Listing not found."}, HTTPStatus.NOT_FOUND)
                return
        self.send_json({"ok": True})

    def read_body(self) -> bytes | None:
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json({"error": "Invalid request length."}, HTTPStatus.BAD_REQUEST)
            return None
        if length < 1 or length > MAX_REQUEST_BYTES:
            self.send_json({"error": "Request must be between 1 byte and 12 MB."}, HTTPStatus.BAD_REQUEST)
            return None
        return self.rfile.read(length)

    def read_json(self) -> dict | None:
        body = self.read_body()
        if body is None:
            return None
        try:
            data = json.loads(body)
        except (UnicodeDecodeError, json.JSONDecodeError):
            self.send_json({"error": "Request body must be valid JSON."}, HTTPStatus.BAD_REQUEST)
            return None
        if not isinstance(data, dict):
            self.send_json({"error": "Request body must be a JSON object."}, HTTPStatus.BAD_REQUEST)
            return None
        return data

    def send_json(self, payload, status: HTTPStatus = HTTPStatus.OK) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def admin_exists(self) -> bool:
        with connect_database() as connection:
            row = connection.execute(
                "SELECT username FROM admin WHERE id = 1"
            ).fetchone()
            return bool(row and (row["username"] or "").strip())

    def authenticated(self) -> bool:
        return self.session_role() is not None

    def session_role(self) -> str | None:
        cookie = self.headers.get("Cookie", "")
        token = next(
            (part.strip().split("=", 1)[1] for part in cookie.split(";")
             if part.strip().startswith("itech_admin=")),
            "",
        )
        session = SESSIONS.get(token)
        if not session:
            return None
        role, expires = session
        if expires < time.time():
            SESSIONS.pop(token, None)
            return None
        return role

    def require_admin(self) -> bool:
        if self.authenticated():
            return True
        self.send_json({"error": "Please sign in to manage the catalog."}, HTTPStatus.UNAUTHORIZED)
        return False

    def create_session(self, role: str, status: HTTPStatus = HTTPStatus.OK) -> None:
        token = secrets.token_urlsafe(32)
        SESSIONS[token] = (role, time.time() + SESSION_LIFETIME)
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Cache-Control", "no-store")
        self.set_session_cookie(token)
        body = json.dumps({"ok": True, "role": role}).encode("utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def set_session_cookie(self, token: str) -> None:
        self.send_header(
            "Set-Cookie",
            f"itech_admin={token}; HttpOnly; SameSite=Strict; Path=/; Max-Age={SESSION_LIFETIME}",
        )

    def login(self) -> None:
        data = self.read_json()
        if data is None:
            return
        password = data.get("password", "")
        if not isinstance(password, str):
            self.send_json({"error": "Password is incorrect."}, HTTPStatus.UNAUTHORIZED)
            return
        with connect_database() as connection:
            admin = connection.execute("SELECT * FROM admin WHERE id = 1").fetchone()
        candidate = hashlib.pbkdf2_hmac(
            "sha256", password.encode("utf-8"), admin["salt"], 310_000
        ) if admin else b""
        valid = bool(admin and hmac.compare_digest(candidate, admin["password_hash"]))
        if not valid:
            self.send_json({"error": "Password is incorrect."}, HTTPStatus.UNAUTHORIZED)
            return
        self.create_session("owner")

    def logout(self) -> None:
        cookie = self.headers.get("Cookie", "")
        token = next(
            (part.strip().split("=", 1)[1] for part in cookie.split(";")
             if part.strip().startswith("itech_admin=")),
            "",
        )
        SESSIONS.pop(token, None)
        self.send_response(HTTPStatus.OK)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Set-Cookie", "itech_admin=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0")
        body = b'{"ok":true}'
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def upload_image(self) -> None:
        if not self.require_admin():
            return
        content_type = self.headers.get("Content-Type", "")
        if not content_type.lower().startswith("multipart/form-data;"):
            self.send_json({"error": "Upload must use multipart form data."}, HTTPStatus.BAD_REQUEST)
            return
        body = self.read_body()
        if body is None:
            return
        message = BytesParser(policy=policy.default).parsebytes(
            f"Content-Type: {content_type}\r\nMIME-Version: 1.0\r\n\r\n".encode("ascii") + body
        )
        if not message.is_multipart():
            self.send_json({"error": "Upload form data could not be read."}, HTTPStatus.BAD_REQUEST)
            return
        image_part = next(
            (part for part in message.iter_parts() if part.get_param("name", header="content-disposition") == "image"),
            None,
        )
        if image_part is None:
            self.send_json({"error": "Choose an image file to upload."}, HTTPStatus.BAD_REQUEST)
            return
        media_type = image_part.get_content_type().lower()
        extension = ALLOWED_IMAGE_TYPES.get(media_type)
        image_data = image_part.get_payload(decode=True) or b""
        if not extension or not image_data or len(image_data) > MAX_IMAGE_BYTES:
            self.send_json({"error": "Use a JPEG, PNG, WEBP, or GIF image under 8 MB."}, HTTPStatus.BAD_REQUEST)
            return
        signatures = {
            "image/jpeg": image_data.startswith(b"\xff\xd8\xff"),
            "image/png": image_data.startswith(b"\x89PNG\r\n\x1a\n"),
            "image/webp": image_data.startswith(b"RIFF") and image_data[8:12] == b"WEBP",
            "image/gif": image_data.startswith((b"GIF87a", b"GIF89a")),
        }
        if not signatures.get(media_type, False):
            self.send_json({"error": "Image contents do not match the selected image format."}, HTTPStatus.BAD_REQUEST)
            return
        UPLOADS.mkdir(exist_ok=True)
        filename = secrets.token_hex(16) + extension
        (UPLOADS / filename).write_bytes(image_data)
        self.send_json({"image": f"/uploads/{filename}"}, HTTPStatus.CREATED)

    def save_item(self, item_id: int | None = None) -> None:
        if not self.require_admin():
            return
        data = self.read_json()
        if data is None:
            return
        category = data.get("category", "")
        title = data.get("title", "")
        description = data.get("description", "")
        price = data.get("price", "")
        model = data.get("model", "")
        part_category = data.get("part_category", "Accessories")
        target = data.get("target", "phones")
        stock = data.get("stock", "")
        image = data.get("image", "")
        visible = data.get("visible", True)
        if category not in ALLOWED_CATEGORIES:
            self.send_json({"error": "Choose a valid catalog section."}, HTTPStatus.BAD_REQUEST)
            return
        if part_category not in ALLOWED_PART_CATEGORIES:
            self.send_json({"error": "Choose a valid spare-part category."}, HTTPStatus.BAD_REQUEST)
            return
        if target not in ALLOWED_TARGETS:
            self.send_json({"error": "Choose a valid storefront destination."}, HTTPStatus.BAD_REQUEST)
            return
        if not isinstance(title, str) or not title.strip() or len(title) > 120:
            self.send_json({"error": "Title is required and must be 120 characters or fewer."}, HTTPStatus.BAD_REQUEST)
            return
        for name, value, limit in (
            ("description", description, 2000),
            ("price", price, 80),
            ("model", model, 120),
            ("part_category", part_category, 60),
            ("target", target, 30),
            ("stock", stock, 80),
            ("image", image, 250),
        ):
            if not isinstance(value, str) or len(value) > limit:
                self.send_json({"error": f"{name.title()} is invalid or too long."}, HTTPStatus.BAD_REQUEST)
                return
        if category == "phone-parts":
            try:
                numeric_price = float(price.replace(",", "").replace("₦", "").strip())
                if numeric_price <= 0:
                    raise ValueError
            except ValueError:
                self.send_json({"error": "Spare-part listings need a numeric price greater than zero."}, HTTPStatus.BAD_REQUEST)
                return
        if image:
            if image.startswith("/uploads/"):
                image_path = (UPLOADS / image[len("/uploads/"):]).resolve()
                valid_image = UPLOADS.resolve() in image_path.parents and image_path.is_file()
            else:
                image_path = (FRONTEND_ROOT / image).resolve()
                valid_image = (
                    image_path.parent == FRONTEND_ROOT
                    and image_path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}
                    and image_path.is_file()
                )
            if not valid_image:
                self.send_json({"error": "Select an existing storefront image or upload a new one."}, HTTPStatus.BAD_REQUEST)
                return
        if not isinstance(visible, bool):
            self.send_json({"error": "Visibility must be true or false."}, HTTPStatus.BAD_REQUEST)
            return
        values = (
            category, title.strip(), description.strip(), price.strip(),
            model.strip(), part_category.strip(), target, stock.strip(), image, int(visible)
        )
        with connect_database() as connection:
            if item_id is None:
                cursor = connection.execute(
                    """
                    INSERT INTO catalog_items
                    (category, title, description, price, model, part_category, target, stock, image, visible)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    """,
                    values,
                )
                item_id = cursor.lastrowid
            else:
                result = connection.execute(
                    """
                    UPDATE catalog_items SET category=?, title=?, description=?,
                    price=?, model=?, part_category=?, target=?, stock=?, image=?, visible=? WHERE id=?
                    """,
                    (*values, item_id),
                )
                if result.rowcount == 0:
                    self.send_json({"error": "Listing not found."}, HTTPStatus.NOT_FOUND)
                    return
            row = connection.execute(
                "SELECT * FROM catalog_items WHERE id = ?", (item_id,)
            ).fetchone()
        self.send_json(public_item(row), HTTPStatus.CREATED if self.command == "POST" else HTTPStatus.OK)


if __name__ == "__main__":
    connection = connect_database()
    connection.execute("DROP TABLE IF EXISTS password_reset_tokens")
    connection.commit()
    connection.close()
    server = ThreadingHTTPServer((HOST, PORT), CatalogHandler)
    print(f"ITECH Fix local catalog is running at http://{HOST}:{PORT}")
    print(f"Admin dashboard: http://{HOST}:{PORT}/admin")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down local catalog.")
    finally:
        server.server_close()
