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
    LongDesc: "This is a long description of the game. It provides in-depth details about gameplay, story, features, and more. It explains the game's mechanics, lore, and characters in a detailed manner, offering insights into what players can expect.",
    ShortDesc: "An amazing action-packed adventure game.",
    Languages: "English, Spanish, French",
    FullAudioLanguages: "English, Spanish",
    Reviews: "Very Positive",
    HeaderImage: "image_url",
    Website: "https://www.awesomegame.com",
    SupportWeb: "https://www.awesomegame.com/support",
    SupportEmail: "support@awesomegame.com",
    SupportWindows: "Yes",
    SupportMac: "Yes",
    SupportLinux: "No",
    MetacriticScore: "85",
    MetacriticURL: "https://www.metacritic.com/game/awesome-game",
    UserScore: "4.5",
    Positive: "90%",
    Negative: "10%",
    ScoreRank: "A",
    Achievements: "Yes",
    Recommends: "Yes",
    Notes: "Regular updates and bug fixes.",
    AveragePlaytime: "15 hours",
    AveragePlaytime2W: "10 hours",
    MedianPlaytime: "12 hours",
    MedianPlaytime2W: "8 hours",
    Packages: "Standard, Deluxe, Ultimate",
    Developers: "Awesome Studio",
    Publishers: "Super Games Inc.",
    Categories: "Action, Adventure",
    Genres: "Action, RPG",
    Screenshots: "screenshot_url",
    Movies: "movie_url",
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
            <span className="font-bold text-gray-900">12345</span>
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
              <p className="text-gray-700 font-semibold">Packages</p>
              <p className="text-gray-900">{dummyData.Packages}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6">
          <div>
              <p className="text-gray-700 font-semibold">Long Description</p>
              <p className="text-gray-900 text-pretty">{dummyData.LongDesc}</p>
            </div>
          </div>

          {/* Short Description, Languages, Full Audio Languages */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Short Description</p>
              <p className="text-gray-900">{dummyData.ShortDesc}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Languages</p>
              <p className="text-gray-900">{dummyData.Languages}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Full Audio Languages</p>
              <p className="text-gray-900">{dummyData.FullAudioLanguages}</p>
            </div>
          </div>

          {/* Reviews, Header Image, Website */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Reviews</p>
              <p className="text-gray-900">{dummyData.Reviews}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Genres</p>
              <p className="text-gray-900">{dummyData.Genres}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Tags</p>
              <p className="text-gray-900">{dummyData.Tags}</p>
            </div>
          </div>

          {/* Website, Support Web, Support Email */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Website</p>
              <p className="text-gray-900 break-words">{dummyData.Website}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Support Web</p>
              <p className="text-gray-900 break-words">{dummyData.SupportWeb}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Support Email</p>
              <p className="text-gray-900 break-words">{dummyData.SupportEmail}</p>
            </div>
          </div>

          {/* Support Windows, Support Mac, Support Linux */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Support Windows</p>
              <p className="text-gray-900">{dummyData.SupportWindows}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Support Mac</p>
              <p className="text-gray-900">{dummyData.SupportMac}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Support Linux</p>
              <p className="text-gray-900">{dummyData.SupportLinux}</p>
            </div>
          </div>

          {/* Metacritic Score, Metacritic URL, User Score */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Metacritic Score</p>
              <p className="text-gray-900">{dummyData.MetacriticScore}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Metacritic URL</p>
              <p className="text-gray-900 break-words">{dummyData.MetacriticURL}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">User Score</p>
              <p className="text-gray-900">{dummyData.UserScore}</p>
            </div>
          </div>

          {/* Positive, Negative, Score Rank */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Positive</p>
              <p className="text-gray-900">{dummyData.Positive}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Negative</p>
              <p className="text-gray-900">{dummyData.Negative}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Score Rank</p>
              <p className="text-gray-900">{dummyData.ScoreRank}</p>
            </div>
          </div>

          {/* Achievements, Recommends, Notes */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Achievements</p>
              <p className="text-gray-900">{dummyData.Achievements}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Recommends</p>
              <p className="text-gray-900">{dummyData.Recommends}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Notes</p>
              <p className="text-gray-900">{dummyData.Notes}</p>
            </div>
          </div>

          {/* Developers, Publishers, Categories */}
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-gray-700 font-semibold">Developers</p>
              <p className="text-gray-900">{dummyData.Developers}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Publishers</p>
              <p className="text-gray-900">{dummyData.Publishers}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Categories</p>
              <p className="text-gray-900">{dummyData.Categories}</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">

          <div>
              <p className="text-gray-700 font-semibold">Header Image</p>
              <p className="text-gray-900">{dummyData.HeaderImage}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Screenshots</p>
              <p className="text-gray-900">{dummyData.Screenshots}</p>
            </div>
            <div>
              <p className="text-gray-700 font-semibold">Movies</p>
              <p className="text-gray-900">{dummyData.Movies}</p>
            </div>

          </div>
          
        </div>
      </div>
    </div>
  );
};

export default EditPage;
