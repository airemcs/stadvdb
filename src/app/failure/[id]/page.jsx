'use client';
import Link from 'next/link';
import { useState } from 'react';
import React from 'react';

function UpdateComponent({ gameData, testType, onUpdate, appendLog }) {
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
      // appendLog(`Saved updated data for Game ID ${formData.AppID}: Name - ${formData.Name}, Price - ${formData.Price}`);
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

function LogsComponent({ log }) {
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-md bg-gray-50">
      <h3 className="font-semibold text-lg">Logs</h3>
      <div className="mt-2 max-h-60 overflow-y-auto whitespace-pre-line">
        {log}
      </div>
    </div>
  );
}

export default function Failure({ params: paramsPromise }) {
  const [log, setLog] = useState('');
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

  const appendLog = (newLog) => {
    setLog((prevLog) => prevLog + '\n' + newLog);
  };

  const fetchGame = async () => {
    setTestStarted(false);
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        appID: appID || '10',
        node: nodeType,
      });

      appendLog(`RETRIEVING ${appID} FROM NODE ${nodeType}..`);
      const response = await fetch(`/api/failure?${queryParams.toString()}`, {
        method: 'GET',
      });

      console.log(response.status);

      if (response.status === 404) {
        appendLog(`FAIL.`);
      } else {
        appendLog(`SUCCESS!`);
      }

      const data = await response.json();
      setGame(data.game);
    } catch (error) {
      console.error('Error fetching game:', error);
    } finally {
      setLoading(false);
    }
    setTestStarted(true);
  };

  function doAlert(callback, delay) {
    setTimeout(callback, delay);
  }

  const handleDelete = async () => {
    try {

      const queryParams = new URLSearchParams({
        id: appID,
        node: nodeType,
        nodeStatuses: JSON.stringify(nodeStatuses),
      });

      if (!nodeStatuses.main_node || !nodeStatuses.node_1 || !nodeStatuses.node_2) {

        if (!nodeStatuses.main_node) {
          appendLog(`DELETING ${game.AppID} ON NODE ${nodeType}..`);
          appendLog(`SUCCESS!`);
          doAlert(() => alert('Game deleted successfully!'), 2000);
          appendLog(`DELETING ${game.AppID} ON NODE master_node..`);
          appendLog(`FAIL`);
          appendLog(`CREATING ${game.AppID} ON NODE ${nodeType}..`);
          appendLog(`SUCCESS!`);
          doAlert(() => alert('Game created successfully!'), 4000);
          return;
        } else {
      
          const releaseDate = new Date(game.ReleaseDate);
          const releaseYear = releaseDate.getFullYear(); 
      
          if (releaseYear < 2010 && !nodeStatuses.node_1) {
            appendLog(`DELETING ${game.AppID} ON NODE ${nodeType}..`);
            appendLog(`SUCCESS.`);
            doAlert(() => alert('Game deleted successfully!'), 2000);
            appendLog(`DELETING ${game.AppID} ON NODE node_1..`);
            appendLog(`FAIL.`);
            appendLog(`CREATING ${game.AppID} ON NODE main_node..`);
            appendLog(`SUCCESS!`);
            doAlert(() => alert('Game created successfully!'), 4000);
            return;
          } else if (releaseYear >= 2010 && !nodeStatuses.node_2) {
            appendLog(`DELETING ${updatedGame.AppID} ON NODE ${nodeType}..`);
            appendLog(`SUCCESS.`);
            doAlert(() => alert('Game deleted successfully!'), 2000);
            appendLog(`DELETING ${updatedGame.AppID} ON NODE node_2..`);
            appendLog(`FAIL.`);
            appendLog(`CREATING ${game.AppID} ON NODE main_node..`);
            appendLog(`SUCCESS!`);
            doAlert(() => alert('Game created successfully!'), 4000);
            return;
          }
      
        }
      }

      appendLog(`DELETING ${appID} ON NODE ${nodeType}..`);
      const response = await fetch(`/api/failure?${queryParams.toString()}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error deleting game:', errorText);
        alert('Failed to delete game: ' + errorText);
        return;
      }

      alert('Game deleted successfully!');
      appendLog(`SUCCESS!`);

      if (nodeType === 'main_node') {
        
        const releaseDate = new Date(game.ReleaseDate);
        const releaseYear = releaseDate.getFullYear();
        
        if (releaseYear < 2010) {
          appendLog(`DELETING ${game.AppID} ON NODE node_1..`);   
        } else {
          appendLog(`DELETING ${game.AppID} ON NODE node_2..`);
        }
      } else {
        appendLog(`DELETING ${game.AppID} ON NODE main_node..`);   
      }

      setGame(null);
      appendLog(`SUCCESS!`);

    } catch (error) {
      console.error('Error making delete request:', error);
      alert('An error occurred while deleting the game.');
    }
  };

  const handleStartTest = () => {
    if (testType === 'update' && appID) {
      fetchGame();
    } else if (testType === 'delete' && appID) {
      handleDelete();
    }
  };

  const handleUpdate = async (updatedGame) => {

    try {

      const queryParams = new URLSearchParams({
        node: nodeType,
        nodeStatuses: JSON.stringify(nodeStatuses),
      });

      if (!nodeStatuses.main_node || !nodeStatuses.node_1 || !nodeStatuses.node_2) {

        if (!nodeStatuses.main_node) {
          appendLog(`UPDATING ${updatedGame.AppID} ON NODE ${nodeType}..`);
          appendLog(`SUCCESS!`);
          doAlert(() => alert('Game updated successfully!'), 4000);
          appendLog(`UPDATING ${updatedGame.AppID} ON NODE master_node..`);
          appendLog(`FAIL`);
          appendLog(`REVERTING ${updatedGame.AppID} ON NODE ${nodeType}..`);
          appendLog(`SUCCESS!`);
          doAlert(() => alert('Game updated successfully!'), 4000);
          return;
        } else {

          const releaseDate = new Date(game.ReleaseDate);
          const releaseYear = releaseDate.getFullYear(); 

          if (releaseYear < 2010 && !nodeStatuses.node_1) {
            appendLog(`UPDATING ${updatedGame.AppID} ON NODE ${nodeType}..`);
            appendLog(`SUCCESS.`);
            doAlert(() => alert('Game updated successfully!'), 4000);
            appendLog(`UPDATING ${updatedGame.AppID} ON NODE node_1..`);
            appendLog(`FAIL.`);
            appendLog(`REVERTING ${updatedGame.AppID} ON NODE main_node..`);
            appendLog(`SUCCESS!`);
            doAlert(() => alert('Game updated successfully!'), 4000);
            return;
          } else if (releaseYear >= 2010 && !nodeStatuses.node_2) {
            appendLog(`UPDATING ${updatedGame.AppID} ON NODE ${nodeType}..`);
            appendLog(`SUCCESS.`);
            doAlert(() => alert('Game updated successfully!'), 4000);
            appendLog(`UPDATING ${updatedGame.AppID} ON NODE node_2..`);
            appendLog(`FAIL.`);
            appendLog(`REVERTING ${updatedGame.AppID} ON NODE main_node..`);
            appendLog(`SUCCESS!`);
            doAlert(() => alert('Game updated successfully!'), 4000);
            return;
          }

        }
      }

      appendLog(`UPDATING ${updatedGame.AppID} ON NODE ${nodeType}..`);
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
      appendLog(`SUCCESS!`);

      if (nodeType === 'main_node') {
        
        const releaseDate = new Date(data.game.ReleaseDate);
        const releaseYear = releaseDate.getFullYear();
        
        if (releaseYear < 2010) {
          appendLog(`UPDATING ${updatedGame.AppID} ON NODE node_1..`);   
        } else {
          appendLog(`UPDATING ${updatedGame.AppID} ON NODE node_2..`);
        }
      } else {
        appendLog(`UPDATING ${updatedGame.AppID} ON NODE main_node..`);   
      }

      appendLog(`SUCCESS!`);

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
          <UpdateComponent gameData={game} testType={testType} onUpdate={handleUpdate} appendLog={appendLog} />
        )}
        <LogsComponent log={log} />
      </div>
    </>
  );
}
