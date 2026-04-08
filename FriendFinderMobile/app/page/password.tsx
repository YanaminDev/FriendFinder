import { useNav } from '../../src/utils/useNav';
import PasswordScreen from '../../src/feature/auth/PasswordScreen';

export default function PasswordRoute() {
  const navigation = useNav();
  return <PasswordScreen navigation={navigation} />;
}
