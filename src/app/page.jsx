/* eslint-disable */
'use client';
import Link from "next/link";
import { useEffect, useState } from "react";
import GameRow from "./components/GameRow";

export default function Home() {
  const [games, setGames] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => Number(window?.localStorage.getItem('currentPage')) || 1);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState("");
  const [filters, setFilters] = useState({ appId: '', gameName: '', date: '', price: '', requiredAge: '', estimatedOwners: '' });
  const [appliedFilters, setAppliedFilters] = useState({});
  const [totalGames, setTotalGames] = useState("");
  const [selectedNode, setSelectedNode] = useState(() => {
    return window?.localStorage.getItem('selectedNode') || 'main_node';
  });
  const [showModal, setShowModal] = useState(false);
  const [gameToDelete, setGameToDelete] = useState(null);

  const gamesPerPage = 5;

  const handleDelete = async () => {
    if (!gameToDelete) return;

    try {
      const response = await fetch(`/api/games`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: gameToDelete,
          node: selectedNode,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Game deleted successfully:', data);
        // Update the local state to remove the deleted game
        setGames((prevGames) => prevGames.filter((game) => game.AppID !== gameToDelete));
        setShowModal(false); // Close the modal after deletion
      } else {
        console.error('Error deleting game:', data.message);
      }
    } catch (error) {
      console.error('Error during delete game process:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setCurrentPage(1);
    setFilters({ appId: '', gameName: '', price: '', requiredAge: '', estimatedOwners: '', year: '' });
  };

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

  useEffect(() => {
    window?.localStorage.setItem('currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    window?.localStorage.setItem('selectedNode', selectedNode);
    window?.localStorage.setItem('currentPage', currentPage);
  }, [selectedNode, currentPage]);

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
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-md shadow-xl">
            <p className="text-gray-800">Loading...</p>
          </div>
        </div>
      )}
      
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded-md shadow-xl max-w-md w-full">
            <p className="text-gray-800 text-xl mb-4">Are you sure you want to delete this game?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-400 hover:bg-gray-600 text-white py-2 px-5 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-5 rounded-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-4 lg:mx-16 mt-10 pb-6">
        <div className="text-white text-4xl lg:text-5xl italic font-bold">Games</div>

        {/* Filters */}
        <div className="flex gap-3 justify-center items-center">
          <div className="mt-5">
            <select
              value={selectedNode}
              onChange={(e) => setSelectedNode(e.target.value)}
              className="border border-white rounded-md py-2 px-3 text-black"
            >
              <option value="main_node">Main Node</option>
              <option>Node1</option>
              <option>Node2</option>
            </select>
          </div>
          <div className="mt-5 text-xl font-bold">Concurrency</div>
          <div className="mt-5 gap-4 flex">
            <Link href="/concurrency/1" className="border border-white rounded-md py-[9px] px-3 text-black">Case 1</Link>
            <Link href="/concurrency/2" className="border border-white rounded-md py-[9px] px-3 text-black">Case 2</Link>
            <Link href="/concurrency/3" className="border border-white rounded-md py-[9px] px-3 text-black">Case 3</Link>
          </div>
        </div>

        {/* Filter Inputs */}
        <div className="flex flex-wrap items-center space-x-4 mt-5">
          <div className="flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700">
            <input
              value={filters.appId}
              maxLength="7"
              type="number"
              placeholder="App ID"
              name="appId"
              className="text-white w-full lg:w-[140px] outline-none bg-transparent"
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700">
            <input
              value={filters.gameName}
              type="text"
              placeholder="Game Name"
              name="gameName"
              className="text-white w-full lg:w-[236px] outline-none bg-transparent"
              onChange={handleFilterChange}
            />
          </div>

          <input
            type="number"
            value={filters.year}
            name="year"
            className="w-full lg:w-[140px] border border-white py-2 px-3 text-white rounded-md bg-transparent hover:border-green-700 hover:shadow focus:border-green-700"
            onChange={handleFilterChange}
            min="1900"
            max="2100"
            placeholder="Year"
          />

          <div className="flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700">
            <input
              value={filters.price}
              type="number"
              placeholder="Price"
              name="price"
              className="text-white w-full lg:w-[140px] outline-none bg-transparent"
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700">
            <input
              value={filters.requiredAge}
              type="number"
              placeholder="Required Age"
              name="requiredAge"
              className="text-white w-full lg:w-[140px] outline-none bg-transparent"
              onChange={handleFilterChange}
            />
          </div>

          <div className="flex items-center border border-white rounded-md px-3 py-2 hover:border-green-700 hover:shadow-lg focus-within:border-green-700">
            <input
              value={filters.estimatedOwners}
              type="number"
              placeholder="Estimated Owners"
              name="estimatedOwners"
              className="text-white w-full lg:w-[140px] outline-none bg-transparent"
              onChange={handleFilterChange}
            />
          </div>

          <button
            onClick={applyFilters}
            className="border text-white rounded-md py-2 px-4 hover:bg-green-700"
          >
            Apply Filters
          </button>
        </div>

        {/* Game List */}
        {games &&
          games.map((game) => (
            <Link key={game.AppID} href={`/view/${game.AppID}`}>
              <GameRow
                appID={game.AppID}
                gameName={game.Name}
                date={game.ReleaseDate}
                price={game.Price}
                requiredAge={game.RequiredAge}
                estimatedOwners={game.EstimatedOwners}
                node={selectedNode}
                onDelete={() => {
                  setGameToDelete(game.AppID);
                  setShowModal(true);
                }}
              />
            </Link>
          ))}

        {/* Pagination */}
        <div className="flex justify-center mt-5">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="border py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500"
          >
            Previous
          </button>
          <span className="px-4 py-2">{currentPage} / {totalPages}</span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="border py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-500"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
