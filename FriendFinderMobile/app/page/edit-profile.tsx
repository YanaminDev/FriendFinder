import { useNav } from '../../src/utils/useNav';
import EditProfileScreen from '../../src/feature/profile/EditProfileScreen';

export default function EditProfileRoute() {
  const navigation = useNav();
  return <EditProfileScreen navigation={navigation} />;
}
