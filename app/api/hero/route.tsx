import { ImageResponse } from "next/og";

export const runtime = "edge";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const title = (searchParams.get("title") || "ONBAST").slice(0, 100);
    const subtitle = (searchParams.get("subtitle") || "WEB, SEO & GEO").slice(0, 120);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-end",
            padding: "72px",
            backgroundColor: "#030303",
            backgroundImage:
              "radial-gradient(circle at 20% 30%, rgba(79, 70, 229, 0.20) 0%, transparent 55%), radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.18) 0%, transparent 55%)",
            fontFamily: "sans-serif",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 980 }}>
            <div style={{ fontSize: 28, fontWeight: 700, color: "rgba(255,255,255,0.8)" }}>ONBAST</div>
            <div
              style={{
                fontSize: 86,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: "-0.04em",
                backgroundImage: "linear-gradient(to bottom right, #ffffff 0%, #a5b4fc 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              {title}
            </div>
            <div
              style={{
                fontSize: 34,
                fontWeight: 400,
                color: "#a3a3a3",
                lineHeight: 1.2,
                padding: "12px 22px",
                borderRadius: 999,
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              {subtitle}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 800,
      }
    );
  } catch {
    return new Response("Failed to generate the image", { status: 500 });
  }
}

