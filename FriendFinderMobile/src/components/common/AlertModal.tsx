import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../constants/theme';

interface AlertModalProps {
  visible: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  buttonLabel?: string;
  onPress?: () => void;
  secondaryButtonLabel?: string;
  onSecondaryPress?: () => void;
}

const AlertModal: React.FC<AlertModalProps> = ({
  visible,
  type = 'info',
  title,
  message,
  buttonLabel = 'ตกลง',
  onPress,
  secondaryButtonLabel,
  onSecondaryPress,
}) => {
  const getTypeConfig = (t: string) => {
    switch (t) {
      case 'success':
        return { icon: 'checkmark-circle', color: colors.success, bgColor: '#f0fdf4' };
      case 'error':
        return { icon: 'close-circle', color: colors.danger, bgColor: '#fef2f2' };
      case 'warning':
        return { icon: 'warning', color: colors.warning, bgColor: '#fffbeb' };
      default:
        return { icon: 'information-circle', color: colors.primary, bgColor: '#f0f9ff' };
    }
  };

  const config = getTypeConfig(type);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/40">
        <View
          className="bg-white rounded-2xl p-6 max-w-xs w-11/12 shadow-lg"
          style={{ backgroundColor: config.bgColor }}
        >
          {/* Icon */}
          <View className="items-center mb-4">
            <Ionicons name={config.icon as any} size={48} color={config.color} />
          </View>

          {/* Title */}
          <Text className="text-lg font-bold text-gray-900 text-center mb-2">{title}</Text>

          {/* Message */}
          <Text className="text-sm text-gray-600 text-center mb-6 leading-5">{message}</Text>

          {/* Buttons */}
          <View className={secondaryButtonLabel ? 'flex-row gap-3' : ''}>
            {secondaryButtonLabel && (
              <TouchableOpacity
                className="flex-1 rounded-lg py-3 items-center bg-gray-200"
                onPress={onSecondaryPress}
              >
                <Text className="text-gray-800 font-semibold text-base">{secondaryButtonLabel}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className={`${secondaryButtonLabel ? 'flex-1' : ''} rounded-lg py-3 items-center`}
              style={{ backgroundColor: config.color }}
              onPress={onPress}
            >
              <Text className="text-white font-semibold text-base">{buttonLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AlertModal;
