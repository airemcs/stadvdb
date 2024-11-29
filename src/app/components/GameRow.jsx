import Image from 'next/image';
import React from 'react';

const GameRow = ({ appID, gameName, date, price, requiredAge, estimatedOwners }) => {
  return (
    <div className='flex items-center justify-between bg-dark-green-C rounded-lg shadow-md p-4 mt-6 hover:bg-opacity-90 bg-red-500'>
      <div className='h-24 font-bold grid grid-cols-7 text-white text-xl w-full'>
        <div className='flex justify-center items-center italic'>{appID}</div>
        <div className='flex justify-center items-center'>{gameName}</div>
        <div className='flex justify-center items-center'>{date}</div>
        <div className='flex justify-center items-center'>{price}</div>
        <div className='flex justify-center items-center'>{requiredAge}</div>
        <div className='flex justify-center items-center'>{estimatedOwners}</div>
        <div className='flex space-x-2'>
          <div className='flex gap-5 items-center'>
            <button className='btn border-none hover:bg-yellow-700 w-24 bg-light-green h-10 flex items-center justify-center rounded'>
            <Image
                className='mr-2'
                src="/EditIcon.png"
                alt="Edit"
                width={24}
                height={24}
              />
            </button>
            <button className='btn border-none hover:bg-yellow-700  w-24 bg-light-green h-10 flex items-center justify-center rounded'>
              <Image
                  className='mr-2'
                  src="/DeleteIcon.png"
                  alt="Delete"
                  width={24}
                  height={24}
                />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameRow;
