import { useNav } from '../../src/utils/useNav';
import DrinkingScreen from '../../src/feature/onboarding/DrinkingScreen';

export default function DrinkingRoute() {
  const navigation = useNav();
  return <DrinkingScreen navigation={navigation} />;
}
