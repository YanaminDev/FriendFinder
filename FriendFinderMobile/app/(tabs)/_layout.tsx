import { Tabs, usePathname, useRouter } from 'expo-router';
import BottomTabBar from '../../src/components/common/BottomTabBar';
import { TabRoute } from '../../src/types';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  const activeTab: TabRoute =
    pathname.includes('history') ? 'HISTORY' :
    pathname.includes('chat') ? 'CHAT' :
    pathname.includes('profile') ? 'PROFILE' : 'HOME';

  const handleTabPress = (tab: TabRoute) => {
    switch (tab) {
      case 'HOME':    router.push('/(tabs)/home'); break;
      case 'HISTORY': router.push('/(tabs)/history'); break;
      case 'CHAT':    router.push('/(tabs)/chat'); break;
      case 'PROFILE': router.push('/(tabs)/profile'); break;
    }
  };

  return (
    <Tabs
      tabBar={() => <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="history" />
      <Tabs.Screen name="chat" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}
