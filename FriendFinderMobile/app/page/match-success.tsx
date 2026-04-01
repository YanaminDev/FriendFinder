import { useNav } from '../../src/utils/useNav';
import MatchSuccessScreen from '../../src/feature/match/MatchSuccessScreen';

export default function MatchSuccessRoute() {
  const navigation = useNav();
  return <MatchSuccessScreen navigation={navigation} />;
}
