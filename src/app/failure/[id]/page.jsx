'use client';
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';

function UpdateComponent({ gameData, testType, onUpdate }) {

  const [formData, setFormData] = useState({
    AppID: gameData.AppID || '',
    Name: gameData.Name || '',
    Price: gameData.Price || '',
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (onUpdate) {
      onUpdate(formData);
    }
  };

  return (
    <div className="text-center mt-5 p-4 border border-gray-300 rounded-md">
      <p className="text-lg font-bold">Update Component</p>
      <div className="mt-4">
        {testType === 'update' ? (
          <>
            <div>
              <strong>Name:</strong>
              <input
                type="text"
                placeholder={gameData.Name}
                value={formData.Name}
                onChange={(e) => handleInputChange('Name', e.target.value)}
                className="border p-2 ml-2 rounded mb-2"
              />
            </div>
            <div>
              <strong>Price:</strong>
              <input
                type="text"
                placeholder={gameData.Price}
                value={formData.Price}
                onChange={(e) => handleInputChange('Price', e.target.value)}
                className="border p-2 ml-2 rounded"
              />
            </div>
            <button
              onClick={handleSave}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Save
            </button>
          </>
        ) : (
          <>
            <div><strong>App ID:</strong> {gameData.AppID}</div>
            <div><strong>Name:</strong> {gameData.Name}</div>
            <div><strong>Price:</strong> {gameData.Price}</div>
          </>
        )}
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
  const [game, setGame] = useState(null);
  const [nodeStatuses, setNodeStatuses] = useState({
    main_node: true,
    node_1: true,
    node_2: true,
  });

  const operations = ['delete', 'update'];
  const validNodes = ['main_node', 'node_1', 'node_2'];

  const fetchGame = async () => {
    setTestStarted(false);
    let response;

    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        appID: appID || '10',
        node: nodeType,
      });

      response = await fetch(`/api/failure?${queryParams.toString()}`, {
        method: 'GET',
      });

      const data = await response.json();
      setGame(data.game);
    } catch (error) {
      console.error('Error fetching game:', error);
    }

    setTestStarted(true);
    setLoading(false);
  };

  const handleStartTest = () => {
    console.log('Node statuses:', nodeStatuses);
    if (testType === 'update' && appID) {
      fetchGame();
    }
  };

  const handleUpdate = async (updatedGame) => {
    console.log('Updated game data:', updatedGame);
  
    // Determine secondary and main node logic
    const isMainNode = nodeType === 'main_node';
    const secondaryNodes = validNodes.filter((node) => node !== 'main_node' && node !== nodeType);
  
    // Check secondary nodes' availability when updating from main_node
    if (isMainNode) {
      const unavailableNodes = secondaryNodes.filter((node) => !nodeStatuses[node]);
  
      if (unavailableNodes.length > 0) {
        alert(`Update failed: The following nodes are unavailable: ${unavailableNodes.join(', ')}`);
        return;
      }
    }
  
    // Check main node availability when updating from secondary node
    if (!isMainNode && !nodeStatuses['main_node']) {
      alert('Update failed: The main node is unavailable.');
      return;
    }
  
    try {
      const queryParams = new URLSearchParams({
        node: nodeType,
        nodeStatuses: JSON.stringify(nodeStatuses),
      });
  
      const response = await fetch(`/api/failure?${queryParams.toString()}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedGame),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error('Error updating game:', error);
        alert('Failed to update game: ' + error.message);
        return;
      }
  
      const data = await response.json();
      console.log('Game updated successfully:', data.game);
      setGame(data.game);
      alert('Game updated successfully!');
    } catch (error) {
      console.error('Error making update request:', error);
      alert('An error occurred while updating the game.');
    }
  };

  const toggleNodeStatus = (node) => {
    setNodeStatuses((prevState) => ({
      ...prevState,
      [node]: !prevState[node],
    }));
  };

  return (
    <>
      <div className="flex flex-col py-10 m-20 gap-5">
        <Link
          href="/"
          className="px-20 py-5 self-start btn border-none text-gray-900 hover:bg-gray-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500"
        >
          Return
        </Link>
        <div className="text-3xl font-semibold mb-6 flex m-auto">Case #3 Simulation</div>
        <div className="text-xl flex m-auto text-center">
          The failure in writing to the central node when attempting to replicate the transaction from Node 2 or Node 3.
        </div>

        <div className="flex justify-center items-center">
          {validNodes.map((node) => (
            <div
              key={node}
              className={`flex items-center space-x-4 p-4 rounded-lg transition duration-300 ${
                nodeStatuses[node] ? 'text-green-500 font-bold' : 'text-red-500'
              }`}
            >
              <label htmlFor={node} className="text-lg capitalize">
                {node.replace('_', ' ')}
              </label>
              <div className="relative">
                <input
                  type="checkbox"
                  id={node}
                  checked={nodeStatuses[node]}
                  onChange={() => toggleNodeStatus(node)}
                  className="hidden"
                />
                <div
                  className={`w-14 h-8 bg-gray-300 rounded-full p-1 cursor-pointer transition duration-300 ${
                    nodeStatuses[node] ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  onClick={() => toggleNodeStatus(node)}
                >
                  <div
                    className={`w-6 h-6 bg-white rounded-full shadow-md transition-all duration-300 ${
                      nodeStatuses[node] ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-row items-center justify-center gap-x-8 h-10">
          <input
            maxLength="7"
            type="number"
            placeholder="App ID"
            className="text-white text-lg py-3 bg-transparent m-auto outline outline-1 outline-white text-center rounded w-full h-full"
            onChange={(e) => setAppID(e.target.value)}
          />
          <select
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
            className="border border-white rounded-md h-full text-black w-full text-center basis-1/2"
          >
            {operations.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <select
            value={nodeType}
            onChange={(e) => setNodeType(e.target.value)}
            className="border border-white rounded-md h-full text-black w-full text-center basis-1/2"
          >
            {validNodes.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <button
            onClick={handleStartTest}
            className={`w-full h-full flex items-center justify-center rounded-lg outline outline-1 ${
              nodeStatuses[nodeType] ? 'bg-green-500 hover:bg-green-400 text-white' : 'bg-red-500 text-black cursor-not-allowed hover:bg-red-500'
            } transition duration-300`}
            disabled={!nodeStatuses[nodeType]}  // Disable the button if the node is unavailable
          >
            Start Test
          </button>
        </div>

        {testStarted && game && (
          <UpdateComponent
            gameData={game}
            testType={testType}
            onUpdate={handleUpdate}
          />
        )}

        {loading && <p className="text-center text-gray-500">Loading...</p>}
      </div>
    </>
  );
}
