'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

export default function Concurrency({ params }) {
  const [testType, setTestType] = useState('');
  const [testText, setTestText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [games, setGames] = useState({});
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionTime, setTransactionTime] = useState('');
  const [selectedIsolationLevel, setSelectedIsolationLevel] = useState('ReadCommitted'); // Default level
  const isolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
  const [dbIsolationLevel, setdbIsolationLevel] = useState('ReadCommitted'); // Default level
  const [showInputs, setShowInputs] = useState(false)
  const [fetchOnlyA, setFetchOnlyA] = useState(false)
  const [gameName, setGameName] = useState('')
  const [gamePrice, setgamePrice] = useState('')


  const params2 = React.use(params);
  useEffect(() => {
    if (params2.id == 1) {
      setTestType('Read');
      setTestText('Concurrent transactions in two or more nodes are reading the same data item.');
    }
    if (params2.id == 2) {
      setTestType('Update/Read');
      setTestText('At least one transaction in the three nodes is writing (update / delete) and the other concurrent transactions are reading the same data item.');
    }
    if (params2.id == 3) {
      setTestType('Update');
      setTestText('Concurrent transactions in two or more nodes are writing (update / delete) the same data item.');
    }
  }, [params2]);

  const fetchGames = async (useFetchOnly = false) => {  
    setTestStarted(false);
    let response;
    try {
        setLoading(true);
        const queryParams = new URLSearchParams({
            appId: appId || '10',
            isolationLevel: selectedIsolationLevel,
        });

        if (params2.id === 1 || useFetchOnly) {
            setShowInputs(false);
            response = await fetch(`/api/testCases?${queryParams.toString()}`);
            setFetchOnlyA(false);  
        } else if (params2.id == 2 && !useFetchOnly) {
            response = await fetch(`/api/testCases`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: appId,
                    isolationLevel: selectedIsolationLevel,
                    name: gameName,
                    price: gamePrice,
                }),
            });
        } else {
          console.log("3")
        }
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setTransactionTime(data.transactionTime);
        setdbIsolationLevel(data.isolationLevel);
        setGames(data.totalGames);
        setGameName(data.totalGames.main_node.games.Name);
        setgamePrice(data.totalGames.main_node.games.Price);
        setAppId(data.totalGames.main_node.games.AppID)
    } catch (error) {
        console.error('Error fetching games:', error);
    }
    setTestStarted(true);
    setLoading(false);
};

   

const fetchOnly = async () => {
    await fetchGames(true); 
      setShowInputs(true);
};


  const handleStartTest = () => {
    if (params2.id == 1){
      setTestStarted(true);
      fetchGames();
    } else if (params2.id == 2) {
      fetchGames();
    } 
  };
  return (
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
      <div className="text-3xl font-semibold mb-6 flex m-auto">Concurrency Test Case {params.id}</div>
      <div className="text-xl mb-6 flex m-auto text-center">{testText}</div>
      <input
        maxLength="7"
        type="number"
        placeholder="GameID"
        name="Game"
        className="text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded"
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
      />
      <button onClick={fetchOnly} className="m-auto px-10 py-5 self-start btn border-none text-gray-900 hover:bg-green-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-green-500">
        Find Game
      </button>
      {params2.id == 2 && showInputs && <div className='m-auto flex gap-4'>
          <input
            maxLength="100"
            type="text"
            placeholder="Game Name"
            name="Game Name"
            className="text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded"
            value={gameName || ''} 
            onChange={(e) => setGameName(e.target.value)}
          />
          <input
            maxLength="7"
            type="number"
            placeholder="Price"
            name="Game"
            className="text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded"
            value={gamePrice}
            onChange={(e) => setgamePrice(e.target.value)}
          />

      </div>
      } 
      { params2.id == 2 && showInputs && <div className="grid grid-cols-3 items-center justify-center mx-10">
        <div className="text-xl mb-6 flex m-auto text-center w-[200px]">{transactionTime}</div>
        <div className="text-xl mb-6 flex m-auto mt-2 text-center">
          <div className='flex flex-row'>
          <select
          value={selectedIsolationLevel}
          onChange={(e) => setSelectedIsolationLevel(e.target.value)}
          className="border border-white rounded-md py-2 px-3 text-black w-[200px] text-center"
        >
          {isolationLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
        <button onClick={handleStartTest} className="ml-5 w-[200px] btn border-none text-gray-900 hover:bg-green-40 flex items-center justify-center rounded-lg outline outline-1 bg-green-500">
        Update Test
      </button>
          </div>
      </div>
      
      
        <div className="text-xl mb-6 flex m-auto text-center">{dbIsolationLevel}</div>
      </div>


      }
      
      {testStarted && games.main_node && games.main_node.games && (
        <div className="w-full lg:w-2/3 m-auto">
          <div className="grid grid-cols-4 items-center p-4 border-b border-black">
            <div className="font-bold text-center text-xl">Field</div>
            <div className="font-bold text-center text-xl">Main Node {params.id == 2 && <div>- Write -</div>}</div>
            <div className="font-bold text-center text-xl">Node 1 {params.id == 2 && <div>- Read -</div>}</div>
            <div className="font-bold text-center text-xl">Node 2 {params.id == 2 && <div>- Write -</div>}</div>
          </div>
          {Object.keys(games.main_node.games).map((field, i) => (
            <div key={i} className="grid grid-cols-4 items-center p-4 border-b border-black">
              <div className="font-bold text-center">{field}</div>
              <div className="text-center">{games.main_node.games[field]}</div>
              <div className="text-center">N/A</div> {/* Placeholder for Node 1 */}
              <div className="text-center">{games.node_2?.games ? games.node_2.games[field] : 'N/A'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}