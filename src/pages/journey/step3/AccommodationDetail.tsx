import React, { useEffect } from 'react';
import type { Accommodation } from '@/api/accommodation';

type ExtAccommodation = Accommodation & {
  description?: string; // 없으면 '-'
  tags?: string[]; // 없으면 type만 표시
};

interface AccommodationDetailProps {
  accommodation: ExtAccommodation | null;
  setCurrentAccommodation: (accommodation: ExtAccommodation | null) => void;
}

const AccommodationDetail = ({
  accommodation,
  setCurrentAccommodation,
}: AccommodationDetailProps) => {
  // Esc 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === 'Escape' && setCurrentAccommodation(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [setCurrentAccommodation]);

  if (!accommodation) return null;

  const tags = accommodation.tags?.length
    ? accommodation.tags
    : [accommodation.type].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
      onClick={() => setCurrentAccommodation(null)}
    >
      <div
        className="relative w-[860px] max-w-[90vw] bg-white rounded-xl shadow-xl border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold">{accommodation.name}</h2>
            <button
              aria-label="close"
              onClick={() => setCurrentAccommodation(null)}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>

          {/* 태그칩 */}
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 본문 */}
        <div className="px-6 pb-6">
          {/* 이미지 */}
          <div className="w-full flex justify-center">
            <img
              src={accommodation.image_url || ''}
              alt={accommodation.name}
              className="max-h-[360px] w-auto rounded-md object-cover"
            />
          </div>

          {/* 설명/위치 */}
          <div className="mt-6 grid grid-cols-[80px_1fr] gap-x-4 gap-y-4 text-sm">
            <div className="text-gray-600">설명</div>
            <div className="leading-6 whitespace-pre-wrap">
              {accommodation.description || '-'}
            </div>

            <div className="text-gray-600">위치</div>
            <div className="text-gray-800">{accommodation.address}</div>
          </div>
        </div>

        {/* 하단 닫기 버튼 */}
        <div className="absolute right-4 bottom-4">
          <button
            onClick={() => setCurrentAccommodation(null)}
            className="px-5 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccommodationDetail;
