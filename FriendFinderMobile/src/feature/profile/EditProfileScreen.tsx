// ─── EditProfileScreen ─────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Modal, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Button from '../../components/common/Button';
import { getUserProfile, UserProfile, updateUserShowName, updateUserInterestedGender } from '../../service/user.service';
import { getUserInformation, UserInformation, updateUserBio, updateUserHeight, updateUserBloodGroup, updateUserLanguage, updateUserEducation } from '../../service/user_information.service';
import { getUserLifeStyle, UserLifeStyle, updateUserLookingFor, updateUserDrinking, updateUserSmoke, updateUserWorkout, updateUserPet } from '../../service/user_life_style.service';
import { getUserImages, UserImage, uploadUserImage, updateUserImage, deleteUserImage } from '../../service/user_image.service';
import { getEducation, Education } from '../../service/education.service';
import { getLanguage, Language } from '../../service/language.service';
import { getLookingFor, LookingFor } from '../../service/looking_for.service';
import { getDrinking, Drinking } from '../../service/drinking.service';
import { getSmoke, Smoke } from '../../service/smoke.service';
import { getWorkout, Workout } from '../../service/workout.service';
import { getPet, Pet } from '../../service/pet.service';
import { colors } from '../../constants/theme';

// ─── Types ────────────────────────────────────────────────────────────────────

interface EditableImage {
  id?: string;
  uri: string;
  isNew: boolean;
}

interface SelectOption {
  id: string;
  name: string;
  icon?: string;
}

interface ImageSlotProps {
  index: number;
  uri: string;
  onPress: (index: number) => void;
  onDelete: (index: number) => void;
}

// ─── Sub-components (outside main component to prevent re-creation) ───────────

const ImageSlot = React.memo(({ index, uri, onPress, onDelete }: ImageSlotProps) => (
  <View className="flex-1 mx-2 mb-4 relative" style={{ zIndex: 1 }}>
    <TouchableOpacity
      onPress={() => onPress(index)}
      activeOpacity={0.7}
      className="bg-white rounded-2xl shadow-lg aspect-square items-center justify-center border-2 border-dashed border-gray-300"
      style={{ overflow: 'visible' }}
    >
      {uri ? (
        <View className="w-full h-full rounded-2xl overflow-hidden">
          <Image source={{ uri }} className="w-full h-full" />
        </View>
      ) : (
        <View className="items-center">
          <MaterialCommunityIcons name="plus-circle" size={40} color={colors.primary} />
          <Text className="text-xs text-gray-500 mt-2">เพิ่มรูป</Text>
        </View>
      )}
    </TouchableOpacity>
    {uri && (
      <TouchableOpacity
        onPress={() => onDelete(index)}
        className="absolute bg-red-500 rounded-full w-8 h-8 items-center justify-center shadow-lg"
        style={{ top: -6, right: -6, zIndex: 50 }}
      >
        <MaterialCommunityIcons name="close" size={16} color="white" />
      </TouchableOpacity>
    )}
  </View>
));

const CardHeader = ({ icon, title }: { icon: string; title: string }) => (
  <View className="flex-row items-center gap-2 mb-4 pb-3 border-b border-gray-100">
    <MaterialCommunityIcons name={icon as any} size={20} color={colors.primary} />
    <Text className="text-lg font-bold text-gray-900">{title}</Text>
  </View>
);

const InputField = React.memo(({ label, value, onChangeText, placeholder, multiline = false, keyboardType = 'default', editable = true }: any) => (
  <View className="gap-2 mb-3">
    <Text className="text-sm font-semibold text-gray-700">{label}</Text>
    <View className={`border rounded-xl px-4 ${multiline ? 'py-3 min-h-24' : 'h-12'} justify-center ${editable ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-100'}`}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        keyboardType={keyboardType}
        editable={editable}
        className="text-base text-gray-900 p-0"
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  </View>
), (prevProps, nextProps) => {
  return prevProps.value === nextProps.value &&
         prevProps.label === nextProps.label &&
         prevProps.placeholder === nextProps.placeholder &&
         prevProps.multiline === nextProps.multiline;
});

const DisplayField = ({ label, value }: any) => (
  <View className="gap-2 mb-3">
    <Text className="text-sm font-semibold text-gray-700">{label}</Text>
    <View className="border border-gray-200 rounded-xl px-4 h-12 justify-center bg-gray-100">
      <Text className="text-base text-gray-700">{value || '-'}</Text>
    </View>
  </View>
);

