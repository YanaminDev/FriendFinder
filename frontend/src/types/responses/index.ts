// Auth Response DTOs
export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user_id?: string;
  username?: string;
}

// Activity Response DTOs
export interface ActivityResponse {
  id: string;
  name: string;
}

// Location Response DTOs
export interface LocationResponse {
  id: string;
  name: string;
  description?: string;
  phone?: string;
  activity_id: string;
  position_id: string;
  latitude: number;
  longitude: number;
  open_date?: string;
  open_time?: string;
  close_time?: string;
  created_at?: string;
  updated_at?: string;
}

// User Response DTOs
export interface UserResponse {
  user_id: string;
  username: string;
  user_show_name: string;
  sex: string;
  age: number;
  birth_of_date: string;
  interested_gender: string;
  created_at?: string;
  updated_at?: string;
}

// Map Response DTOs
export interface MapTokenResponse {
  token: string;
}

// Generic API Response
export interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}
