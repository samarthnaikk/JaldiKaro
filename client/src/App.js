import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';

function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <h2>JaldiKaro Website Builder (Drag & Drop)</h2>
      <ReactFlow />
      {/* Add controls, sidebar, and generate button here */}
    </div>
  );
}

export default App;
