import React, { useEffect, useRef, useState } from "react";

interface InstaViewerProps {
  url: string;
  caption?: string;
}

const InstaViewer = ({ url, caption }: InstaViewerProps) => {
  const ref = useRef(null);

  caption = "여러분 제가 그동안 서울에서 가본 뷔페 중에 가장 만족도가 높았던 여의도 켄싱턴호텔 '브로드웨이'가 스시&그릴 라이브 가을 특선으로 돌아왔습니다!\n\n@함께 가고 싶은 친구에게 지금 바로 공유해 주세요 :)\n\n———\n\n🍣 스시&사시미 섹션\n가을 바다의 싱싱함을 그대로 담은 \n스시와 사시미가 가득 준비되어 있습니다.\n\n시즌 맞은 대하, 가리비, 참소라, 시즌 활어회,\n삼치, 가을 연어까지 제철 해산물을 다양하게 맛볼 수 있답니다. \n해산물 좋아하신다면 만족도 120% 장담해요!\n\n🥩 그릴 라이브 섹션\n즉석에서 구워내는 양갈비 구이,\n앵거스 부채살구이가 준비돼 있어요. \n\n불맛과 육즙이 살아 있는 고기를 셰프가 \n바로 구워주셔서 한층 풍미가 살아있답니다. \n\n다양한 소스와 곁들이는 채소도 준비돼 있어 \n고급 레스토랑의 만족감을 그대로 느끼실 수 있어요.\n\n🍲 따뜻한 메뉴 & 사이드\n버섯라구스프,  모시조개탕 같은 국물 요리와 \n해물국수, 각종 따뜻한 사이드 메뉴도 있어 \n속까지 든든하게 채워줍니다.\n\n가볍게 시작할 수 있는 샐러드와 치즈, 빵, \n다양한 디저트 코너도 빼놓을 수 없어요.\n\n🏟️ 특별한 공간\n이번 시즌에는 2층 공간까지 추가로 \n오픈돼 프라이빗한 분위기에서 식사할 수 있어요. \n\n게다가 미국 메이저리그 야구 소장품 \n전시까지 함께 감상할 수 있어 \n식사 이상의 특별한 경험을 선사합니다.\n\n🗺️ 주소\n서울특별시 영등포구 국회대로 76길 16 켄싱턴 여의도 호텔 1층\n\n⏰ 운영 시간\n• 07:00~21:00\n• 런치 11:30~14:00\n• 디너 18:00~21:00\n\n📞 전화번호(예약)\n• 02-6670-7260\n\n여의도 중심에서 가을 제철 해산물과 \n고급 그릴 요리를 동시에 즐길 수 있는 \n브로드웨이! 꼭 저장해 두세요 :)\n\n———\n\n#브로드웨이 #켄싱턴호텔여의도 #여의도켄싱턴호텔 #여의도맛집 #서울뷔페"

  useEffect(() => {
    if (!url) return;
    if (!ref.current) return;

    // 기존 내용 지우고 blockquote 삽입
    ref.current.innerHTML = `
      <blockquote 
        class="instagram-media" 
        data-instgrm-permalink="${url}" 
        data-instgrm-version="14"
        style="margin:0 auto; width:300px;">
      </blockquote>
    `;

    // Instagram 스크립트 로드
    const scriptId = "instagram-embed-script";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      document.body.appendChild(s);
      s.onload = () => window.instgrm?.Embeds?.process();
    } else {
      window.instgrm?.Embeds?.process();
    }
  }, [url]);

  return(
    <div className="w-full flex justify-center my-20">
      <div className="border-2 border-gray-300 rounded-lg p-4 overflow-y-auto flex flex-col items-center gap-2">
        <div className="flex gap-2">
          <div ref={ref}></div>
          <div className="mt-2 text-sm text-gray-500 whitespace-pre-wrap w-[300px] h-[700px] overflow-y-auto">
            <div>
              
            </div>
            <div>
              {caption}
            </div>
          </div>
        </div>
        <div>
          <button>닫기</button>
        </div>
      </div>
    </div>
    )
}

export default InstaViewer;
