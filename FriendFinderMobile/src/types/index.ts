// ─── FriendFinder TypeScript Types ───────────────────────────────────────────

export interface UserBase {
  id: string;
  username: string;
  name: string;
  avatar?: string;
  initials?: string;
  avatarBgColor?: string;
  age: number;
  gender: Gender;
  isOnline?: boolean;
}

export interface User extends UserBase {
  birthDate: string;
  bio: string;
  interestedGender: string;
  lookingFor: string;
  education: string;
  height: number;
  language: string;
  bloodGroup: string;
  drinking: string;
  smoking: string;
  workout: string;
  pets: string;
  photos: string[];
  interests: string[];
}

export interface MatchProfile extends UserBase {
  lookingFor: string;
  interests: string[];
  photos: string[];
  bio: string;
  education: string;
  height: number;
  language: string;
  bloodGroup: string;
  drinking: string;
  smoking: string;
  workout: string;
  pets: string;
}

export type Gender = 'Male' | 'Female' | 'LGBTQ+';
export type TabRoute = 'HOME' | 'HISTORY' | 'CHAT' | 'PROFILE';

export interface ChatConversation {
  id: string;
  user: UserBase;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  isMine: boolean;
  isRead?: boolean;
  chatType?: string;
  imageUri?: string;
}

export interface Notification {
  id: string;
  userId: string;
  avatar: string;
  message: string;
  time: string;
  hasActions: boolean;
  isRead: boolean;
}

export interface VenueReview {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  comment: string;
  liked: boolean;
}

export interface Venue {
  id: string;
  name: string;
  category: string;
  image: string;
  successfulMatches: number;
  address: string;
  phone: string;
  openHours: string;
  description: string;
  reviews: VenueReview[];
  latitude?: number;
  longitude?: number;
}

export interface HistoryItem {
  id: string;
  date: string;
  venue: Venue;
  personReview: VenueReview;
  locationReview: VenueReview;
}

export interface Activity {
  id: string;
  name: string;
  icon: string;
  isPopular?: boolean;
  isRecommended?: boolean;
}

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  PhoneNumber: undefined;
  Password: undefined;
  OtpVerification: { phone: string };
  UserInfo: undefined;
  Gender: undefined;
  Birthday: undefined;
  InterestedGender: undefined;
  LookingFor: undefined;
  Language: undefined;
  BloodType: undefined;
  Height: undefined;
  Education: undefined;
  Smoking: undefined;
  Drinking: undefined;
  Exercise: undefined;
  Pets: undefined;
  Home: undefined;
  SelectActivity: undefined;
  Match: undefined;
  MatchUp: { matchedUser: MatchProfile };
  MatchSuccess: undefined;
  MatchCancelled: undefined;
  VenueDetail: { venue: Venue };
  ChatList: undefined;
  ChatDetail: { conversation: ChatConversation };
  Notification: undefined;
  History: undefined;
  EditProfile: undefined;
  ReviewExperience: undefined;
};
