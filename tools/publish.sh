#!/usr/bin/env bash
#
# publish.sh — assemble the folder that actually goes on the web.
#
# The repository holds more than the site: 185MB of photographic masters, the
# AI drafts they were cut from, the design notes, and CLAUDE.md. All of that
# belongs in history and none of it belongs on a public URL. Netlify's
# `publish` directive takes a folder and uploads it whole, with no exclude
# list, so the folder has to be built rather than pointed at.
#
# THIS IS NOT A BUILD STEP FOR THE SITE. Nothing is compiled, bundled or
# transformed — files are copied unchanged. `index.html` at the repository
# root still opens from file:// with the cart working, which is the property
# the whole project is arranged around. This script only decides what gets
# uploaded.
#
# Run by Netlify via netlify.toml. Safe to run by hand to see what would ship.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
OUT="$ROOT/_site"

rm -rf "$OUT"
mkdir -p "$OUT"

# Every page at the repository root.
pages=0
for f in "$ROOT"/*.html; do
  [ -e "$f" ] || continue
  cp "$f" "$OUT/"
  pages=$((pages + 1))
done

# Crawler files. 404.html is copied by the loop above, as a page; Netlify
# serves it for any unmatched path with the right 404 status, which is what
# makes it a 404 rather than a soft one.
for f in robots.txt sitemap.xml; do
  [ -f "$ROOT/$f" ] && cp "$ROOT/$f" "$OUT/"
done

# The design system, the scripts, the processed photography, the favicon.
cp -R "$ROOT/assets" "$OUT/assets"

# Photography that has been replaced is kept in the repository so the copy
# written from it can still be checked against the picture — but nothing
# references it, so uploading it only costs the visitor bandwidth.
find "$OUT/assets/images" -type d -name retired -prune -exec rm -rf {} +

# Deliberately NOT copied, and each for a reason:
#   CLAUDE.md, README.md, docs/   internal notes
#   tools/                        this script and the proof sheet maker
#   Hamper Photos/                PNG masters, never referenced at runtime
#   NEW HAMPER PHOTOS/            AI drafts and their prompt files
#   Collection Name Images/       working files
#   Thoughtful Lines/             working files
#   Hero Image.png                master; the web copy is in assets/images
#   netlify.toml, netlify/        read from the repository root, not from here

echo "  $pages pages + assets  ->  _site/"
du -sh "$OUT" | sed 's/^/  /'

# A deploy that silently shipped nothing would be worse than a failed one.
# A floor, not a count: it catches a run that copied nothing or almost
# nothing. It is deliberately below the real number so that removing a page
# does not fail the deploy — which is exactly what happened when the four
# journal pages went and this still read 15.
MIN_PAGES=8
[ "$pages" -ge "$MIN_PAGES" ] || {
  echo "  Only $pages pages found — expected at least $MIN_PAGES." >&2; exit 1; }
[ -f "$OUT/index.html" ] || { echo "  No index.html in _site." >&2; exit 1; }
[ -d "$OUT/assets/js" ] || { echo "  No assets/js in _site." >&2; exit 1; }
# A sitemap that fails to ship is invisible rather than broken, which is worse.
for f in 404.html robots.txt sitemap.xml; do
  [ -f "$OUT/$f" ] || { echo "  $f missing from _site." >&2; exit 1; }
done
