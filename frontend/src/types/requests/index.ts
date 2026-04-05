// Auth Request DTOs
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  user_show_name: string;
  username: string;
  password: string;
  sex: 'male' | 'female' | 'lgbtq';
  age: number;
  birth_of_date: string;
  interested_gender: 'male' | 'female' | 'lgbtq';
}

export interface ForgotPasswordRequest {
  email: string;
}

// Location Request DTOs
export interface CreateLocationRequest {
  name: string;
  description?: string;
  phone?: string;
  activity_id: string;
  latitude: number;
  longitude: number;
  position_id?: string;
  open_date?: string;
  open_time?: string;
  close_time?: string;
}

export interface UpdateLocationRequest {
  description?: string;
  phone?: string;
  open_date?: string;
  open_time?: string;
  close_time?: string;
}

export interface DeleteLocationRequest {
  id: string;
}

// Activity Request DTOs
export interface CreateActivityRequest {
  name: string;
}

export interface UpdateActivityRequest {
  name: string;
}

export interface DeleteActivityRequest {
  id: string;
}

// User Request DTOs
export interface UpdateUserProfileRequest {
  user_show_name?: string;
  age?: number;
  interested_gender?: 'male' | 'female' | 'lgbtq';
}
