import Link from 'next/link';
import React from 'react';

const EditPage = () => {
  const dummyData = {
    AppID: "12345",
    Name: "Awesome Game",
    ReleaseDate: "2023-06-15",
    EstimatedOwners: "500,000",
    PeakCCU: "10,000",
    RequiredAge: "13",
    Price: "$49.99",
    DLCCOUNT: "1200",
    Website: "https://www.awesomegame.com",
    SupportEmail: "support@awesomegame.com",
    Recommends: "Yes",
    AveragePlaytime: "15 hours",
    MedianPlaytime: "12 hours",
    Publishers: "Super Games Inc.",
    Categories: "Action, Adventure",
    Genres: "Action, RPG",
    Tags: "Epic, Adventure, Multiplayer"
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 p-4">
      {/* Form Container */}
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg space-y-8">
        
      <div className="flex items-center justify-between mb-8">
          {/* Return Button */}
          <Link href="/" className="btn border-none text-gray-900 hover:bg-gray-300 w-24 h-10 flex items-center justify-center rounded-lg outline outline-1 bg-gray-200">
            Return
          </Link>

          {/* App ID Display */}
          <div className="text-gray-700 text-sm font-medium">
            <span>App ID: </span>
            <span className="font-bold text-gray-900">{dummyData.AppID}</span>
          </div>
        </div>

        {/* Display all the fields */}
        <div className="space-y-6">

          {/* Name, Release Date, Estimated Owners */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Name</p>
              <p className="text-gray-900">{dummyData.Name}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Release Date</p>
              <p className="text-gray-900">{dummyData.ReleaseDate}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Estimated Owners</p>
              <p className="text-gray-900">{dummyData.EstimatedOwners}</p>
            </div>
          </div>

          {/* Peak CCU, Required Age, Price */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Peak CCU</p>
              <p className="text-gray-900">{dummyData.PeakCCU}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Required Age</p>
              <p className="text-gray-900">{dummyData.RequiredAge}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Price</p>
              <p className="text-gray-900">{dummyData.Price}</p>
            </div>
          </div>

          {/* DLCCOUNT, Long Description */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">DLCCOUNT</p>
              <p className="text-gray-900">{dummyData.DLCCOUNT}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Average Playtime</p>
              <p className="text-gray-900">{dummyData.AveragePlaytime}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Average Playtime</p>
              <p className="text-gray-900">{dummyData.MedianPlaytime}</p>
            </div>
          </div>

          {/* Reviews, Header Image, Website */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Genres</p>
              <p className="text-gray-900">{dummyData.Genres}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Tags</p>
              <p className="text-gray-900">{dummyData.Tags}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Categories</p>
              <p className="text-gray-900">{dummyData.Categories}</p>
            </div>
          </div>

          {/* Website, Support Web, Support Email */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Website</p>
              <p className="text-gray-900 break-words">{dummyData.Website}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Support Email</p>
              <p className="text-gray-900 break-words">{dummyData.SupportEmail}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Publishers</p>
              <p className="text-gray-900">{dummyData.Publishers}</p>
            </div>
            
          </div>

          {/* Developers, Publishers, Categories */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Recommends</p>
              <p className="text-gray-900">{dummyData.Recommends}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPage;
