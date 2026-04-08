import { useNav } from '../../src/utils/useNav';
import BirthdayScreen from '../../src/feature/onboarding/BirthdayScreen';

export default function BirthdayRoute() {
  const navigation = useNav();
  return <BirthdayScreen navigation={navigation} />;
}
