// ─── ProfileScreen ─────────────────────────────────────────────────────────────

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Image, TextInput, Modal, KeyboardAvoidingView, Platform, PanResponder, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import AlertModal from '../../components/common/AlertModal';
import InfoRow from '../../components/profile/InfoRow';
import { getUserProfile, UserProfile, logout, changePassword } from '../../service/user.service';
import { getUserInformation, UserInformation } from '../../service/user_information.service';
import { getUserLifeStyle, UserLifeStyle } from '../../service/user_life_style.service';
import { getUserImages, UserImage } from '../../service/user_image.service';
import { colors } from '../../constants/theme';
import { useResponsive } from '../../hooks/useResponsive';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearAuth, setCredentials, setIsAuthenticated } from '../../redux/authSlice';
import { login } from '../../service/user.service';

const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { maxContentWidth, horizontalPadding } = useResponsive();
  const dispatch = useAppDispatch();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [userLifeStyle, setUserLifeStyle] = useState<UserLifeStyle | null>(null);
  const [userImages, setUserImages] = useState<UserImage[]>([]);
  const [loading, setLoading] = useState(true);

  // Change password modal state
  const [changePasswordModalVisible, setChangePasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  // Alert state
  const [alert, setAlert] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string }>({ visible: false, type: 'info', title: '', message: '' });

  // Logout confirmation state
  const [logoutConfirmation, setLogoutConfirmation] = useState(false);

  // Swipe gesture state
  const [translateY] = useState(new Animated.Value(0));
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 10,
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dy > 0) {
        translateY.setValue(gestureState.dy);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dy > 100) {
        // Swipe down far → close immediately
        Animated.timing(translateY, {
          toValue: 500,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setChangePasswordModalVisible(false);
          translateY.setValue(0);
        });
      } else {
        // Swipe not far enough → spring back
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

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
    setLogoutConfirmation(true);
  };

  const handleConfirmLogout = async () => {
    setLogoutConfirmation(false);
    try {
      await logout();
      dispatch(clearAuth());
    } catch (error) {
      console.error('Logout error:', error);
      setAlert({
        visible: true,
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: 'เกิดข้อผิดพลาดในการออกจากระบบ',
      });
    }
  };

  const validatePasswordRequirements = (password: string): string | null => {
    if (password.length < 8) {
      return 'ต้องมีอย่างน้อย 8 ตัวอักษร';
    }
    if (!/[A-Z]/.test(password)) {
      return 'ต้องมีตัวพิมพ์ใหญ่';
    }
    if (!/[a-z]/.test(password)) {
      return 'ต้องมีตัวพิมพ์เล็ก';
    }
    if (!/\d/.test(password)) {
      return 'ต้องมีตัวเลข';
    }
    if (!/[@$!%*?&]/.test(password)) {
      return 'ต้องมีอักษรพิเศษ (@$!%*?&)';
    }
    return null;
  };

  const handleChangePassword = async () => {
    // Validation
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: 'กรุณากรอกข้อมูลให้ครบ',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: 'รหัสผ่านใหม่ไม่ตรงกัน',
      });
      return;
    }

    if (newPassword === oldPassword) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: 'รหัสผ่านใหม่ต้องแตกต่างจากรหัสผ่านเดิม',
      });
      return;
    }

    const passwordError = validatePasswordRequirements(newPassword);
    if (passwordError) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'รหัสผ่านไม่ตรงตามเงื่อนไข',
        message: passwordError,
      });
      return;
    }

    setChangingPassword(true);
    try {
      // Step 1: Change password on backend
      await changePassword(oldPassword, newPassword);

      // Step 2: Silent re-login with new password
      if (!userProfile?.username) {
        throw new Error('ไม่พบชื่อผู้ใช้');
      }
      const loginResponse = await login({ username: userProfile.username, password: newPassword });

      // Step 3: Update Redux with new credentials
      dispatch(setCredentials({ username: userProfile.username, password: newPassword, accessToken: loginResponse.accessToken }));
      dispatch(setIsAuthenticated(true));

      // Step 4: Close modal and show success with AlertModal
      setChangePasswordModalVisible(false);
      setAlert({
        visible: true,
        type: 'success',
        title: 'สำเร็จ',
        message: 'เปลี่ยนรหัสผ่านสำเร็จแล้ว',
      });

      // Clear form
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ข้อผิดพลาด',
        message: error?.message || 'เปลี่ยนรหัสผ่านไม่สำเร็จ',
      });
    } finally {
      setChangingPassword(false);
    }
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

          {/* Change Password Button */}
          <View className="mx-4 mt-4">
            <TouchableOpacity
              onPress={() => setChangePasswordModalVisible(true)}
              className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex-row items-center justify-center"
            >
              <MaterialCommunityIcons name="lock-reset" size={20} color="#3b82f6" />
              <Text className="text-blue-600 font-semibold ml-2">เปลี่ยนรหัสผ่าน</Text>
            </TouchableOpacity>
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

      {/* Alert Modal */}
      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonLabel="ตกลง"
        onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
      />

      {/* Logout Confirmation Modal */}
      <AlertModal
        visible={logoutConfirmation}
        type="warning"
        title="ยืนยันการออกจากระบบ"
        message="คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ"
        buttonLabel="ออกจากระบบ"
        onPress={handleConfirmLogout}
        secondaryButtonLabel="ยกเลิก"
        onSecondaryPress={() => setLogoutConfirmation(false)}
      />

      {/* Change Password Modal */}
      <Modal
        visible={changePasswordModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setChangePasswordModalVisible(false)}
      >
        <SafeAreaView className="flex-1 bg-black/50">
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1 justify-end"
          >
            <ScrollView
              scrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            >
              <Animated.View
                className="bg-white rounded-t-3xl p-6 pb-8"
                style={{ transform: [{ translateY }] }}
                {...panResponder.panHandlers}
              >
              {/* Drag Handle */}
              <View className="items-center py-2 mb-2">
                <View className="w-10 h-1 bg-gray-300 rounded-full" />
              </View>

              {/* Header */}
              <View className="flex-row items-center justify-between mb-6">
                <Text className="text-xl font-bold text-gray-900">เปลี่ยนรหัสผ่าน</Text>
                <TouchableOpacity onPress={() => setChangePasswordModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Old Password */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">รหัสผ่านเดิม</Text>
                <View className="border border-gray-300 rounded-xl px-4 h-12 justify-center flex-row items-center">
                  <TextInput
                    value={oldPassword}
                    onChangeText={setOldPassword}
                    placeholder="กรอกรหัสผ่านเดิม"
                    placeholderTextColor="#d1d5db"
                    secureTextEntry={!showOldPassword}
                    className="flex-1 text-base text-gray-900 p-0"
                  />
                  <TouchableOpacity onPress={() => setShowOldPassword(!showOldPassword)}>
                    <MaterialCommunityIcons name={showOldPassword ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* New Password */}
              <View className="mb-4">
                <Text className="text-sm font-semibold text-gray-700 mb-2">รหัสผ่านใหม่</Text>
                <View className="border border-gray-300 rounded-xl px-4 h-12 justify-center flex-row items-center">
                  <TextInput
                    value={newPassword}
                    onChangeText={setNewPassword}
                    placeholder="กรอกรหัสผ่านใหม่"
                    placeholderTextColor="#d1d5db"
                    secureTextEntry={!showNewPassword}
                    className="flex-1 text-base text-gray-900 p-0"
                  />
                  <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                    <MaterialCommunityIcons name={showNewPassword ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
                {/* Password Requirements */}
                <View className="mt-3 bg-gray-50 rounded-lg p-3">
                  <Text className="text-xs font-semibold text-gray-700 mb-2">ต้องมี:</Text>
                  <View className="gap-1">
                    <Text className={`text-xs ${newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                      ✓ อย่างน้อย 8 ตัวอักษร
                    </Text>
                    <Text className={`text-xs ${/[A-Z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      ✓ ตัวพิมพ์ใหญ่ (A-Z)
                    </Text>
                    <Text className={`text-xs ${/[a-z]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      ✓ ตัวพิมพ์เล็ก (a-z)
                    </Text>
                    <Text className={`text-xs ${/\d/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      ✓ ตัวเลข (0-9)
                    </Text>
                    <Text className={`text-xs ${/[@$!%*?&]/.test(newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                      ✓ อักษรพิเศษ (@$!%*?&)
                    </Text>
                  </View>
                </View>
              </View>

              {/* Confirm Password */}
              <View className="mb-6">
                <Text className="text-sm font-semibold text-gray-700 mb-2">ยืนยันรหัสผ่านใหม่</Text>
                <View className="border border-gray-300 rounded-xl px-4 h-12 justify-center flex-row items-center">
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="ยืนยันรหัสผ่านใหม่"
                    placeholderTextColor="#d1d5db"
                    secureTextEntry={!showConfirmPassword}
                    className="flex-1 text-base text-gray-900 p-0"
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <MaterialCommunityIcons name={showConfirmPassword ? 'eye' : 'eye-off'} size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Buttons */}
              <View className="gap-3">
                <TouchableOpacity
                  onPress={handleChangePassword}
                  disabled={changingPassword}
                  className={`rounded-xl p-4 items-center ${changingPassword ? 'bg-gray-300' : 'bg-blue-600'}`}
                >
                  <Text className="text-white font-semibold text-base">
                    {changingPassword ? 'กำลังเปลี่ยน...' : 'เปลี่ยนรหัสผ่าน'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setChangePasswordModalVisible(false)}
                  className="rounded-xl p-4 items-center bg-gray-100"
                >
                  <Text className="text-gray-800 font-semibold text-base">ยกเลิก</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
