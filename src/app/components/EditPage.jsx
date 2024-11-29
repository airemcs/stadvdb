import React, { useState } from 'react';

const EditPage = () => {
  const [isFormChanged, setIsFormChanged] = useState(false); // Track if the form has changed
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the modal is open
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Track if the confirmation modal is open

  // Handler to track form changes
  const handleInputChange = () => {
    setIsFormChanged(true);
  };

  // Handler to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
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
    setIsConfirmOpen(false);
    setIsModalOpen(true); // Show the success modal
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">

      {/* Form Container */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg space-y-8">

        {/* Header with Button and App ID */}
        <div className="flex items-center justify-between mb-8">
          {/* Return Button */}
          <button className="btn border-none text-gray-900 hover:bg-gray-300 w-24 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-200">
            Return
          </button>

          {/* App ID Display */}
          <div className="text-gray-700 text-sm font-medium">
            <span>App ID: </span>
            <span className="font-bold text-gray-900">12345</span>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">

          {/* Game and Release Date Group */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Game" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="date" 
                placeholder="Release Date" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          {/* Other Form Fields */}
          <div className="flex space-x-6">
            <div className="flex-1">
              <input 
                type="number" 
                placeholder="Estimated Owners" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="number" 
                placeholder="Peak CCU" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Required Age" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <input 
                type="number" 
                placeholder="Price" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="number" 
                placeholder="DLCCOUNT" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Website" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <input 
                type="email" 
                placeholder="Support Email" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Recommends" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="number" 
                placeholder="Average Playtime" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <input 
                type="number" 
                placeholder="Median Playtime" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Publishers" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Genres" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
          </div>

          <div className="flex space-x-6">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Tags" 
                className="text-gray-700 w-full p-3 mb-2 outline-none bg-white border border-gray-300 rounded-md" 
                onChange={handleInputChange} 
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={openConfirmation}
            className={`btn ${isFormChanged ? 'bg-green-500' : 'bg-gray-300'} text-white w-28 h-10 flex items-center justify-center rounded-lg outline outline-2 ${isFormChanged ? 'border-green-500' : ''}`}
            disabled={!isFormChanged}
          >
            Save
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {isConfirmOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-lg font-bold text-center mb-4">Are you sure you want to save the changes?</h2>
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
