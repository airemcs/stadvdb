'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

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

function DeleteComponent({ id, gameData, onConfirm }) {
  return (
    <div className="text-center mt-5 p-4 border border-red-300 rounded-md">
      <p className="text-lg font-bold text-red-600">Delete Component</p>
      <p>App ID: {id}</p>
      <p className="text-red-600">The application will be deleted.</p>
      <div>
        <strong>Name:</strong> {gameData.Name}
      </div>
      <div>
        <strong>Release Date:</strong> {gameData.ReleaseDate}
      </div>
      <div>
        <strong>Price:</strong> {gameData.Price}
      </div>
      <button onClick={onConfirm} className="mt-4 text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md">
        Confirm Deletion
      </button>
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
  const [game, setGame] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const operations = ['delete', 'update'];
  const validNodes = ['main_node', 'node_1', 'node_2'];

  const fetchGame = async () => {
    setTestStarted(false);
    let response;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        appID: appID || '10',
        node: nodeType
      });

      response = await fetch(`/api/failure?${queryParams.toString()}`, {
        method: 'GET'
      });

      const data = await response.json();
      setGame(data.game);
    } catch (error) {
      console.error('Error fetching games:', error);
    }

    setTestStarted(true);
    setLoading(false);
  };

  const handleStartTest = () => {
    if (testType === 'delete') {
      // Show the confirmation prompt for delete
      setShowConfirmation(true);
    } else {
      // Fetch the game data for update or other tests
      fetchGame();
    }
  };

  const handleConfirmDeletion = () => {
    // You can implement deletion logic here
    console.log("Confirmed Deletion for App ID:", appID);
    setShowConfirmation(false);
    setGame(null);
  };

  return (
    <>
      <div className="flex flex-col py-10 m-20 gap-5">
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-md shadow-xl">
              <p className="text-gray-800">Loading...</p>
            </div>
          </div>
        )}
        <Link href="/" className="px-20 py-5 self-start btn border-none text-gray-900 hover:bg-gray-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500">
          Return
        </Link>
        <div className="text-3xl font-semibold mb-6 flex m-auto">Case #3 Simulation</div>
        <div className="text-xl mb-6 flex m-auto text-center">
          The failure in writing to the central node when attempting to replicate the transaction from Node 2 or Node 3. [TODO: Remove me, 10090]
        </div>
        <div className="flex flex-row items-center justify-center gap-x-8 h-10">
          <input
            maxLength="7"
            type="number"
            placeholder="App ID"
            className="text-white text-lg py-3 bg-transparent m-auto outline outline-1 outline-white text-center rounded w-full h-full"
            onChange={(e) => setAppID(e.target.value)}
          />
          <select value={testType} onChange={(e) => setTestType(e.target.value)} className="border border-white rounded-md h-full text-black w-full text-center basis-1/2">
            {operations.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <select value={nodeType} onChange={(e) => setNodeType(e.target.value)} className="border border-white rounded-md h-full text-black w-full text-center basis-1/2">
            {validNodes.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <button onClick={handleStartTest} className="w-full h-full text-white hover:bg-green-400 flex items-center justify-center rounded-lg outline outline-1 bg-green-500">
            Start Test
          </button>
          {testType === 'update' && (
            <button
              onClick={fetchGame}
              className="w-full h-full text-white hover:bg-blue-400 flex items-center justify-center rounded-lg outline outline-1 bg-blue-500"
            >
              Update Table
            </button>
          )}
        </div>

        {game && testType === 'update' && <UpdateComponent gameData={game} />}
        {testType === 'delete' && game && !showConfirmation && <DeleteComponent id={appID} gameData={game} onConfirm={handleConfirmDeletion} />}
        {showConfirmation && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
            <div className="bg-white p-5 rounded-md shadow-xl">
              <p className="text-gray-800">Are you sure you want to delete this application?</p>
              <p><strong>Name:</strong> {game.Name}</p>
              <p><strong>Release Date:</strong> {game.ReleaseDate}</p>
              <p><strong>Price:</strong> {game.Price}</p>
              <div className="mt-4">
                <button onClick={handleConfirmDeletion} className="mr-4 bg-red-600 text-white px-4 py-2 rounded-md">Yes, Delete</button>
                <button onClick={() => setShowConfirmation(false)} className="bg-gray-600 text-white px-4 py-2 rounded-md">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
