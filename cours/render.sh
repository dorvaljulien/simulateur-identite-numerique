#!/bin/sh
# Construit le cours (.docx, .odt) et un aperçu PDF. Usage : sh cours/render.sh [dossier_apercu]
cd "$(dirname "$0")" && node build-cours.js && (zip -d cours-identite-numerique.docx '*/' >/dev/null 2>&1 || true)
soffice --headless --convert-to odt cours-identite-numerique.docx --outdir . >/dev/null 2>&1
[ -n "$1" ] && mkdir -p "$1" && soffice --headless --convert-to pdf cours-identite-numerique.docx --outdir "$1" >/dev/null 2>&1
ls -la cours-identite-numerique.*
