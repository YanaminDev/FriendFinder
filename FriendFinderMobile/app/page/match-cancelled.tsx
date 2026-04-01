import { useNav } from '../../src/utils/useNav';
import MatchCancelledScreen from '../../src/feature/match/MatchCancelledScreen';

export default function MatchCancelledRoute() {
  const navigation = useNav();
  return <MatchCancelledScreen navigation={navigation} />;
}
