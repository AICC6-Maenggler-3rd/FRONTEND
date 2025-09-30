declare global {
  interface Window {
    naver: any;
  }

  interface Window {
    kakao: any;
  }
}

declare namespace naver.maps {
  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class CustomOverlay extends OverlayView {
    constructor(options: {
      position: LatLng | Coord | Point | Array<number>;
      content: string | HTMLElement;
      xAnchor?: number;
      yAnchor?: number;
      zIndex?: number;
      map?: Map | null;
    });

    setMap(map: Map | null): void;
    getMap(): Map | null;
    setContent(content: string | HTMLElement): void;
  }
}

export {};