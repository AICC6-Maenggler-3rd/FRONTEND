import { getPlaceList, type Place } from '@/api/place';
import InstaViewer from '@/components/common/InataViewer';
import React, { useEffect, useState } from 'react'


const PlaceList = () => {
  const [placeList, setPlaceList] = useState<Place[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPlace, setCurrentPlace] = useState<Place | null>(null);

  useEffect(() => {
    const fetchPlaceList = async () => {
      const res = await getPlaceList(currentPage, 10);
      setPlaceList(res.data);
      setTotalPages(res.total_pages);
    };
    fetchPlaceList();
  }, []);


  const handleMore = async () => {
    const res = await getPlaceList(currentPage + 1, 10);
    setPlaceList([...placeList, ...res.data]);
    setCurrentPage(currentPage + 1);
  }

  const handlePlaceClick = (place: Place) => {
    setCurrentPlace(place);
  }

  const getPlaceURL = (place: Place) => {
    const base_url = 'https://www.instagram.com/';
    const strings = place.website?.split('/');
    if (!strings) {
      return '';
    }
    if (strings.length < 5) {
      return '';
    }
    console.log(base_url + strings[4] + '/' + strings[5]);
    return base_url + strings[4] + '/' + strings[5];
  }

  return (
    <div>
      {
        currentPlace && (
          <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center bg-black/30' onClick={() => setCurrentPlace(null)}>
            <div className='w-[650px] h-[calc(100vh-10rem)] bg-white flex flex-col gap-2 justify-between p-2 border-2 border-blue-300 rounded-md' onClick={(e) => e.stopPropagation()}>
              <div className='w-full h-[650px] flex gap-2'>
                <InstaViewer url={getPlaceURL(currentPlace)} width={300}/>
                <div className='w-[300px] flex flex-col gap-2'>
                  <div>
                    <div className='text-lg font-bold'>
                      {currentPlace.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {currentPlace.address}
                    </div>
                  </div>
                  <div className='text-sm text-gray-800 whitespace-pre-wrap h-[550px] overflow-y-auto'>
                    {currentPlace.description}
                  </div>
                </div>
              </div>
              <button onClick={() => setCurrentPlace(null)} className='bg-blue-400 text-white px-4 py-2 rounded-md'>닫기</button>
            </div>
          </div>
        )
      }
      <div className='mt-20'>
        <h1>장소 목록</h1>
        <div className='flex flex-col gap-2 w-[350px] px-2 overflow-y-auto h-[calc(100vh-10rem)]'>
          {placeList?.map((place) => (
            <div key={place.place_id} className='flex items-center gap-2 justify-between'>
              <div className='px-4 py-2 flex flex-col gap-2'>
                <div className='text-lg font-bold w-[180px] truncate'>
                  {place.name}
                </div>
                <div className='text-sm text-gray-500 rounded-full bg-gray-100 px-2 py-1 w-fit'>
                  {place.type}
                </div>
              </div>
              <button onClick={() => handlePlaceClick(place)} className='bg-blue-400 text-white px-4 py-2 rounded-md'>
                상세
              </button>
            </div>
          ))}
          <button onClick={handleMore} className='text-center text-lg font-bold border-2 border-blue-300 m-2 p-4 rounded-sm'>
            더보기
          </button>
        </div>
        
      </div>
    </div>
  )
}

export default PlaceList
