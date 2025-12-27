import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 96,
  height: 96,
};

export const contentType = "image/png";

export function GET() {
  return new ImageResponse(
    <div
      style={{
        fontSize: 72,
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
    {
      ...size,
    }
  );
}

