const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');
const BASE = 'https://matias-240.github.io/pinza-qr';
const TARGET = 'https://www.falabella.com/falabella-cl';
const PAGES = 6;
const out = __dirname;
(async () => {
  fs.mkdirSync(path.join(out, 'qr'), { recursive: true });
  for (let i = 1; i <= PAGES; i++) {
    const dir = path.join(out, 'p', String(i));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), `<!doctype html>
<html lang="es"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex">
<title>PINZA - página ${i}</title>
<link rel="canonical" href="${TARGET}">
<meta http-equiv="refresh" content="0; url=${TARGET}">
<script>location.replace(${JSON.stringify(TARGET)});</script>
</head><body><p>Redirigiendo a <a href="${TARGET}">Falabella</a>…</p></body></html>
`);
    const url = `${BASE}/p/${i}/`;
    const svg = await QRCode.toString(url, { type: 'svg', margin: 2, errorCorrectionLevel: 'M' });
    fs.writeFileSync(path.join(out, 'qr', `pagina-${i}.svg`), svg);
  }
  fs.writeFileSync(path.join(out, 'README.md'), `# PINZA - QR dinámicos

Cada página del PDF tiene un código QR (SVG vectorial) que apunta a una URL de GitHub Pages.
Esa URL redirige a ${TARGET}.

Para cambiar el destino de un QR, edita \`p/N/index.html\` y haz commit: el QR impreso no cambia.

| Página | QR | URL del QR | Destino |
|---|---|---|---|
${Array.from({ length: PAGES }, (_, k) => `| ${k + 1} | [qr/pagina-${k + 1}.svg](qr/pagina-${k + 1}.svg) | ${BASE}/p/${k + 1}/ | ${TARGET} |`).join('\n')}
`);
  console.log('ok');
})();
