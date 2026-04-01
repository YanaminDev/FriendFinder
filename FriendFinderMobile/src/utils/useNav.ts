import { useRouter } from 'expo-router';

const ROUTE_MAP: Record<string, string> = {
  // Auth
  PhoneNumber: '/phone',
  Login: '/login',
  OtpVerification: '/otp',
  Password: '/password',
  // Onboarding
  UserInfo: '/user-info',
  Gender: '/gender',
  Birthday: '/birthday',
  InterestedGender: '/interested-gender',
  LookingFor: '/looking-for',
  Language: '/language',
  BloodType: '/blood-type',
  Height: '/height',
  Education: '/education',
  Smoking: '/smoking',
  Drinking: '/drinking',
  Exercise: '/exercise',
  Pets: '/pets',
  // Main app (tabs)
  Home: '/(tabs)',
  History: '/(tabs)/history',
  ChatList: '/(tabs)/chat',
  Profile: '/(tabs)/profile',
  // Stack screens
  SelectActivity: '/select-activity',
  Match: '/match',
  MatchUp: '/match-up',
  MatchSuccess: '/match-success',
  MatchCancelled: '/match-cancelled',
  VenueDetail: '/venue-detail',
  ChatDetail: '/chat-detail',
  Notification: '/notification',
  EditProfile: '/edit-profile',
  ReviewExperience: '/review-experience',
};

export function useNav() {
  const router = useRouter();
  return {
    navigate: (screen: string, params?: Record<string, string>) => {
      const path = ROUTE_MAP[screen];
      if (path) {
        if (params) {
          router.push({ pathname: path as never, params });
        } else {
          router.push(path as never);
        }
      }
    },
    goBack: () => router.back(),
  };
}
