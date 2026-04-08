import { useNav } from '../../src/utils/useNav';
import ExerciseScreen from '../../src/feature/onboarding/ExerciseScreen';

export default function ExerciseRoute() {
  const navigation = useNav();
  return <ExerciseScreen navigation={navigation} />;
}
