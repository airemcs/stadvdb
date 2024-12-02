'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';

export default function Recovery({ params }) {

  const [testType, setTestType] = useState('read'); // for the RUD operations
  const [node, setNode] = useState('main_node'); // for the node
  const [releasedYear,setReleasedYear] = useState();
  const [status,setStatus] = useState([]);
  const [nodeRead,setNodeRead] = useState();

  const [testText, setTestText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [game, setGame] = useState({});
  const [appId, setAppId] = useState('');

  const [loading, setLoading] = useState(false);
  const [showlogs,setShowLogs] = useState(false);
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
  const changeReleasedYear = (dateConverted) =>{
    console.log("mark")
    return setReleasedYear(()=>dateConverted);
  }
  const fetchgameDetails = async () => {
    setTestStarted(false);
    setShowLogs(false);
    try {
      setLoading(true);
      const gameId = appId;

      // get the date of the game first
      const firstresponse = await fetch(`/api/specificgames?appId=${gameId}`,{
        method: 'GET'
      });

      if (!firstresponse.ok) {
        throw new Error(`Error fetching game: ${firstresponse.statusText}`);
      }

      const data1 = await firstresponse.json();

      console.log(data1.games.ReleaseDate)

      const date = data1.games.ReleaseDate.split('-');

      console.log(Number(date[0]));
      const dateConverted = Number(date[0]);
      
      changeReleasedYear(dateConverted);

      const queryParams = new URLSearchParams({
        appId: appId || '10',
        testType,
        isolationLevel: "ReadCommitted",
        node: node,
        releasedYear: dateConverted
      });

      const secondresponse = await fetch(`/api/step3testCases?${queryParams.toString()}`,
        {method: 'GET'});

      const data2 = await secondresponse.json();

      console.log(data2.nodeRead)
      setNodeRead(data2.nodeRead)
      setGame(data2.game);
      setTransactionTime(data2.transactionTime);
      setStatus(data2.status);

    } catch (error) {
      console.error("Error fetching game:", error);
      setStatus(['Games does not exist']);
    }

    setTestStarted(true);
    setLoading(false);
    setShowLogs(true);
  };

  const updateGame = async() => {
    setLoading(true);
    setShowLogs(false);
    try {

      // get the date of the game first
      const firstresponse = await fetch(`/api/specificgames?appId=${appId}`,{
        method: 'GET'
      });

      if (!firstresponse.ok) {
        throw new Error(`Error fetching game: ${firstresponse.statusText}`);
      }

      const data1 = await firstresponse.json();

      console.log(data1.games.ReleaseDate)

      const date = data1.games.ReleaseDate.split('-');

      console.log(Number(date[0]));

      const dateConverted = Number(date[0]);
      
      console.log("1");

      const response = await fetch(`/api/step3testCases`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          node: node,
          id: appId, // Make sure appId is defined and valid
          name: gameDetails.gamename,
          price: gameDetails.price,
          releasedYear:dateConverted
        }),
      });
      console.log("2");

      const data = await response.json();
      console.log(data)

      setStatus(data.status)


      if (response.ok) {
        console.log('Games saved successfully:', data);

      } else {
        console.error('Error saving games:', data.message);
      }
    } catch (error) {
      console.error('Error during save games process:', error);
      setStatus(['Games does not exist']);
    } finally {
      setLoading(false);
      setShowLogs(true);
    }
  };

  const deleteGame = async() => {
    setLoading(true);
    setShowLogs(false);
    try {

      // get the date of the game first
      const firstresponse = await fetch(`/api/specificgames?appId=${appId}`,{
        method: 'GET'
      });

      if (!firstresponse.ok) {
        throw new Error(`Error fetching game: ${firstresponse.statusText}`);
      }

      const data1 = await firstresponse.json();

      console.log(data1.games.ReleaseDate)

      const date = data1.games.ReleaseDate.split('-');

      console.log(Number(date[0]));

      const dateConverted = Number(date[0]);
      
      console.log("1");

      const response = await fetch(`/api/step3testCases`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          node: node,
          id: appId, // Make sure appId is defined and valid
          name: gameDetails.gamename,
          price: gameDetails.price,
          releasedYear:dateConverted
        }),
      });

      console.log("2");

      const data = await response.json();
      console.log(data)

      setStatus(data.status)


      if (response.ok) {
        console.log('Games saved successfully:', data);

      } else {
        console.error('Error saving games:', data.message);
      }
    } catch (error) {
      console.error('Error during delete games process:', error);
      setStatus(['Games does not exist']);
    } finally {
      setLoading(false);
      setShowLogs(true);
    }
  };

  const handleStartTest = () => {
    setTestStarted(true);
    setStatus([]);

    if(testType == "read"){
        console.log("reading...")
        fetchgameDetails();
        
    }else if(testType == "update"){
        console.log("updating...")
        updateGame();
    }else if(testType == "delete"){
        console.log("deleting...")
        deleteGame();
        setGame({});
        
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
        {validNodes
        .map((item,index) => (
          <tr key={index} className={index % 2 === 0 ? 'bg-gray-600' : ''}>
            {item === node ?
                <td className="py-2 text-center border px-4 border-white">{node} is made unavailable</td>
                :
                <td className="py-2 text-center border px-4 border-white">{item} is available</td>}
          </tr>
        ))}

        <div className="text-xl mt-10 flex text-center"> Transaction: {testType}</div>
      </div>
      
      </div>
        {showlogs && (
        <div className="w-full lg:w-2/3 m-auto overflow-x-auto">
          <div className='flex flex-col justify-center text-center'>
            <div className="text-xl mb-3 flex m-auto"> Logs: </div>

            <div className='justify-center'>
            <table className="min-w-full bg-gray-700">

              <thead>
                <tr>
                  <th className="py-2 px-4 bg-gray-600 border">Step</th>
                  <th className="py-2 px-4 bg-gray-600 border">Log Message</th>
                </tr>
              </thead>

              <tbody>
                {status.map((item, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-gray-600' : ''}>
                    <td className="py-2 text-center border px-4 border-white">{index + 1}</td>
                    <td className="py-2 text-center border px-4 border-white">{item}</td>
                  </tr>
                ))}

              </tbody>
            </table>
            </div>
          </div>
        </div>
    )}
      
      
      {testStarted && game && testType === 'read' &&(
        <div className="w-[400px] lg:w-1/3 m-auto">
          <div className="grid grid-cols-2 items-center p-4 border-b border-black">
          <div className="font-bold text-center text-xl">Field</div>
            {nodeRead == "main_node" && (<div className="font-bold text-center text-xl">Main Node</div>)}
            {nodeRead == "node_1" && (<div className="font-bold text-center text-xl">Node 1</div>)}
            {nodeRead == "node_2" && (<div className="font-bold text-center text-xl">Node 2</div>)}

          </div>

          {Object.keys(game).map((field, i) => (
            <div key={i} className="grid grid-cols-2 items-center p-4 border-b border-black">
              <div className="font-bold text-center">{field}</div>
              <div className="text-center">{game? game[field] : 'N/A'}</div>

            </div>
          ))}
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