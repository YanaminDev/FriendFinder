import { useNav } from '../../src/utils/useNav';
import ReviewExperienceScreen from '../../src/feature/review/ReviewExperienceScreen';

export default function ReviewExperienceRoute() {
  const navigation = useNav();
  return <ReviewExperienceScreen navigation={navigation} />;
}
