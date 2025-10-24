interface RecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface RecommendationData {
  id: number;
  title: string;
  location: string;
  image: string;
  description: string;
  tags: string[];
  rating: number;
  visitors: number;
  distance: string;
}

export function RecommendationModal({
  isOpen,
  onClose,
}: RecommendationModalProps) {
  // 하드코딩된 추천 데이터
  const recommendations: RecommendationData[] = [
    {
      id: 1,
      title: '제주도 성산일출봉',
      location: '제주특별자치도 서귀포시',
      image: '/image/성산일출봉.jpg',
      description:
        '회원님과 비슷한 사용자들이 가장 많이 방문한 제주도의 대표 관광지입니다.',
      tags: ['자연', '일출', '등산', '힐링'],
      rating: 4.8,
      visitors: 1247,
      distance: '서울에서 1시간 30분',
    },
    {
      id: 2,
      title: '경주 불국사',
      location: '경상북도 경주시',
      image: '/image/불꽃축제.jpg',
      description:
        '역사와 문화를 사랑하는 여행자들이 선호하는 유네스코 세계문화유산입니다.',
      tags: ['역사', '문화', '유네스코', '사찰'],
      rating: 4.7,
      visitors: 892,
      distance: '서울에서 3시간',
    },
    {
      id: 3,
      title: '강릉 핑크뮬리',
      location: '강원도 강릉시',
      image: '/image/핑크뮬리.jpg',
      description:
        'SNS에서 화제가 된 핑크뮬리 밭으로, 사진 찍기를 좋아하는 여행자들에게 인기입니다.',
      tags: ['SNS', '사진', '자연', '핑크뮬리'],
      rating: 4.6,
      visitors: 1563,
      distance: '서울에서 2시간 30분',
    },
    {
      id: 4,
      title: '남원 한옥마을',
      location: '전라북도 남원시',
      image: '/image/남원.jpg',
      description:
        '전통 한옥의 아름다움을 느낄 수 있는 힐링 여행지로 추천됩니다.',
      tags: ['한옥', '전통', '힐링', '문화'],
      rating: 4.5,
      visitors: 734,
      distance: '서울에서 3시간 30분',
    },
    {
      id: 5,
      title: '평창 스키장',
      location: '강원도 평창군',
      image: '/image/스키장.jpg',
      description:
        '겨울 스포츠를 즐기는 액티브한 여행자들이 선호하는 스키 리조트입니다.',
      tags: ['스키', '겨울', '액티비티', '리조트'],
      rating: 4.4,
      visitors: 1023,
      distance: '서울에서 2시간',
    },
    {
      id: 6,
      title: '철길마을',
      location: '경기도 양평군',
      image: '/image/철길마을.jpg',
      description: '가족 단위 여행자들이 즐겨 찾는 감성적인 철길마을입니다.',
      tags: ['가족', '감성', '철길', '카페'],
      rating: 4.3,
      visitors: 1456,
      distance: '서울에서 1시간 30분',
    },
  ];

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="relative w-[860px] max-w-[90vw] max-h-[90vh] bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="px-6 pt-5 pb-3">
          <div className="flex items-start justify-between">
            <h2 className="text-2xl font-semibold">
              회원님과 비슷한 사용자들이 갔던 여행지
            </h2>
            <button
              aria-label="close"
              onClick={onClose}
              className="rounded-full p-1 text-gray-500 hover:bg-gray-100"
            >
              ✕
            </button>
          </div>
          <div className="mt-3">
            <p className="text-sm text-gray-600">
              AI가 분석한 맞춤 추천 여행지를 확인해보세요
            </p>
          </div>
        </div>

        {/* 본문 - 스크롤 가능한 영역 */}
        <div className="flex-1 overflow-y-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs bg-white text-gray-800 shadow-md">
                      ⭐ {item.rating}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-600 mb-2">
                    📍 {item.location}
                  </p>

                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 border border-green-200"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-600">
                    <span>👥 {item.visitors.toLocaleString()}명 방문</span>
                    <span>🚗 {item.distance}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 닫기 */}
        <div className="absolute right-4 bottom-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
