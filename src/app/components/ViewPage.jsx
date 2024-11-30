import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ViewPage = ({ AppID }) => {
  const [gameData, setGameData] = useState(null);

  const fetchGameData = async () => {
    try {
      const gameId = AppID.id;
      const response = await fetch(`/api/games?AppID=${gameId}`);
      if (!response.ok) {
        throw new Error(`Error fetching game: ${response.statusText}`);
      }
      const data = await response.json();
      setGameData(data); 
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  if (!gameData) {
    return <div>Loading...</div>; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg space-y-8">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="btn border-none text-gray-900 hover:bg-gray-300 w-24 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-200">
            Return
          </Link>
          <div className="text-gray-700 text-sm font-medium">
            <span>App ID: </span>
            <span className="font-bold text-gray-900">{gameData.AppID}</span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Name</p>
              <p className="text-gray-900">{gameData.Name}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Release Date</p>
              <p className="text-gray-900">{gameData.ReleaseDate}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Estimated Owners</p>
              <p className="text-gray-900">{gameData.EstimatedOwners}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Peak CCU</p>
              <p className="text-gray-900">{gameData.PeakCCU}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Required Age</p>
              <p className="text-gray-900">{gameData.RequiredAge}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Price</p>
              <p className="text-gray-900">${gameData.Price}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">DLCCOUNT</p>
              <p className="text-gray-900">{gameData.DLCCOUNT}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Average Playtime</p>
              <p className="text-gray-900">{gameData.AveragePlaytime} hours</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Median Playtime</p>
              <p className="text-gray-900">{gameData.MedianPlaytime} hours</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Genres</p>
              <p className="text-gray-900">{gameData.Genres}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Tags</p>
              <p className="text-gray-900">{gameData.Tags}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Categories</p>
              <p className="text-gray-900">{gameData.Categories}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Website</p>
              <p className="text-gray-900 break-words">{gameData.Website}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Support Email</p>
              <p className="text-gray-900 break-words">{gameData.SupportEmail}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Publishers</p>
              <p className="text-gray-900">{gameData.Publishers}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Recommends</p>
              <p className="text-gray-900">{gameData.Recommends}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;