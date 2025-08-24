import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import axios from "axios";

// Configuration de l'API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function middleware(req: NextRequest) {
  const refreshToken = req.cookies.get("refresh_token")?.value;

  // Routes protégées
  if (req.nextUrl.pathname.startsWith("/dashboard")) {
    if (!refreshToken) {
      return NextResponse.redirect(new URL("/auth", req.url));
    }

    try {
      // Tenter de rafraîchir le token
      const refreshRes = await axios.post(`${API_BASE_URL}/auth/refresh`, {
        refresh_token: refreshToken,
      });

      // Refresh réussi → mettre à jour les cookies
      const data = refreshRes.data;
      const response = NextResponse.next();

      response.cookies.set("access_token", data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      response.cookies.set("refresh_token", data.refresh_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return response;
    } catch {
      // En cas d'erreur → rediriger vers /auth
      const response = NextResponse.redirect(new URL("/auth", req.url));
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      response.cookies.delete("user");
      return response;
    }
  }

  return NextResponse.next();
}

// Configuration des routes sur lesquelles appliquer le middleware
export const config = {
  matcher: ["/dashboard/:path*"],
};
