import { useNav } from '../../src/utils/useNav';
import VenuesListScreen from '../../src/feature/venue/VenuesListScreen';

export default function VenuesListRoute() {
  const navigation = useNav();
  return <VenuesListScreen navigation={navigation} />;
}
