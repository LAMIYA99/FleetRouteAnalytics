import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GeekBro MMC — Fleet Route Analytics Report",
  description: "AI fleet telematics — Driver trip reports",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="az" className="h-full">
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
