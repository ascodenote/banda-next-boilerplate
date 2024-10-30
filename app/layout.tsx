import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import AppBar from "./appbar";
import Provider from "./provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sepasang Janji",
  description: "Sepasang Janji",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          {/* <AppBar /> */}
          <div className={"  min-h-screen "}>{children}</div>
        </Provider>
      </body>
    </html>
  );
}
