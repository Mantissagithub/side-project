import React from 'react';
import PdfViewer from './pdfViewer';
import CodeViewer from './codeViewer';

const MainContent = ({ files }) => {
  return (
    <div className="flex flex-wrap p-4">
      {files.map((file, index) => (
        <div key={index} className="m-2 p-2 border rounded">
          {file.fileType === 'pdf' && <PdfViewer url={`http://localhost:5000${file.filePath}`} />}
          {file.fileType === 'py' && <CodeViewer url={`http://localhost:5000${file.filePath}`} />}
          {/* Add more conditions here for other file types */}
        </div>
      ))}
    </div>
  );
};

export default MainContent;
