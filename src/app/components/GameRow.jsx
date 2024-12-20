/* eslint-disable */
'use client'
import Link from 'next/link';

import Image from 'next/image';
import React from 'react';
const GameRow = ({ appID, gameName, date, price, requiredAge, estimatedOwners, onDelete}) => {

  const handleButtonClick = (e) => {
    e.stopPropagation();
    e.nativeEvent.preventDefault();
    e.nativeEvent.stopImmediatePropagation();

    onDelete();
  };
  
  return (
  <div className='flex items-center justify-between rounded-lg shadow-md p-4 mt-6 hover:bg-opacity-90 outline outline-1 hover:outline-gray-700'>
  <div className='h-24 font-bold grid grid-cols-7 text-xl w-full'>

    <div className='flex justify-center items-center italic'>{appID}</div>
    <div className='flex justify-center items-center'>{gameName}</div>
    <div className='flex justify-center items-center'>{date}</div>
    <div className='flex justify-center items-center'>{price}</div>
    <div className='flex justify-center items-center'>{requiredAge}</div>
    <div className='flex justify-center items-center'>{estimatedOwners}</div>

    <div className='flex space-x-2'>
    <div className='flex gap-5 items-center'>

      <Link href={`/edit/${appID}`} className='btn border-none hover:bg-opacity-90 w-24 bg-yellow-500 h-10 flex items-center justify-center rounded outline outline-1 z-30'>
        
      <Image
        className='mr-2'
        src="/EditIcon.png"
        alt="Edit"
        width={24}
        height={24}
      />
      </Link>
      
      <button onClick={handleButtonClick} className='btn border-none hover:bg-opacity-90  w-24 bg-red-500 h-10 flex items-center justify-center rounded outline outline-1 z-30'>
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
