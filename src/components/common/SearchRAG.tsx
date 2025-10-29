import { searchPlaceRAG, type Place } from '@/api/place';
import React, { useEffect, useState } from 'react'
import InstaViewer, { getPlaceURL } from './InataViewer';

const SearchRAG = ({ onClose }: { onClose: () => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [openIndex, setOpenIndex] = useState(-1);
  const [instaUrl, setInstaUrl] = useState('');
  

  useEffect(() => {
    if (placeList.length > 0) {
      handleOpenIndex(placeList[0].website ?? '', placeList[0].place_id);
    }
  }, [placeList]);
  const handleSearch = async () => {
    const res = await searchPlaceRAG(searchQuery, 10);
    setPlaceList(res.places);
    console.log(res);
  }

  const handleOpenIndex = (url: string, index: number) => {
    setOpenIndex(index);
    setInstaUrl(getPlaceURL(url));
  }

  return (
        <div
        className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40"
        onClick={onClose}
      >
        <div
          className={
            `relative w-[860px] max-w-[90vw] ${placeList.length > 0 ? "max-h-[90vh]" : "max-h-[200px]"} bg-white rounded-xl shadow-xl border border-gray-200 flex flex-col transition-all duration-300 ease-out overflow-hidden`
          }
          onClick={(e) => e.stopPropagation()}
        >
          {/* 헤더 */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-start justify-between">
              <h2 className="text-2xl font-semibold">
                여행지 추천
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
      <div className='flex items-center gap-2 py-2 px-4 h-[100px] w-full'>
        <input type="text" placeholder='검색' className='w-[calc(100%-100px)] p-2 border-2 border-gray-300 rounded-md' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} className='p-2 border-2 border-gray-300 rounded-md w-[100px]'>검색</button>
      </div>
          {/* 본문 - 스크롤 가능한 영역 */}
          <div className="flex px-6 pb-16">
            <div className='w-1/2 overflow-y-auto h-[600px] flex flex-col gap-2'>
              {placeList.map((place) => (
                <div key={place.place_id} className={`shadow-md py-4 rounded-md flex flex-col gap-2 w-full h-[100px] cursor-pointer hover:bg-gray-100 transition-all duration-300 ease-out ${openIndex === place.place_id ? 'bg-gray-100' : ''}`}>
                  <div onClick={() => handleOpenIndex(place.website ?? '', place.place_id)} className='px-4'>
                    <h3 className='text-lg font-bold'>{place.name}</h3>
                    <p className='text-sm text-gray-500'>{place.address}</p>
                    <p className='text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit'>{place.type}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className='w-1/2 h-[750px]'>
              {instaUrl && (
                <div className='w-full h-[750px] px-4 flex gap-2 justify-center items-center'>
                    <InstaViewer url={instaUrl}/>
                </div>
              )}
            </div>
          </div>
  
          {/* 하단 닫기 */}
          {
            placeList.length > 0 && (
              <div className="absolute right-4 bottom-4">
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-md bg-gray-700 text-white hover:bg-gray-800"
                >
                  닫기
                </button>
              </div>
            )
          }
        </div>
      </div>
  )
}

export default SearchRAG
