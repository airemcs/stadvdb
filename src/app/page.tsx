'use client'
import { useState } from "react";
import GameRow from "./components/GameRow";

export default function Home() {
  
  const games = [
    {
      appID: "12345",
      gameName: "League of Legends",
      date: "July 12, 2024",
      price: "P99.99",
      requiredAge: "18+",
      estimatedOwners: "50,000",
    },
    {
      appID: "67890",
      gameName: "Fortnite",
      date: "July 15, 2024",
      price: "P199.99",
      requiredAge: "12+",
      estimatedOwners: "100,000",
    },
    {
      appID: "54321",
      gameName: "Minecraft",
      date: "August 1, 2024",
      price: "P150.00",
      requiredAge: "7+",
      estimatedOwners: "200,000",
    },
    {
      appID: "98765",
      gameName: "Call of Duty: Warzone",
      date: "August 15, 2024",
      price: "P249.99",
      requiredAge: "18+",
      estimatedOwners: "150,000",
    },
    {
      appID: "13579",
      gameName: "Apex Legends",
      date: "September 5, 2024",
      price: "P149.99",
      requiredAge: "16+",
      estimatedOwners: "300,000",
    },
    {
      appID: "24680",
      gameName: "Valorant",
      date: "September 20, 2024",
      price: "P99.99",
      requiredAge: "13+",
      estimatedOwners: "400,000",
    },
    {
      appID: "12345",
      gameName: "League of Legends",
      date: "July 12, 2024",
      price: "P99.99",
      requiredAge: "18+",
      estimatedOwners: "50,000",
    },
    {
      appID: "67890",
      gameName: "Fortnite",
      date: "July 15, 2024",
      price: "P199.99",
      requiredAge: "12+",
      estimatedOwners: "100,000",
    },
    {
      appID: "54321",
      gameName: "Minecraft",
      date: "August 1, 2024",
      price: "P150.00",
      requiredAge: "7+",
      estimatedOwners: "200,000",
    },
    {
      appID: "98765",
      gameName: "Call of Duty: Warzone",
      date: "August 15, 2024",
      price: "P249.99",
      requiredAge: "18+",
      estimatedOwners: "150,000",
    },
    {
      appID: "13579",
      gameName: "Apex Legends",
      date: "September 5, 2024",
      price: "P149.99",
      requiredAge: "16+",
      estimatedOwners: "300,000",
    },
    {
      appID: "24680",
      gameName: "Valorant",
      date: "September 20, 2024",
      price: "P99.99",
      requiredAge: "13+",
      estimatedOwners: "400,000",
    },
  ];
  
  const [currentPage, setCurrentPage] = useState(1);

  const gamesPerPage = 3;
  const totalPages = Math.ceil(games.length / gamesPerPage);

  const indexOfLastGame = currentPage * gamesPerPage;
  const indexOfFirstGame = indexOfLastGame - gamesPerPage;
  const currentGames = games.slice(indexOfFirstGame, indexOfLastGame);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
  <>
  <div className="mx-16 mt-10 pb-6">

    <div className="text-normal-green text-5xl italic font-bold">Games</div>

    <div className='flex items-center space-x-4 mt-5'>

      <div className='flex items-center border border-normal-green rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
        <input type="text" placeholder="App ID" className='text-normal-green w-[236px] outline-none bg-white' />
        <svg className='text-normal-green w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
        </svg>
      </div>

      <div className='flex items-center border border-normal-green rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
        <input type="text" placeholder="Game Name" className='text-normal-green w-[236px] outline-none bg-white' />
        <svg className='text-normal-green w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
        </svg>
      </div>

      <input type="date" className='w-[224px] border border-normal-green py-2 px-3 text-normal-green rounded-md bg-white hover:border-green-700 hover:shadow focus:border-green-700' />

      <div className='flex items-center border border-normal-green rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
        <input type="text" placeholder="Price" className='text-normal-green w-[236px] outline-none bg-white' />
        <svg className='text-normal-green w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
        </svg>
      </div>

      <div className='flex items-center border border-normal-green rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
        <input type="text" placeholder="Required Age" className='text-normal-green w-[236px] outline-none bg-white' />
        <svg className='text-normal-green w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
        </svg>
      </div>

      <div className='flex items-center border border-normal-green rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
        <input type="text" placeholder="Estimated Owners" className='text-normal-green w-[236px] outline-none bg-white' />
        <svg className='text-normal-green w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
        </svg>
      </div>

      <button className='btn border-none hover:bg-yellow-700 active:bg-green-900 w-[202px] bg-light-green text-white py-2 px-5 rounded-md'>Filter</button>

    </div>

    <div className="flex w-full flex-col mt-5">

      <div className="w-full grid grid-cols-7 text-normal-green text-xl font-bold">
        <div className="flex justify-center">App ID</div>
        <div className="flex justify-center">Game Name</div>
        <div className="flex justify-center">Date</div>
        <div className="flex justify-center">Price</div>
        <div className="flex justify-center">Required Age</div>
        <div className="flex justify-center">Estimated Owners</div>
      </div>

      <hr className="bg-normal-green h-[2px] w-full mt-3"></hr>

      {currentGames.map((game) => (
        <GameRow
          key={game.appID}
          appID={game.appID}
          gameName={game.gameName}
          date={game.date}
          price={game.price}
          requiredAge={game.requiredAge}
          estimatedOwners={game.estimatedOwners}
        />
      ))}

      <div className="flex justify-center mt-5 space-x-4">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className={`btn border-none hover:bg-yellow-700 active:bg-green-900 w-[202px] bg-light-green text-white py-2 px-5 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
        >Previous
        </button>

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className={`btn border-none hover:bg-yellow-700 active:bg-green-900 w-[202px] bg-light-green text-white py-2 px-5 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Next
        </button>
      </div>
      
    </div>

  </div>
  </>
  );
}
