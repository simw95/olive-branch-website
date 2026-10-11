#!/usr/bin/env bash
#
# label-proof.sh — read every word in an AI-edited hamper photo before it ships.
#
#   bash tools/label-proof.sh "NEW HAMPER PHOTOS/Edited with CHATGPT - 1.1.png"
#
# Generative editing rewrites text it was never asked to touch. In the first
# edited hamper it changed the candle from 30 to 50 hours, renamed a grapefruit
# soap to calendula, moved every soap from 55g to 50g, and deleted the net
# weight from a Makaibari tin. None of that is visible at page size — the type
# is 8px on screen and reads as "a label".
#
# So this does one thing: cuts the photo into overlapping tiles and blows each
# one up until the small print is legible, then lays them out as a single sheet
# to check against the real products. Two minutes per photo, and it is the only
# step between a wrong claim and a customer reading it.
#
# Output lands next to the source as <name>-PROOF.jpg.

set -euo pipefail

MAGICK="/c/Program Files/ImageMagick-7.1.2-Q16-HDRI/magick.exe"
[ -x "$MAGICK" ] || { echo "ImageMagick not found at $MAGICK" >&2; exit 1; }

SRC="${1:-}"
[ -n "$SRC" ] && [ -f "$SRC" ] || { echo "usage: bash tools/label-proof.sh <image>" >&2; exit 1; }

COLS="${COLS:-3}"
ROWS="${ROWS:-3}"
TILE_W="${TILE_W:-900}"          # width each tile is blown up to
OVERLAP="${OVERLAP:-12}"         # % overlap, so nothing falls on a seam

DIR=$(dirname "$SRC")
BASE=$(basename "$SRC")
STEM="${BASE%.*}"
OUT="$DIR/$STEM-PROOF.jpg"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

# `identify` prints no trailing newline, which makes `read` exit non-zero and,
# under `set -e`, kills the script before it starts. Split the string instead.
DIMS=$("$MAGICK" identify -format "%w %h" "$SRC")
W="${DIMS%% *}"
H="${DIMS##* }"
echo "source: ${W}x${H}  →  ${COLS}x${ROWS} tiles at ${TILE_W}px wide"

# Tile size including the overlap margin.
CW=$(( W * (100 + OVERLAP) / (COLS * 100) ))
CH=$(( H * (100 + OVERLAP) / (ROWS * 100) ))

n=0
for (( r = 0; r < ROWS; r++ )); do
  for (( c = 0; c < COLS; c++ )); do
    n=$(( n + 1 ))
    # Step by the un-overlapped width so tiles advance evenly, then clamp so
    # the last row and column do not run past the edge.
    x=$(( c * W / COLS )); y=$(( r * H / ROWS ))
    (( x + CW > W )) && x=$(( W - CW )); (( x < 0 )) && x=0
    (( y + CH > H )) && y=$(( H - CH )); (( y < 0 )) && y=0

    "$MAGICK" "$SRC" -crop "${CW}x${CH}+${x}+${y}" +repage \
      -filter Lanczos -resize "${TILE_W}x" \
      -unsharp 0x0.7+0.6+0.01 \
      -bordercolor '#1A1A17' -border 3 \
      -background '#1A1A17' -splice 0x40 -gravity north \
      -fill white -pointsize 28 -annotate +0+6 "$n" \
      "$TMP/$(printf '%02d' $n).png"
  done
done

"$MAGICK" montage "$TMP"/*.png -tile "${COLS}x" -geometry +6+6 \
  -background '#55554C' "$TMP/sheet.png"

"$MAGICK" "$TMP/sheet.png" \
  -background '#1A1A17' -splice 0x70 -gravity north \
  -fill white -pointsize 34 \
  -annotate +0+10 "PROOF — $STEM" \
  -fill '#C9C4B5' -pointsize 20 \
  -annotate +0+46 "Read every label against the real product. Check: scent names, weights, burn hours, net weight, brand wording." \
  -quality 88 "$OUT"

echo "proof sheet: $OUT"
"$MAGICK" identify -format "             %wx%h  %b\n" "$OUT"
