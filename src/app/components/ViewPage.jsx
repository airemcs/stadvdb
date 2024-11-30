import Link from 'next/link';
import React, { useEffect, useState } from 'react';

const ViewPage = ({ AppID }) => {
  const [gameData, setGameData] = useState(null);
  const fetchGameData = async () => {
    try {
      const gameId = AppID.id;
      const response = await fetch(`/api/games?appId=${gameId}`);
      if (!response.ok) {
        throw new Error(`Error fetching game: ${response.statusText}`);
      }
      const data = await response.json();
      setGameData(data.games[0]); 
    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  useEffect(() => {
    fetchGameData();
  }, []);

  if (!gameData) {
    return <div>   
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
        <div className="bg-white p-5 rounded-md shadow-xl">
          <p className="text-gray-800">Loading...</p>
        </div>
      </div>
   </div>; 
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl bg-gray-400 p-8 rounded-lg shadow-lg space-y-8">
      <div className="flex items-center justify-between mb-8">
          <Link href="/" className="btn border-none text-gray-900 hover:bg-gray-400 w-24 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500">
            Return
          </Link>
          <div className="text-gray-700 text-lg font-medium">
            <span>App ID: </span>
            <span className="font-bold text-gray-900">{gameData.AppID}</span>
          </div>
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Name</p>
              <p className="text-gray-900 text-lg">{gameData.Name}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Release Date</p>
              <p className="text-gray-900 text-lg">{gameData.ReleaseDate}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Estimated Owners</p>
              <p className="text-gray-900 text-lg">{gameData.EstimatedOwners}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Peak CCU</p>
              <p className="text-gray-900 text-lg">{gameData.PeakCCU}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Required Age</p>
              <p className="text-gray-900 text-lg">{gameData.RequiredAge}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Price</p>
              <p className="text-gray-900 text-lg">{gameData.Price}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">DLCCOUNT</p>
              <p className="text-gray-900 text-lg">{gameData.DLCCOUNT}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Average Playtime</p>
              <p className="text-gray-900 text-lg">{gameData.AveragePlaytime}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Average Playtime</p>
              <p className="text-gray-900 text-lg">{gameData.MedianPlaytime}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Genres</p>
              <p className="text-gray-900 text-lg">{gameData.Genres}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Tags</p>
              <p className="text-gray-900 text-lg">{gameData.Tags}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Categories</p>
              <p className="text-gray-900 text-lg">{gameData.Categories}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Website</p>
              {gameData.Website && <p clas text-lgs className="text-gray-900 break-words">{gameData.Website}</p>}
              {!gameData.Website && <p className="text-gray-900 break-words">NA</p>}
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Support Email</p>
              <p className="text-gray-900  text-lgbreak-words">{gameData.SupportEmail}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Publishers</p>
              <p className="text-gray-900 text-lg">{gameData.Publishers}</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold text-2xl italic">Recommends</p>
              <p className="text-gray-900 text-lg">{gameData.Recommends}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPage;