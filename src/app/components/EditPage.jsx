import Link from 'next/link';
import { getActiveResourcesInfo } from 'process';
import React, { useState, useEffect } from 'react';

const EditPage = ({appId}) => {
  const [isFormChanged, setIsFormChanged] = useState(false); // Track if the form has changed
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the modal is open
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Track if the confirmation modal is open
  const [loading, setLoading] = useState(true);
  const [selectedNode, setSelectedNode] = useState(() => {
    return window?.localStorage.getItem('selectedNode');
  });

  console.log(selectedNode);

  // Handler to track form changes
  const handleInputChange = () => {
    setIsFormChanged(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setIsConfirmOpen(false);
  };

  // Handler to open the confirmation modal
  const openConfirmation = () => {
    setIsConfirmOpen(true);
  };

  // Handler to close the confirmation modal
  const closeConfirmation = () => {
    setIsConfirmOpen(false);
  };

  // Handler for confirming the save
  const confirmSave = () => {

    setIsFormChanged(false);
    setIsModalOpen(true); // Show the success modal

    const updateGame = async() => {
      setLoading(true);
      try {
        const response = await fetch(`/api/games`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            node: selectedNode,
            id: appId, // Make sure appId is defined and valid
            name: gameDetails.gamename,
            releaseDate: gameDetails.releaseDate,
            estimatedOwners: gameDetails.estimatedOwners,
            peakCCU: gameDetails.peakCCU,
            requiredAge: gameDetails.requiredAge,
            price: gameDetails.price,
            dlcCount: gameDetails.dlcCount,
            website: gameDetails.website,
            supportEmail: gameDetails.supportEmail, // Fixed property name
            recommends: gameDetails.recommends,
            averagePlaytime: gameDetails.averagePlaytime,
            medianPlaytime: gameDetails.medianPlaytime,
            publishers: gameDetails.publishers,
            categories: gameDetails.categories,
            genres: gameDetails.genres,
            tags: gameDetails.tags,
          }),
        });
    
        const data = await response.json();
        
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

    updateGame();
  };

  const [gameDetails, setGameDetails] = useState({
    gamename: '',
    releaseDate: '',
    estimatedOwners: '',
    peakCCU: 0,
    requiredAge: 0,
    price: 0.0,
    dlcCount: 0,
    website: '',
    supportEmail: '',
    recommends: 0,
    averagePlaytime: 0,
    medianPlaytime: 0,
    publishers: '',
    categories: '',
    genres: '',
    tags: '',
  });

  const fetchgameDetails = async () => {
    try {
      const gameId = appId;

      const response = await fetch(`/api/games?appId=${gameId}`);

      if (!response.ok) {
        throw new Error(`Error fetching game: ${response.statusText}`);
      }
      const data = await response.json();

      console.log(data.games[0])

      setGameDetails({
        gamename: data.games[0].Name,
        releaseDate: data.games[0].ReleaseDate,
        estimatedOwners: data.games[0].EstimatedOwners,
        peakCCU: data.games[0].PeakCCU,
        requiredAge: data.games[0].RequiredAge,
        price: data.games[0].Price,
        dlcCount: data.games[0].DLCCOUNT,
        website: data.games[0].Website,
        supportEmail: data.games[0].SupportEmail,
        recommends: data.games[0].Recommends,
        averagePlaytime: data.games[0].AveragePlaytime,
        medianPlaytime: data.games[0].MedianPlaytime,
        publishers: data.games[0].Publishers,
        categories: data.games[0].Categories,
        genres: data.games[0].Genres,
        tags: data.games[0].Tags
      }) 

    } catch (error) {
      console.error("Error fetching game:", error);
    }
  };
  
  
  useEffect(() => {
    fetchgameDetails();
  },[]);

  if (!gameDetails) {
    return <div>Loading...</div>; 
  }

  console.log(gameDetails);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black-200 p-4">

      {/* Form Container */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg space-y-8">

        {/* Header with Button and App ID */}
        <div className="flex items-center justify-between mb-8">
          {/* Return Button */}
          <Link href="/">
            <button className="btn border-none text-gray-900 hover:bg-gray-300 w-24 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-200">
              Return
            </button>
          </Link>
          

          {/* App ID Display */}
          <div className="text-gray-700 text-sm font-medium">
            <span>App ID: </span>
            <span className="font-bold text-sm text-gray-900">{appId}</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          {/* Game and Release Date Group */}
          <div className="flex space-x-6">
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
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Released Date: 
              </div>
              <input 
                type="date" 
                value={gameDetails.releaseDate}  
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    releaseDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Other Form Fields */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Estimated Owners: 
              </div>
              <input 
                type="number" 
                value={gameDetails.estimatedOwners} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    estimatedOwners: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex-1">
            <div className='text-black font-bold'>
                  Peak CCU: 
              </div>
              <input 
                type="number" 
                value={gameDetails.peakCCU} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    peakCCU: Number(e.target.value), // Convert to number
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Required Age: 
              </div>
              <input 
                type="text" 
                value={gameDetails.requiredAge}  
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    requiredAge: Number(e.target.value), // Convert to number
                  }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Price: 
              </div>
              <input 
                type="number" 
                value={gameDetails.price} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    price: parseFloat(e.target.value), // Convert to float
                  }))
                } 
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  DLC Count: 
              </div>
              <input 
                type="number" 
                value={gameDetails.dlcCount}  
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    dlcCount: Number(e.target.value), // Convert to number
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Website: 
              </div>
              <input 
                type="text" 
                value={gameDetails.website} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    website: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Support Email: 
              </div>
              <input 
                type="email" 
                value={gameDetails.supportEmail} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    supportEmail: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Recommends: 
              </div>
              <input 
                type="text" 
                value={gameDetails.recommends} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    recommends: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Average Playtime: 
              </div>
              <input 
                type="number" 
                value={gameDetails.averagePlaytime} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    averagePlaytime: Number(e.target.value), // Convert to number
                  }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Median Playtime: 
              </div>
              <input 
                type="number" 
                value={gameDetails.medianPlaytime}  
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    medianPlaytime: Number(e.target.value), // Convert to number
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Publishers: 
              </div>
              <input 
                type="text" 
                value={gameDetails.publishers} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    publishers: e.target.value,
                  }))
                }
              />
            </div>
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Genre: 
              </div>
              <input 
                type="text" 
                value={gameDetails.genres}  
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    genres: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Categories: 
              </div>
              <input 
                type="text" 
                value={gameDetails.categories}  
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    categories: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <div className='text-black font-bold'>
                  Tags: 
              </div>
              <input 
                type="text" 
                value={gameDetails.tags} 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={(e) =>
                  setGameDetails((prevDetails) => ({
                    ...prevDetails,
                    tags: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={openConfirmation}
            className='bg-green-500 text-white w-28 h-10 flex items-center justify-center rounded-lg outline outline-2 border-green-500'
          >
            Save
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-center mb-4 text-black">Are you sure you want to save the changes?</h2>
            <div className="flex justify-between">
              <button
                onClick={confirmSave}
                className="bg-green-500 text-white px-6 py-2 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={closeConfirmation}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-center mb-4">Changes Saved!</h2>
            <p className="text-center">Your changes have been successfully saved.</p>
            <div className="flex justify-center mt-4">
              <button onClick={closeModal} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPage;
