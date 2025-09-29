import React, { useEffect, useRef } from 'react'
import NaverMap, { type MapInfo } from './NaverMap';



const MapPage = () => {
  
  const mapInfo : MapInfo = {
    markers:[
      { lat: 37.5665, lng: 126.9780, title: "서울시청" , infoWindow: (<div style={{backgroundColor:'white', height:'120px'}}>test</div>)},
      { lat: 37.5700, lng: 126.9830, title: "경복궁" , infoWindow: (<div>test2</div>)},
      { lat: 37.5512, lng: 126.9882, title: "남산타워" , infoWindow: (<div>test3</div>)},
    ],
    direction:[
      { lat: 37.5665, lng: 126.9780, title: "서울시청" },
      { lat: 37.5700, lng: 126.9830, title: "경복궁" },
      { lat: 37.5512, lng: 126.9882, title: "남산타워" },
    ]
  }
  

  return (
    <div
      style={{
        width:'700px',
        height:'700px'
      }}
      >
      <NaverMap 
        markers={mapInfo.markers}
        direction={mapInfo.direction}
      />
    </div>
  );
};

export default MapPage
