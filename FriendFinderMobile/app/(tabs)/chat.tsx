import { useNav } from '../../src/utils/useNav';
import ChatListScreen from '../../src/feature/chat/ChatListScreen';

export default function ChatRoute() {
  const navigation = useNav();
  return <ChatListScreen navigation={navigation} />;
}
