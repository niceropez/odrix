"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  StravaService, 
  StravaActivity, 
  StravaStreams, 
  KilometerData, 
  calculateKilometerData 
} from "@/lib/strava";
import Navbar from "@/components/Navbar";
import KilometerAnalysis from "@/components/KilometerAnalysis";
import Image from "next/image";
import Link from "next/link";

export default function ActivityDetail() {
  const { data: session, status } = useSession();
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<StravaActivity | null>(null);
  const [streams, setStreams] = useState<StravaStreams | null>(null);
  const [kilometerData, setKilometerData] = useState<KilometerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showStreams, setShowStreams] = useState(false);

  const activityId = params.id as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
      return;
    }

    if (session?.accessToken && activityId) {
      fetchActivity();
    }
  }, [session, status, activityId]);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const stravaService = new StravaService(session!.accessToken!);
      const activityData = await stravaService.getActivity(Number(activityId));
      setActivity(activityData);
    } catch (err) {
      setError("Error al cargar la actividad");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStreams = async () => {
    if (!activity) return;
    
    try {
      setLoadingStreams(true);
      const stravaService = new StravaService(session!.accessToken!);
      
      // Try with fewer streams first for debugging
      const streamData = await stravaService.getActivityStreams(Number(activityId), [
        "time", "distance", "altitude", "heartrate", "velocity_smooth"
      ]);
      
      console.log("Received stream data:", streamData);
      setStreams(streamData);
      
      // Calculate kilometer data
      const kmData = calculateKilometerData(streamData);
      console.log("Calculated km data:", kmData);
      setKilometerData(kmData);
      setShowStreams(true);
    } catch (err) {
      console.error("Error loading streams:", err);
      setError("Error al cargar los datos detallados");
    } finally {
      setLoadingStreams(false);
    }
  };

  const formatDistance = (distance: number) => {
    return (distance / 1000).toFixed(2) + " km";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const formatPace = (metersPerSecond: number) => {
    if (metersPerSecond === 0) return "N/A";
    const minutesPerKm = 1000 / (metersPerSecond * 60);
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.round((minutesPerKm - minutes) * 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")} min/km`;
  };

  const formatSpeed = (metersPerSecond: number) => {
    return (metersPerSecond * 3.6).toFixed(1) + " km/h";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      Run: "🏃‍♂️",
      Ride: "🚴‍♂️",
      Walk: "🚶‍♂️",
      Hike: "🥾",
      Swim: "🏊‍♂️",
      Workout: "🏋️‍♂️",
      Yoga: "🧘‍♂️",
      VirtualRide: "🚴‍♂️💻",
      VirtualRun: "🏃‍♂️💻",
    };
    return icons[type] || "🏃‍♂️";
  };

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
            <div className="mt-4 flex space-x-4">
              <button
                onClick={fetchActivity}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Reintentar
              </button>
              <Link
                href="/dashboard"
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Volver al Dashboard
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (!activity) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Actividad no encontrada
            </h1>
            <Link
              href="/dashboard"
              className="mt-4 inline-block bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
              Volver al Dashboard
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link
              href="/dashboard"
              className="text-orange-600 hover:text-orange-700 mr-4"
            >
              ← Volver al Dashboard
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <span className="text-3xl mr-3">
                    {getActivityIcon(activity.type)}
                  </span>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {activity.name}
                    </h1>
                    <p className="text-lg text-gray-600">{activity.type}</p>
                  </div>
                </div>
                <p className="text-gray-500 mb-4">
                  {formatDate(activity.start_date_local)}
                </p>

                {activity.description && (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Descripción
                    </h3>
                    <p className="text-gray-700">{activity.description}</p>
                  </div>
                )}
              </div>

              {activity.athlete && activity.athlete.profile_medium && (
                <div className="flex items-center ml-6">
                  <Image
                    src={activity.athlete.profile_medium || "/default-avatar.svg"}
                    alt={`${activity.athlete.firstname || "Usuario"} ${activity.athlete.lastname || ""}`}
                    width={50}
                    height={50}
                    className="rounded-full mr-3"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">
                      {activity.athlete.firstname || "Usuario"} {activity.athlete.lastname || ""}
                    </p>
                    {(activity.athlete.city || activity.athlete.country) && (
                      <p className="text-sm text-gray-500">
                        {activity.athlete.city && activity.athlete.country 
                          ? `${activity.athlete.city}, ${activity.athlete.country}`
                          : activity.athlete.city || activity.athlete.country
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {formatDistance(activity.distance)}
            </div>
            <div className="text-gray-600">Distancia</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {formatTime(activity.moving_time)}
            </div>
            <div className="text-gray-600">Tiempo en movimiento</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {formatSpeed(activity.average_speed)}
            </div>
            <div className="text-gray-600">Velocidad promedio</div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">
              {activity.total_elevation_gain.toFixed(0)}m
            </div>
            <div className="text-gray-600">Elevación ganada</div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Estadísticas de Rendimiento
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-800">Ritmo promedio:</span>
                <span className="font-semibold text-gray-900">
                  {formatPace(activity.average_speed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Velocidad máxima:</span>
                <span className="font-semibold text-gray-900">
                  {formatSpeed(activity.max_speed)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-800">Tiempo total:</span>
                <span className="font-semibold text-gray-900">
                  {formatTime(activity.elapsed_time)}
                </span>
              </div>
              {activity.calories && (
                <div className="flex justify-between">
                  <span className="text-gray-800">Calorías:</span>
                  <span className="font-semibold text-gray-900">
                    {activity.calories}
                  </span>
                </div>
              )}
              {activity.average_heartrate && (
                <div className="flex justify-between">
                  <span className="text-gray-800">FC promedio:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(activity.average_heartrate)} bpm
                  </span>
                </div>
              )}
              {activity.max_heartrate && (
                <div className="flex justify-between">
                  <span className="text-gray-800">FC máxima:</span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(activity.max_heartrate)} bpm
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Detalles de Actividad
            </h3>
            <div className="space-y-4">
              {activity.device_name && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Dispositivo:</span>
                  <span className="font-semibold text-gray-900">
                    {activity.device_name}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Logros:</span>
                <span className="font-semibold text-gray-900">
                  {activity.achievement_count}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Kudos:</span>
                <span className="font-semibold text-gray-900">
                  {activity.kudos_count} ❤️
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Comentarios:</span>
                <span className="font-semibold text-gray-900">
                  {activity.comment_count}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Fotos:</span>
                <span className="font-semibold text-gray-900">
                  {activity.photo_count}
                </span>
              </div>
              {activity.trainer && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Trainer:</span>
                  <span className="font-semibold text-gray-900">Sí 🏠</span>
                </div>
              )}
              {activity.commute && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Commute:</span>
                  <span className="font-semibold text-gray-900">Sí 🚗</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Kilometer Analysis Section */}
        <div className="mb-8">
          <KilometerAnalysis
            kilometerData={kilometerData}
            loading={loadingStreams}
            onLoadData={fetchStreams}
            showLoadButton={!showStreams}
          />
        </div>

        {/* Map placeholder */}
        {activity.map && activity.map.summary_polyline && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Ruta</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg">🗺️ Mapa de la ruta</p>
                <p className="text-sm">Integración con mapas próximamente</p>
                <p className="text-xs mt-2">ID del mapa: {activity.map.id}</p>
              </div>
            </div>
          </div>
        )}

        {/* Location info */}
        {(activity.location_city || activity.start_latlng) && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Ubicación
            </h3>
            <div className="space-y-2">
              {activity.location_city && (
                <p className="text-gray-700">
                  📍 {activity.location_city}
                  {activity.location_state && `, ${activity.location_state}`}
                  {activity.location_country &&
                    `, ${activity.location_country}`}
                </p>
              )}
              {activity.start_latlng && (
                <p className="text-gray-500 text-sm">
                  Coordenadas de inicio: {activity.start_latlng[0]},{" "}
                  {activity.start_latlng[1]}
                </p>
              )}
              {activity.timezone && (
                <p className="text-gray-500 text-sm">
                  Zona horaria: {activity.timezone}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
