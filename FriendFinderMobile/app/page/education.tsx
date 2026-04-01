import { useNav } from '../../src/utils/useNav';
import EducationScreen from '../../src/feature/onboarding/EducationScreen';

export default function EducationRoute() {
  const navigation = useNav();
  return <EducationScreen navigation={navigation} />;
}
