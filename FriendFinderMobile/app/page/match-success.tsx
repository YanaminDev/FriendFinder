import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import MatchSuccessScreen from '../../src/feature/match/MatchSuccessScreen';

export default function MatchSuccessRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{ matchId?: string }>();
  const route = { params: { matchId: params.matchId || '' } };
  return <MatchSuccessScreen navigation={navigation} route={route} />;
}
