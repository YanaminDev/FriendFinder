// ─── MatchCancelledScreen ──────────────────────────────────────────────────────
// หน้ายกเลิกการนัด — ผู้ใช้เลือกเหตุผล (quick select) และ/หรือพิมพ์รายละเอียด
// จากนั้น submit → สร้าง Cancellation record + อัพเดท match.cancel_status = true

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { useResponsive } from '../../hooks/useResponsive';
import { colors } from '../../constants/theme';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { clearFindMatch } from '../../redux/findMatchSlice';
import { updateMatchCancelStatus } from '../../service/match.service';
import { createCancellation } from '../../service/cancellation.service';
import { getSelectCancelOptions, SelectCancel } from '../../service/select_cancel.service';

interface Props {
  navigation: any;
  route?: { params?: { matchId?: string; revieweeId?: string } };
}

const MatchCancelledScreen: React.FC<Props> = ({ navigation, route }) => {
  const dispatch = useAppDispatch();
  const matchId    = route?.params?.matchId   || '';
  const revieweeId = route?.params?.revieweeId || '';
  const userId     = useAppSelector((state) => state.user.user_id);
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  const [quickOptions, setQuickOptions] = useState<SelectCancel[]>([]);
  const [selectedQuickId, setSelectedQuickId] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  // ── Load quick-select options ──────────────────────────────────────────────
  useEffect(() => {
    getSelectCancelOptions()
      .then(setQuickOptions)
      .catch(() => setQuickOptions([]))
      .finally(() => setLoadingOptions(false));
  }, []);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!matchId || !revieweeId || !userId) {
      setAlert({ visible: true, type: 'warning', title: 'ข้อมูลไม่ครบ', message: 'ไม่พบข้อมูล match' });
      return;
    }
    if (!selectedQuickId && !content.trim()) {
      setAlert({ visible: true, type: 'warning', title: 'กรุณาระบุเหตุผล', message: 'เลือกเหตุผลด่วน หรือพิมพ์รายละเอียดก่อนยืนยัน' });
      return;
    }

    setSubmitting(true);
    try {
      await createCancellation({
        match_id:        matchId,
        reviewer_id:     userId,
        reviewee_id:     revieweeId,
        quick_select_id: selectedQuickId || undefined,
        content:         content.trim() || undefined,
      });
      await updateMatchCancelStatus(matchId, true);
      dispatch(clearFindMatch());
      setSubmitted(true);
    } catch (err: any) {
      setAlert({ visible: true, type: 'error', title: 'ผิดพลาด', message: err?.message || 'ยกเลิกไม่สำเร็จ' });
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submitted state ────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <SafeAreaView className="flex-1 bg-gradient-to-b from-red-50 to-white items-center justify-center">
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, alignItems: 'center' }}>

          {/* Icon */}
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <Ionicons name="close-circle" size={56} color="#DC2626" />
          </View>

          {/* Title */}
          <Text className="text-3xl font-bold text-gray-900 text-center mb-3">ยกเลิกการนัดแล้ว</Text>

          {/* Subtitle */}
          <Text className="text-base text-gray-500 text-center mb-12 leading-6">
            การนัดหมายถูกยกเลิกสำเร็จ{'\n'}สามารถค้นหาเพื่อนใหม่ได้เลยครับ
          </Text>

          {/* Info cards */}
          <View style={{ width: '100%', gap: 10, marginBottom: 16 }}>
            <View style={{ backgroundColor: 'white', borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: '#FCD34D' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="information-circle" size={20} color="#D97706" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#D97706', fontWeight: '600' }}>สถานะ</Text>
                  <Text style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>บันทึกเหตุผลการยกเลิกเรียบร้อย</Text>
                </View>
              </View>
            </View>

            <View style={{ backgroundColor: 'white', borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: '#A78BFA' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Ionicons name="heart-dislike" size={20} color="#7C3AED" />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#7C3AED', fontWeight: '600' }}>ผลกระทบ</Text>
                  <Text style={{ fontSize: 13, color: '#374151', marginTop: 2 }}>ไม่ส่งผลต่อ rating ของคุณ</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Button */}
          <View className="w-full">
            <Button
              label="กลับไปหาเพื่อนใหม่"
              onPress={() => navigation.navigate('Home')}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView className="flex-1 bg-white">
        <AppHeader title="ยกเลิกการนัด" showBack onBackPress={() => navigation.goBack()} />

        <ScrollView
          contentContainerStyle={{ paddingVertical: 20, paddingBottom: 140, alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 18 }}>

            {/* Info banner */}
            <View style={{
              backgroundColor: 'linear-gradient(135deg, #FEE2E2 0%, #FEF2F2 100%)',
              borderRadius: 14,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'flex-start',
              gap: 12,
              borderWidth: 1,
              borderColor: '#FECACA',
            }}>
              <Ionicons name="alert-circle" size={24} color="#DC2626" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#DC2626', marginBottom: 4 }}>ข้อมูลสำคัญ</Text>
                <Text style={{ fontSize: 12, color: '#7F1D1D', lineHeight: 18 }}>
                  โปรดระบุเหตุผลการยกเลิก การกดยกเลิกการจับคู่ อีกฝ่ายจะไม่ได้รับการแจ้งเตือน
                </Text>
              </View>
            </View>

            {/* Quick select section */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <Ionicons name="pricetag" size={18} color="#FF8383" />
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
                  Quick Select
                </Text>
              </View>
              {loadingOptions ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : quickOptions.length === 0 ? (
                <Text className="text-xs text-gray-400">ไม่มีตัวเลือก</Text>
              ) : (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {quickOptions.map((opt) => {
                    const selected = selectedQuickId === opt.id;
                    return (
                      <TouchableOpacity
                        key={opt.id}
                        onPress={() => setSelectedQuickId(selected ? null : opt.id)}
                        activeOpacity={0.7}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 10,
                          borderRadius: 10,
                          borderWidth: 1.5,
                          borderColor: selected ? '#DC2626' : '#E5E7EB',
                          backgroundColor: selected ? '#FEF2F2' : '#FAFAFA',
                        }}
                      >
                        <Text style={{
                          fontSize: 13,
                          fontWeight: selected ? '600' : '500',
                          color: selected ? '#DC2626' : '#374151'
                        }}>
                          {opt.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Custom text section */}
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Ionicons name="create" size={18} color="#FF8383" />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
                    รายละเอียดเพิ่มเติม
                  </Text>
                </View>
                <Text style={{ fontSize: 11, color: '#9CA3AF' }}>ไม่บังคับ</Text>
              </View>
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder="พิมพ์ความคิดเห็นของคุณที่นี่..."
                multiline
                numberOfLines={4}
                style={{
                  backgroundColor: '#FAFAFA',
                  borderRadius: 12,
                  borderWidth: 1.5,
                  borderColor: '#E5E7EB',
                  padding: 14,
                  fontSize: 13,
                  color: '#111827',
                  textAlignVertical: 'top',
                  minHeight: 110,
                  fontFamily: 'System',
                }}
                placeholderTextColor="#9CA3AF"
              />
              <Text style={{ fontSize: 11, color: '#9CA3AF', marginTop: 6 }}>
                {content.length}/500
              </Text>
            </View>

            {/* Helper text */}
            <View style={{ backgroundColor: '#F0FDF4', borderRadius: 10, padding: 12, borderLeftWidth: 3, borderLeftColor: '#22C55E' }}>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color="#22C55E" />
                <Text style={{ fontSize: 12, color: '#15803D', flex: 1 }}>
                  ข้อมูลของคุณจะถูกเก็บเป็นส่วนตัว และใช้เพื่อปรับปรุงการให้บริการเท่านั้น
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom buttons */}
        <View className="bg-white border-t border-gray-100 pt-3" style={{ alignItems: 'center' }}>
          <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, paddingBottom: bottomPadding, gap: 10 }}>
            <Button
              label={submitting ? 'กำลังยืนยัน...' : 'ยืนยันการยกเลิก'}
              onPress={handleSubmit}
              disabled={submitting}
            />
            <Button
              label="ย้อนกลับ"
              variant="outline"
              color="gray"
              onPress={() => navigation.goBack()}
            />
          </View>
        </View>

        <AlertModal
          visible={alert.visible}
          type={alert.type}
          title={alert.title}
          message={alert.message}
          buttonLabel="ตกลง"
          onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default MatchCancelledScreen;
