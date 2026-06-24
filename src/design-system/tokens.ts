export const colors = {
  background: "#0e1511",
  surface: "#0e1511",
  surfaceContainerLow: "#161d1a",
  surfaceContainer: "#1a211d",
  surfaceContainerHigh: "#242c28",
  onSurface: "#dce4de",
  onSurfaceVariant: "#bbcac1",
  outline: "#85948c",
  outlineVariant: "#3c4a43",
  primary: "#42e5b0",
  primaryContainer: "#00c896",
  onPrimary: "#003828",
  secondary: "#bec6e0",
  tertiary: "#ffbca2",
  error: "#ffb4ab"
} as const;

export const typography = {
  display: { family: "Plus Jakarta Sans", size: "48px", weight: 700, lineHeight: 1.1 },
  headline: { family: "Plus Jakarta Sans", size: "32px", weight: 600, lineHeight: 1.2 },
  title: { family: "Plus Jakarta Sans", size: "24px", weight: 600, lineHeight: 1.3 },
  body: { family: "Inter", size: "16px", weight: 400, lineHeight: 1.5 },
  label: { family: "Geist", size: "14px", weight: 500, lineHeight: 1.4 }
} as const;

export const spacing = {
  xs: "8px",
  sm: "16px",
  md: "24px",
  lg: "32px",
  xl: "48px",
  gutter: "24px",
  containerMax: "1440px"
} as const;

export const radius = {
  sm: "4px",
  md: "8px",
  lg: "16px",
  xl: "24px",
  full: "9999px"
} as const;

export const shadows = {
  glass: "0 18px 50px rgba(0, 0, 0, 0.35)",
  glow: "0 18px 60px rgba(66, 229, 176, 0.16)"
} as const;
