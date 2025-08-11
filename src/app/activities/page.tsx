"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { StravaService, StravaActivity } from "@/lib/strava";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function ActivitiesPage() {
  const { data: session, status } = useSession();
  const [activities, setActivities] = useState<StravaActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin");
    }

    if (session?.accessToken) {
      fetchActivities(1, true);
    }
  }, [session, status]);

  const fetchActivities = async (
    pageNum: number = 1,
    reset: boolean = false
  ) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const stravaService = new StravaService(
        session!.accessToken!,
        session!.refreshToken,
        session!.expiresAt
      );
      const newActivities = await stravaService.getActivities(pageNum, 20);

      if (reset) {
        setActivities(newActivities);
      } else {
        setActivities((prev) => [...prev, ...newActivities]);
      }

      setHasMore(newActivities.length === 20);
      setPage(pageNum);
    } catch (err) {
      setError("Error al cargar las actividades");
      console.error("Error:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchActivities(page + 1, false);
    }
  };

  const formatDistance = (distance: number) => {
    return (distance / 1000).toFixed(2) + " km";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else {
      return `${minutes}m`;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      Run: "bg-red-100 text-red-800",
      Ride: "bg-blue-100 text-blue-800",
      Walk: "bg-green-100 text-green-800",
      Hike: "bg-yellow-100 text-yellow-800",
      Swim: "bg-cyan-100 text-cyan-800",
      Workout: "bg-purple-100 text-purple-800",
      Yoga: "bg-pink-100 text-pink-800",
      VirtualRide: "bg-indigo-100 text-indigo-800",
      VirtualRun: "bg-orange-100 text-orange-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
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
            <button
              onClick={() => fetchActivities(1, true)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reintentar
            </button>
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Mis Actividades
              </h1>
              <p className="text-gray-600 mt-2">
                {activities.length} actividades cargadas
              </p>
            </div>
            <Link
              href="/dashboard"
              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg"
            >
              ← Dashboard
            </Link>
          </div>
        </div>

        {/* Activities Grid */}
        <div className="grid gap-6">
          {activities.map((activity) => (
            <Link
              key={activity.id}
              href={`/activities/${activity.id}`}
              className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200 hover:border-orange-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">
                      {getActivityIcon(activity.type)}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-600">
                        {activity.name}
                      </h3>
                      <div className="flex items-center mt-1 space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            activity.type
                          )}`}
                        >
                          {activity.type}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {formatDate(activity.start_date_local)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {formatDistance(activity.distance)}
                      </div>
                      <div className="text-xs text-gray-500">Distancia</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">
                        {formatTime(activity.moving_time)}
                      </div>
                      <div className="text-xs text-gray-500">Tiempo</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">
                        {(activity.average_speed * 3.6).toFixed(1)} km/h
                      </div>
                      <div className="text-xs text-gray-500">Velocidad</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">
                        {activity.total_elevation_gain.toFixed(0)}m
                      </div>
                      <div className="text-xs text-gray-500">Elevación</div>
                    </div>
                  </div>
                </div>

                <div className="ml-6 text-right">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>❤️ {activity.kudos_count}</span>
                    <span>💬 {activity.comment_count}</span>
                    <span>🏆 {activity.achievement_count}</span>
                  </div>
                  <div className="mt-2">
                    <span className="text-orange-600 text-sm font-medium">
                      Ver detalles →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="text-center mt-8">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium"
            >
              {loadingMore ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Cargando...
                </div>
              ) : (
                "Cargar más actividades"
              )}
            </button>
          </div>
        )}

        {!hasMore && activities.length > 0 && (
          <div className="text-center mt-8 text-gray-500">
            <p>Has visto todas tus actividades</p>
          </div>
        )}

        {activities.length === 0 && !loading && (
          <div className="text-center mt-16">
            <div className="text-6xl mb-4">🏃‍♂️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No tienes actividades aún
            </h3>
            <p className="text-gray-600">
              ¡Sal y registra tu primera actividad en Strava!
            </p>
          </div>
        )}
      </div>
    </>
  );
}
