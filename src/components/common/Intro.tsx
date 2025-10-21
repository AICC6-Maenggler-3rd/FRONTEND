import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function FloatingInstagramPosts() {
  const posts = [
    {
      image: '/image/인트로1.jpg',
      username: 'pick_insta',
      likes: '2,341',
      position: 'top-20 right-230',
      rotation: 'rotate-3',
      delay: '0s',
    },
    {
      image: '/image/인트로2.jpg',
      username: 'mukbang_yummy!',
      likes: '1,892',
      position: 'top-20 right-100',
      rotation: '-rotate-4',
      delay: '0.3s',
    },
    {
      image: '/image/인트로3.png',
      username: 'desert_trip',
      likes: '3,156',
      position: 'top-90 right-165',
      rotation: 'rotate-0',
      delay: '0.6s',
    },
    {
      image: '/image/인트로4.jpg',
      username: 'accommodation_good',
      likes: '4,203',
      position: 'top-120 right-100',
      rotation: 'rotate-10',
      delay: '0.9s',
    },
    {
      image: '/image/인트로5.jpg',
      username: 'hotplace',
      likes: '5,421',
      position: 'top-130 right-230',
      rotation: '-rotate-8',
      delay: '1.2s',
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden ">
      {posts.map((post, index) => (
        <div
          key={index}
          className={`absolute ${post.position} ${post.rotation} animate-float-in opacity-0`}
          style={{ animationDelay: post.delay, animationFillMode: 'forwards' }}
        >
          <div className="bg-white rounded-xl shadow-xl overflow-hidden w-48 transform hover:scale-105 transition-transform duration-300">
            {/* Instagram post header */}
            <div className="flex items-center gap-2 p-2 border-b border-slate-100">
              {/* Instagram Story Ring with Profile Picture */}
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 p-0.5">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                  <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                    {post.username.charAt(0).toUpperCase()}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <span className="text-xs font-semibold text-slate-900">
                  {post.username}
                </span>
                <div className="text-xs text-slate-500">2시간 전</div>
              </div>
              <div className="text-slate-500">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </div>
            </div>

            {/* Post image */}
            <div className="aspect-square relative">
              <img
                src={post.image}
                alt={`Travel post by ${post.username}`}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Post actions */}
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Heart icon */}
                  <svg
                    className="w-4 h-4 text-slate-900 hover:text-red-500 transition-colors cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {/* Comment icon */}
                  <svg
                    className="w-4 h-4 text-slate-900 hover:text-blue-500 transition-colors cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                  {/* Share/Send icon */}
                  <svg
                    className="w-4 h-4 text-slate-900 hover:text-green-500 transition-colors cursor-pointer"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </div>
                {/* Bookmark icon */}
                <svg
                  className="w-4 h-4 text-slate-900 hover:text-yellow-500 transition-colors cursor-pointer"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </div>
              <div className="text-xs font-semibold text-slate-900">
                {post.likes} likes
              </div>
              <div className="text-xs text-slate-900">
                <span className="font-semibold">{post.username}</span> 여행의
                추억을 담았어요 ✈️ #여행 #힐링
              </div>
              <div className="text-xs text-slate-500">
                댓글 {Math.floor(Math.random() * 50) + 10}개 모두 보기
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-sky-200 to-slate-200 min-h-screen relative">
      {/* Floating Instagram Posts */}
      <FloatingInstagramPosts />

      <div className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div className="relative">
            <div className="space-y-4 ml-15 mb-10 mt-50">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                AI가 추천하는
                <br />
                <span className="bg-gradient-to-r from-purple-500 to-orange-500 bg-clip-text text-transparent">
                  완벽한 여행 일정
                </span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed mt-10">
                수많은 여행자들의 발자취를 따라,
                <br />
                당신만을 위한 완벽한 여행을 만나보세요.
              </p>
            </div>

            {/* 버튼들 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/journey/step1"
                className="bg-gradient-to-r from-blue-300 to-sky-200 text-gray-800 px-8 py-4 rounded-xl text-center hover:shadow-lg transform shadow-md ml-15"
              >
                여행 계획 시작하기
              </Link>
            </div>

            {/* 기능 하이라이트 */}
            <div className="flex items-center space-x-5 pt-3 mt-3 ml-15">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-purple-600 text-xl mb-1">★</span>
                </div>
                <span className="text-gray-600 font-medium text-md">
                  10만+ 여행 데이터
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-pink-500 flex items-center justify-center text-xs">
                  {/* 작은 점 대신 하트 아이콘을 사용해 명확하게 합니다. */}
                  <span className="text-pink-600 text-xl mb-1">❤</span>
                </div>
                <span className="text-gray-600 font-medium text-md">
                  AI 맞춤 추천
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function TravelProcessSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const travelImages = [
    '/image/한옥.jpg',
    '/image/핑크뮬리.jpg',
    '/image/남원.jpg',
    '/image/mirror.jpg',
    '/image/기획전.jpg',
    '/image/불꽃축제.jpg',
    '/image/스키장.jpg',
    '/image/철길마을.jpg',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentImageIndex(
          (prevIndex) => (prevIndex + 1) % travelImages.length,
        );
        setIsAnimating(false);
      }, 700);
    }, 3000);

    return () => clearInterval(interval);
  }, [travelImages.length]);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Travel Process */}
        <div className="max-w-7xl mx-auto mt-30">
          {/* 4-step process */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
            {/* Left side - Travel process */}
            <div className="space-y-12">
              {/* Main question */}
              <div className="animate-fade-in-up">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground text-balance mb-4">
                  여행은 가고 싶고, <br />
                  어디를 가야할지 막막할 땐?
                </h2>
              </div>
              <div
                className="grid grid-cols-2 gap-6 animate-fade-in-up"
                style={{ animationDelay: '0.2s' }}
              >
                <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 group">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-black font-bold text-lg group-hover:bg-primary/20 transition-colors">
                      1
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-1">
                        지역/일정 선택
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 group">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center text-black font-bold text-lg group-hover:bg-accent/20 transition-colors">
                      2
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-1">
                        장소/숙박 선택
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 group">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center text-black font-bold text-lg group-hover:bg-secondary/20 transition-colors">
                      3
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-1">
                        AI 일정 생성
                      </h3>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 bg-card/60 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 group">
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-black font-bold text-lg group-hover:bg-primary/20 transition-colors">
                      4
                    </div>
                    <div className="text-center">
                      <h3 className="font-semibold text-foreground mb-1">
                        일정 확정
                      </h3>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            {/* Right side - 이미지 */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '0.6s' }}
            >
              <div className="w-full max-w-5xl flex items-center justify-center p-10 rounded-2xl">
                <img
                  src="/image/인트로 이미지.png"
                  alt="인트로 이미지"
                  className="w-full h-auto max-w-2xl rounded-2xl shadow-2xl"
                />
              </div>
            </div>
          </div>

          <section className="py-32 bg-gradient-to-b from-white to-blue-50 mb-30">
            <div className="container mx-auto px-4">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <Badge variant="secondary" className="mb-4 px-4 py-2 text-sm">
                    AI 자동 일정 생성
                  </Badge>
                  <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-balance">
                    SNS 속 여행지도 이제는 손쉽게
                  </h2>
                  <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    유명한데 어딘지 몰라서 못 가셨다고요? <br />
                    SNS 속 그곳, 클릭 한번으로 AI가 여행 계획을 세워드려요.
                  </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center relative">
                  {/* 왼쪽: 인스타그램 게시물 */}
                  <div className="relative">
                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 max-w-md mx-auto">
                      {/* 인스타그램 헤더 */}
                      <div className="flex items-center gap-3 p-4 border-b">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          I
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm">inpick_lover</p>
                          <p className="text-xs text-gray-500">
                            제주도, 대한민국
                          </p>
                        </div>
                      </div>

                      {/* 인스타그램 이미지 */}
                      <div className="aspect-square bg-gray-100">
                        <img
                          src="/image/성산일출봉.jpg"
                          alt="제주도 여행"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* 인스타그램 하단 */}
                      <div className="p-4">
                        <div className="flex gap-4 mb-3">
                          <span className="text-lg">❤️</span>
                          <span className="text-lg">💬</span>
                          <span className="text-lg mb-1"> ... </span>
                        </div>
                        <p className="font-semibold text-sm mb-1">
                          좋아요 1,234개
                        </p>
                        <p className="text-sm">
                          <span className="font-semibold">travel_lover</span>{' '}
                          제주도 힐링 여행 <br />
                          🌊 성산일출봉, 우도, 카페 투어 #제주도 #제주여행 #힐링
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 모바일용 화살표 (세로 방향) */}
                  <div className="flex justify-center py-4 lg:hidden">
                    <svg width="50" height="150" viewBox="0 0 50 100">
                      <defs>
                        <marker
                          id="arrowhead-mobile"
                          markerWidth="10"
                          markerHeight="10"
                          refX="5"
                          refY="5"
                          orient="auto"
                          fill="#3b82f6"
                        >
                          <polygon points="0 0, 10 5, 0 10" />
                        </marker>
                      </defs>
                      <path
                        d="M 25 5 L 25 95"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        fill="none"
                        strokeDasharray="8,8"
                        markerEnd="url(#arrowhead-mobile)"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="0"
                          to="-16"
                          dur="1s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </svg>
                  </div>

                  {/* 중간: 점선 연결 (데스크톱에서만 표시) */}
                  <svg
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block pointer-events-none"
                    width="200"
                    height="100"
                    viewBox="0 0 200 100"
                  >
                    <defs>
                      <marker
                        id="arrowhead"
                        markerWidth="10"
                        markerHeight="10"
                        refX="9"
                        refY="3"
                        orient="auto"
                        fill="#3b82f6"
                      >
                        <polygon points="0 0, 10 3, 0 6" />
                      </marker>
                    </defs>
                    <path
                      d="M 20 50 Q 100 20, 180 50"
                      stroke="#3b82f6"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="8,8"
                      markerEnd="url(#arrowhead)"
                    >
                      <animate
                        attributeName="stroke-dashoffset"
                        from="0"
                        to="-16"
                        dur="1s"
                        repeatCount="indefinite"
                      />
                    </path>
                  </svg>

                  {/* 오른쪽: 일정표 */}
                  <div className="relative">
                    <div className="bg-white rounded-3xl shadow-2xl p-6 border border-gray-200 max-w-md mx-auto">
                      {/* 일정표 헤더 */}
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-xl font-bold">
                            제주도 힐링 여행
                          </h3>
                          <Badge className="bg-blue-500">AI 생성</Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          제주도의 아름다운 자연을 만끽하며 힐링하는 여행
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span>📅 2025.09.15 ~ 09.18</span>
                          <span>⏱️ 3박 4일</span>
                        </div>
                      </div>

                      {/* 일정 항목들 */}
                      <div className="space-y-3">
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="text-sm font-semibold text-gray-600 min-w-[50px]">
                              09:00
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">성산일출봉 등반</p>
                                <Badge variant="outline" className="text-xs">
                                  관광
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                📍 제주특별자치도 서귀포시 성산읍
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="text-sm font-semibold text-gray-600 min-w-[50px]">
                              12:00
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">
                                  우도 해산물 맛집
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  식사
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                📍 제주특별자치도 제주시 우도면
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-start gap-3">
                            <div className="text-sm font-semibold text-gray-600 min-w-[50px]">
                              15:00
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-semibold">
                                  오션뷰 카페 투어
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  카페
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600">
                                📍 제주특별자치도 서귀포시 안덕면
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <button className="w-full mt-6 text-blue-700">
                        전체 일정 보기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* AI 추천 섹션 */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-40">
            {/* 왼쪽 - 카드 스택 (앞 카드가 오른쪽 뒤로 넘어가는 효과) */}
            <div
              className="animate-fade-in-up"
              style={{ animationDelay: '0.8s' }}
            >
              {(() => {
                const total = travelImages.length;
                const iFront = currentImageIndex; // 중앙 큰 카드
                const iRight = (currentImageIndex + 2) % total; // 오른쪽-뒤 카드

                // 정지 상태의 위치 클래스
                const posFront =
                  'z-30 translate-x-0 translate-y-0 scale-100 opacity-100 rotate-0';
                const posLeft =
                  'z-20 -translate-x-10 sm:-translate-x-14 translate-y-3 scale-95 opacity-95 rotate-[-6deg]';
                const posRightBack =
                  'z-10 translate-x-16 sm:translate-x-20 translate-y-6 scale-90 opacity-85 rotate-[8deg]';

                // 애니메이션 상태에서의 이동(앞 → 오른쪽뒤, 왼쪽 → 앞, 오른쪽뒤 → 왼쪽)
                const frontClass = isAnimating ? posRightBack : posFront;
                // const leftClass = isAnimating ? posFront : posLeft;
                const rightClass = isAnimating ? posLeft : posRightBack;

                const cardBase =
                  'absolute transition-all duration-700 ease-out will-change-transform';
                const imgFront =
                  'w-[260px] sm:w-[320px] md:w-[360px] h-[360px] sm:h-[420px] object-cover rounded-[2rem]';
                const imgOther =
                  'w-[230px] sm:w-[280px] md:w-[320px] h-[330px] sm:h-[380px] object-cover rounded-[1.75rem]';

                return (
                  <div className="relative w-full h-96 sm:h-[28rem] flex items-center justify-center">
                    {/* 오른쪽 뒤 카드 */}
                    <div className={`${cardBase} ${rightClass}`}>
                      <Card className="overflow-hidden shadow-lg border-border/50 bg-card/90">
                        <img
                          src={travelImages[iRight]}
                          alt="right-back"
                          className={imgOther}
                        />
                      </Card>
                    </div>

                    {/* 중앙 앞 카드 */}
                    <div className={`${cardBase} ${frontClass}`}>
                      <Card className="overflow-hidden shadow-2xl border-border/50 bg-card">
                        <img
                          src={travelImages[iFront]}
                          alt="front"
                          className={isAnimating ? imgOther : imgFront}
                        />
                      </Card>
                    </div>

                    {/* 인디케이터 도트 */}
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 flex space-x-2">
                      {travelImages.map((_, index) => (
                        <button
                          key={index}
                          className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index === currentImageIndex
                              ? 'bg-white scale-125'
                              : 'bg-white/50'
                          }`}
                          onClick={() => setCurrentImageIndex(index)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* 오른쪽 - 텍스트와 태그들 */}
            <div
              className="animate-fade-in-up mb-10 mt-40"
              style={{ animationDelay: '1s' }}
            >
              <h3 className="text-4xl font-bold mb-1">
                어떤 여행을 꿈꾸세요? <br />
                AI가 현실로 만들어 드려요
              </h3>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                당신의 모든 취향을 담아, 가장 완벽한 일정을 선물합니다.
              </p>

              <div className="flex flex-wrap gap-3 mb-8">
                <Badge variant="outline" className="px-4 py-2">
                  자연과 함께
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  여유롭게 힐링
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  체험・액티비티
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  SNS 햣플
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  관광보다 먹방
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  쇼핑 & 시티 라이프
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  반려동물 동반
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  촌캉스 & 로컬 감성
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  연예인 맛집
                </Badge>
                <Badge variant="outline" className="px-4 py-2">
                  방송 출연
                </Badge>
              </div>

              <Link to="/journey/step1" className="hover:text-blue">
                AI일정 만들어 보기
              </Link>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-60 max-w-6xl container mx-auto px-6 ml-22">
          <Card
            className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 animate-fade-in-up w-[400px]"
            style={{ animationDelay: '0.6s' }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 animate-float">
              <svg
                className="w-8 h-8 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              AI 맞춤 추천
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              개인의 취향, 예산, 여행 스타일을 분석하여 <br />
              최적의 여행지와 일정을 추천합니다.
            </p>
          </Card>

          <Card
            className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 animate-fade-in-up w-[400px]"
            style={{ animationDelay: '0.8s' }}
          >
            <div
              className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mb-6 animate-float"
              style={{ animationDelay: '1s' }}
            >
              <svg
                className="w-8 h-8 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              실시간 일정 관리
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              여행 중에도 실시간으로 일정을 조정하고 <br />
              새로운 추천을 받을 수 있습니다.
            </p>
          </Card>

          <Card
            className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:bg-card/80 transition-all duration-300 animate-fade-in-up w-[400px]"
            style={{ animationDelay: '1s' }}
          >
            <div
              className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-6 animate-float"
              style={{ animationDelay: '2s' }}
            >
              <svg
                className="w-8 h-8 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-4">
              로컬 정보 제공
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              현지인만 아는 숨겨진 명소와 맛집 정보를 <br /> AI가 발굴하여
              제공합니다.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}

// 통합된 메인 컴포넌트 (기존 App 함수와 동일한 역할)
export default function App() {
  return (
    <div className="bg-background font-sans text-foreground">
      <HeroSection />
      <TravelProcessSection />
    </div>
  );
}
