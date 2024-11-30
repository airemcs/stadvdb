'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";

export default function Concurrency({ params }) {
  const [testType, setTestType] = useState('');
  const [testText, setTestText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [games, setGames] = useState({});
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const params2 = React.use(params)
  useEffect(() => {
    if (params2.id == 1) {
      setTestType("Read");
      setTestText("Concurrent transactions in two or more nodes are reading the same data item.");
    }
    if (params2.id == 2) {
      setTestType("Update/Read");
      setTestText("At least one transaction in the three nodes is writing (update / delete) and the other concurrent transactions are reading the same data item.");
    }
    if (params2.id == 3) {
      setTestType("Update");
      setTestText("Concurrent transactions in two or more nodes are writing (update / delete) the same data item.");
    }
  }, [params2]);

  const fetchGames = async () => {
    let response;
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        appId: appId || '10',
        testType
      });
  
      response = await fetch(`/api/testCases?${queryParams.toString()}`);
      
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
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
      <Link href="/" className="px-20 py-5 self-start btn border-none text-gray-900 hover:bg-gray-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500">
        Return
      </Link>
      <div className="text-3xl font-semibold mb-6 flex m-auto">Concurrency Test</div>
      <div className="text-xl mb-6 flex m-auto text-center">{testText}</div>
      <input
        maxLength="7"
        type="number"
        placeholder="Game"
        name="Game"
        className="text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded"
        value={appId}
        onChange={e => setAppId(e.target.value)}
      />
      <button
        onClick={handleStartTest}
        className="m-auto px-10 py-5 self-start btn border-none text-gray-900 hover:bg-green-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-green-500"
      >
        Start Test
      </button>
      {testStarted && games.main_node && games.main_node.games && (
        <div className="w-full lg:w-2/3 m-auto">
          <div className="grid grid-cols-4 items-center p-4 border-b border-black">
            <div className="font-bold text-center text-xl">Field</div>
            <div className="font-bold text-center text-xl">Main Node</div>
            <div className="font-bold text-center text-xl">Node 1</div>
            <div className="font-bold text-center text-xl">Node 2</div>
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