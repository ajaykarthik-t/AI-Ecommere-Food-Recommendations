import ThemeProvider from "@/providers/ThemeProvider";
import "./globals.css";
import type { Metadata } from "next";
import LayoutProvider from "@/providers/LayoutProvider";
import StoreProvider from "@/providers/StoreProvider";

export const metadata: Metadata = {
  title: "Grocery-Next Dev",
  description: "An e-commerce site built with Next.js and TypeScript.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css"
          rel="stylesheet"
        ></link>
      </head>
      <body>
        <StoreProvider>
          <ThemeProvider>
            <LayoutProvider>{children}</LayoutProvider>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
