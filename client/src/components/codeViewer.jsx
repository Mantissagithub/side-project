import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CodeViewer = ({ url }) => {
  const [code, setCode] = useState('');

  useEffect(() => {
    axios.get(url).then(response => setCode(response.data));
  }, [url]);

  return (
    <pre style={{ whiteSpace: 'pre-wrap' }}>
      <code>{code}</code>
    </pre>
  );
};

export default CodeViewer;
