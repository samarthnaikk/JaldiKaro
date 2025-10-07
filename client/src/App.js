import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';

// Custom Node Components
const PageNode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #3b82f6', 
    borderRadius: '8px', 
    padding: '10px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>📄 Page</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const ComponentNode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #10b981', 
    borderRadius: '8px', 
    padding: '10px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontWeight: 'bold', color: '#10b981' }}>🧩 {data.type}</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const APINode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #f59e0b', 
    borderRadius: '8px', 
    padding: '10px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>🔌 API</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const DatabaseNode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #8b5cf6', 
    borderRadius: '8px', 
    padding: '10px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>🗄️ Database</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const initialNodes = [
  {
    id: '1',
    type: 'pageNode',
    position: { x: 250, y: 50 },
    data: { label: 'Homepage' },
  },
  {
    id: '2',
    type: 'componentNode',
    position: { x: 100, y: 150 },
    data: { label: 'Header', type: 'Header' },
  },
  {
    id: '3',
    type: 'componentNode',
    position: { x: 400, y: 150 },
    data: { label: 'Hero Section', type: 'Hero' },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e1-3', source: '1', target: '3' },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(() => ({
    pageNode: PageNode,
    componentNode: ComponentNode,
    apiNode: APINode,
    databaseNode: DatabaseNode,
  }), []);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    []
  );

  const addNode = (type, nodeType, label) => {
    const newNode = {
      id: `${nodes.length + 1}`,
      type: nodeType,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label, type },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '250px', 
        background: '#f8fafc', 
        borderRight: '1px solid #e2e8f0',
        padding: '20px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>JaldiKaro Builder</h2>
        
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Pages</h3>
          <button 
            onClick={() => addNode('Page', 'pageNode', 'New Page')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #3b82f6',
              background: '#eff6ff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            📄 Add Page
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Components</h3>
          <button 
            onClick={() => addNode('Header', 'componentNode', 'Header')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #10b981',
              background: '#ecfdf5',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧩 Header
          </button>
          <button 
            onClick={() => addNode('Footer', 'componentNode', 'Footer')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #10b981',
              background: '#ecfdf5',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧩 Footer
          </button>
          <button 
            onClick={() => addNode('Form', 'componentNode', 'Contact Form')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #10b981',
              background: '#ecfdf5',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧩 Form
          </button>
          <button 
            onClick={() => addNode('Gallery', 'componentNode', 'Image Gallery')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #10b981',
              background: '#ecfdf5',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧩 Gallery
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Backend</h3>
          <button 
            onClick={() => addNode('API', 'apiNode', 'REST API')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #f59e0b',
              background: '#fffbeb',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔌 API Endpoint
          </button>
          <button 
            onClick={() => addNode('Database', 'databaseNode', 'MongoDB')}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #8b5cf6',
              background: '#faf5ff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🗄️ Database
          </button>
        </div>

        <div style={{ marginTop: '40px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button 
            style={{ 
              width: '100%', 
              padding: '12px', 
              background: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            🚀 Generate Website
          </button>
        </div>
      </div>

      {/* Main Canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <MiniMap />
        </ReactFlow>
      </div>
    </div>
  );
}

export default App;
