import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import MatchUpScreen from '../../src/feature/match/MatchUpScreen';

export default function MatchUpRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{ userId: string }>();
  const route = { params: { userId: params.userId || '' } };
  return <MatchUpScreen navigation={navigation} route={route} />;
}
