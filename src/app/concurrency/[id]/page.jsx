'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import React from 'react';
import { isNull } from 'util';

export default function Concurrency({ params }) {
  const [testType, setTestType] = useState('');
  const [testText, setTestText] = useState('');
  const [testStarted, setTestStarted] = useState(false);
  const [games, setGames] = useState({});
  const [appId, setAppId] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactionTime, setTransactionTime] = useState('');
  const [selectedIsolationLevel, setSelectedIsolationLevel] = useState('ReadUncommitted'); 
  const isolationLevels = ['Serializable', 'RepeatableRead', 'ReadCommitted', 'ReadUncommitted'];
  const [dbIsolationLevel, setdbIsolationLevel] = useState('ReadCommitted'); 
  const [showInputs, setShowInputs] = useState(false)
  const [fetchOnlyA, setFetchOnlyA] = useState(false)
  const [gameName, setGameName] = useState('')
  const [gamePrice, setgamePrice] = useState('')
  const [logs, setLogs] = useState({})
  const [data1, setData] = useState({})
  const [newGameName, setNewGameName] = useState("")
  const [newGamePrice, setNewPrice] = useState("")
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
            testType: params2.id
        });

        if (params2.id === 1 || useFetchOnly) {
            setShowInputs(false);
            response = await fetch(`/api/testCases?${queryParams.toString()}`);
            setFetchOnlyA(false);
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setData(data)
          setTransactionTime(data.transactionTime);
          setdbIsolationLevel(data.isolationLevel);
          setGames(data.totalGames);
          if(isNull( data.totalGames.main_node.games)) setShowInputs(false) 
            else setShowInputs(true)
          setGameName(data.totalGames.main_node.games.Name);
          setgamePrice(data.totalGames.main_node.games.Price);
          setAppId(data.totalGames.main_node.games.AppID)
          setLogs(data.logs)  
        } else if (params2.id == 2 && !useFetchOnly) {

            setNewGameName(gameName)
            setNewPrice(gamePrice)
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
                    type: params2.id
                }),
            });
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setData(data)
          setTransactionTime(data.transactionTime);
          setdbIsolationLevel(data.isolationLevel);
          setGames(data.totalGames);
          if(isNull( data.totalGames.main_node.games)) setShowInputs(false) 
            else setShowInputs(true)
          setGameName(data.totalGames.main_node.games.Name);
          setgamePrice(data.totalGames.main_node.games.Price);
          setAppId(data.totalGames.main_node.games.AppID)
          setLogs(data.logs)
        } else if (params2.id == 3 && !useFetchOnly) {
          setNewGameName(gameName)
          setNewPrice(gamePrice)
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
                type: params2.id
            }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setData(data)
      setTransactionTime(data.transactionTime);
      setdbIsolationLevel(data.isolationLevel);
      setGames(data.totalGames);
      if(isNull( data.totalGames.main_node.games)) setShowInputs(false) 
        else setShowInputs(true)
      setLogs(data.logs)
        }
        

    } catch (error) {
      console.error("Error fetching game:", error);
    }
    setTestStarted(true);
    setLoading(false);

};

   

const fetchOnly = async () => {
    await fetchGames(true); 
};


  const handleStartTest = () => {
    if (params2.id == 1){
      setTestStarted(true);
      fetchGames();
      if(data.totalGames.main_node.games == null) {
        setShowInputs(false);
      } else setShowInputs(true)
    } else if (params2.id == 2 || params2.id ==3) {
         fetchGames()
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
      <div className="text-3xl font-semibold mb-6 flex m-auto">Concurrency Test Case {params2.id}</div>
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
      {(params2.id == 2 || params2.id == 3) && showInputs && <div className='m-auto flex gap-4'>
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
      { (params2.id == 2 || params2.id == 3) && showInputs && !loading && <div className="grid grid-cols-3 items-center justify-center mx-10">
        <div className="text-xl mb-6 flex m-auto text-center w-[200px]">{transactionTime}</div>
        <div className="text-xl mb-6 flex m-auto mt-2 text-center">
          <div className='flex flex-row'>

        <button onClick={handleStartTest} className="ml-5 w-[200px] py-2 btn border-none text-gray-900 hover:bg-green-40 flex items-center justify-center rounded-lg outline outline-1 bg-green-500">
        Update Test
      </button>
          </div>
      </div>   
      
        <div className="text-xl mb-6 flex m-auto text-center">{dbIsolationLevel}</div>
      </div>
      }

{ (params2.id == 1) && showInputs && !loading && <div className="grid grid-cols-2 items-center justify-center mx-10">
        <div className="text-xl mb-6 flex m-auto text-center w-[200px]">{transactionTime}</div>
     
        <div className="text-xl mb-6 flex m-auto text-center">{dbIsolationLevel}</div>
      </div>
      }



{testStarted && logs && logs.length > 0 && (
      <div>
        <div className="text-3xl font-semibold mb-6 flex m-auto w-max">Logs</div>
     <div className="w-full lg:w-2/3 m-auto overflow-x-auto">
       <table className="min-w-full bg-gray-700">
         <thead>
           <tr>
             <th className="py-2 px-4 bg-gray-600 border">Step</th>
             <th className="py-2 px-4 bg-gray-600 border">Log Message</th>
           </tr>
         </thead>
         <tbody>
           {logs.map((log, index) => (
             <tr key={index} className={index % 2 === 0 ? 'bg-gray-600' : ''}>
               <td className="py-2 text-center border px-4 border-white">{index + 1}</td>
               <td className="py-2 text-center border px-4 border-white">{log}</td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
      </div>
   )}
      
      {params2.id != 3 && testStarted && !loading && games.main_node && games.main_node.games && (
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
              <div className="text-center">{games.main_node?.games ? games.main_node.games[field] : 'N/A'}</div>
              <div className="text-center">{games.node_1?.games ? games.node_1.games[field] : 'N/A'}</div> {/* Placeholder for Node 1 */}
              <div className="text-center">{games.node_2?.games ? games.node_2.games[field] : 'N/A'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}