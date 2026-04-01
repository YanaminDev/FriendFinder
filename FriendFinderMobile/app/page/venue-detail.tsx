import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import VenueDetailScreen from '../../src/feature/match/VenueDetailScreen';

export default function VenueDetailRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{ venueId: string }>();
  const route = { params: { venueId: params.venueId || '' } };
  return <VenueDetailScreen navigation={navigation} route={route} />;
}
