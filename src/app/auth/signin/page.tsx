"use client";

import { signIn } from "next-auth/react";
import { useEffect } from "react";

export default function SignIn() {
  useEffect(() => {
    // Redirigir automáticamente a Strava para autenticación
    signIn("strava", { callbackUrl: "/" });
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Conectando con Strava
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Redirigiendo a Strava para autenticación...
          </p>
        </div>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
        </div>
        <div className="text-center">
          <button
            onClick={() => signIn("strava", { callbackUrl: "/" })}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
          >
            Conectar con Strava
          </button>
        </div>
      </div>
    </div>
  );
}
