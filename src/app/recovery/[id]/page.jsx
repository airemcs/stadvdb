'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

export default function Recovery({ params }) {
  const [testType, setTestType] = useState('read'); // for the RUD operations
  const [node, setNode] = useState('main_node'); // for the node
  const [releasedYear,setReleasedYear] = useState();
  const [status,setStatus] = useState([]);

  const [testText, setTestText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [game, setGame] = useState({});
  const [appId, setAppId] = useState('');

  const [loading, setLoading] = useState(false);
  const [transactionTime, setTransactionTime] = useState('');
  const RUDoperations = ['read', 'update', 'delete'];
  const validNodes = ['main_node', 'node_1', 'node_2'];

  const [gameDetails, setGameDetails] = useState({
    gamename: '',
    releaseDate: '',
    price: 0.0,
  });

  const params2 = React.use(params);

  useEffect(() => {
    if (params2.id == 1) {
      setTestText('One of the nodes is unavailable during the execution of a transaction and then eventually comes back online.');
    }
  }, [params2]);

  // for reading games
  const fetchgameDetails = async () => {
    try {
      const gameId = appId;

      const response = await fetch(`/api/specificgames?appId=${gameId}`,{
        method: 'GET'
      });

      if (!response.ok) {
        throw new Error(`Error fetching game: ${response.statusText}`);
      }
      const data = await response.json();

      console.log(data.games.ReleaseDate)

      const date = data.games.ReleaseDate.split('-');

      console.log(Number(date[0]))

      setReleasedYear(Number(date[0]));

    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };

  const fetchGames = async () => {
    setTestStarted(false)
    let response;

    try {
      setLoading(true);
      console.log(releasedYear);
      const queryParams = new URLSearchParams({
        appId: appId || '10',
        testType,
        isolationLevel: "ReadCommitted",
        node: node,
        releasedYear: releasedYear
      });

      response = await fetch(`/api/step3testCases?${queryParams.toString()}`,
        {method: 'GET'});

      const data = await response.json();

      setGame(data.game);
      setTransactionTime(data.transactionTime);
      setStatus(data.status);

    } catch (error) {
      console.error('Error fetching games:', error);
    }
    setTestStarted(true)
    setLoading(false);
  };

  const updateGame = async() => {
    setLoading(true);
    try {
      const response = await fetch(`/api/specificgames`, {
        method: 'PUT',
        
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          node: node,
          id: appId, // Make sure appId is defined and valid
          name: gameDetails.gamename,
          price: gameDetails.price
        }),
      });
  
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        console.log('Games saved successfully:', data);
        setProposalFields(data.proposal); 
        isConfirmOpen(false);
      } else {
        console.error('Error saving games:', data.message);
      }
    } catch (error) {
      console.error('Error during save games process:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
    
    if(testType == "read"){
        console.log("reading...")
        fetchgameDetails();
        fetchGames();
    }else if(testType == "update"){
        console.log("updating...")
        updateGame();
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
      <Link
        href="/"
        className="px-20 py-5 self-start btn border-none text-gray-900 hover:bg-gray-400 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-500"
      >
        Return
      </Link>
      <div className="text-3xl font-semibold mb-6 flex m-auto">Recovery Test Case 1 / 2</div>
      <div className="text-xl mb-6 flex m-auto text-center">{testText}</div>
      <input
        maxLength="7"
        type="number"
        placeholder="AppId"
        name="Game"
        className="text-white text-xl py-3 bg-transparent m-auto outline-double outline-white text-center rounded"
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
          value={node}
            onChange={(e) => setNode(e.target.value)}
          className="border border-white rounded-md py-2 px-3 mr-4 text-black w-[500px] text-center"
        >
          {validNodes.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
          
        </select>

        <select
          value={testType}
            onChange={(e) => setTestType(e.target.value)}
          className="border border-white rounded-md py-2 px-3 text-black w-[500px] text-center"
        >
          {RUDoperations.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
          
        </select>
      </div>
        <div>
          <div className="text-xl mb-6 flex m-auto text-center">{testType}</div>
          <div className="text-xl mb-3 flex m-auto text-center"> Logs: </div>
          {status.map((item, index) => (
            <div key={index} className="text-md mb-2 flex">{index + 1} - {item}</div>
          ))}
          <div className="text-xl mb-6 flex m-auto text-center">{node}</div>
          
        </div>
        
      </div>
      
      {testStarted && game && testType === 'read' &&(
        <div className="space-y-6">
        <div className="grid grid-cols-3 gap-">
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Name</p>
            <p className="text-gray-900 text-lg">{game.Name}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Release Date</p>
            <p className="text-gray-900 text-lg">{game.ReleaseDate}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Estimated Owners</p>
            <p className="text-gray-900 text-lg">{game.EstimatedOwners}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Peak CCU</p>
            <p className="text-gray-900 text-lg">{game.PeakCCU}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Required Age</p>
            <p className="text-gray-900 text-lg">{game.RequiredAge}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Price</p>
            <p className="text-gray-900 text-lg">{game.Price}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">DLCCOUNT</p>
            <p className="text-gray-900 text-lg">{game.DLCCOUNT}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Average Playtime</p>
            <p className="text-gray-900 text-lg">{game.AveragePlaytime}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Average Playtime</p>
            <p className="text-gray-900 text-lg">{game.MedianPlaytime}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Genres</p>
            <p className="text-gray-900 text-lg">{game.Genres}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Tags</p>
            <p className="text-gray-900 text-lg">{game.Tags}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Categories</p>
            <p className="text-gray-900 text-lg">{game.Categories}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Website</p>
            {game.Website && <p clas text-lgs className="text-gray-900 break-words">{game.Website}</p>}
            {!game.Website && <p className="text-gray-900 break-words">NA</p>}
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Support Email</p>
            <p className="text-gray-900  text-lgbreak-words">{game.SupportEmail}</p>
          </div>
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Publishers</p>
            <p className="text-gray-900 text-lg">{game.Publishers}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-gray-700 font-semibold text-2xl italic">Recommends</p>
            <p className="text-gray-900 text-lg">{game.Recommends}</p>
          </div>
        </div>
      </div>
      )}


      {game && testType === 'update' &&(
          <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg space-y-8">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Price
              </div>
              <input 
                type="text" 
                value={gameDetails.price} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                  onChange={(e) => 
                    setGameDetails((prevDetails) => ({
                      ...prevDetails,       // Copy all existing properties
                      price: e.target.value // Override the specific property
                    }))                  
                  } 
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Name: 
              </div>
              <input 
                type="text" 
                value={gameDetails.gamename} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                  onChange={(e) => 
                    setGameDetails((prevDetails) => ({
                      ...prevDetails,       // Copy all existing properties
                      gamename: e.target.value // Override the specific property
                    }))                  
                  } 
              />
            </div>
          
          </div>

      )}
      
    </div>
  );
}