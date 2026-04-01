import { useNav } from '../../src/utils/useNav';
import SelectActivityScreen from '../../src/feature/activity/SelectActivityScreen';

export default function SelectActivityRoute() {
  const navigation = useNav();
  return <SelectActivityScreen navigation={navigation} />;
}
