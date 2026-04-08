import { useNav } from '../../src/utils/useNav';
import LoginScreen from '../../src/feature/auth/LoginScreen';

export default function LoginRoute() {
  const navigation = useNav();
  return <LoginScreen navigation={navigation} />;
}
