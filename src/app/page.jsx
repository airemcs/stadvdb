'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import GameRow from "./components/GameRow";

export default function Home() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const gamesPerPage = 5; 

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch(`/api/games?page=${currentPage}&limit=${gamesPerPage}`);
        const data = await response.json();
        console.log(data)
        setGames(data);
      } catch (error) {
        console.error("Error fetching games:", error);
      }
    };

    fetchGames();
  }, [currentPage]);

  const totalPages = Math.ceil(100000 / gamesPerPage);

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

        {/* Add the filtering UI here if needed */}

        <div className="flex w-full flex-col mt-5">

          <div className="w-full grid grid-cols-6 text-normal-green text-xl font-bold">
            <div className="flex justify-center">App ID</div>
            <div className="flex justify-center">Game Name</div>
            <div className="flex justify-center">Date</div>
            <div className="flex justify-center">Price</div>
            <div className="flex justify-center">Required Age</div>
            <div className="flex justify-center">Estimated Owners</div>
          </div>

          <hr className="bg-normal-green h-[2px] w-full mt-3"></hr>

          {games.map((game) => (
            <Link href="/view" className="z-0" key={game.AppID}>
              <GameRow
                appID={game.AppID}
                gameName={game.Name}
                date={game.ReleaseDate}
                price={game.Price}
                requiredAge={game.RequiredAge}
                estimatedOwners={game.EstimatedOwners}
              />
            </Link>
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