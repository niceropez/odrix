import axios from "axios";

const STRAVA_BASE_URL = "https://www.strava.com/api/v3";

export interface StravaActivity {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  start_date_local: string;
  achievement_count: number;
  kudos_count: number;
  comment_count: number;
  athlete_count: number;
  photo_count: number;
  average_speed: number;
  max_speed: number;
  // Campos adicionales para la vista detallada
  description?: string;
  calories?: number;
  device_name?: string;
  gear_id?: string;
  trainer?: boolean;
  commute?: boolean;
  manual?: boolean;
  private?: boolean;
  visibility?: string;
  start_latlng?: [number, number];
  end_latlng?: [number, number];
  map?: {
    id: string;
    summary_polyline: string;
    resource_state: number;
  };
  timezone?: string;
  utc_offset?: number;
  location_city?: string;
  location_state?: string;
  location_country?: string;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  kilojoules?: number;
  device_watts?: boolean;
  has_heartrate?: boolean;
  heartrate_opt_out?: boolean;
  display_hide_heartrate_option?: boolean;
  elev_high?: number;
  elev_low?: number;
  pr_count?: number;
  total_photo_count?: number;
  has_kudoed?: boolean;
  workout_type?: number;
  suffer_score?: number;
  external_id?: string;
  upload_id?: number;
  athlete?: {
    id: number;
    username: string;
    resource_state: number;
    firstname: string;
    lastname: string;
    premium: boolean;
    summit: boolean;
    city: string;
    state: string;
    country: string;
    sex: string;
    profile_medium: string;
    profile: string;
    friend?: any;
    follower?: any;
  };
}

export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  premium: boolean;
  created_at: string;
  updated_at: string;
  badge_type_id: number;
  profile_medium: string;
  profile: string;
  friend: null;
  follower: null;
}

export interface StravaStreams {
  time?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  distance?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  latlng?: {
    data: [number, number][];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  altitude?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  velocity_smooth?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  heartrate?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  cadence?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  watts?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  temp?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  moving?: {
    data: boolean[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
  grade_smooth?: {
    data: number[];
    series_type: string;
    original_size: number;
    resolution: string;
  };
}

export interface KilometerData {
  km: number;
  pace: string;
  elevation: number;
  heartrate: number | null;
  speed: number;
  distance: number;
  time: number;
}

export class StravaService {
  private accessToken: string;
  private refreshToken?: string;
  private expiresAt?: number;

  constructor(accessToken: string, refreshToken?: string, expiresAt?: number) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.expiresAt = expiresAt;
  }

  private async ensureValidToken(): Promise<string> {
    // Check if token is expired or expiring soon (within 5 minutes)
    if (this.expiresAt && this.refreshToken) {
      const now = Math.floor(Date.now() / 1000);
      const timeUntilExpiry = this.expiresAt - now;

      console.log("⏰ Token expires in:", timeUntilExpiry / 60, "minutes");

      if (timeUntilExpiry < 300) {
        // Less than 5 minutes
        console.log("🔄 Token expiring soon, refreshing...");
        try {
          const refreshedTokens = await this.refreshStravaToken();
          this.accessToken = refreshedTokens.access_token;
          this.expiresAt = refreshedTokens.expires_at;
          console.log("✅ Token refreshed in StravaService");
        } catch (error) {
          console.error("❌ Failed to refresh token:", error);
          // Continue with existing token, might fail the request
        }
      }
    }

    return this.accessToken;
  }

  private async refreshStravaToken(): Promise<any> {
    if (!this.refreshToken) {
      throw new Error("No refresh token available");
    }

    console.log("🔄 Calling API endpoint to refresh token...");

    const response = await fetch("/api/refresh-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("❌ Token refresh API error:", error);
      throw new Error(`Token refresh failed: ${JSON.stringify(error)}`);
    }

    const result = await response.json();
    console.log("✅ Token refresh successful via API");
    return result;
  }

  private async makeRequest(
    endpoint: string,
    params?: Record<string, string | number>
  ) {
    try {
      const validToken = await this.ensureValidToken();

      const response = await axios.get(`${STRAVA_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${validToken}`,
        },
        params,
      });
      return response.data;
    } catch (error: any) {
      console.error("Strava API Error:", error);

      // If token is invalid, try to refresh once
      if (error.response?.status === 401 && this.refreshToken) {
        console.log("🔄 401 error, attempting token refresh...");
        try {
          const refreshedTokens = await this.refreshStravaToken();
          this.accessToken = refreshedTokens.access_token;
          this.expiresAt = refreshedTokens.expires_at;

          // Retry the original request with new token
          const response = await axios.get(`${STRAVA_BASE_URL}${endpoint}`, {
            headers: {
              Authorization: `Bearer ${this.accessToken}`,
            },
            params,
          });
          return response.data;
        } catch (refreshError) {
          console.error("❌ Token refresh failed:", refreshError);
          throw error; // Throw original error
        }
      }

      throw error;
    }
  }

  async getAthlete(): Promise<StravaAthlete> {
    return this.makeRequest("/athlete");
  }

  async getActivities(page = 1, perPage = 30): Promise<StravaActivity[]> {
    return this.makeRequest("/athlete/activities", {
      page,
      per_page: perPage,
    });
  }

  async getActivity(id: number): Promise<StravaActivity> {
    return this.makeRequest(`/activities/${id}`);
  }

