// ─── MatchUpScreen ─────────────────────────────────────────────────────────────
// หน้าเลือกสถานที่นัดพบ หลังจาก match สำเร็จ
// - แสดงข้อมูลทั้งสองคน + activity ที่ match กัน
// - ดึง locations ในพื้นที่ (position_id) → แนะนำร้านที่ activity ตรงกัน
// - ทั้งสองฝั่งเสนอสถานที่ได้ + poll รับ proposal → popup modal
// - ถ้าตอบรับ → update Match.location_id → navigate Home
// - ปุ่ม Cancel → navigate MatchCancelled (พร้อม matchId + otherUserId)
// ──────────────────────────────────────────────────────────────────────────────

import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import AppHeader from '../../components/common/AppHeader';
import Button from '../../components/common/Button';
import AlertModal from '../../components/common/AlertModal';
import { useResponsive } from '../../hooks/useResponsive';
import { colors } from '../../constants/theme';
import { useAppSelector } from '../../redux/hooks';
import { getMatchById, Match, updateMatchCancelStatus } from '../../service/match.service';
import { getLocationsByPosition, Location } from '../../service/location.service';
import { getPublicUserImages } from '../../service/user_image.service';
import { getLocationImages, LocationImage } from '../../service/location_image.service';
import {
  createLocationProposal,
  getLocationProposalByMatch,
  respondLocationProposal,
  LocationProposal,
} from '../../service/location_proposal.service';

interface Props {
  navigation: any;
  route: { params: { matchId: string } };
}

// ─── Avatar with image or fallback initials ───────────────────────────────────
interface UserAvatarProps {
  name: string;
  imageUrl?: string;
  isSelf?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, imageUrl, isSelf }) => (
  <View style={{ alignItems: 'center', gap: 6 }}>
    <View style={{
      width: 56, height: 56, borderRadius: 28,
      backgroundColor: isSelf ? colors.primary : '#6366F1',
      alignItems: 'center', justifyContent: 'center',
      borderWidth: 2, borderColor: 'white',
      overflow: 'hidden',
    }}>
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
          {name?.charAt(0)?.toUpperCase() || '?'}
        </Text>
      )}
    </View>
    <Text style={{ fontSize: 12, color: '#374151', fontWeight: '600', maxWidth: 80, textAlign: 'center' }} numberOfLines={1}>
      {isSelf ? `${name} (คุณ)` : name}
    </Text>
  </View>
);

