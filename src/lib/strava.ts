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
