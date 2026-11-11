# Rasid Live (sample app)

Live bus positions on a real map. No packages to install, needs Node 18 or newer.

## Run on your computer
    ADMIN_CODE=choose-a-secret node server.js
Open http://localhost:3000. Windows (PowerShell): `$env:ADMIN_CODE="choose-a-secret"; node server.js`

## Two-phone test
Phones only share location over HTTPS, so give the server an https address first (see the chat guide):
- quick: Cloudflare Tunnel `cloudflared tunnel --url http://localhost:3000`
- permanent: put this folder on GitHub and deploy it on Render (Node web service, start command `node server.js`, set ADMIN_CODE).

Add `?fast=1` to the address so phones send every 5 seconds instead of 60.

## Settings (environment variables)
PORT, ADMIN_CODE, DRIVER_CODE, PING_MS (60000), STALE_MS (200000), TILE_URL, DATA_DIR, TRACK_LOG.

## Tests
    node --test test/unit.js
