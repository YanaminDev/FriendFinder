import { useNav } from '../../src/utils/useNav';
import HeightScreen from '../../src/feature/onboarding/HeightScreen';

export default function HeightRoute() {
  const navigation = useNav();
  return <HeightScreen navigation={navigation} />;
}
