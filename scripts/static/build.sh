#!/usr/bin/env bash
# Builds the server-less demo of the store into out/ (used by .github/workflows/pages.yml).
# It deletes the parts that need a server from the working tree (middleware, every API route except the static search
# index, the catch-all 404 route; GitHub Pages serves 404.html instead), so run it in CI or in a throwaway copy, never
# in a checkout you work in.
#   BASE_PATH=/gfd scripts/static/build.sh
set -euo pipefail
cd "$(dirname "$0")/../.."

rm -f src/middleware.ts
rm -rf 'src/app/[locale]/[...rest]'
find src/app/api -mindepth 1 -maxdepth 1 ! -name search-index -exec rm -rf {} +
rm -rf .next out

STATIC_DEMO=1 BASE_PATH="${BASE_PATH:-}" npx next build

# English pages are un-prefixed on the live site (/women); the export writes them under /en, so copy them to the root.
cp -R out/en/. out/
touch out/.nojekyll
echo "static demo: $(find out -name index.html | wc -l) pages in out/"
