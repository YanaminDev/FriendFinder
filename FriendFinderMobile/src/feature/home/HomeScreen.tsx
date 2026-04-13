// ─── HomeScreen ────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../../components/common/AppHeader';
import NotificationButton from '../../components/common/NotificationButton';
import NotificationCard from '../../components/common/NotificationCard';
import LocationDetailCard from '../../components/map/LocationDetailCard';
import PrimaryButton from '../../components/common/PrimaryButton';
import MapComponentWeb from '../../components/map/MapComponentWeb';
import { getAllPositions, Position } from '../../service/position.service';
import { useUserLocation } from '../../hooks/useUserLocation';
import { useSocket } from '../../hooks/useSocket';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { setIsFinding, setPositionId, clearFindMatch, setUserLocation } from '../../redux/findMatchSlice';
import { createFindMatch, deleteFindMatch } from '../../service/find_match.service';
import { getPendingNotifications, respondNotification, NotificationData } from '../../service/notification.service';
import { createMatch, getActiveMatchByUser } from '../../service/match.service';
import AlertModal from '../../components/common/AlertModal';


const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { selectedActivities, isFinding, userLatitude, userLongitude, positionId } = useAppSelector((state) => state.findMatch);
  const userId = useAppSelector((state) => state.user.user_id);

  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [findMatchLoading, setFindMatchLoading] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [activeMatchId, setActiveMatchId] = useState<string | null>(null);
  const [alert, setAlert] = useState<{ visible: boolean; type: 'success' | 'error' | 'warning' | 'info'; title: string; message: string }>({ visible: false, type: 'info', title: '', message: '' });
  const { userLocation, loading: locationLoading } = useUserLocation();
  const matchAcceptedHandled = useRef(false);
  const matchCancelledAlertShown = useRef<string | null>(null); // Track which matchId already showed alert

  // บันทึก GPS ลง Redux เมื่อได้ตำแหน่งใหม่
  useEffect(() => {
    if (userLocation) {
      dispatch(setUserLocation({ latitude: userLocation.latitude, longitude: userLocation.longitude }));
    }
  }, [userLocation]);

  // Initialize Socket.IO connection when home screen loads
  useSocket(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await getAllPositions();
        setPositions(data);
      } catch (error) {
        console.error('Failed to fetch positions:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchActiveMatch = async () => {
      try {
        const match = await getActiveMatchByUser(userId);
        setActiveMatchId(match?.id || null);
      } catch {
        setActiveMatchId(null);
      }
    };

    matchAcceptedHandled.current = false; // Reset flag when home screen mounts
    fetchPositions();
    fetchActiveMatch();
  }, []);

  // ดึง notifications จริง
  const fetchNotifications = useCallback(async () => {
    try {
      const data = await getPendingNotifications();

      // ตรวจสอบว่ามี match_accepted notification ใหม่ไหม → ไปหน้าเลือกสถานที่ทันที
      const matchAccepted = data.find((n: NotificationData) => n.type === 'match_accepted');
      if (matchAccepted && !matchAcceptedHandled.current) {
        matchAcceptedHandled.current = true;
        // เปลี่ยนสถานะเป็น accepted เพื่อไม่ให้ poll เจออีก
        await respondNotification(matchAccepted.id, 'accepted');
        dispatch(clearFindMatch());
        try {
          const activeMatch = await getActiveMatchByUser(userId);
          if (activeMatch?.id) {
            navigation.navigate('MatchSuccess', { matchId: activeMatch.id });
            return;
          }
        } catch (e) {
          console.error('Fetch active match failed:', e);
        }
      }

      const mapped = data
        .filter((n: NotificationData) => n.type !== 'match_accepted') // match_accepted แสดงเป็น modal ไม่ต้องเอาเข้า list
        .map((n: NotificationData) => ({
          id: n.id,
          title: 'คำขอ Match!',
          message: `${n.sender?.user_show_name || 'ผู้ใช้'} อยากเจอคุณ`,
          timestamp: new Date(n.createdAt).toLocaleString('th-TH'),
          icon: 'heart',
          type: n.type,
          hasActions: true,
          senderId: n.sender_id,
          positionId: n.position_id,
          activityId: n.activity_id,
        }));
      setNotifications(mapped);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    // Poll every 5 seconds เพื่อให้รวดเร็วขึ้นเมื่อรับ match success notification
    const interval = setInterval(fetchNotifications, 5000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // ─── Poll active match status ─────────────────────────────────────────────
  useEffect(() => {
    const pollActiveMatch = async () => {
      try {
        const match = await getActiveMatchByUser(userId);
        if (match && match.cancel_status) {
          // Match ถูก cancel ให้ clear activeMatchId และแจ้งเตือน (เพียงครั้งเดียวต่อ matchId)
          if (matchCancelledAlertShown.current !== match.id) {
            matchCancelledAlertShown.current = match.id;
            setAlert({
              visible: true,
              type: 'warning',
              title: 'การนัดหมายถูกยกเลิก',
              message: 'ผู้ใช้อีกฝ่ายได้ยกเลิกการนัดหมาย',
            });
          }
          setActiveMatchId(null);
        } else {
          setActiveMatchId(match?.id || null);
          // Reset flag ถ้า activeMatch เปลี่ยน
          if (!match?.id) {
            matchCancelledAlertShown.current = null;
          }
        }
      } catch {
        setActiveMatchId(null);
      }
    };

    pollActiveMatch();
    const interval = setInterval(pollActiveMatch, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [userId]);

  // กดยอมรับ match request
  const handleAcceptNotification = async (notification: any) => {
    let createdMatchId: string | null = null;
    try {
      await respondNotification(notification.id, 'accepted');
      const match = await createMatch({
        user1_id: notification.senderId,
        user2_id: userId,
        activity_id: notification.activityId || selectedActivities[0]?.id || '',
        position_id: notification.positionId || positionId || '',
      });
      createdMatchId = match?.id || null;
    } catch (error: any) {
      console.error('Accept notification error:', error);
    } finally {
      dispatch(clearFindMatch());
      setShowNotifications(false);
      fetchNotifications();
      if (createdMatchId) {
        navigation.navigate('MatchSuccess', { matchId: createdMatchId });
      } else {
        try {
          const active = await getActiveMatchByUser(userId);
          if (active?.id) {
            navigation.navigate('MatchSuccess', { matchId: active.id });
            return;
          }
        } catch {}
      }
    }
  };

  // กดปฏิเสธ match request
  const handleRejectNotification = async (notification: any) => {
    try {
      await respondNotification(notification.id, 'rejected');
      fetchNotifications();
    } catch (error: any) {
      setAlert({ visible: true, type: 'error', title: 'ข้อผิดพลาด', message: error?.message || 'ไม่สามารถปฏิเสธได้' });
    }
  };

  // หา position ที่ใกล้กับ user มากที่สุด (ใช้ GPS ปัจจุบัน หรือ fallback จาก Redux)
  const findNearestPosition = (): Position | null => {
    const lat = userLocation?.latitude ?? userLatitude;
    const lng = userLocation?.longitude ?? userLongitude;
    if (!lat || !lng || positions.length === 0) return null;
    let nearest: Position | null = null;
    let minDistance = Infinity;
    for (const pos of positions) {
      const dist = Math.sqrt(
        Math.pow(pos.latitude - lat, 2) +
        Math.pow(pos.longitude - lng, 2)
      );
      if (dist < minDistance) {
        minDistance = dist;
        nearest = pos;
      }
    }
    return nearest;
  };

  // กด Find Match
  const handleFindMatch = async () => {
    dispatch(clearFindMatch());
    const nearest = findNearestPosition();
    if (!nearest) {
      setAlert({ visible: true, type: 'warning', title: 'ไม่พบสถานที่', message: 'ไม่พบสถานที่ใกล้เคียง กรุณาเปิด GPS' });
      return;
    }
    setFindMatchLoading(true);
    try {
      await createFindMatch({
        user_id: userId,
        position_id: nearest.id,
        activity_id1: selectedActivities[0]?.id,
        activity_id2: selectedActivities[1]?.id,
        activity_id3: selectedActivities[2]?.id,
      });
      dispatch(setPositionId(nearest.id));
      dispatch(setIsFinding(true));
      navigation.navigate('Match');
    } catch (error: any) {
      setAlert({ visible: true, type: 'error', title: 'ข้อผิดพลาด', message: error?.message || 'ไม่สามารถค้นหาได้' });
    } finally {
      setFindMatchLoading(false);
    }
  };

  // กด Cancel Find Match
  const handleCancelFindMatch = async () => {
    setFindMatchLoading(true);
    try {
      await deleteFindMatch(userId);
      dispatch(clearFindMatch());
      setAlert({ visible: true, type: 'info', title: 'ยกเลิกสำเร็จ', message: 'ยกเลิกการค้นหาเพื่อนแล้ว' });
    } catch (error: any) {
      setAlert({ visible: true, type: 'error', title: 'ข้อผิดพลาด', message: error?.message || 'ไม่สามารถยกเลิกได้' });
    } finally {
      setFindMatchLoading(false);
    }
  };

  return (
  <View className="flex-1 bg-white">
    <SafeAreaView className="flex-1 justify-between" edges={['top', 'left', 'right', 'bottom']}>
      <View className="flex-1">
        <AppHeader title="Home" />
        {/* Map with responsive height */}
        <View className="relative flex-1">
          {loading ? (
            <View className="flex-1 justify-center items-center bg-gray-100">
              <ActivityIndicator size="large" color="#FF6B6B" />
            </View>
          ) : (
            <MapComponentWeb
              pins={positions.map(p => ({
                id: p.id,
                title: p.name,
                longitude: p.longitude,
                latitude: p.latitude,
              }))}
              userLocation={userLocation || undefined}
              height="100%"
              onPinPress={(pin: any) => {
                const position = positions.find(p => p.id === pin.id);
                if (position) {
                  console.log('Selected position:', position);
                  console.log('Position image:', position.image);
                  setSelectedLocation({
                    ...position,
                    name: position.name,
                    description: position.information,
                    phone: position.phone,
                    image: position.image,
                    openHours: position.open_time && position.close_time
                      ? `${position.open_time} - ${position.close_time}`
                      : position.open_time || position.close_time || 'ไม่ระบุเวลา',
                    markerPosition: pin.position
                  });
                }
              }}
            />
          )}

          {/* Notification Button - Top Right */}
          <View className="absolute top-4 right-4 z-10">
            <NotificationButton
              onPress={() => setShowNotifications(!showNotifications)}
              badge={notifications.length}
              size="md"
            />
          </View>

          {/* Notification Card Popup */}
          {showNotifications && (
            <NotificationCard
              notifications={notifications}
              onClose={() => setShowNotifications(false)}
              onNotificationPress={(notification) => {
                setShowNotifications(false);
              }}
              onAccept={handleAcceptNotification}
              onReject={handleRejectNotification}
            />
          )}

          {/* Find Match / Cancel / Resume Button - Bottom Center */}
          <View className="absolute left-0 right-0 items-center" style={{ bottom: 30 }}>
            {isFinding ? (
              <View style={{ gap: 12, alignItems: 'center' }}>
                <PrimaryButton
                  onPress={() => navigation.navigate('Match')}
                  size="md"
                  text="กลับไปปัดหาคน"
                />
                <PrimaryButton
                  onPress={handleCancelFindMatch}
                  size="sm"
                  text={findMatchLoading ? 'ยกเลิก...' : 'ยกเลิกการค้นหา'}
                />
              </View>
            ) : activeMatchId ? (
              <PrimaryButton
                onPress={() => navigation.navigate('MatchUp', { matchId: activeMatchId })}
                size="md"
                text="กลับไป Match "
              />
            ) : selectedActivities.length > 0 ? (
              <PrimaryButton
                onPress={handleFindMatch}
                size="md"
                text={findMatchLoading ? 'กำลังค้นหา...' : 'FIND MATCH'}
              />
            ) : (
              <PrimaryButton onPress={() => navigation.navigate('SelectActivity')} size="md" text="CHECK IN NOW" />
            )}
          </View>

          {/* Location Detail Card */}
          {selectedLocation && (
            <LocationDetailCard
              id={selectedLocation.id}
              title={selectedLocation.name}
              description={selectedLocation.description}
              phone={selectedLocation.phone}
              openDate={selectedLocation.open_date}
              openTime={selectedLocation.openHours}
              imageUrl={selectedLocation.image}
              markerPosition={selectedLocation.markerPosition}
              onClose={() => setSelectedLocation(null)}
              onPress={() => {
                setSelectedLocation(null);
                navigation.navigate('VenueDetail', { venueId: selectedLocation.id });
              }}
            />
          )}
        </View>
      </View>
    </SafeAreaView>

    <AlertModal
      visible={alert.visible}
      type={alert.type}
      title={alert.title}
      message={alert.message}
      buttonLabel="ตกลง"
      onPress={() => setAlert({ visible: false, type: 'info', title: '', message: '' })}
    />
  </View>
  );
};

export default HomeScreen;
