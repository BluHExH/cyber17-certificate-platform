import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Cyber 17 Official | Certificate Issuance & Verification",
    template: "%s | Cyber 17 Official",
  },
  description:
    "Official certificate issuance and verification platform of Cyber 17 Official. Verify authenticity of digital certificates securely.",
  keywords: ["certificate verification", "cybersecurity", "Cyber 17 Official", "digital certificates"],
  authors: [{ name: "Cyber 17 Official" }],
  openGraph: {
    title: "Cyber 17 Official",
    description: "Official Certificate Issuance & Verification Platform",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased cyber-grid min-h-screen">
        {children}
      </body>
    </html>
  );
}
