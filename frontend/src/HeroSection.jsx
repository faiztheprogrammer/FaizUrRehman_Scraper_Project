import React from "react";

function HeroSection({ keyword, setKeyword }) {
  const backgroundImageUrl =
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80";

  const handleInputChange = (e) => {
    setKeyword(e.target.value);
  };

  return (
    <div
      className="relative h-64 md:h-80 bg-cover bg-center rounded-xl overflow-hidden mb-8"
      style={{ backgroundImage: `url(${backgroundImageUrl})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white p-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          Find Your Next Actuary Role
        </h1>
        <p className="mt-2 text-lg md:text-xl">
          The premier job board for actuarial professionals.
        </p>
        <div className="mt-6 w-full max-w-lg">
          <input
            type="text"
            name="keyword"
            placeholder="Search by title, company, or keyword..."
            value={keyword}
            onChange={handleInputChange}
            className="w-full p-3 border rounded-full text-black"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
