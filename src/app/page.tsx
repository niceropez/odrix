'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

export default function Home() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </>
    )
  }

  if (!session) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
                Analiza tus actividades de{' '}
                <span className="text-orange-600">Strava</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Conecta tu cuenta de Strava y obtén insights detallados sobre tus entrenamientos,
                progreso y rendimiento deportivo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signin"
                  className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  Conectar con Strava
                </Link>
                <a
                  href="#features"
                  className="border border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-3 rounded-lg text-lg font-semibold transition-colors"
                >
                  Ver características
                </a>
              </div>
            </div>

            <div id="features" className="mt-20">
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
                Características principales
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Estadísticas detalladas
                  </h3>
                  <p className="text-gray-600">
                    Visualiza tu progreso con gráficos y métricas avanzadas
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Análisis de rendimiento
                  </h3>
                  <p className="text-gray-600">
                    Analiza tus tiempos, distancias y mejoras a lo largo del tiempo
                  </p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Seguimiento de objetivos
                  </h3>
                  <p className="text-gray-600">
                    Establece y monitorea tus objetivos de entrenamiento
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Bienvenido, {session.user?.name}!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu cuenta de Strava está conectada correctamente. Ahora puedes acceder a tus datos.
          </p>
          <div className="grid md:grid-cols-3 gap-4">
            <Link
              href="/dashboard"
              className="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Dashboard</h3>
              <p className="text-sm text-gray-600">
                Vista general de tus estadísticas
              </p>
            </Link>
            <Link
              href="/activities"
              className="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Actividades</h3>
              <p className="text-sm text-gray-600">
                Explora todas tus actividades
              </p>
            </Link>
            <Link
              href="/stats"
              className="block p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <h3 className="font-semibold text-gray-900 mb-2">Estadísticas</h3>
              <p className="text-sm text-gray-600">
                Análisis detallado de rendimiento
              </p>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
