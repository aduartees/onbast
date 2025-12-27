import { ImageResponse } from "next/og";

export const runtime = "edge";

const buildPng = async (size: number) => {
  const res = new ImageResponse(
    <div
      style={{
        fontSize: Math.round(size * 0.75),
        background: "black",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        borderRadius: "0px",
        fontFamily: "sans-serif",
        fontWeight: 800,
      }}
    >
      O
    </div>,
    { width: size, height: size }
  );

  return new Uint8Array(await res.arrayBuffer());
};

const u16le = (value: number) => {
  const out = new Uint8Array(2);
  out[0] = value & 0xff;
  out[1] = (value >> 8) & 0xff;
  return out;
};

const u32le = (value: number) => {
  const out = new Uint8Array(4);
  out[0] = value & 0xff;
  out[1] = (value >> 8) & 0xff;
  out[2] = (value >> 16) & 0xff;
  out[3] = (value >> 24) & 0xff;
  return out;
};

export async function GET() {
  const images = [
    { size: 16, png: await buildPng(16) },
    { size: 32, png: await buildPng(32) },
    { size: 48, png: await buildPng(48) },
  ];

  const header = new Uint8Array([
    0x00,
    0x00,
    0x01,
    0x00,
    images.length,
    0x00,
  ]);

  const dirEntries: Uint8Array[] = [];
  const imageData: Uint8Array[] = [];

  const dirSize = 6 + 16 * images.length;
  let offset = dirSize;

  for (const img of images) {
    const sizeByte = img.size >= 256 ? 0 : img.size;
    const entry = new Uint8Array(16);
    entry[0] = sizeByte;
    entry[1] = sizeByte;
    entry[2] = 0;
    entry[3] = 0;
    entry.set(u16le(1), 4);
    entry.set(u16le(32), 6);
    entry.set(u32le(img.png.byteLength), 8);
    entry.set(u32le(offset), 12);
    dirEntries.push(entry);

    imageData.push(img.png);
    offset += img.png.byteLength;
  }

  const total = header.byteLength + dirEntries.reduce((n, b) => n + b.byteLength, 0) + imageData.reduce((n, b) => n + b.byteLength, 0);
  const out = new Uint8Array(total);
  let cursor = 0;
  out.set(header, cursor);
  cursor += header.byteLength;
  for (const entry of dirEntries) {
    out.set(entry, cursor);
    cursor += entry.byteLength;
  }
  for (const data of imageData) {
    out.set(data, cursor);
    cursor += data.byteLength;
  }

  return new Response(out, {
    headers: {
      "content-type": "image/x-icon",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
