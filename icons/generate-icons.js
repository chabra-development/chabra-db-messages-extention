/**
 * Gera icon16.png, icon48.png, icon128.png sem dependências externas.
 * Execute: node icons/generate-icons.js
 */

const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

function createPNG(size) {
  // Cor de fundo: azul #2563eb  →  R=37 G=99 B=235
  // Letra "T" branca desenhada pixel a pixel

  const pixels = new Uint8Array(size * size * 4); // RGBA

  // Preencher fundo azul
  for (let i = 0; i < size * size; i++) {
    pixels[i * 4 + 0] = 37;   // R
    pixels[i * 4 + 1] = 99;   // G
    pixels[i * 4 + 2] = 235;  // B
    pixels[i * 4 + 3] = 255;  // A
  }

  // Desenhar letra "T" branca
  // A "T" ocupa ~60% da altura e 70% da largura, centrada
  const barH    = Math.max(1, Math.round(size * 0.13)); // espessura da barra horizontal
  const stemW   = Math.max(1, Math.round(size * 0.13)); // espessura do stem vertical
  const padX    = Math.round(size * 0.15);              // margem lateral
  const padTop  = Math.round(size * 0.20);              // margem topo
  const padBot  = Math.round(size * 0.18);              // margem base

  const barTop  = padTop;
  const barBot  = padTop + barH;
  const barLeft = padX;
  const barRight = size - padX;

  const stemLeft  = Math.round((size - stemW) / 2);
  const stemRight = stemLeft + stemW;
  const stemTop   = barTop;
  const stemBot   = size - padBot;

  function setWhite(x, y) {
    if (x < 0 || x >= size || y < 0 || y >= size) return;
    const i = (y * size + x) * 4;
    pixels[i + 0] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = 255;
  }

  // Barra horizontal do T
  for (let y = barTop; y < barBot; y++)
    for (let x = barLeft; x < barRight; x++)
      setWhite(x, y);

  // Stem vertical do T
  for (let y = stemTop; y < stemBot; y++)
    for (let x = stemLeft; x < stemRight; x++)
      setWhite(x, y);

  // Arredondamento de cantos (círculo inscrito)
  const r = Math.round(size * 0.15);
  const corners = [[r, r], [size - 1 - r, r], [r, size - 1 - r], [size - 1 - r, size - 1 - r]];
  for (const [cx, cy] of corners) {
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const dx = x - cx, dy = y - cy;
        if (Math.max(Math.abs(x - r), Math.abs(y - r)) <= r) continue; // dentro do canto
        if (Math.max(Math.abs(x - (size - 1 - r)), Math.abs(y - r)) <= r) continue;
        if (Math.max(Math.abs(x - r), Math.abs(y - (size - 1 - r))) <= r) continue;
        if (Math.max(Math.abs(x - (size - 1 - r)), Math.abs(y - (size - 1 - r))) <= r) continue;
      }
    }
  }

  // Tornar pixels fora do retângulo arredondado transparentes
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const inTopLeft     = x < r && y < r && (x - r) ** 2 + (y - r) ** 2 > r ** 2;
      const inTopRight    = x >= size - r && y < r && (x - (size - 1 - r)) ** 2 + (y - r) ** 2 > r ** 2;
      const inBottomLeft  = x < r && y >= size - r && (x - r) ** 2 + (y - (size - 1 - r)) ** 2 > r ** 2;
      const inBottomRight = x >= size - r && y >= size - r && (x - (size - 1 - r)) ** 2 + (y - (size - 1 - r)) ** 2 > r ** 2;

      if (inTopLeft || inTopRight || inBottomLeft || inBottomRight) {
        const i = (y * size + x) * 4;
        pixels[i + 3] = 0; // transparente
      }
    }
  }

  return encodePNG(size, size, pixels);
}

function encodePNG(width, height, rgba) {
  // Montar raw image data (filter byte 0x00 por scanline)
  const raw = [];
  for (let y = 0; y < height; y++) {
    raw.push(0); // filter type None
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      raw.push(rgba[i], rgba[i+1], rgba[i+2], rgba[i+3]);
    }
  }

  const compressed = zlib.deflateSync(Buffer.from(raw), { level: 9 });

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, "ascii");
    const dataBytes = Buffer.isBuffer(data) ? data : Buffer.from(data);
    const len = Buffer.alloc(4);
    len.writeUInt32BE(dataBytes.length);
    const crcData = Buffer.concat([typeBytes, dataBytes]);
    const crc = Buffer.alloc(4);
    crc.writeInt32BE(crc32(crcData));
    return Buffer.concat([len, typeBytes, dataBytes, crc]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8]  = 8;  // bit depth
  ihdr[9]  = 6;  // color type RGBA
  ihdr[10] = 0;  // compression
  ihdr[11] = 0;  // filter
  ihdr[12] = 0;  // interlace

  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", compressed),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// CRC-32 (IEEE 802.3)
const crcTable = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let c = -1;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ -1);
}

// ─── Gerar e salvar ───────────────────────────────────────────────────────────

const dir = __dirname;

for (const size of [16, 48, 128]) {
  const outPath = path.join(dir, `icon${size}.png`);
  fs.writeFileSync(outPath, createPNG(size));
  console.log(`✅ ${outPath}`);
}

console.log("\nÍcones gerados! Recarregue a extensão em chrome://extensions");
