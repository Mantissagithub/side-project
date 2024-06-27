import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import Sidebar from './components/sideBar';
import Navbar from './components/appBar';
import MainContent from './components/mainContent';

const App = () => {
  const [folderStructure, setFolderStructure] = useState([]);
  const [dataTypes, setDataTypes] = useState([]);
  const [filteredDataTypes, setFilteredDataTypes] = useState([]);
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState(null);

  useEffect(() => {
    // Fetch data types and folder structure initially
    fetchData();
  }, []);

  const fetchData = () => {
    axios.get('http://localhost:5000/file-types')
      .then(res => {
        setDataTypes(res.data);
        setFilteredDataTypes(res.data);
      });
    axios.get('http://localhost:5000/folder-structure')
      .then(res => setFolderStructure(res.data));
  };

  const onDrop = (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append('files', file);
    });

    setIsLoading(true);

    axios.post('http://localhost:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setUploadProgress(percentCompleted);
      }
    }).then(() => {
      fetchData();
      setIsLoading(false);
      setUploadProgress(0);
    }).catch(error => {
      console.error('Error uploading folder:', error);
      setIsLoading(false);
      setUploadProgress(0);
    });
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleTypeSelect = (type) => {
    axios.get(`http://localhost:5000/files?type=${type}`)
      .then(response => setFiles(response.data));
  };

  const handleFolderSelect = (folderPath) => {
    setSelectedFolder(folderPath);
    if (folderPath) {
      axios.get(`http://localhost:5000/files?folderPath=${folderPath}`)
        .then(response => {
          const fileTypesInFolder = [...new Set(response.data.map(file => file.fileType))];
          setFiles(response.data);
          setFilteredDataTypes(dataTypes.filter(type => fileTypesInFolder.includes(type)));
        });
    } else {
      setFiles([]);
      setFilteredDataTypes(dataTypes);
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar folderStructure={folderStructure} onFolderSelect={handleFolderSelect} />
      <div className="flex flex-col flex-1">
        <div className="p-4">
          <div {...getRootProps()} className="p-4 border-dashed border-4 border-gray-600 text-center cursor-pointer">
            <input {...getInputProps()} directory="" webkitdirectory="" type="file" multiple />
            <p>Drag 'n' drop a folder here, or click to select a folder</p>
          </div>
          {isLoading && (
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Uploading...
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {uploadProgress}%
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: `${uploadProgress}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-600"></div>
              </div>
            </div>
          )}
        </div>
        <Navbar dataTypes={filteredDataTypes} onTypeSelect={handleTypeSelect} />
        <MainContent files={files} />
      </div>
    </div>
  );
};

export default App;
