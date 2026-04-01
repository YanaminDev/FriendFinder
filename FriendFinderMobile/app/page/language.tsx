import { useNav } from '../../src/utils/useNav';
import LanguageScreen from '../../src/feature/onboarding/LanguageScreen';

export default function LanguageRoute() {
  const navigation = useNav();
  return <LanguageScreen navigation={navigation} />;
}
