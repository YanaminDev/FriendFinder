import { useNav } from '../../src/utils/useNav';
import GenderScreen from '../../src/feature/onboarding/GenderScreen';

export default function GenderRoute() {
  const navigation = useNav();
  return <GenderScreen navigation={navigation} />;
}
