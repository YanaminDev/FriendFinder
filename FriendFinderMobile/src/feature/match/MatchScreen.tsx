// ─── MatchScreen ───────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import InterestTag from '../../components/common/InterestTag';
import Button from '../../components/common/Button';
import { MOCK_MATCH_PROFILES } from '../../constants/mockData';

const MatchScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const profile = MOCK_MATCH_PROFILES[0];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader
        title="Match"
        rightElement={
          <TouchableOpacity onPress={() => navigation.navigate('SelectActivity')}>
            <Text className="text-2xl">🎯</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>

        {/* Profile card */}
        <View className="mx-4 mt-4 bg-white rounded-2xl overflow-hidden border border-gray-100">
          <Image
            source={{ uri: profile.photos[0] }}
            className="w-full h-80 bg-gray-200"
            resizeMode="cover"
          />
          <View className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <Text className="text-white font-bold text-2xl">{profile.name}, {profile.age}</Text>
            <View className="flex-row flex-wrap gap-1.5 mt-1">
              {profile.interests.map(i => (
                <InterestTag key={i} label={i} variant="dark" />
              ))}
            </View>
          </View>
        </View>

        {/* Info */}
        <View className="mx-4 mt-3 bg-white rounded-xl p-4 gap-2 border border-gray-100">
          <Text className="text-sm text-gray-500 leading-5">{profile.bio || 'ยังไม่มีคำอธิบาย'}</Text>
          <View className="flex-row flex-wrap gap-2 mt-1">
            <View className="flex-row items-center gap-1"><Text className="text-sm">📏</Text><Text className="text-sm text-gray-600">{profile.height} cm</Text></View>
            <View className="flex-row items-center gap-1"><Text className="text-sm">🎓</Text><Text className="text-sm text-gray-600">{profile.education}</Text></View>
            <View className="flex-row items-center gap-1"><Text className="text-sm">🩸</Text><Text className="text-sm text-gray-600">{profile.bloodGroup}</Text></View>
          </View>
        </View>

        {/* Actions */}
        <View className="mx-4 mt-4 gap-3">
          <Button
            label="💗  Let's Hang Out"
            onPress={() => navigation.navigate('MatchUp', { userId: profile.id })}
          />
          <Button variant="outline" color="gray"
            label="ข้าม"
            onPress={() => {}}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

export default MatchScreen;
