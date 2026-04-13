import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import MatchCancelledScreen from '../../src/feature/match/MatchCancelledScreen';

export default function MatchCancelledRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{ matchId?: string; revieweeId?: string }>();
  const route = { params: { matchId: params.matchId || '', revieweeId: params.revieweeId || '' } };
  return <MatchCancelledScreen navigation={navigation} route={route} />;
}