  async getActivityStreams(
    id: number,
    keys: string[] = [
      "time",
      "distance",
      "latlng",
      "altitude",
      "velocity_smooth",
      "heartrate",
      "cadence",
      "watts",
      "temp",
      "moving",
      "grade_smooth",
    ]
  ): Promise<StravaStreams> {
    const keyString = keys.join(",");

    try {
      // Try the standard Strava API endpoint
      const streamsArray = await this.makeRequest(
        `/activities/${id}/streams/${keyString}`,
        {
          key_by_type: "true",
        }
      );

      console.log("Raw streams response:", streamsArray);

      // Convert array response to keyed object
      const streams: StravaStreams = {};

      if (Array.isArray(streamsArray)) {
        streamsArray.forEach((stream: any) => {
          if (stream.type && stream.data) {
            streams[stream.type as keyof StravaStreams] = {
              data: stream.data,
              series_type: stream.series_type || "distance",
              original_size: stream.original_size || stream.data.length,
              resolution: stream.resolution || "high",
            };
          }
        });
      } else if (streamsArray && typeof streamsArray === "object") {
        // Handle case where response is already an object
        Object.keys(streamsArray).forEach((key) => {
          if (streamsArray[key] && streamsArray[key].data) {
            streams[key as keyof StravaStreams] = streamsArray[key];
          }
        });
      }

      console.log("Processed streams:", streams);
      return streams;
    } catch (error) {
      console.error("Error fetching streams:", error);
      throw error;
    }
  }

  async getStats(athleteId: number) {
    return this.makeRequest(`/athletes/${athleteId}/stats`);
  }
}

// Utility functions for processing stream data
export function calculateKilometerData(
  streams: StravaStreams
): KilometerData[] {
  console.log("calculateKilometerData input:", streams);

  if (!streams.distance?.data || !streams.time?.data) {
    console.log("Missing distance or time data:", {
      distance: streams.distance?.data
        ? `${streams.distance.data.length} points`
        : "missing",
      time: streams.time?.data
        ? `${streams.time.data.length} points`
        : "missing",
    });
    return [];
  }

  const distance = streams.distance.data;
  const time = streams.time.data;
  const altitude = streams.altitude?.data || [];
  const heartrate = streams.heartrate?.data || [];
  const velocity = streams.velocity_smooth?.data || [];

  console.log("Stream data lengths:", {
    distance: distance.length,
    time: time.length,
    altitude: altitude.length,
    heartrate: heartrate.length,
    velocity: velocity.length,
  });

  const kilometerData: KilometerData[] = [];
  let lastKmIndex = 0;

  const totalDistance = distance[distance.length - 1];
  const totalKm = Math.floor(totalDistance / 1000);

  console.log(`Total distance: ${totalDistance}m, Total km: ${totalKm}`);

  for (let km = 1; km <= totalKm; km++) {
    const targetDistance = km * 1000;

    // Find the index where we cross the km mark
    const kmIndex = distance.findIndex(
      (d, i) => i > lastKmIndex && d >= targetDistance
    );

    if (kmIndex === -1) {
      console.log(`No index found for km ${km}`);
      break;
    }

    // Calculate data for this kilometer
    const kmTime = time[kmIndex] - time[lastKmIndex];
    const kmDistance = distance[kmIndex] - distance[lastKmIndex];
    const kmSpeed = kmDistance / kmTime; // m/s

    // Calculate pace (min/km)
    const paceSeconds = 1000 / kmSpeed;
    const paceMinutes = Math.floor(paceSeconds / 60);
    const paceSecondsRemainder = Math.round(paceSeconds % 60);
    const pace = `${paceMinutes}:${paceSecondsRemainder
      .toString()
      .padStart(2, "0")}`;

    // Calculate elevation gain for this km
    let elevationGain = 0;
    if (altitude.length > 0) {
      for (let i = lastKmIndex + 1; i <= kmIndex; i++) {
        if (i < altitude.length && altitude[i] > altitude[i - 1]) {
          elevationGain += altitude[i] - altitude[i - 1];
        }
      }
    }

    // Calculate average heart rate for this km
    let avgHeartrate: number | null = null;
    if (heartrate.length > 0) {
      const hrData = heartrate
        .slice(lastKmIndex, kmIndex + 1)
        .filter((hr) => hr > 0);
      if (hrData.length > 0) {
        avgHeartrate = Math.round(
          hrData.reduce((sum, hr) => sum + hr, 0) / hrData.length
        );
      }
    }

    kilometerData.push({
      km,
      pace,
      elevation: Math.round(elevationGain),
      heartrate: avgHeartrate,
      speed: kmSpeed * 3.6, // Convert to km/h
      distance: kmDistance,
      time: kmTime,
    });

    lastKmIndex = kmIndex;
  }

  console.log("Calculated kilometer data:", kilometerData);
  return kilometerData;
}

export function formatPaceFromSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.round(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

// Convenience functions that create StravaService instances with token refresh support
export const getActivities = async (
  accessToken: string,
  refreshToken?: string,
  expiresAt?: number
): Promise<StravaActivity[]> => {
  console.log("🔄 Getting activities with token validity check");
  const stravaService = new StravaService(accessToken, refreshToken, expiresAt);
  const activities = await stravaService.getActivities();
  console.log("📊 Fetched", activities.length, "activities");
  return activities;
};

export const getActivity = async (
  activityId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: number
): Promise<StravaActivity> => {
  console.log(
    "🔄 Getting activity with token validity check for ID:",
    activityId
  );
  const stravaService = new StravaService(accessToken, refreshToken, expiresAt);
  return stravaService.getActivity(Number(activityId));
};

export const getActivityStreams = async (
  activityId: string,
  accessToken: string,
  refreshToken?: string,
  expiresAt?: number
): Promise<StravaStreams> => {
  console.log(
    "🔄 Getting activity streams with token validity check for ID:",
    activityId
  );
  const stravaService = new StravaService(accessToken, refreshToken, expiresAt);
  return stravaService.getActivityStreams(Number(activityId));
};
