// Auth Response DTOs
export interface AuthResponse {
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user_id?: string;
  username?: string;
  role?: string;
}

// Activity Response DTOs
export interface ActivityResponse {
  id: string;
  name: string;
  icon: string;
}

// Location Response DTOs
export interface LocationImage {
  id: string;
  imageUrl: string;
  position: number;
  location_id: string;
  createdAt: string;
}

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
  location_image?: LocationImage[];
  created_at?: string;
  updated_at?: string;
}

// Position Response DTOs
export interface PositionResponse {
  id: string;
  name: string;
  information?: string;
  phone?: string;
  open_date?: string;
  open_time?: string;
  close_time?: string;
  image?: string;
  latitude: number;
  longitude: number;
  location?: LocationResponse[];
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

// ============ Match Review (Admin Feedback) ============
export interface MatchReviewUser {
  user_id: string;
  username: string;
  user_show_name: string;
  images: { imageUrl: string }[];
}

export interface MatchExperience {
  id: string;
  content?: string;
  status: number;
  match_id: string;
  reviewer_id: string;
  reviewee_id: string;
  createdAt: string;
  reviewer: { user_id: string; username: string };
  reviewee: { user_id: string; username: string };
}

export interface MatchLocationReview {
  id: string;
  location_id: string;
  user_id: string;
  status: number;
  review_text?: string;
  match_id: string;
  createdAt: string;
  user: { user_id: string; username: string };
  location: { name: string };
}

export interface MatchCancellation {
  id: string;
  content?: string;
  match_id: string;
  reviewer_id: string;
  reviewee_id: string;
  quick_select_id?: string;
  createdAt: string;
  reviewer: { user_id: string; username: string };
  reviewee: { user_id: string; username: string };
  quick_select?: { id: string; name: string } | null;
}

export interface MatchUserReview {
  id: string;
  user_id: string;
  reviewed_user_id: string;
  status: number;
  review_text?: string;
  match_id: string;
  createdAt: string;
  user: { user_id: string; username: string };
  reviewed_user: { user_id: string; username: string };
}

export interface MatchWithReviews {
  id: string;
  user1_id: string;
  user2_id: string;
  location_id?: string;
  activity_id: string;
  cancel_status: boolean;
  end_date?: string;
  createdAt: string;
  position_id: string;
  user1: MatchReviewUser;
  user2: MatchReviewUser;
  activity: { name: string; icon: string };
  location?: { name: string; location_image?: { imageUrl: string }[] } | null;
  position: { name: string };
  experience: MatchExperience[];
  location_review: MatchLocationReview[];
  cancellation: MatchCancellation[];
  user_review: MatchUserReview[];
}
