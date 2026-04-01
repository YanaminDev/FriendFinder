import { useNav } from '../../src/utils/useNav';
import InterestedGenderScreen from '../../src/feature/onboarding/InterestedGenderScreen';

export default function InterestedGenderRoute() {
  const navigation = useNav();
  return <InterestedGenderScreen navigation={navigation} />;
}
