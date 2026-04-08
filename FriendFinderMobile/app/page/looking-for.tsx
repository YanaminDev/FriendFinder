import { useNav } from '../../src/utils/useNav';
import LookingForScreen from '../../src/feature/onboarding/LookingForScreen';

export default function LookingForRoute() {
  const navigation = useNav();
  return <LookingForScreen navigation={navigation} />;
}
