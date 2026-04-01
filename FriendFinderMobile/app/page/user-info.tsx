import { useNav } from '../../src/utils/useNav';
import UserInfoScreen from '../../src/feature/onboarding/UserInfoScreen';

export default function UserInfoRoute() {
  const navigation = useNav();
  return <UserInfoScreen navigation={navigation} />;
}
