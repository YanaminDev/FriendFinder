import { useNav } from '../../src/utils/useNav';
import HomeScreen from '../../src/feature/home/HomeScreen';

export default function HomeRoute() {
  const navigation = useNav();
  return <HomeScreen navigation={navigation} />;
}
