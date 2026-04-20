import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import OtherProfileScreen from '../../src/feature/profile/OtherProfile';

export default function OtherProfileRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{ userId: string; userName?: string }>();
  const route = {
    params: {
      userId: params.userId || '',
      userName: params.userName || '',
    },
  };
  return <OtherProfileScreen navigation={navigation} route={route} />;
}
