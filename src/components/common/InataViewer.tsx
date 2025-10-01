import React, { useEffect, useRef, useState } from "react";


export default function InstaViewer({ url}) {
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
        style="margin:0 auto; max-width:540px; width:100%;">
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
    <div style={{width: "300px"}}>
      <div ref={ref}></div>
    </div>
    )
}
