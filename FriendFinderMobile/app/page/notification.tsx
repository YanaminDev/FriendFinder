import { useNav } from '../../src/utils/useNav';
import NotificationScreen from '../../src/feature/notification/NotificationScreen';

export default function NotificationRoute() {
  const navigation = useNav();
  return <NotificationScreen navigation={navigation} />;
}
