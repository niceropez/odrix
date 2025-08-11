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

export class StravaService {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async makeRequest(
    endpoint: string,
    params?: Record<string, string | number>
  ) {
    try {
      const response = await axios.get(`${STRAVA_BASE_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
        },
        params,
      });
      return response.data;
    } catch (error) {
      console.error("Strava API Error:", error);
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

  async getStats(athleteId: number) {
    return this.makeRequest(`/athletes/${athleteId}/stats`);
  }
}
