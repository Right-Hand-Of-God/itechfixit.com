# Local site setup

The site runs on this computer using Python 3's standard library and a local SQLite database. It does not need Node.js or an internet connection for its catalog.

1. Double-click `start-local.bat`. It starts the local server in a minimized window, waits for it to respond, and opens the admin page. If the server is already running, it opens the admin page without starting another copy. Keep the minimized server window open while using the site.
2. Open the storefront at `http://127.0.0.1:8765`. Open the catalog editor at `http://127.0.0.1:8765/admin`.
3. Sign in to the admin page with the local administrator password. The initial password is `Itechfix`. Add or edit listings, select their storefront section, and optionally upload JPEG, PNG, WEBP, or GIF images up to 8 MB.
4. Open or refresh the storefront to see visible catalog changes.

The server binds only to `127.0.0.1`, so the site and editor are available only on this computer. The admin dashboard is not linked from the storefront, and its catalog and editing APIs require a signed-in admin session. Do not expose the local server to the public internet.

On first startup, the app imports the included sample phone, laptop, gadget, repair, and spare-part listings into the editable catalog. Catalog data is stored in `backend/catalog.sqlite3`; uploaded images are stored in `backend/uploads`. Keep both when backing up the site. Browser files and storefront images are in `frontend`.

For GitHub Pages hosting with a shared online catalog and admin login, follow [SUPABASE-SETUP.md](./SUPABASE-SETUP.md).
