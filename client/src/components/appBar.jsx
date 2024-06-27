import React from 'react';

const Navbar = ({ dataTypes, onTypeSelect }) => {
  return (
    <div className="flex bg-gray-700 text-white p-2 space-x-2 overflow-x-auto">
      {dataTypes.map((type, index) => (
        <button
          key={index}
          onClick={() => onTypeSelect(type)}
          className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded"
        >
          {type}
        </button>
      ))}
    </div>
  );
};

export default Navbar;
