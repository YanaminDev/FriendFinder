import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { clearIncomingProposal } from '../../redux/locationProposalSlice';
import Button from './Button';
import AlertModal from './AlertModal';
import {
  respondLocationProposal,
  LocationProposal,
} from '../../service/location_proposal.service';
import { colors } from '../../constants/theme';

interface Props {
  onAccepted?: () => void;
}

const GlobalProposalModal: React.FC<Props> = ({ onAccepted }) => {
  const dispatch = useAppDispatch();
  const { incomingProposal, incomingProposalImage } = useAppSelector(
    (state) => state.locationProposal
  );

  const [respondLoading, setRespondLoading] = useState(false);
  const [alert, setAlert] = useState<{
    visible: boolean;
    type: 'success' | 'error' | 'warning' | 'info';
    title: string;
    message: string;
  }>({ visible: false, type: 'info', title: '', message: '' });

  const handleAccept = async () => {
    if (!incomingProposal) return;
    setRespondLoading(true);
    try {
      await respondLocationProposal(incomingProposal.id, 'accepted');
      dispatch(clearIncomingProposal());
      onAccepted?.();
    } catch (err: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ผิดพลาด',
        message: err?.message || 'ตอบรับไม่สำเร็จ',
      });
    } finally {
      setRespondLoading(false);
    }
  };

  const handleReject = async () => {
    if (!incomingProposal) return;

    const proposalId = incomingProposal.id;
    dispatch(clearIncomingProposal());
    setRespondLoading(true);

    try {
      await respondLocationProposal(proposalId, 'rejected');
    } catch (err: any) {
      setAlert({
        visible: true,
        type: 'error',
        title: 'ผิดพลาด',
        message: err?.message || 'ปฏิเสธไม่สำเร็จ',
      });
    } finally {
      setRespondLoading(false);
    }
  };

  return (
    <>
      <Modal visible={!!incomingProposal} transparent animationType="fade">
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              backgroundColor: 'white',
              borderRadius: 20,
              overflow: 'hidden',
              width: '100%',
              maxWidth: 360,
            }}
          >
            {/* Location Image */}
            {incomingProposalImage ? (
              <Image
                source={{ uri: incomingProposalImage }}
                style={{ width: '100%', height: 180 }}
              />
            ) : (
              <View
                style={{
                  width: '100%',
                  height: 180,
                  backgroundColor: '#f3f4f6',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="image-outline" size={48} color={colors.gray300} />
              </View>
            )}

            {/* Content */}
            <View style={{ padding: 24 }}>
              <Text className="text-lg font-bold text-gray-900 mb-1">
                {incomingProposal?.proposer?.user_show_name || 'เพื่อน'} เสนอสถานที่
              </Text>
              <Text className="text-sm text-gray-500 mb-4">
                คุณต้องการไปที่นี่ไหม?
              </Text>

              {/* Location Info */}
              <View
                style={{
                  backgroundColor: '#F9FAFB',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 16,
                }}
              >
                <Text className="text-base font-bold text-gray-900 mb-2">
                  {incomingProposal?.location?.name || '-'}
                </Text>

                {incomingProposal?.location?.description ? (
                  <Text className="text-xs text-gray-500 mb-3" numberOfLines={3}>
                    {incomingProposal.location.description}
                  </Text>
                ) : null}

                {/* Opening Hours */}
                {(incomingProposal?.location?.open_date ||
                  incomingProposal?.location?.open_time ||
                  incomingProposal?.location?.close_time) ? (
                  <View
                    style={{
                      borderTopWidth: 1,
                      borderTopColor: '#E5E7EB',
                      paddingTop: 10,
                    }}
                  >
                    {incomingProposal?.location?.open_date && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                          marginBottom: 6,
                        }}
                      >
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={colors.primary}
                        />
                        <Text className="text-xs text-gray-600">
                          วันเปิด: {incomingProposal.location.open_date}
                        </Text>
                      </View>
                    )}
                    {(incomingProposal?.location?.open_time ||
                      incomingProposal?.location?.close_time) && (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={14}
                          color={colors.primary}
                        />
                        <Text className="text-xs text-gray-600">
                          เวลา: {incomingProposal.location.open_time || '-'} ถึง{' '}
                          {incomingProposal.location.close_time || '-'}
                        </Text>
                      </View>
                    )}
                  </View>
                ) : null}
              </View>

              {/* Buttons */}
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Button
                    label="ปฏิเสธ"
                    variant="outline"
                    color="gray"
                    onPress={handleReject}
                    disabled={respondLoading}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Button
                    label={respondLoading ? '...' : 'ยินยอม'}
                    onPress={handleAccept}
                    disabled={respondLoading}
                  />
                </View>
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
    </>
  );
};

export default GlobalProposalModal;
