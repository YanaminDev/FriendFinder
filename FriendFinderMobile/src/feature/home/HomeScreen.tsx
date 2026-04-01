// ─── HomeScreen ────────────────────────────────────────────────────────────────

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import AppHeader from '../../components/common/AppHeader';
import InterestTag from '../../components/common/InterestTag';
import VenueCard from '../../components/match/VenueCard';
import { MOCK_ACTIVITIES, MOCK_VENUES } from '../../constants/mockData';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
  <SafeAreaView className="flex-1 bg-gray-50">
    <AppHeader
      title="Home"
      rightElement={
        <TouchableOpacity onPress={() => navigation.navigate('Notification')}>
          <Text className="text-2xl">🔔</Text>
        </TouchableOpacity>
      }
    />
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>

      {/* Activities */}
      <View className="px-4 pt-4 pb-2">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-base font-bold text-gray-900">กิจกรรมยอดนิยม</Text>
          <TouchableOpacity onPress={() => navigation.navigate('SelectActivity')}>
            <Text className="text-sm text-primary font-medium">ดูทั้งหมด</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-1">
          <View className="flex-row gap-2 px-1">
            {MOCK_ACTIVITIES.filter(a => a.isPopular).map(act => (
              <TouchableOpacity
                key={act.id}
                className="items-center gap-1 bg-white rounded-xl px-3 py-3 border border-gray-100"
                onPress={() => navigation.navigate('Match')}
              >
                <Text className="text-2xl">{act.icon}</Text>
                <Text className="text-xs font-medium text-gray-700">{act.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Find Match CTA */}
      <TouchableOpacity
        className="mx-4 my-2 bg-primary rounded-2xl px-5 py-4 flex-row items-center justify-between"
        onPress={() => navigation.navigate('Match')}
        activeOpacity={0.85}
      >
        <View className="gap-1">
          <Text className="text-white font-bold text-lg">หาเพื่อนใหม่</Text>
          <Text className="text-white/80 text-sm">เจอคนที่ใช่ในแบบของคุณ 💗</Text>
        </View>
        <Text className="text-4xl">🔍</Text>
      </TouchableOpacity>

      {/* Recommended Venues */}
      <View className="px-4 pt-4">
        <Text className="text-base font-bold text-gray-900 mb-3">สถานที่แนะนำ</Text>
        <View className="gap-3">
          {MOCK_VENUES.map(venue => (
            <VenueCard
              key={venue.id}
              venue={venue}
              primaryLabel="ดูรายละเอียด"
              onPrimaryPress={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
              onReadReview={() => navigation.navigate('VenueDetail', { venueId: venue.id })}
            />
          ))}
        </View>
      </View>

    </ScrollView>
  </SafeAreaView>
);

export default HomeScreen;
