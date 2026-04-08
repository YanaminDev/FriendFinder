import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import OtpScreen from '../../src/feature/auth/OtpScreen';

export default function OtpRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{ phone: string }>();
  const route = { params: { phone: params.phone || '' } };
  return <OtpScreen navigation={navigation} route={route} />;
}
