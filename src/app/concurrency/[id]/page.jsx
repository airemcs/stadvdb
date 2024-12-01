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

  const fetchGames = async () => {
    setTestStarted(false)
    let response;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        appId: appId || '10',
        testType,
        isolationLevel: selectedIsolationLevel 
      });

      response = await fetch(`/api/testCases?${queryParams.toString()}`);

      const data = await response.json();
      setTransactionTime(data.transactionTime);
      setdbIsolationLevel(data.isolationLevel)
      setGames(data.totalGames);
    } catch (error) {
      console.error('Error fetching games:', error);
    }
    setTestStarted(true)
    setLoading(false);
  };

  const handleStartTest = () => {
    setTestStarted(true);
    fetchGames();
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
      <Link
        href="/"
        className="px-20 py-5 self-start btn border-none text-gray-900 hover:bg-gray-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500"
      >
        Return
      </Link>
      <div className="text-3xl font-semibold mb-6 flex m-auto">Concurrency Test Case {params.id}</div>
      <div className="text-xl mb-6 flex m-auto text-center">{testText}</div>
      <input
        maxLength="7"
        type="number"
        placeholder="Game"
        name="Game"
        className="text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded"
        value={appId}
        onChange={(e) => setAppId(e.target.value)}
      />

      <button
        onClick={handleStartTest}
        className="m-auto px-10 py-5 self-start btn border-none text-gray-900 hover:bg-green-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-green-500"
      >
        Start Test
      </button>
      <div className="grid grid-cols-3 items-center justify-center mx-10">
        <div className="text-xl mb-6 flex m-auto text-center w-[200px]">{transactionTime}</div>
        <div className="text-xl mb-6 flex m-auto mt-2 text-center w-[200px]">
        <select
          value={selectedIsolationLevel}
          onChange={(e) => setSelectedIsolationLevel(e.target.value)}
          className="border border-white rounded-md py-2 px-3 text-black w-[500px] text-center"
        >
          {isolationLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
        <div className="text-xl mb-6 flex m-auto text-center">{dbIsolationLevel}</div>
      </div>
      {testStarted && games.main_node && games.main_node.games && (
        <div className="w-full lg:w-2/3 m-auto">
          <div className="grid grid-cols-4 items-center p-4 border-b border-black">
            
          </div>
        </div>
      )}
    </div>
  );
}