import type { Place } from '@/api/place';
import InstaViewer, { getPlaceURL } from '@/components/common/InataViewer'
import React from 'react'

interface PlaceDetailProps {
  place: Place|null;
  setCurrentPlace: (place: Place | null) => void;
}

const PlaceDetail = ({place, setCurrentPlace}: PlaceDetailProps) => {

  

  return (
    place ? (
          <div className='z-999 fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black/30' onClick={() => setCurrentPlace(null)}>
            <div className='w-[650px] h-fit bg-white flex flex-col gap-2 justify-between p-2 border-2 border-blue-300 rounded-md' onClick={(e) => e.stopPropagation()}>
              <div className='w-full h-full flex gap-2'>
                <div className='w-[350px] h-[650px] overflow-hidden'>
                  <InstaViewer url={getPlaceURL(place.website ?? '')} width={300}/>
                </div>
                <div className='w-[300px] flex flex-col gap-2'>
                  <div className=''>
                    <div className='text-lg font-bold'>
                      {place.name}
                    </div>
                    <div className='text-sm text-gray-500'>
                      {place.address}
                    </div>
                  </div>
                  <div className='text-sm text-gray-800 whitespace-pre-wrap wrap-break-word h-[550px] overflow-y-auto'>
                    {place.description}
                  </div>
                </div>
              </div>
              <button onClick={() => setCurrentPlace(null)} className='bg-blue-400 hover:bg-blue-500 font-bold text-white px-4 py-2 rounded-md'>닫기</button>
        </div>
      </div>
    ) : (
      <></>
    )
  )
}

export default PlaceDetail
