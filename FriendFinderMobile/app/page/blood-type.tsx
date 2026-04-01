import { useNav } from '../../src/utils/useNav';
import BloodTypeScreen from '../../src/feature/onboarding/BloodTypeScreen';

export default function BloodTypeRoute() {
  const navigation = useNav();
  return <BloodTypeScreen navigation={navigation} />;
}
