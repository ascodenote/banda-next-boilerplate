import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default auth((req: NextRequest) => {
  const { nextUrl, auth } = req;

  // Daftarkan rute publik dan rute otentikasi
  const publicUrls = ["/site", "/app", "/cockpit"]; // Rute publik
  const authUrls = ["/login", "/register"]; // Rute untuk otentikasi

  const isLoggedIn = !!auth?.user; // Periksa apakah pengguna telah login
  const currentUrl = nextUrl.pathname; // URL saat ini yang sedang diakses

  // Dapatkan hostname dan sesuaikan jika perlu
  const hostname =
    req.headers
      .get("host")
      ?.replace(".localhost:3000", `.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) ??
    "";

  // console.log("isLoggedIn:", isLoggedIn, "Hostname:", hostname);

  // Pengalihan ke /app jika hostname sesuai
  if (hostname === `app.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    if (!isLoggedIn && nextUrl.pathname !== "/login") {
      console.log("NOT LOGIN");
      return NextResponse.redirect(new URL("/login", req.url));
    } else if (isLoggedIn && nextUrl.pathname == "/login") {
      console.log("LOGIN");
      return NextResponse.redirect(new URL("/app", req.url));
    }
    return NextResponse.rewrite(
      new URL(
        `/app${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
        req.url
      )
    );
  }

  // Pengalihan ke /app jika hostname sesuai
  if (hostname === `cockpit.${process.env.NEXT_PUBLIC_ROOT_DOMAIN}`) {
    return NextResponse.rewrite(
      new URL(
        `/cockpit${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
        req.url
      )
    );
  }

  // Pengalihan ke /app jika hostname sesuai
  if (
    hostname === "localhost:3000" ||
    hostname === process.env.NEXT_PUBLIC_ROOT_DOMAIN
  ) {
    return NextResponse.rewrite(
      new URL(
        `/site${nextUrl.pathname === "/" ? "" : nextUrl.pathname}`,
        req.url
      )
    );
  }

  // Izinkan akses ke rute publik tanpa pengalihan
  if (publicUrls.includes(currentUrl)) {
    return NextResponse.next();
  }

  // Pengalihan pengguna yang sudah login dari halaman otentikasi ke halaman utama
  // if (isLoggedIn && authUrls.includes(currentUrl)) {
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // // Pengalihan pengguna yang belum login dari rute yang dilindungi ke halaman login
  // if (
  //   !isLoggedIn &&
  //   !publicUrls.includes(currentUrl) &&
  //   !authUrls.includes(currentUrl)
  // ) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  return NextResponse.next();
});

export const config = {
  matcher: [
    /*
     * Cocokkan semua jalur kecuali:
     * 1. Rute /api
     * 2. Rute /_next (bagian internal Next.js)
     * 3. Rute /_static (di dalam folder /public)
     * 4. Semua file root di dalam folder /public (misalnya, /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};
