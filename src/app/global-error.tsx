"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0, backgroundColor: "#000", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
        }}>
          <div>
            <h1 style={{ fontSize: "6rem", fontWeight: 900, margin: 0, letterSpacing: "-0.05em" }}>
              <span>5</span>
              <span style={{ color: "#e53e3e" }}>0</span>
              <span>0</span>
            </h1>
            <p style={{ fontSize: "0.625rem", fontWeight: 900, letterSpacing: "0.4em", color: "rgba(229,62,62,0.6)", textTransform: "uppercase", marginTop: "0.5rem", marginBottom: "1rem" }}>
              Server Error
            </p>
            <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.4)", marginBottom: "2rem" }}>
              サーバーでエラーが発生しました。<br />
              しばらくしてからもう一度お試しください。
            </p>
            <button
              onClick={reset}
              style={{
                backgroundColor: "#e53e3e",
                color: "#fff",
                fontSize: "0.875rem",
                fontWeight: 900,
                padding: "0.875rem 2rem",
                border: "2px solid rgba(229,62,62,0.3)",
                cursor: "pointer",
              }}
            >
              もう一度試す
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
