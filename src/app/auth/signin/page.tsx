"use client";

import { signIn } from "next-auth/react";
import Link from "next/link";

export default function SignIn() {
  const handleStravaLogin = () => {
    console.log("🚀 Iniciando login con Strava...");
    signIn("strava", {
      callbackUrl: "/dashboard",
      redirect: false, // 🔍 Temporalmente desactivar redirect automático
    })
      .then((result) => {
        console.log("📋 Resultado de signIn:", result);
        if (result?.url) {
          console.log("🔗 URL generada:", result.url);
          window.location.href = result.url; // Redirigir manualmente
        }
      })
      .catch((error) => {
        console.error("❌ Error en signIn:", error);
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Conecta con Strava
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Autoriza el acceso a tu cuenta de Strava para continuar
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <button
            onClick={handleStravaLogin}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Conectar con Strava
          </button>

          {/* 🔍 Botón de debug para ver la URL directamente */}
          <button
            onClick={() => {
              const url = `/api/auth/signin/strava?callbackUrl=${encodeURIComponent(
                "/dashboard"
              )}`;
              console.log("🔗 URL directa:", url);
              window.location.href = url;
            }}
            className="group relative w-full flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            🔍 Debug: URL Directa
          </button>

          <Link
            href="/"
            className="text-center block text-sm text-gray-600 hover:text-gray-900"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
