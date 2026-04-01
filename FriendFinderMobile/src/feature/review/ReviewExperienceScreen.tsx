// ─── ReviewExperienceScreen ────────────────────────────────────────────────────

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';

const ReviewExperienceScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [locationComment, setLocationComment] = useState('');
  const [personComment, setPersonComment] = useState('');
  const [locationLiked, setLocationLiked] = useState<boolean | null>(null);
  const [personLiked, setPersonLiked] = useState<boolean | null>(null);

  const canSubmit = locationComment.trim().length > 0 && personComment.trim().length > 0
    && locationLiked !== null && personLiked !== null;

  return (
    <SafeAreaView className="flex-1 bg-white">
      <AppHeader title="รีวิวประสบการณ์" showBack onBackPress={() => navigation.goBack()} />
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Location review */}
          <View className="gap-3">
            <Text className="text-base font-bold text-gray-900">รีวิวสถานที่</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${locationLiked === true ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
                onPress={() => setLocationLiked(true)}
              >
                <Text className="text-xl">👍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${locationLiked === false ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                onPress={() => setLocationLiked(false)}
              >
                <Text className="text-xl">👎</Text>
              </TouchableOpacity>
            </View>
            <View className="border border-gray-300 rounded-xl px-4 py-3 h-[90px]">
              <TextInput
                value={locationComment}
                onChangeText={setLocationComment}
                multiline
                placeholder="บอกเล่าประสบการณ์สถานที่..."
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900 p-0"
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* Person review */}
          <View className="gap-3">
            <Text className="text-base font-bold text-gray-900">รีวิวคนที่พบ</Text>
            <View className="flex-row gap-3">
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${personLiked === true ? 'border-primary bg-primary-light' : 'border-gray-200'}`}
                onPress={() => setPersonLiked(true)}
              >
                <Text className="text-xl">👍</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 h-12 rounded-xl border items-center justify-center ${personLiked === false ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                onPress={() => setPersonLiked(false)}
              >
                <Text className="text-xl">👎</Text>
              </TouchableOpacity>
            </View>
            <View className="border border-gray-300 rounded-xl px-4 py-3 h-[90px]">
              <TextInput
                value={personComment}
                onChangeText={setPersonComment}
                multiline
                placeholder="บอกเล่าประสบการณ์คนที่พบ..."
                placeholderTextColor="#9ca3af"
                className="text-base text-gray-900 p-0"
                textAlignVertical="top"
              />
            </View>
          </View>

          <Button
            label="ส่งรีวิว"
            onPress={() => navigation.navigate('History')}
            disabled={!canSubmit}
          />

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ReviewExperienceScreen;
