import { useNav } from '../../src/utils/useNav';
import MatchScreen from '../../src/feature/match/MatchScreen';

export default function MatchRoute() {
  const navigation = useNav();
  return <MatchScreen navigation={navigation} />;
}
