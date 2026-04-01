import { useNav } from '../../src/utils/useNav';
import SplashScreen from '../../src/feature/auth/SplashScreen';

export default function SplashRoute() {
  const navigation = useNav();
  return <SplashScreen navigation={navigation} />;
}
