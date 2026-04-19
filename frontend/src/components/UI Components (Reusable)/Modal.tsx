import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  centered?: boolean;
  closeOnOverlay?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  centered = true,
  closeOnOverlay = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-out ${
          isOpen ? 'bg-opacity-40' : 'bg-opacity-0'
        }`}
        onClick={closeOnOverlay ? onClose : undefined}
      />

      {/* Modal */}
      <div
        className={`fixed ${
          centered
            ? 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-11/12 max-w-lg'
            : 'bottom-0 left-0 right-0 rounded-t-2xl'
        } bg-white rounded-2xl shadow-2xl z-50 transform transition-all duration-300 ease-out max-h-[80vh] overflow-y-auto ${
          isOpen
            ? centered
              ? 'scale-100 opacity-100'
              : 'translate-y-0 opacity-100'
            : centered
              ? 'scale-95 opacity-0'
              : 'translate-y-full opacity-0'
        }`}
      >
        {/* Handle Bar - Only for bottom sheet */}
        {!centered && (
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Content */}
        <div className="p-8">
          {/* Header */}
          <h2 className="text-2xl font-bold text-gray-900 mb-8">{title}</h2>

          {/* Children Content */}
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;
