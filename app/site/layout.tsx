import MainNav from "@/components/layouts/main/nav-main";
import type { Metadata } from "next";
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
    <div>
      <MainNav />
      {children}
    </div>
  );
}
