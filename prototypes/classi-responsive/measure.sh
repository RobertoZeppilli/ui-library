#!/usr/bin/env bash
# build dell'app per variante, stampa peso CSS finale (raw/gzip) e numero di regole md:
# nota: @source su un singolo file del pacchetto finisce per scansionare tutto dist, quindi a e b
# danno lo stesso CSS; per isolare A o B togli l'altro file da app/node_modules/trama-proto/dist
set -e
cd "$(dirname "$0")/app"
for v in none a b; do
  { echo '@import "tailwindcss";'; [ "$v" != none ] && echo "@import \"trama-proto/$v.css\";"; } > app/globals.css
  rm -rf .next && pnpm build > "../build-$v.log" 2>&1
  css=$(ls .next/static/chunks/*.css)
  printf '%-5s raw=%6d gzip=%5d regole-md=%s\n' "$v" "$(wc -c <$css)" "$(gzip -9 <$css | wc -c)" "$(grep -oF '.md\:' $css | wc -l)"
  cp $css "../out-$v.css"
done
