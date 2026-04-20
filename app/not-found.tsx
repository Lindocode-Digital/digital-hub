import Link from "next/link";
import Logo from "@/components/common/logo/Logo";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "2rem",
        background: "#000000",
        color: "#ffffff",
      }}
    >
      <section
        style={{
          maxWidth: "640px",
          width: "100%",
          padding: "2.5rem 2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ marginBottom: "1.5rem" }}>
          <Logo
            size="medium"
            scale={0.8}
            postWidth={0.9}
            lampHeight={20}
            dotWidth={1.5}
            bulbWidth={0.7}
            headWidth={2.3}
            headPos={1.7}
            rayPos={-0.7}
            postMargin={33}
            headColor="#ffffff"
            postColor="#ffffff"
            bulbColor="#ffffff"
            rayColor="#ffffff"
            dotColor="#FF0700"
          />
        </div>

        <p
          style={{
            color: "#ff4d4d",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            marginBottom: "0.75rem",
            fontSize: "0.8rem",
            fontWeight: "bold",
          }}
        >
          Error 404
        </p>

        <h1 className="font-press text-[clamp(2rem,6vw,4rem)] leading-none mb-4 tracking-[0.15em]">
          Lost in the system
        </h1>

        <p
          style={{
            color: "#9D9D9D",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "1.75rem",
            maxWidth: "480px",
          }}
        >
          The page you’re looking for does not exist, was moved, or never went
          live.
        </p>

        <Link
          href="https://lindocode.com/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0.9rem 1.25rem",
            borderRadius: "999px",
            textDecoration: "none",
            color: "#fff",
            background: "linear-gradient(135deg, #b30000, #ff3b3b)",
            fontWeight: 600,
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          Return Home
        </Link>
      </section>
    </main>
  );
}
