import { ImageResponse } from "next/og";

export const socialImageSize = { width: 1200, height: 630 };

// Keep this copy alongside the renderer so both social image conventions match.
export const socialPages = {
  home: {
    label: "Portfolio",
    heading: "Software engineer.",
    description: "Building modern applications and thoughtful digital experiences.",
    path: "/",
    alt: "Ahmad FATAYERJI — Software engineer. Portfolio of modern applications and digital experiences.",
  },
  about: {
    label: "About",
    heading: "Curiosity into code.",
    description: "My background, technical skills, and approach to software engineering.",
    path: "/about",
    alt: "About Ahmad FATAYERJI — Curiosity into code. Background and software engineering skills.",
  },
  projects: {
    label: "Projects",
    heading: "Ideas into applications.",
    description: "Selected work across web applications, platforms, and practical tools.",
    path: "/projects",
    alt: "Projects by Ahmad FATAYERJI — Ideas into applications. Selected web applications, platforms, and tools.",
  },
  contact: {
    label: "Contact",
    heading: "Let’s build together.",
    description: "Get in touch about a project, an opportunity, or a shared idea.",
    path: "/contact",
    alt: "Contact Ahmad FATAYERJI — Let’s build together. Projects, opportunities, and shared ideas.",
  },
} as const;

export type SocialPage = keyof typeof socialPages;

export function renderSocialImage(page: SocialPage) {
  const copy = socialPages[page];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#141823",
          color: "#f5f5f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            <div style={{ width: 8, height: 32, background: "#b5a4f4" }} />
            <div style={{ fontSize: 30, fontWeight: 700 }}>Ahmad FATAYERJI</div>
          </div>
          <div style={{ fontSize: 23, color: "#c8c5d5" }}>{copy.label}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 68, fontWeight: 700, letterSpacing: -2, lineHeight: 1.12 }}>
            {copy.heading}
          </div>
          <div style={{ maxWidth: 850, fontSize: 29, lineHeight: 1.45, color: "#c8cbd5" }}>
            {copy.description}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #414554",
            paddingTop: 24,
            fontSize: 22,
            color: "#c8cbd5",
          }}
        >
          <div>Software engineering · France</div>
          <div style={{ color: "#b5a4f4" }}>{copy.path}</div>
        </div>
      </div>
    ),
    socialImageSize,
  );
}
