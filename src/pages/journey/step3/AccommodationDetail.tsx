import { useEffect, useMemo, useState } from 'react';
import type { Accommodation } from '@/api/accommodation';

type ExtAccommodation = Accommodation & {
  description?: string;
  tags?: string[];
};

interface Props {
  accommodation: ExtAccommodation | null;
  setCurrentAccommodation: (v: ExtAccommodation | null) => void;
  onApplyToAllDays?: (accommodation: ExtAccommodation) => void;
}

const MAX_IMAGES = 5;
const yanoljaURL = 'https://place-site.yanolja.com/places/';

const AccommodationDetail = ({
  accommodation,
  setCurrentAccommodation,
  onApplyToAllDays,
}: Props) => {
  const [idx, setIdx] = useState(0);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setIdx(0);
  }, [accommodation]);

  const images = useMemo(() => {
    if (!accommodation?.image_url) return [];
    return accommodation.image_url
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, MAX_IMAGES);
  }, [accommodation]);

  // 키보드: ESC 닫기, ← → 이동
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setCurrentAccommodation(null);
      if (!images.length) return;
      if (e.key === 'ArrowLeft')
        setIdx((i) => (i - 1 + images.length) % images.length);
      if (e.key === 'ArrowRight') setIdx((i) => (i + 1) % images.length);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [images.length, setCurrentAccommodation]);

  if (!accommodation) return null;

  const tags = accommodation.tags?.length
    ? accommodation.tags
    : [accommodation.type].filter(Boolean);

  const go = (n: number) => {
    if (!images.length) return;
    setFade(true);
    setTimeout(() => {
      setIdx(((n % images.length) + images.length) % images.length);
      requestAnimationFrame(() => setFade(false));
    }, 150);
  };

  const goPrev = () => go(idx - 1);
  const goNext = () => go(idx + 1);

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
          <div className="mt-3 flex flex-wrap gap-2 justify-between">
            <div>
              {tags.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              {onApplyToAllDays && (
                <button
                  onClick={() => {
                    onApplyToAllDays(accommodation);
                    setCurrentAccommodation(null);
                  }}
                  className="px-3 py-1 rounded-full text-sm bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                >
                  전체 적용
                </button>
              )}
              <div className="rounded-full p-1  text-gray-500 hover:text-blue-500 decoration-red-50 underline-offset-8">
                <a
                  href={`${yanoljaURL}${accommodation.accommodation_id}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  예약하러가기
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 본문 */}
        <div className="px-6 pb-6">
          {/* 캐러셀 */}
          <div className="relative w-full flex justify-center items-center bg-gray-50 rounded-md overflow-hidden">
            {images.length ? (
              <>
                <img
                  key={images[idx]}
                  src={images[idx]}
                  alt={`${accommodation.name}-${idx + 1}`}
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                  }}
                  className={`max-h-[360px] w-auto object-contain transition-opacity duration-300 ${fade ? 'opacity-0' : 'opacity-100'}`}
                />

                {/* 좌우 화살표 */}
                {images.length > 1 && (
                  <>
                    <button
                      onClick={goPrev}
                      className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-2 py-1 text-gray-700 border"
                      aria-label="previous image"
                    >
                      ‹
                    </button>
                    <button
                      onClick={goNext}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white px-2 py-1 text-gray-700 border"
                      aria-label="next image"
                    >
                      ›
                    </button>
                  </>
                )}
                {/* 인디케이터 */}
                {images.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setIdx(i)}
                        className={`h-2 w-2 rounded-full ${i === idx ? 'bg-gray-800' : 'bg-gray-300'}`}
                        aria-label={`go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="h-[220px] flex items-center justify-center text-gray-400">
                이미지 없음
              </div>
            )}
          </div>

          {/* 설명/위치 */}
          <div className="mt-6 grid grid-cols-[80px_1fr] gap-x-4 gap-y-4 text-sm">
            <div className="text-gray-600">전화번호</div>
            <div className="leading-6 whitespace-pre-wrap">
              {accommodation.phone || '-'}
            </div>

            <div className="text-gray-600">위치</div>
            <div className="text-gray-800">{accommodation.address}</div>
          </div>
        </div>

        {/* 하단 닫기 */}
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