const MatchUpScreen: React.FC<Props> = ({ navigation, route }) => {
  const { matchId } = route.params;
  const userId = useAppSelector((state) => state.user.user_id);
  const { maxContentWidth, horizontalPadding, bottomPadding } = useResponsive();

  const [match, setMatch] = useState<Match | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationImages, setLocationImages] = useState<Record<string, LocationImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const [selfImage, setSelfImage] = useState<string | undefined>();
  const [otherImage, setOtherImage] = useState<string | undefined>();
  const [proposing, setProposing] = useState(false);
  const [waitingResponse, setWaitingResponse] = useState(false);

  const [incomingProposal, setIncomingProposal] = useState<LocationProposal | null>(null);
  const [respondLoading, setRespondLoading] = useState(false);
  const seenProposalIds = useRef<Set<string>>(new Set());
  const cancelledAlertShown = useRef(false);

  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  // ─── Load match + locations + reset cancellation flag ───────────────────
  useEffect(() => {
    cancelledAlertShown.current = false; // Reset flag for new match
    const load = async () => {
      if (!matchId) { setLoading(false); return; }
      try {
        const m = await getMatchById(matchId);
        setMatch(m);
        if (m?.location_id) {
          navigation.navigate('Home');
          return;
        }
        if (m?.position_id) {
          const locs = await getLocationsByPosition(m.position_id);
          setLocations(locs);

          // ดึงรูปของแต่ละ location
          const imagesMap: Record<string, LocationImage[]> = {};
          for (const loc of locs) {
            try {
              const imgs = await getLocationImages(loc.id);
              imagesMap[loc.id] = imgs;
            } catch (err) {
              console.error(`Error fetching images for location ${loc.id}:`, err);
              imagesMap[loc.id] = [];
            }
          }
          setLocationImages(imagesMap);
        }

        // ดึงรูปของทั้งสองคน
        if (m?.user1_id && m?.user2_id) {
          try {
            const [img1, img2] = await Promise.all([
              getPublicUserImages(m.user1_id).catch(() => []),
              getPublicUserImages(m.user2_id).catch(() => []),
            ]);
            if (userId === m.user1_id) {
              setSelfImage(img1?.[0]?.imageUrl);
              setOtherImage(img2?.[0]?.imageUrl);
            } else {
              setSelfImage(img2?.[0]?.imageUrl);
              setOtherImage(img1?.[0]?.imageUrl);
            }
          } catch {}
        }
      } catch (err) {
        console.error('Load match/locations failed:', err);
        setAlert({ visible: true, type: 'error', title: 'ผิดพลาด', message: 'โหลดข้อมูลไม่สำเร็จ' });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [matchId]);

  // ─── Poll for incoming proposals / accepted state ─────────────────────────
  const pollProposal = useCallback(async () => {
    if (!matchId) return;
    try {
      const p = await getLocationProposalByMatch(matchId);
      if (!p) return;

      if (p.proposer_id === userId) {
        // เราเป็นคนเสนอ — เช็คว่าถูกยอมรับหรือยัง
        try {
          const refreshed = await getMatchById(matchId);
          if (refreshed?.location_id) {
            navigation.navigate('Home');
            return;
          }
        } catch {}
        return;
      }

      // proposal จากอีกฝั่ง + ยังไม่เคยเห็น
      if (p.status === 'pending' && !seenProposalIds.current.has(p.id)) {
        seenProposalIds.current.add(p.id);
        setIncomingProposal(p);
      }
    } catch {}
  }, [matchId, userId, navigation]);

  useEffect(() => {
    if (!matchId) return;
    pollProposal();
    const interval = setInterval(pollProposal, 3000);
    return () => clearInterval(interval);
  }, [matchId, pollProposal]);

  // ─── Poll for match cancellation ──────────────────────────────────────────
  useEffect(() => {
    if (!matchId) return;

    const pollCancellation = async () => {
      try {
        const m = await getMatchById(matchId);
        if (m?.cancel_status && !cancelledAlertShown.current) {
          cancelledAlertShown.current = true;
          setAlert({
            visible: true,
            type: 'warning',
            title: 'การนัดหมายถูกยกเลิก',
            message: 'การ match นี้ถูกยกเลิกเเล้ว',
          });
          setTimeout(() => {
            navigation.navigate('Home');
          }, 1500);
        }
      } catch (err) {
        console.error('Error checking match cancellation:', err);
      }
    };

    pollCancellation();
    const interval = setInterval(pollCancellation, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [matchId, navigation]);

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const matchActivityId = match?.activity_id;
  const selfUser  = match && userId === match.user1_id ? match.user1 : match?.user2;
  const otherUser = match && userId === match.user1_id ? match.user2 : match?.user1;
  const otherUserId = match && userId === match.user1_id ? match.user2_id : match?.user1_id;

  const recommendedLocations = locations.filter((l) => l.activity_id === matchActivityId);
  const otherLocations       = locations.filter((l) => l.activity_id !== matchActivityId);

  // ─── Actions ──────────────────────────────────────────────────────────────
  const handlePropose = async () => {
    if (!selectedLocationId || !matchId) return;
    setProposing(true);
    try {
      await createLocationProposal({ match_id: matchId, location_id: selectedLocationId });
      setWaitingResponse(true);
      setAlert({ visible: true, type: 'info', title: 'ส่งคำเสนอแล้ว', message: 'รอให้อีกฝั่งตอบรับ...' });
    } catch (err: any) {
      setAlert({ visible: true, type: 'error', title: 'ผิดพลาด', message: err?.message || 'ส่งคำเสนอไม่สำเร็จ' });
    } finally {
      setProposing(false);
    }
  };

  const handleAcceptProposal = async () => {
    if (!incomingProposal) return;
    setRespondLoading(true);
    try {
      await respondLocationProposal(incomingProposal.id, 'accepted');
      setIncomingProposal(null);
      navigation.navigate('Home');
    } catch (err: any) {
      setAlert({ visible: true, type: 'error', title: 'ผิดพลาด', message: err?.message || 'ตอบรับไม่สำเร็จ' });
    } finally {
      setRespondLoading(false);
    }
  };

  const handleRejectProposal = async () => {
    if (!incomingProposal) return;
    setRespondLoading(true);
    try {
      await respondLocationProposal(incomingProposal.id, 'rejected');
      setIncomingProposal(null);
      setWaitingResponse(false);
    } catch (err: any) {
      setAlert({ visible: true, type: 'error', title: 'ผิดพลาด', message: err?.message || 'ปฏิเสธไม่สำเร็จ' });
    } finally {
      setRespondLoading(false);
    }
  };

  const handleCancel = () => {
    navigation.navigate('MatchCancelled', {
      matchId,
      revieweeId: otherUserId || '',
    });
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text className="text-gray-500 mt-3">กำลังโหลด...</Text>
      </SafeAreaView>
    );
  }

  if (!match) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-8">
        <Ionicons name="alert-circle-outline" size={64} color={colors.gray300} />
        <Text className="text-lg font-bold text-gray-700 mt-4">ไม่พบ match</Text>
        <View className="w-full mt-6">
          <Button label="กลับหน้าหลัก" onPress={() => navigation.navigate('Home')} />
        </View>
      </SafeAreaView>
    );
  }

  const renderLocationCard = (loc: Location, recommended = false) => {
    const isSelected = selectedLocationId === loc.id;
    return (
      <TouchableOpacity
        key={loc.id}
        activeOpacity={0.85}
        style={{
          backgroundColor: 'white',
          borderRadius: 14,
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: isSelected ? colors.primary : '#f3f4f6',
        }}
      >
        {/* Location Image */}
        {locationImages[loc.id]?.[0]?.imageUrl ? (
          <Image
            source={{ uri: locationImages[loc.id][0].imageUrl }}
            style={{ width: '100%', height: 140 }}
          />
        ) : (
          <View style={{ width: '100%', height: 140, backgroundColor: '#f3f4f6', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="image-outline" size={40} color={colors.gray300} />
          </View>
        )}

        {/* Content */}
        <View style={{ padding: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text className="text-base font-bold text-gray-900">{loc.name}</Text>
              {loc.description ? (
                <Text className="text-xs text-gray-500" numberOfLines={2}>{loc.description}</Text>
              ) : null}
              {loc.activity?.name ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 }}>
                  <Ionicons name="pricetag-outline" size={12} color={colors.gray400} />
                  <Text className="text-xs text-gray-400">{loc.activity.name}</Text>
                </View>
              ) : null}
            </View>
            {isSelected && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
          </View>

          {/* Action Buttons */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => setSelectedLocationId(isSelected ? null : loc.id)}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 10,
                backgroundColor: isSelected ? colors.primary : '#f3f4f6',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: isSelected ? 'white' : colors.primary }}>
                {isSelected ? 'เลือก' : 'เลือก'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('VenueDetail', { venueId: loc.id })}
              style={{
                flex: 1,
                paddingVertical: 8,
                paddingHorizontal: 10,
                backgroundColor: '#f3f4f6',
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280' }}>ดูรายละเอียด</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <AppHeader title="เลือกสถานที่นัด" showBack onBackPress={() => navigation.navigate('Home')} />

      <ScrollView
        contentContainerStyle={{ paddingVertical: 16, paddingBottom: 140, alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, rowGap: 12 }}>

          {/* ─── Both users card ─── */}
          <View style={{ backgroundColor: 'white', borderRadius: 16, padding: 16 }}>
            {/* Users side by side */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 14 }}>
              <UserAvatar name={selfUser?.user_show_name || 'คุณ'} imageUrl={selfImage} isSelf />
              <View style={{ alignItems: 'center', gap: 4 }}>
                <Ionicons name="heart" size={22} color={colors.primary} />
                <Text style={{ fontSize: 10, color: colors.gray400 }}>match</Text>
              </View>
              <UserAvatar name={otherUser?.user_show_name || 'เพื่อน'} imageUrl={otherImage} />
            </View>

            {/* Activity badge */}
            {match.activity?.name && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                <Text className="text-xs text-gray-500">กิจกรรมที่ตรงกัน:</Text>
                <View style={{ backgroundColor: colors.primary, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 3 }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>{match.activity.name}</Text>
                </View>
              </View>
            )}

            {/* Position */}
            {match.position?.name && (
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: 8 }}>
                <Ionicons name="location-outline" size={13} color={colors.gray400} />
                <Text className="text-xs text-gray-400">{match.position.name}</Text>
              </View>
            )}
          </View>

          {/* Waiting banner */}
          {waitingResponse && (
            <View style={{ backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <ActivityIndicator size="small" color="#D97706" />
              <Text style={{ color: '#92400E', fontSize: 13, flex: 1 }}>รอให้อีกฝั่งตอบรับคำเสนอ...</Text>
            </View>
          )}

          {/* Recommended locations only */}
          {recommendedLocations.length > 0 && (
            <>
              <Text className="text-sm font-bold text-gray-900 mt-2">
                สถานที่สำหรับ {match.activity?.name || 'กิจกรรม'}
              </Text>
              {recommendedLocations.map((l) => renderLocationCard(l, true))}
            </>
          )}

          {recommendedLocations.length === 0 && (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <Ionicons name="storefront-outline" size={48} color={colors.gray300} />
              <Text className="text-gray-400 mt-3">ยังไม่มีสถานที่สำหรับกิจกรรมนี้ในบริเวณนี้</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom buttons */}
      <View className="bg-white border-t border-gray-100" style={{ alignItems: 'center', paddingTop: 12 }}>
        <View style={{ width: '100%', maxWidth: maxContentWidth, paddingHorizontal: horizontalPadding, paddingBottom: bottomPadding , gap: 10 }}>
          <Button
            label={proposing ? 'กำลังส่ง...' : 'เสนอสถานที่นี้'}
            onPress={handlePropose}
            disabled={!selectedLocationId || proposing}
          />
          <Button
            label="ยกเลิกการนัด"
            variant="outline"
            color="gray"
            onPress={handleCancel}
          />
        </View>
      </View>

      {/* Incoming proposal modal */}
      <Modal visible={!!incomingProposal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View style={{ backgroundColor: 'white', borderRadius: 20, padding: 24, width: '100%', maxWidth: 360 }}>
            <View style={{ alignItems: 'center', marginBottom: 12 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name="location" size={32} color={colors.primary} />
              </View>
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center mb-1">
              {incomingProposal?.proposer?.user_show_name || 'เพื่อน'} เสนอสถานที่
            </Text>
            <Text className="text-sm text-gray-500 text-center mb-4">คุณต้องการไปที่นี่ไหม?</Text>
            <View style={{ backgroundColor: '#F9FAFB', borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <Text className="text-base font-bold text-gray-900 mb-1">
                {incomingProposal?.location?.name || '-'}
              </Text>
              {incomingProposal?.location?.description ? (
                <Text className="text-xs text-gray-500" numberOfLines={3}>
                  {incomingProposal.location.description}
                </Text>
              ) : null}
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Button label="ปฏิเสธ" variant="outline" color="gray" onPress={handleRejectProposal} disabled={respondLoading} />
              </View>
              <View style={{ flex: 1 }}>
                <Button label={respondLoading ? '...' : 'ยินยอม'} onPress={handleAcceptProposal} disabled={respondLoading} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      <AlertModal
        visible={alert.visible}
        type={alert.type}
        title={alert.title}
        message={alert.message}
        buttonLabel="ตกลง"
        onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
      />
    </SafeAreaView>
  );
};

export default MatchUpScreen;
