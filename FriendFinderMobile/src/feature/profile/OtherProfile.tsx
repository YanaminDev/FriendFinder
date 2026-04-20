// ─── OtherProfileScreen ────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import InfoRow from '../../components/profile/InfoRow';
import { getUserInformation, UserInformation } from '../../service/user_information.service';
import { getUserLifeStyle, UserLifeStyle } from '../../service/user_life_style.service';
import { getPublicUserImages, UserImage } from '../../service/user_image.service';
import { colors } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';

interface OtherProfileProps {
  navigation: any;
  route: { params: { userId: string; userName: string } };
}

const OtherProfileScreen: React.FC<OtherProfileProps> = ({ navigation, route }) => {
  const { userId, userName } = route.params;
  const { maxContentWidth } = useResponsive();

  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [userLifeStyle, setUserLifeStyle] = useState<UserLifeStyle | null>(null);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [info, lifeStyle, images] = await Promise.all([
          getUserInformation(userId).catch(() => null),
          getUserLifeStyle(userId).catch(() => null),
          getPublicUserImages(userId).catch(() => []),
        ]);
        setUserInfo(info);
        setUserLifeStyle(lifeStyle);
        setUserImages(images || []);
      } catch (error) {
        console.error('Error fetching other user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const CardHeader = ({ icon, title }: { icon: string; title: string }) => (
    <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
      <MaterialCommunityIcons name={icon as any} size={20} color={colors.primary} />
      <Text className="text-base font-bold text-gray-900 flex-1">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title={userName || 'โปรไฟล์'}
        showBack
        onBackPress={() => navigation.goBack()}
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 24, alignItems: 'center' }}
        >
          <View style={{ width: '100%', maxWidth: maxContentWidth }}>

            {/* Header */}
            <View className="items-center py-3 bg-white">
              <Text className="text-2xl font-bold text-gray-900">{userName || '-'}</Text>
            </View>

            {/* Gallery Grid */}
            <View className="px-2 mt-4">
              <Text className="text-sm font-semibold text-gray-700 mx-2 mb-3">รูปภาพ</Text>
              <View className="flex-row flex-wrap">
                {[0, 1].map((index) => (
                  <View key={index} className="flex-1 mx-2 mb-4">
                    <View className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square items-center justify-center bg-gray-100">
                      {userImages[index]?.imageUrl ? (
                        <Image source={{ uri: userImages[index].imageUrl }} className="w-full h-full" />
                      ) : (
                        <MaterialCommunityIcons name="image" size={32} color={colors.gray300} />
                      )}
                    </View>
                  </View>
                ))}
              </View>
              <View className="flex-row flex-wrap">
                {[2, 3].map((index) => (
                  <View key={index} className="flex-1 mx-2 mb-4">
                    <View className="bg-white rounded-2xl overflow-hidden shadow-lg aspect-square items-center justify-center bg-gray-100">
                      {userImages[index]?.imageUrl ? (
                        <Image source={{ uri: userImages[index].imageUrl }} className="w-full h-full" />
                      ) : (
                        <MaterialCommunityIcons name="image" size={32} color={colors.gray300} />
                      )}
                    </View>
                  </View>
                ))}
              </View>
            </View>

            {/* Card: User Information */}
            <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg">
              <CardHeader icon="information" title="ข้อมูลเพิ่มเติม" />
              <InfoRow iconName="school" label="การศึกษา" value={userInfo?.education?.name || '-'} />
              <InfoRow iconName="resize" label="ส่วนสูง" value={userInfo?.user_height ? `${userInfo.user_height} cm` : '-'} />
              <InfoRow iconName="translate" label="ภาษา" value={userInfo?.language?.name || '-'} />
              <InfoRow iconName="water" label="กรุ๊ปเลือด" value={userInfo?.blood_group || '-'} />
              {/* Bio */}
              <View className="mt-3 pt-3 border-t border-gray-100">
                <Text className="text-sm font-semibold text-gray-600 mb-2">ประวัติส่วนตัว</Text>
                <View className="bg-gray-50 rounded-xl p-4 min-h-24">
                  <Text className="text-sm text-gray-700 leading-6">
                    {userInfo?.user_bio || '-'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Card: Life Style */}
            <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg mb-6">
              <CardHeader icon="heart-multiple" title="ไลฟ์สไตล์" />
              <InfoRow iconName="heart-search" label="Looking for" value={userLifeStyle?.looking_for?.name || '-'} />
              <InfoRow iconName="bottle-wine" label="การดื่มแอลกอฮอล์" value={userLifeStyle?.drinking?.name || '-'} />
              <InfoRow iconName="smoke" label="การสูบบุหรี่" value={userLifeStyle?.smoke?.name || '-'} />
              <InfoRow iconName="dumbbell" label="การออกกำลังกาย" value={userLifeStyle?.workout?.name || '-'} />
              <InfoRow iconName="paw" label="สัตว์เลี้ยง" value={userLifeStyle?.pet?.name || '-'} />
            </View>

          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default OtherProfileScreen;
