import type React from "react";
import "@/app/globals.css";
import { Inter } from "next/font/google";
import { AppThemeProvider } from "@/context/themecontext";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Gerador de QR Code",
  description: "Gere QR Codes de forma fácil e rápida a partir de textos, links ou dados estruturados em JSON.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AppThemeProvider>
          {children}
          <Toaster />
        </AppThemeProvider>
      </body>
    </html>
  );
}