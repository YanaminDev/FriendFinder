import { useLocalSearchParams } from 'expo-router';
import { useNav } from '../../src/utils/useNav';
import ChatDetailScreen from '../../src/feature/chat/ChatDetailScreen';

export default function ChatDetailRoute() {
  const navigation = useNav();
  const params = useLocalSearchParams<{
    conversationId: string;
    otherUsername?: string;
    otherAvatar?: string;
  }>();
  const route = {
    params: {
      conversationId: params.conversationId || '',
      otherUsername: params.otherUsername,
      otherAvatar: params.otherAvatar,
    },
  };
  return <ChatDetailScreen navigation={navigation} route={route} />;
}
