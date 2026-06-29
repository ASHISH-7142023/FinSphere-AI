import type { Metadata } from "next";
import { Geist, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "FinSphere AI",
  description: "Personal finance super-app MVP",
  icons: "/aplogfi.png"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className={`${jakarta.variable} ${inter.variable} ${geist.variable} font-body antialiased`}>
        {children}
         <script src="https://cdn.botpress.cloud/webchat/v3.6/inject.js"></script>
         <script src="https://files.bpcontent.cloud/2026/06/29/07/20260629071552-AO9LM9N8.js" defer></script>
      </body>
    </html>
  );
}
