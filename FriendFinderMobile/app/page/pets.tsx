import { useNav } from '../../src/utils/useNav';
import PetsScreen from '../../src/feature/onboarding/PetsScreen';

export default function PetsRoute() {
  const navigation = useNav();
  return <PetsScreen navigation={navigation} />;
}
