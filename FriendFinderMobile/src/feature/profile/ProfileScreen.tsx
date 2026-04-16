// ─── ProfileScreen ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import InfoRow from '../../components/profile/InfoRow';
import { getUserProfile, UserProfile, logout } from '../../service/user.service';
import { getUserInformation, UserInformation } from '../../service/user_information.service';
import { getUserLifeStyle, UserLifeStyle } from '../../service/user_life_style.service';
import { getUserImages, UserImage } from '../../service/user_image.service';
import { colors } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppDispatch } from '../../redux/hooks';
import { clearAuth } from '../../redux/authSlice';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth } = useResponsive();
  const dispatch = useAppDispatch();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [userLifeStyle, setUserLifeStyle] = useState<UserLifeStyle | null>(null);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchProfileData = async () => {
        setLoading(true);
        try {
          const profile = await getUserProfile();
          setUserProfile(profile);

          const [info, lifeStyle, images] = await Promise.all([
            getUserInformation(profile.user_id).catch((err) => {
              console.error('Error fetching user information:', err);
              return null;
            }),
            getUserLifeStyle(profile.user_id).catch((err) => {
              console.error('Error fetching user lifestyle:', err);
              return null;
            }),
            getUserImages(profile.user_id).catch((err) => {
              console.error('Error fetching user images:', err);
              return [];
            }),
          ]);
          setUserInfo(info);
          setUserLifeStyle(lifeStyle);
          setUserImages(images || []);
        } catch (error) {
          console.error('Error fetching profile data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProfileData();
    }, [])
  );

  const handleLogout = async () => {
    Alert.alert('ยืนยันการออกจากระบบ', 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ', [
      { text: 'ยกเลิก', onPress: () => {}, style: 'cancel' },
      {
        text: 'ออกจากระบบ',
        onPress: async () => {
          try {
            await logout();
            dispatch(clearAuth());
          } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('ข้อผิดพลาด', 'เกิดข้อผิดพลาดในการออกจากระบบ');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const CardHeader = ({ icon, title }: { icon: string; title: string }) => (
    <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
      <MaterialCommunityIcons name={icon as any} size={20} color={colors.primary} />
      <Text className="text-base font-bold text-gray-900 flex-1">{title}</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title="Profile"
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <MaterialCommunityIcons name="pencil" size={24} color={colors.primary} />
          </TouchableOpacity>
        }
      />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 24, alignItems: 'center' }} nestedScrollEnabled={true} scrollEnabled={true}>
        <View style={{ width: '100%', maxWidth: maxContentWidth }}>

          {/* Header with name only */}
          <View className="items-center py-3 bg-white">
            <Text className="text-2xl font-bold text-gray-900">{userProfile?.user_show_name || '-'}</Text>
          </View>

          {/* Gallery Grid */}
          <View className="px-2 mt-4">
            <Text className="text-sm font-semibold text-gray-700 mx-2 mb-3">รูปภาพของฉัน</Text>
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

          {/* Card 1: Personal Information */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg">
            <CardHeader icon="account" title="ข้อมูลส่วนตัว" />
            <InfoRow iconName="gender-male-female" label="เพศ" value={userProfile?.sex ? userProfile.sex.toUpperCase() : '-'} />
            <InfoRow iconName="numeric" label="อายุ" value={userProfile?.age ? `${userProfile.age} ปี` : '-'} />
            <InfoRow iconName="cake" label="วันเกิด" value={userProfile?.birth_of_date ? new Date(userProfile.birth_of_date).toLocaleDateString('th-TH') : '-'} />
            <InfoRow iconName="heart" label="สนใจ" value={userProfile?.interested_gender ? userProfile.interested_gender.toUpperCase() : '-'} />
            {/* Bio block */}
            <View className="mt-3 pt-3 border-t border-gray-100">
              <Text className="text-sm font-semibold text-gray-600 mb-2">ประวัติส่วนตัว</Text>
              <View className="bg-gray-50 rounded-xl p-4 min-h-32">
                <Text className="text-sm text-gray-700 leading-6">
                  {userInfo?.user_bio || 'อธิบายเกี่ยวกับตัวคุณ'}
                </Text>
              </View>
            </View>
          </View>

          {/* Card 2: User Information */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg">
            <CardHeader icon="information" title="ข้อมูลเพิ่มเติม" />
            <InfoRow iconName="school" label="การศึกษา" value={userInfo?.education?.name || '-'} />
            <InfoRow iconName="resize" label="ส่วนสูง" value={userInfo?.user_height ? `${userInfo.user_height} cm` : '-'} />
            <InfoRow iconName="translate" label="ภาษา" value={userInfo?.language?.name || '-'} />
            <InfoRow iconName="water" label="กรุ๊ปเลือด" value={userInfo?.blood_group || '-'} />
          </View>

          {/* Card 3: Life Style */}
          <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg mb-6">
            <CardHeader icon="heart-multiple" title="ไลฟ์สไตล์" />
            <InfoRow iconName="heart-search" label="Looking for" value={userLifeStyle?.looking_for?.name || '-'} />
            <InfoRow iconName="bottle-wine" label="การดื่มแอลกอฮอล์" value={userLifeStyle?.drinking?.name || '-'} />
            <InfoRow iconName="smoke" label="การสูบบุหรี่" value={userLifeStyle?.smoke?.name || '-'} />
            <InfoRow iconName="dumbbell" label="การออกกำลังกาย" value={userLifeStyle?.workout?.name || '-'} />
            <InfoRow iconName="paw" label="สัตว์เลี้ยง" value={userLifeStyle?.pet?.name || '-'} />
          </View>

          {/* Logout Button */}
          <View className="mx-4 mt-4 mb-6">
            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-50 border border-red-200 rounded-2xl p-4 flex-row items-center justify-center"
            >
              <MaterialCommunityIcons name="logout" size={20} color="#ef4444" />
              <Text className="text-red-600 font-semibold ml-2">ออกจากระบบ</Text>
            </TouchableOpacity>
          </View>

        </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ProfileScreen;
