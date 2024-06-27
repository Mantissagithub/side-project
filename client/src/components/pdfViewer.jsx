import React from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PdfViewer = ({ url }) => {
  return (
    <Worker workerUrl="https://unpkg.com/pdfjs-dist@2.12.313/build/pdf.worker.min.js">
      <div style={{ height: '500px' }}>
        <Viewer fileUrl={url} />
      </div>
    </Worker>
  );
};

export default PdfViewer;
