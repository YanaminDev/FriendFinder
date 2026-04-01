import { useNav } from '../../src/utils/useNav';
import ProfileScreen from '../../src/feature/profile/ProfileScreen';

export default function ProfileRoute() {
  const navigation = useNav();
  return <ProfileScreen navigation={navigation} />;
}
