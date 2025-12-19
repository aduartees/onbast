import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // ?title=<title>
    const hasTitle = searchParams.has('title');
    const title = hasTitle
      ? searchParams.get('title')?.slice(0, 100)
      : 'ONBAST';

    // ?subtitle=<subtitle>
    const hasSubtitle = searchParams.has('subtitle');
    const subtitle = hasSubtitle
      ? searchParams.get('subtitle')?.slice(0, 100)
      : 'Agencia Digital';

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#030303', // Neutral-950 equivalent
            backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(79, 70, 229, 0.15) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.15) 0%, transparent 50%)',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Logo / Brand */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 40,
            }}
          >
             <div style={{ fontSize: 32, fontWeight: 900, color: 'white', letterSpacing: '-0.05em' }}>
                ONBAST
             </div>
          </div>

          {/* Main Title */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              padding: '0 40px',
            }}
          >
            <div
              style={{
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.1,
                marginBottom: 20,
                textShadow: '0 10px 30px rgba(0,0,0,0.5)',
                backgroundImage: 'linear-gradient(to bottom right, #ffffff 0%, #a5b4fc 100%)',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {title}
            </div>
            
            {/* Subtitle / Badge */}
            {subtitle && (
                <div
                style={{
                    fontSize: 28,
                    color: '#a3a3a3',
                    fontWeight: 400,
                    marginTop: 10,
                    padding: '10px 30px',
                    borderRadius: 50,
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                }}
                >
                {subtitle}
                </div>
            )}
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
