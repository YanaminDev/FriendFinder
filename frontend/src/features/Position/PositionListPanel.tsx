import React, { useEffect, useState } from 'react';
import { IoClose, IoChevronForward, IoTimeOutline, IoCallOutline, IoLocationOutline } from 'react-icons/io5';
import { positionService } from '../../services';
import type { PositionResponse } from '../../types/responses';
import Card from '../../components/Card';

interface PositionListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPosition: (position: PositionResponse) => void;
}

const PositionListPanel: React.FC<PositionListPanelProps> = ({
  isOpen,
  onClose,
  onSelectPosition,
}) => {
  const [positions, setPositions] = useState<PositionResponse[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    positionService
      .getAll()
      .then((data) => setPositions(data))
      .catch((err) => console.error('Failed to fetch positions:', err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const handleSelect = (position: PositionResponse) => {
    onSelectPosition(position);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b bg-white">
          <div className="flex items-center gap-2">
            <IoLocationOutline className="h-5 w-5 text-[#F26B6B]" />
            <h2 className="text-lg font-bold text-gray-800">ทุก Position</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-700 transition"
          >
            <IoClose className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
          {loading && (
            <div className="text-center py-10 text-gray-400 text-sm">กำลังโหลด...</div>
          )}

          {!loading && positions.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">ยังไม่มี Position</div>
          )}

          {!loading &&
            positions.map((pos) => (
              <Card
                key={pos.id}
                className="mb-5 p-0 hover:shadow-md transition cursor-pointer"
                onClick={() => handleSelect(pos)}
              >
                <div className="flex items-center gap-3 p-3">
                  {/* Thumbnail */}
                  {pos.image ? (
                    (() => {
                      let imgSrc = pos.image;
                      try {
                        const parsed = JSON.parse(pos.image);
                        imgSrc = Array.isArray(parsed) ? parsed[0] : pos.image;
                      } catch {}
                      return (
                        <img
                          src={imgSrc}
                          alt={pos.name}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                        />
                      );
                    })()
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <IoLocationOutline className="h-6 w-6 text-gray-300" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0 ">
                    <p className="font-semibold text-gray-800 truncate">{pos.name}</p>

                    {pos.phone && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <IoCallOutline className="h-3 w-3 text-[#F26B6B] flex-shrink-0" />
                        <span className="text-xs text-gray-500 truncate">{pos.phone}</span>
                      </div>
                    )}

                    {(pos.open_time || pos.close_time) && (
                      <div className="flex items-center gap-1 mt-0.5">
                        <IoTimeOutline className="h-3 w-3 text-[#F26B6B] flex-shrink-0" />
                        <span className="text-xs text-gray-500">
                          {pos.open_date && `${pos.open_date} `}
                          {pos.open_time && pos.close_time
                            ? `${pos.open_time} - ${pos.close_time}`
                            : pos.open_time || pos.close_time}
                        </span>
                      </div>
                    )}

                    {pos.location && pos.location.length > 0 && (
                      <p className="text-xs text-[#F26B6B] mt-1">
                        {pos.location.length} สถานที่
                      </p>
                    )}
                  </div>

                  <IoChevronForward className="h-4 w-4 text-gray-400 flex-shrink-0" />
                </div>
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default PositionListPanel;
