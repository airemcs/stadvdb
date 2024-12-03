'use client';
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';

// UpdateComponent as provided
function UpdateComponent({ gameData }) {
  return (
    <div className="text-center mt-5 p-4 border border-gray-300 rounded-md">
      <p className="text-lg font-bold">Update Component</p>
      <div className="mt-4">
        <div><strong>App ID:</strong> {gameData.AppID}</div>
        <div><strong>Name:</strong> {gameData.Name}</div>
        <div><strong>Release Date:</strong> {gameData.ReleaseDate}</div>
        <div><strong>Estimated Owners:</strong> {gameData.EstimatedOwners}</div>
        <div><strong>Peak CCU:</strong> {gameData.PeakCCU}</div>
        <div><strong>Required Age:</strong> {gameData.RequiredAge}</div>
        <div><strong>Price:</strong> {gameData.Price}</div>
        <div><strong>DLC Count:</strong> {gameData.DLCCount}</div>
        <div><strong>Website:</strong> <a href={gameData.Website} target="_blank">{gameData.Website}</a></div>
        <div><strong>Support Email:</strong> {gameData.SupportEmail}</div>
        <div><strong>Recommends:</strong> {gameData.Recommends}</div>
        <div><strong>Average Playtime:</strong> {gameData.AveragePlaytime}</div>
        <div><strong>Median Playtime:</strong> {gameData.MedianPlaytime}</div>
        <div><strong>Publishers:</strong> {gameData.Publishers}</div>
        <div><strong>Categories:</strong> {gameData.Categories}</div>
        <div><strong>Genres:</strong> {gameData.Genres}</div>
        <div><strong>Tags:</strong> {gameData.Tags}</div>
      </div>
    </div>
  );
}

export default function Failure({ params: paramsPromise }) {
  const params = React.use(paramsPromise);
  const [loading, setLoading] = useState(false);
  const [appID, setAppID] = useState('');
  const [testType, setTestType] = useState('read');
  const [nodeType, setNodeType] = useState('main_node');
  const [testStarted, setTestStarted] = useState(false);
  const [gameData, setGameData] = useState(null); // Updated for game data

  const fetchGame = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        appID: appID || '10',
        node: nodeType
      });

      const response = await fetch(`/api/failure?${queryParams.toString()}`);
      const data = await response.json();
      setGameData(data.game); // Save game data for update
    } catch (error) {
      console.error('Error fetching games:', error);
    } finally {
      setLoading(false);
      setTestStarted(true);
    }
  };

  const handleStartTest = () => {
    if (appID && testType === 'update') {
      fetchGame();
    }
  };

  return (
    <div className="flex flex-col py-10 m-20 gap-5">
      {loading && <p>Loading...</p>}
      <Link href="/" className="px-20 py-5 self-start btn border-none">Return</Link>
      <div className="text-3xl font-semibold mb-6 flex m-auto">Case #3 Simulation</div>

      <div className="flex flex-row items-center justify-center gap-x-8 h-10">
        <input
          maxLength="7"
          type="number"
          placeholder="App ID"
          className="text-white text-lg py-3 bg-transparent m-auto outline outline-1 outline-white text-center rounded w-full h-full"
          onChange={(e) => setAppID(e.target.value)}
        />
        <select value={testType} onChange={(e) => setTestType(e.target.value)} className="border border-white rounded-md h-full text-black w-full text-center basis-1/2">
          <option value="read">Read</option>
          <option value="update">Update</option>
        </select>
        <button onClick={handleStartTest} disabled={!appID} className="bg-green-500 hover:bg-green-400 text-white">
          Start Test
        </button>
      </div>

      {testStarted && gameData && testType === 'update' && <UpdateComponent gameData={gameData} />}
    </div>
  );
}
