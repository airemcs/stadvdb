'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import React from "react";

const data = [
  {
    "Type": "Read",
    "Nodes": [
      {
        "AppID": "1002310",
        "Name": "The Childs Sight",
        "ReleaseDate": "2019-03-28",
        "EstimatedOwners": "20000",
        "PeakCCU": 0,
        "RequiredAge": 0,
        "Price": 9.99,
        "DLCCOUNT": 0,
        "Website": "",
        "SupportEmail": "support@forever-entertainment.com",
        "Recommends": 0,
        "AveragePlaytime": 0,
        "MedianPlaytime": 0,
        "Publishers": "Forever Entertainment S. A.",
        "Categories": "Single-player",
        "Genres": "Action, Adventure, Casual, Indie, Simulation",
        "Tags": "Indie, Action, Casual, Adventure, Simulation, Horror"
      },
      {
        "AppID": "2002310",
        "Name": "Node 1 Example",
        "ReleaseDate": "2021-03-28",
        "EstimatedOwners": "30000",
        "PeakCCU": 20,
        "RequiredAge": 18,
        "Price": 19.99,
        "DLCCOUNT": 1,
        "Website": "http://example.com",
        "SupportEmail": "contact@example.com",
        "Recommends": 5,
        "AveragePlaytime": 60,
        "MedianPlaytime": 30,
        "Publishers": "Example Publisher",
        "Categories": "Multiplayer",
        "Genres": "RPG, Strategy",
        "Tags": "RPG, Strategy, Multiplayer"
      },
      {
        "AppID": "2002310",
        "Name": "Node 1 Example",
        "ReleaseDate": "2021-03-28",
        "EstimatedOwners": "30000",
        "PeakCCU": 20,
        "RequiredAge": 18,
        "Price": 19.99,
        "DLCCOUNT": 1,
        "Website": "http://example.com",
        "SupportEmail": "contact@example.com",
        "Recommends": 5,
        "AveragePlaytime": 60,
        "MedianPlaytime": 30,
        "Publishers": "Example Publisher",
        "Categories": "Multiplayer",
        "Genres": "RPG, Strategy",
        "Tags": "RPG, Strategy, Multiplayer"
      },
    ]
  },
];

export default function Concurrency({ params }) {
  const [testType, setTestType] = useState('');
  const [testText, setTestText] = useState('');
  const [testStarted, setTestStarted] = useState(true);
  const [games, setGames] =useState({})
  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          limit: 1,
        }).toString();

        const response = await fetch(`/api/games?${queryParams}`);
        const data = await response.json();
        setGames(data.games);
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  });


  const params2 = React.use(params);
  useEffect(() => {
    if (params2.id == 1) {
      setTestType("Read")
      setTestText("Concurrent transactions in two or more nodes are reading the same data item.")
    }
    if (params2.id == 2) {
      setTestType("Update/Read")
      setTestText("At least one transaction in the three nodes is writing (update / delete) and the other concurrent transactions are reading the same data item.")
    }
    if (params2.id == 3) {
      setTestType("Update")
      setTestText("Concurrent transactions in two or more nodes are writing (update / delete) the same data item.")
    }
  }, [params2]);

  const startTest = () => {
    setTestStarted(!testStarted);
  };

  return (
    <div className="flex flex-col py-10 m-20 gap-5">
      <Link href="/" className="px-20 py-5 self-start btn border-none text-gray-900 hover:bg-gray-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500">
        Return
      </Link>
      <div className="text-3xl font-semibold mb-6 flex m-auto">Concurrency Test</div>
      <div className="text-xl mb-6 flex m-auto text-center">{testText}</div>
      <input maxLength="7" type="number" placeholder="Game" name="Game" className='text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded'/>
      <button onClick={startTest} className="m-auto px-10 py-5 self-start btn border-none text-gray-900 hover:bg-green-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-green-500">Start Test</button>
      {testStarted && data.map((typeData, typeIndex) => (
        <div key={typeIndex} className="w-full lg:w-2/3 m-auto">
          <div className="grid grid-cols-4 items-center p-4 border-b border-black">
            <div className="font-bold text-center text-xl">Type</div>
            <div className="font-bold text-center text-xl">Main Node</div>
            <div className="font-bold text-center text-xl">Node 1</div>
            <div className="font-bold text-center text-xl">Node 2</div>
          </div>
          {Object.keys(typeData.Nodes[0]).map((field, i) => (
            <div key={i} className="grid grid-cols-4 items-center p-4 border-b border-black">
              <div className="font-bold text-center">{field}</div>
              {typeData.Nodes.map((node, nodeIndex) => (
                <div key={nodeIndex} className="text-center">{node[field]}</div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}