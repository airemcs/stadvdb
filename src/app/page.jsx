/* eslint-disable */
'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import GameRow from "./components/GameRow";

export default function Home() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");
  const [filters, setFilters] = useState({ appId: '', gameName: '', date: '', price: '', requiredAge: '', estimatedOwners: '' });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [totalGames, setTotalGames] = useState("");
  const [selectedNode, setSelectedNode] = useState(() => {
    return localStorage.getItem('selectedNode') || 'main_node';
  });

  const gamesPerPage = 5;

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: currentPage,
          limit: gamesPerPage,
          node: selectedNode, 
          ...appliedFilters,
        }).toString();

        const response = await fetch(`/api/games?${queryParams}`);
        const data = await response.json();
        setGames(data.games);
        setTotalGames(data.count)
        if (data.error === "Failed to fetch games")
          setTotalGames(0)
        setTotalPages(Math.ceil(data.count / gamesPerPage))
      } catch (error) {
        console.error("Error fetching games:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [currentPage, appliedFilters, selectedNode]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      applyFilters();
    }
  };

  useEffect(() => {
    localStorage.setItem('selectedNode', selectedNode);
    localStorage.setItem('currentPage', currentPage);
  }, [selectedNode, currentPage]);

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setFilters({ appId: '', gameName: '', price: '', requiredAge: '', estimatedOwners: '', year: '' });
  };

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
  console.log(selectedNode)

  return (
    <>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-md shadow-xl">
            <p className="text-gray-800">Loading...</p>
          </div>
        </div>
      )}
      <div className="mx-4 lg:mx-16 mt-10 pb-6">
        <div className="text-white text-4xl lg:text-5xl italic font-bold">Games</div>
        
        <div className="mt-5">
          <select
            value={selectedNode}
            onChange={(e) => setSelectedNode(e.target.value)}
            className="border border-white rounded-md py-2 px-3 text-black"
          >
            <option value = "main_node">Main Node</option>
            <option>Node1</option>
            <option>Node2</option>
          </select>
        </div>

        <div className='flex flex-wrap items-center space-x-4 mt-5'>
          <div className='flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
            <input value={filters.appId} maxLength="7" type="number" placeholder="App ID" name="appId" className='text-white w-full lg:w-[140px] outline-none bg-transparent' onChange={handleFilterChange} onKeyPress={handleKeyPress} />
            <svg className='text-white w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
            </svg>
          </div>

          <div className='flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
            <input value={filters.name} type="text" placeholder="Game Name" name="gameName" className='text-white w-full lg:w-[236px] outline-none bg-transparent' onChange={handleFilterChange} onKeyPress={handleKeyPress} />
            <svg className='text-white w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
            </svg>
          </div>

          <input type="number" value={filters.year} name="year" className='w-full lg:w-[140px] border border-white py-2 px-3 text-white rounded-md bg-transparent hover:border-green-700 hover:shadow focus:border-green-700' onChange={handleFilterChange} min="1900" max="2100" placeholder="Year" onKeyPress={handleKeyPress} />

          <div className='flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
            <input value={filters.price} type="number" placeholder="Price" name="price" className='text-white w-full lg:w-[140px] outline-none bg-transparent' onChange={handleFilterChange} onKeyPress={handleKeyPress} />
            <svg className='text-white w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
            </svg>
          </div>

          <div className='flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
            <input value={filters.requiredAge} type="number" placeholder="Required Age" name="requiredAge" className='text-white w-full lg:w-[140px] outline-none bg-transparent' onChange={handleFilterChange} onKeyPress={handleKeyPress} />
            <svg className='text-white w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
            </svg>
          </div>

          <div className='flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700'>
            <input value={filters.estimatedOwners} type="number" placeholder="Estimated Owners" name="estimatedOwners" className='text-white w-full lg:w-[140px] outline-none bg-transparent' onChange={handleFilterChange} />
            <svg className='text-white w-5 h-5 mr-2' xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 4a6 6 0 100 12 6 6 0 000-12zm13 15l-7.5-4.5" />
            </svg>
          </div>

          <button className='transition duration-300 ease-in-out bg-gray-400 hover:bg-gray-600 text-white w-full lg:w-[202px] py-2 px-5 rounded-md mt-2 lg:mt-0' onClick={applyFilters}>Filter</button>

        </div>
        <div className="flex w-full flex-col mt-5">
          <div className="w-full grid grid-cols-2 md:grid-cols-7 text-white text-2xl lg:text-2xl font-bold">
            <div className="flex justify-center md:col-span-2"></div>
            <div className="hidden md:flex justify-center"></div>
            <div className="hidden md:flex justify-center">Total Games: {totalGames}</div>
            <div className="hidden md:flex justify-center"></div>
            <div className="hidden md:flex justify-center"></div>
        </div>
        </div>
        <div className="flex w-full flex-col mt-5">
          <div className="w-full grid grid-cols-2 md:grid-cols-7 text-white text-lg lg:text-xl font-bold">
            <div className="flex justify-center">App ID</div>
            <div className="flex justify-center">Game Name</div>
            <div className="hidden md:flex justify-center">Date</div>
            <div className="hidden md:flex justify-center">Price</div>
            <div className="hidden md:flex justify-center">Required Age</div>
            <div className="hidden md:flex justify-center">Estimated Owners</div>
        </div>

          <hr className="border-white mt-3"></hr>

          {games &&
              games.map((game) => (
                <Link key={game.AppID} href={`/view/${game.AppID}` }>
                  <GameRow
                    appID={game.AppID}
                    gameName={game.Name}
                    date={game.ReleaseDate}
                    price={game.Price}
                    requiredAge={game.RequiredAge}
                    estimatedOwners={game.EstimatedOwners}
                    node = {selectedNode}
                  />
                </Link>
              ))
            }
          <div className="flex justify-center mt-5 space-x-4">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`transition duration-300 ease-in-out bg-gray-700 hover:bg-gray-600 text-white w-full lg:w-[202px] py-2 px-5 rounded-md ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >Previous
            </button>

            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className={`transition duration-300 ease-in-out bg-gray-400 hover:bg-gray-600 text-white w-full lg:w-[202px] py-2 px-5 rounded-md ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </>
  );
}