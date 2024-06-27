import React, { useState } from 'react';
import { FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa';

const Sidebar = ({ folderStructure, onFolderSelect }) => {
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (folderPath) => {
    setOpenFolders({
      ...openFolders,
      [folderPath]: !openFolders[folderPath]
    });
  };

  const renderFolder = (folder, currentPath = '') => {
    const folderPath = `${currentPath}/${folder.name}`;
    const isOpen = openFolders[folderPath] || false;

    return (
      <div key={folder.name} className="ml-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => {
            toggleFolder(folderPath);
            if (folder.children) {
              onFolderSelect(folderPath);
            }
          }}
        >
          {folder.children ? (
            isOpen ? <FaFolderOpen className="mr-2" /> : <FaFolder className="mr-2" />
          ) : <FaFile className="mr-2" />}
          {folder.name}
        </div>
        {folder.children && isOpen && folder.children.map(child => renderFolder(child, folderPath))}
      </div>
    );
  };

  return (
    <div className="w-64 bg-gray-800 text-white p-4 overflow-y-auto">
      <h2 className="text-xl font-bold">Folder Structure</h2>
      <div>
        {folderStructure.map(folder => renderFolder(folder))}
      </div>
    </div>
  );
};

export default Sidebar;
