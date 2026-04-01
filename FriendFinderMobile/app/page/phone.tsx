import { useNav } from '../../src/utils/useNav';
import PhoneScreen from '../../src/feature/auth/PhoneScreen';

export default function PhoneRoute() {
  const navigation = useNav();
  return <PhoneScreen navigation={navigation} />;
}
