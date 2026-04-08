import { useNav } from '../../src/utils/useNav';
import SmokingScreen from '../../src/feature/onboarding/SmokingScreen';

export default function SmokingRoute() {
  const navigation = useNav();
  return <SmokingScreen navigation={navigation} />;
}
