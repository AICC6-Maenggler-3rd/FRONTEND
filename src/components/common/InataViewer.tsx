import React, { useEffect, useRef, useState } from "react";

interface InstaViewerProps {
  url: string;
  width?: number;
}

const InstaViewer = ({ url, width = 300 }: InstaViewerProps) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!url) return;
    if (!ref.current) return;

    // 기존 내용 지우고 blockquote 삽입
    ref.current.innerHTML = `
      <blockquote 
        class="instagram-media" 
        data-instgrm-permalink="${url}" 
        data-instgrm-version="14"
        style="margin:0 auto; width:${width}px;">
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
    <div ref={ref}></div>
    )
}

export default InstaViewer;