const SelectField = ({ label, value, onPress }: { label: string; value: string; onPress: () => void }) => (
  <View className="gap-2 mb-3">
    <Text className="text-sm font-semibold text-gray-700">{label}</Text>
    <TouchableOpacity
      onPress={onPress}
      className="border border-gray-300 rounded-xl px-4 h-12 flex-row items-center justify-between bg-white"
      activeOpacity={0.7}
    >
      <Text className={`text-base ${value ? 'text-gray-900' : 'text-gray-400'}`}>{value || 'เลือก...'}</Text>
      <MaterialCommunityIcons name="chevron-down" size={20} color="#9ca3af" />
    </TouchableOpacity>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────

const BLOOD_GROUP_OPTIONS: SelectOption[] = [
  { id: 'A', name: 'A' },
  { id: 'B', name: 'B' },
  { id: 'AB', name: 'AB' },
  { id: 'O', name: 'O' },
];

const INTERESTED_GENDER_OPTIONS: SelectOption[] = [
  { id: 'male', name: 'ชาย' },
  { id: 'female', name: 'หญิง' },
  { id: 'lgbtq', name: 'LGBTQ+' },
];

const EditProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  // ─── Profile state ────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userInfo, setUserInfo] = useState<UserInformation | null>(null);
  const [userLifeStyle, setUserLifeStyle] = useState<UserLifeStyle | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ─── Editable text fields ─────────────────────────────────────────
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [height, setHeight] = useState('');

  // ─── Images ───────────────────────────────────────────────────────
  const [images, setImages] = useState<EditableImage[]>([
    { uri: '', isNew: false },
    { uri: '', isNew: false },
    { uri: '', isNew: false },
    { uri: '', isNew: false },
  ]);
  const [originalImages, setOriginalImages] = useState<EditableImage[]>([]);

  // ─── Dropdown selected IDs (local state, not Redux) ───────────────
  const [selectedEducationId, setSelectedEducationId] = useState<string | null>(null);
  const [selectedLanguageId, setSelectedLanguageId] = useState<string | null>(null);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState<string | null>(null);
  const [selectedLookingForId, setSelectedLookingForId] = useState<string | null>(null);
  const [selectedDrinkingId, setSelectedDrinkingId] = useState<string | null>(null);
  const [selectedSmokeId, setSelectedSmokeId] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<string | null>(null);
  const [selectedInterestedGender, setSelectedInterestedGender] = useState<string | null>(null);

  // ─── Dropdown options (fetched from API) ──────────────────────────
  const [educationOptions, setEducationOptions] = useState<Education[]>([]);
  const [languageOptions, setLanguageOptions] = useState<Language[]>([]);
  const [lookingForOptions, setLookingForOptions] = useState<LookingFor[]>([]);
  const [drinkingOptions, setDrinkingOptions] = useState<Drinking[]>([]);
  const [smokeOptions, setSmokeOptions] = useState<Smoke[]>([]);
  const [workoutOptions, setWorkoutOptions] = useState<Workout[]>([]);
  const [petOptions, setPetOptions] = useState<Pet[]>([]);

  // ─── Modal state ──────────────────────────────────────────────────
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalOptions, setModalOptions] = useState<SelectOption[]>([]);
  const [modalSelectedId, setModalSelectedId] = useState<string | null>(null);
  const modalCallbackRef = useRef<((id: string) => void) | null>(null);

  // ─── Fetch profile + dropdown data ────────────────────────────────
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const profile = await getUserProfile();
        setUserProfile(profile);
        setName(profile.user_show_name);

        const [info, lifeStyle, userImages, eduList, langList, lookingForList, drinkingList, smokeList, workoutList, petList] = await Promise.all([
          getUserInformation(profile.user_id).catch(() => null),
          getUserLifeStyle(profile.user_id).catch(() => null),
          getUserImages(profile.user_id).catch(() => []),
          getEducation().catch(() => []),
          getLanguage().catch(() => []),
          getLookingFor().catch(() => []),
          getDrinking().catch(() => []),
          getSmoke().catch(() => []),
          getWorkout().catch(() => []),
          getPet().catch(() => []),
        ]);

        // Set profile data
        setUserInfo(info);
        setUserLifeStyle(lifeStyle);
        setBio(info?.user_bio || '');
        setHeight(info?.user_height?.toString() || '');

        // Set current selected IDs from user data
        setSelectedEducationId(info?.education_id || null);
        setSelectedLanguageId(info?.language_id || null);
        setSelectedBloodGroup(info?.blood_group || null);
        setSelectedInterestedGender(profile.interested_gender || null);
        setSelectedLookingForId(lifeStyle?.looking_for_id || null);
        setSelectedDrinkingId(lifeStyle?.drinking_id || null);
        setSelectedSmokeId(lifeStyle?.smoke_id || null);
        setSelectedWorkoutId(lifeStyle?.workout_id || null);
        setSelectedPetId(lifeStyle?.pet_id || null);

        // Set dropdown options
        setEducationOptions(eduList);
        setLanguageOptions(langList);
        setLookingForOptions(lookingForList);
        setDrinkingOptions(drinkingList);
        setSmokeOptions(smokeList);
        setWorkoutOptions(workoutList);
        setPetOptions(petList);

        // Load existing images
        const newImages: EditableImage[] = [
          { uri: '', isNew: false },
          { uri: '', isNew: false },
          { uri: '', isNew: false },
          { uri: '', isNew: false },
        ];
        const origImages: EditableImage[] = [
          { uri: '', isNew: false },
          { uri: '', isNew: false },
          { uri: '', isNew: false },
          { uri: '', isNew: false },
        ];

        if (userImages && userImages.length > 0) {
          userImages.slice(0, 4).forEach((img: UserImage, index: number) => {
            const editableImg = { id: img.id, uri: img.imageUrl, isNew: false };
            newImages[index] = editableImg;
            origImages[index] = { ...editableImg };
          });
        }
        setImages(newImages);
        setOriginalImages(origImages);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────

  const handleNameChange = useCallback((text: string) => setName(text), []);
  const handleBioChange = useCallback((text: string) => setBio(text), []);
  const handleHeightChange = useCallback((text: string) => setHeight(text), []);

  const handlePickImage = useCallback(async (index: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setImages(prev => {
          const next = [...prev];
          next[index] = { id: prev[index].id, uri: result.assets[0].uri, isNew: true };
          return next;
        });
      }
    } catch (error) {
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถเลือกรูปได้');
    }
  }, []);

  const handleDeleteImage = useCallback((index: number) => {
    Alert.alert('ลบรูป', 'คุณต้องการลบรูปนี้ใช่หรือไม่?', [
      { text: 'ยกเลิก' },
      {
        text: 'ลบ',
        onPress: () => {
          setImages(prev => {
            const next = [...prev];
            next[index] = { uri: '', isNew: false };
            return next;
          });
        },
      },
    ]);
  }, []);

  // ─── Modal helpers ────────────────────────────────────────────────

  const openSelect = (title: string, options: SelectOption[], currentId: string | null, onSelect: (id: string) => void) => {
    setModalTitle(title);
    setModalOptions(options);
    setModalSelectedId(currentId);
    modalCallbackRef.current = onSelect;
    setModalVisible(true);
  };

  const handleModalSelect = (id: string) => {
    modalCallbackRef.current?.(id);
    setModalVisible(false);
  };

  // ─── Get display name from options ────────────────────────────────

  const getOptionName = (options: SelectOption[], id: string | null) => {
    if (!id) return '';
    return options.find(o => o.id === id)?.name || '';
  };

  // ─── Save ─────────────────────────────────────────────────────────

  const handleSave = async () => {
    if (!userProfile) return;
    setSaving(true);
    try {
      // Update name
      if (name !== userProfile.user_show_name) {
        await updateUserShowName(name);
      }
      // Update interested gender
      if (selectedInterestedGender && selectedInterestedGender !== userProfile.interested_gender) {
        await updateUserInterestedGender(selectedInterestedGender as any);
      }
      // Update bio
      if (bio !== (userInfo?.user_bio || '')) {
        await updateUserBio(bio);
      }
      // Update height
      if (height && parseInt(height) !== userInfo?.user_height) {
        await updateUserHeight(parseInt(height));
      }
      // Update education
      if (selectedEducationId && selectedEducationId !== userInfo?.education_id) {
        await updateUserEducation(selectedEducationId);
      }
      // Update language
      if (selectedLanguageId && selectedLanguageId !== userInfo?.language_id) {
        await updateUserLanguage(selectedLanguageId);
      }
      // Update blood group
      if (selectedBloodGroup && selectedBloodGroup !== userInfo?.blood_group) {
        await updateUserBloodGroup(selectedBloodGroup as any);
      }
      // Update lifestyle fields
      if (selectedLookingForId && selectedLookingForId !== userLifeStyle?.looking_for_id) {
        await updateUserLookingFor(selectedLookingForId);
      }
      if (selectedDrinkingId && selectedDrinkingId !== userLifeStyle?.drinking_id) {
        await updateUserDrinking(selectedDrinkingId);
      }
      if (selectedSmokeId && selectedSmokeId !== userLifeStyle?.smoke_id) {
        await updateUserSmoke(selectedSmokeId);
      }
      if (selectedWorkoutId && selectedWorkoutId !== userLifeStyle?.workout_id) {
        await updateUserWorkout(selectedWorkoutId);
      }
      if (selectedPetId && selectedPetId !== userLifeStyle?.pet_id) {
        await updateUserPet(selectedPetId);
      }

      // Handle deleted images
      for (let i = 0; i < originalImages.length; i++) {
        const original = originalImages[i];
        const current = images[i];
        if (original.id && original.uri && !current.uri) {
          try {
            await deleteUserImage(original.id);
          } catch (error) {
            console.error(`Error deleting image ${i}:`, error);
          }
        }
      }

      // Upload/update images
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (!img.uri || !img.isNew) continue;

        const imageFile = {
          uri: img.uri,
          name: `profile_${i}_${Date.now()}.jpg`,
          type: 'image/jpeg',
        };

        try {
          if (img.id) {
            await updateUserImage(img.id, imageFile);
          } else {
            await uploadUserImage(userProfile.user_id, imageFile);
          }
        } catch (error) {
          console.error(`Error uploading image ${i}:`, error);
          Alert.alert('ข้อผิดพลาด', `ไม่สามารถอัปโหลดรูปที่ ${i + 1} ได้`);
        }
      }

      navigation.goBack();
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('เกิดข้อผิดพลาด', 'ไม่สามารถบันทึกข้อมูลได้');
    } finally {
      setSaving(false);
    }
  };

  // ─── Loading ──────────────────────────────────────────────────────

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
        <View className="flex-row items-center justify-center px-4 py-4 bg-white border-b border-gray-200 relative">
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ position: 'absolute', left: 16, width: 24, height: 24 }}>
            <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">แก้ไขโปรไฟล์</Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Render ───────────────────────────────────────────────────────

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <View className="flex-row items-center justify-center px-4 py-4 bg-white border-b border-gray-200 relative">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ position: 'absolute', left: 16, width: 24, height: 24 }}
        >
          <MaterialCommunityIcons name="chevron-left" size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>แก้ไขโปรไฟล์</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ paddingBottom: 24 }}
        scrollEnabled={true}
        nestedScrollEnabled={true}
      >
        {/* Images Grid */}
        <View className="px-2 mt-4">
          <Text className="text-sm font-semibold text-gray-700 mx-2 mb-3">รูปภาพของคุณ (สูงสุด 4 รูป)</Text>
          <View className="flex-row flex-wrap">
            <ImageSlot index={0} uri={images[0].uri} onPress={handlePickImage} onDelete={handleDeleteImage} />
            <ImageSlot index={1} uri={images[1].uri} onPress={handlePickImage} onDelete={handleDeleteImage} />
          </View>
          <View className="flex-row flex-wrap">
            <ImageSlot index={2} uri={images[2].uri} onPress={handlePickImage} onDelete={handleDeleteImage} />
            <ImageSlot index={3} uri={images[3].uri} onPress={handlePickImage} onDelete={handleDeleteImage} />
          </View>
        </View>

        {/* Card 1: Personal Information */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg">
          <CardHeader icon="account" title="ข้อมูลส่วนตัว" />
          <InputField label="ชื่อ" value={name} onChangeText={handleNameChange} placeholder="ชื่อที่แสดง" />
          <DisplayField label="เพศ" value={userProfile?.sex} />
          <DisplayField label="อายุ" value={userProfile?.age ? `${userProfile.age} ปี` : '-'} />
          <SelectField
            label="สนใจเพศ"
            value={INTERESTED_GENDER_OPTIONS.find(o => o.id === selectedInterestedGender)?.name || ''}
            onPress={() => openSelect('สนใจเพศ', INTERESTED_GENDER_OPTIONS, selectedInterestedGender, setSelectedInterestedGender)}
          />
          <InputField label="ประวัติส่วนตัว" value={bio} onChangeText={handleBioChange} placeholder="อธิบายเกี่ยวกับตัวคุณ" multiline />
        </View>

        {/* Card 2: User Information */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg">
          <CardHeader icon="information" title="ข้อมูลเพิ่มเติม" />
          <SelectField
            label="การศึกษา"
            value={getOptionName(educationOptions, selectedEducationId)}
            onPress={() => openSelect('การศึกษา', educationOptions, selectedEducationId, setSelectedEducationId)}
          />
          <InputField label="ส่วนสูง (cm)" value={height} onChangeText={handleHeightChange} placeholder="เช่น 170" keyboardType="numeric" />
          <SelectField
            label="ภาษา"
            value={getOptionName(languageOptions, selectedLanguageId)}
            onPress={() => openSelect('ภาษา', languageOptions, selectedLanguageId, setSelectedLanguageId)}
          />
          <SelectField
            label="กรุ๊ปเลือด"
            value={selectedBloodGroup || ''}
            onPress={() => openSelect('กรุ๊ปเลือด', BLOOD_GROUP_OPTIONS, selectedBloodGroup, setSelectedBloodGroup)}
          />
        </View>

        {/* Card 3: Life Style */}
        <View className="mx-4 mt-4 bg-white rounded-2xl p-4 shadow-lg mb-4">
          <CardHeader icon="heart-multiple" title="ไลฟ์สไตล์" />
          <SelectField
            label="กำลังมองหา"
            value={getOptionName(lookingForOptions, selectedLookingForId)}
            onPress={() => openSelect('กำลังมองหา', lookingForOptions, selectedLookingForId, setSelectedLookingForId)}
          />
          <SelectField
            label="การดื่มแอลกอฮอล์"
            value={getOptionName(drinkingOptions, selectedDrinkingId)}
            onPress={() => openSelect('การดื่มแอลกอฮอล์', drinkingOptions, selectedDrinkingId, setSelectedDrinkingId)}
          />
          <SelectField
            label="การสูบบุหรี่"
            value={getOptionName(smokeOptions, selectedSmokeId)}
            onPress={() => openSelect('การสูบบุหรี่', smokeOptions, selectedSmokeId, setSelectedSmokeId)}
          />
          <SelectField
            label="การออกกำลังกาย"
            value={getOptionName(workoutOptions, selectedWorkoutId)}
            onPress={() => openSelect('การออกกำลังกาย', workoutOptions, selectedWorkoutId, setSelectedWorkoutId)}
          />
          <SelectField
            label="สัตว์เลี้ยง"
            value={getOptionName(petOptions, selectedPetId)}
            onPress={() => openSelect('สัตว์เลี้ยง', petOptions, selectedPetId, setSelectedPetId)}
          />
        </View>

        {/* Save Button */}
        <View className="mx-4 mt-4">
          <Button
            label={saving ? "กำลังบันทึก..." : "บันทึก"}
            onPress={handleSave}
            disabled={saving || name.trim().length < 2}
          />
        </View>
      </ScrollView>

      {/* ─── Dropdown Modal ──────────────────────────────────────────── */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <TouchableOpacity
          className="flex-1 bg-black/50 justify-end"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-t-3xl max-h-96">
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <Text className="text-lg font-bold text-gray-900">{modalTitle}</Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <MaterialCommunityIcons name="close" size={24} color="#9ca3af" />
                </TouchableOpacity>
              </View>
              <FlatList
                data={modalOptions}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className={`flex-row items-center gap-3 px-5 py-4 border-b border-gray-50 ${item.id === modalSelectedId ? 'bg-primary-light' : ''}`}
                    onPress={() => handleModalSelect(item.id)}
                    activeOpacity={0.7}
                  >
                    {item.icon && (
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color={item.id === modalSelectedId ? colors.primary : '#9ca3af'}
                      />
                    )}
                    <Text className={`text-base flex-1 ${item.id === modalSelectedId ? 'font-bold' : ''}`} style={{ color: item.id === modalSelectedId ? colors.primary : '#374151' }}>
                      {item.name}
                    </Text>
                    {item.id === modalSelectedId && (
                      <MaterialCommunityIcons name="check" size={20} color={colors.primary} />
                    )}
                  </TouchableOpacity>
                )}
                style={{ maxHeight: 300 }}
              />
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
