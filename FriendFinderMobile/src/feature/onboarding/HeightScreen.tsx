// ─── HeightScreen ─────────────────────────────────────────────────────────────

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import OnboardingLayout from '../../components/common/OnboardingLayout';
import Button from '../../components/common/Button';
import { colors } from '../../constants/theme';
import { useAppDispatch } from '../../redux/hooks';
import { setHeight } from '../../redux/userInformationSlice';

const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const HEIGHTS = Array.from({ length: 151 }, (_, i) => i + 100); // 100-250

const HeightScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const [selected, setSelected] = useState(170);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    const index = HEIGHTS.indexOf(selected);
    if (index !== -1) {
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
      }, 0);
    }
  }, []);

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.y / ITEM_HEIGHT);
    setSelected(HEIGHTS[Math.max(0, Math.min(index, HEIGHTS.length - 1))]);
  };

  return (
    <OnboardingLayout
      onBack={() => navigation.goBack()}
      title="ส่วนสูงของคุณ"
      subtitle="เลื่อนเพื่อเลือกส่วนสูง"
      footer={
        <Button
          label="ดำเนินการต่อ"
          onPress={() => {
            dispatch(setHeight(selected));
            navigation.navigate('Education');
          }}
        />
      }
    >
      <View className="items-center gap-4">
        <View
          className="border-2 rounded-2xl overflow-hidden"
          style={{ borderColor: colors.primary, height: ITEM_HEIGHT * VISIBLE_ITEMS, width: 160 }}
        >
          <ScrollView
            ref={scrollViewRef}
            scrollEventThrottle={16}
            onScroll={handleScroll}
            onMomentumScrollEnd={handleScroll}
            snapToInterval={ITEM_HEIGHT}
            decelerationRate={0.8}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
            nestedScrollEnabled={true}
          >
            {HEIGHTS.map(h => (
              <View key={h} style={{ height: ITEM_HEIGHT, justifyContent: 'center' }}>
                <Text
                  className={`text-center font-semibold ${
                    h === selected ? 'text-primary text-xl' : 'text-gray-400 text-base'
                  }`}
                >
                  {h}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>

        <Text className="text-xs text-gray-500 font-medium">เซนติเมตร</Text>

        <View className="bg-primary-light rounded-2xl px-4 py-3 items-center w-40">
          <Text className="text-sm text-gray-600">ส่วนสูง</Text>
          <Text className="text-2xl font-bold text-primary">{selected} ซม.</Text>
        </View>
      </View>
    </OnboardingLayout>
  );
};

export default HeightScreen;
