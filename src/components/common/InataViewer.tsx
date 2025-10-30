import React, { useEffect, useRef, useState } from "react";
import Spinner from "../ui/Spinner";

interface InstaViewerProps {
  url: string;
  width?: number;
}

export const getPlaceURL = (url: string) => {
  const base_url = 'https://www.instagram.com/';
  const strings = url.split('/');
  if (!strings) {
    return '';
  }
  if (strings.length < 5) {
    return '';
  }
  console.log(base_url + strings[4] + '/' + strings[5]);
  return base_url + strings[4] + '/' + strings[5];
}

const InstaViewer = ({ url, width = 300 }: InstaViewerProps) => {
  const ref = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!url || !ref.current) return;

    // 로딩 상태 초기화
    setLoading(true);

    ref.current.innerHTML = `
      <blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14" style="margin:0 auto;"></blockquote>
    `;

    const scriptId = "instagram-embed-script";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://www.instagram.com/embed.js";
      s.async = true;
      s.onload = () => window.instgrm?.Embeds?.process();
      document.body.appendChild(s);
    } else {
      window.instgrm?.Embeds?.process();
    }

    // iframe 생성 + 렌더링 안정화 감지
    const observer = new MutationObserver(() => {
      const iframe = ref.current.querySelector("iframe");
      if (iframe) {
        setTimeout(() => setLoading(false), 300); // 안정화 후 로딩 종료
        observer.disconnect();
      }
    });

    observer.observe(ref.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [url]);

  return (
    <div className="h-full overflow-hidden">
      {loading && (
        <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
          <Spinner />
          <p>인스타그램 불러오는중 ...</p>
        </div>
      )}
      <div className={`${loading ? 'hidden' : ''}`} ref={ref}></div>
    </div>
  );
}

export default InstaViewer;
