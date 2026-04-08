import { useRouter } from 'expo-router';

const ROUTE_MAP: Record<string, string> = {
  // Auth
  PhoneNumber: '/page/phone',
  Login: '/page/login',
  OtpVerification: '/page/otp',
  Password: '/page/password',
  // Onboarding
  UserInfo: '/page/user-info',
  Gender: '/page/gender',
  Birthday: '/page/birthday',
  InterestedGender: '/page/interested-gender',
  LookingFor: '/page/looking-for',
  Language: '/page/language',
  BloodType: '/page/blood-type',
  Height: '/page/height',
  Education: '/page/education',
  Smoking: '/page/smoking',
  Drinking: '/page/drinking',
  Exercise: '/page/exercise',
  Pets: '/page/pets',
  // Main app (tabs)
  Home: '/(tabs)/home',
  History: '/(tabs)/history',
  ChatList: '/(tabs)/chat',
  Profile: '/(tabs)/profile',
  // Stack screens
  SelectActivity: '/page/select-activity',
  Match: '/page/match',
  MatchUp: '/page/match-up',
  MatchSuccess: '/page/match-success',
  MatchCancelled: '/page/match-cancelled',
  VenueDetail: '/page/venue-detail',
  ChatDetail: '/page/chat-detail',
  Notification: '/page/notification',
  EditProfile: '/page/edit-profile',
  ReviewExperience: '/page/review-experience',
};

export function useNav() {
  const router = useRouter();
  return {
    navigate: (screen: string, params?: Record<string, string>) => {
      const path = ROUTE_MAP[screen];
      if (path) {
        if (params) {
          const queryString = new URLSearchParams(params).toString();
          router.push(`${path}?${queryString}` as never);
        } else {
          router.push(path as never);
        }
      }
    },
    goBack: () => router.back(),
  };
}
