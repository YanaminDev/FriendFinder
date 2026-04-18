import React, { useEffect, useState } from 'react';
import { IoClose, IoChevronForward, IoTimeOutline, IoCallOutline, IoLocationOutline, IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { positionService } from '../../services';
import type { PositionResponse } from '../../types/responses';
import Card from '../../components/Card';

interface PositionListPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPosition: (position: PositionResponse) => void;
  onPositionVisibilityChange?: (positionId: string, isHidden: boolean) => void;
}

const PositionListPanel: React.FC<PositionListPanelProps> = ({
  isOpen,
  onClose,
  onSelectPosition,
  onPositionVisibilityChange,
}) => {
  const [positions, setPositions] = useState<PositionResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'active' | 'hidden'>('active');

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    positionService
      .getAll()
      .then((data) => setPositions(data))
      .catch((err) => console.error('Failed to fetch positions:', err))
      .finally(() => setLoading(false));
  }, [isOpen]);

  const filteredPositions = positions.filter((pos) =>
    filter === 'active' ? !pos.isHidden : pos.isHidden
  );
  const activeCount = positions.filter((p) => !p.isHidden).length;
  const hiddenCount = positions.filter((p) => p.isHidden).length;

  const handleToggleVisibility = async (e: React.MouseEvent, pos: PositionResponse) => {
    e.stopPropagation();
    try {
      const updated = pos.isHidden
        ? await positionService.unhide(pos.id)
        : await positionService.hide(pos.id);
      setPositions((prev) =>
        prev.map((p) => (p.id === pos.id ? { ...p, isHidden: updated.isHidden } : p))
      );
      onPositionVisibilityChange?.(pos.id, !!updated.isHidden);
    } catch (err) {
      console.error('Failed to toggle position visibility:', err);
    }
  };

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

        {/* Tabs */}
        <div className="flex border-b bg-gray-50">
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              filter === 'active'
                ? 'text-[#F26B6B] border-b-2 border-[#F26B6B]'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            เปิดให้บริการ ({activeCount})
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`flex-1 py-2.5 text-sm font-medium transition ${
              filter === 'hidden'
                ? 'text-yellow-600 border-b-2 border-yellow-500'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            ปิดชั่วคราว ({hiddenCount})
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-20">
          {loading && (
            <div className="text-center py-10 text-gray-400 text-sm">กำลังโหลด...</div>
          )}

          {!loading && filteredPositions.length === 0 && (
            <div className="text-center py-10 text-gray-400 text-sm">
              {filter === 'active' ? 'ไม่มี Position ที่เปิดให้บริการ' : 'ไม่มี Position ที่ปิดชั่วคราว'}
            </div>
          )}

          {!loading &&
            filteredPositions.map((pos) => (
              <Card
                key={pos.id}
                className="mb-5 p-0 hover:shadow-md transition cursor-pointer overflow-hidden"
                onClick={() => handleSelect(pos)}
              >
                <div className={pos.isHidden ? 'opacity-60 grayscale' : ''}>
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
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-gray-800 truncate">{pos.name}</p>
                      {pos.isHidden && (
                        <IoEyeOffOutline className="h-3.5 w-3.5 text-yellow-500 flex-shrink-0" title="ซ่อนอยู่" />
                      )}
                    </div>

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
                </div>

                {/* Toggle visibility button */}
                {pos.isHidden ? (
                  <button
                    onClick={(e) => handleToggleVisibility(e, pos)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-green-600 bg-green-50 hover:bg-green-100 border-t border-green-100 rounded-b-xl transition"
                  >
                    <IoEyeOutline className="h-3.5 w-3.5" />
                    เปิดให้บริการอีกครั้ง
                  </button>
                ) : (
                  <button
                    onClick={(e) => handleToggleVisibility(e, pos)}
                    className="flex items-center justify-center gap-1.5 w-full py-2 text-xs font-medium text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border-t border-yellow-100 rounded-b-xl transition"
                  >
                    <IoEyeOffOutline className="h-3.5 w-3.5" />
                    ปิดชั่วคราว
                  </button>
                )}
              </Card>
            ))}
        </div>
      </div>
    </>
  );
};

export default PositionListPanel;
