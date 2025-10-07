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
    <div style={{ fontWeight: 'bold', color: '#3b82f6' }}>Page</div>
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
    <div style={{ fontWeight: 'bold', color: '#10b981' }}>{data.type}</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    <Handle type="source" position={Position.Bottom} />
  </div>
);

const InputNode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #06b6d4', 
    borderRadius: '8px', 
    padding: '10px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Top} />
    <div style={{ fontWeight: 'bold', color: '#06b6d4' }}>Input Field</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    <div style={{ fontSize: '10px', color: '#06b6d4', fontWeight: 'bold' }}>Type: {data.dataType}</div>
    {data.dbColumn && (
      <div style={{ fontSize: '10px', color: '#8b5cf6' }}>DB: {data.dbTable}.{data.dbColumn}</div>
    )}
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
    <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>API</div>
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
    <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>SQL Table</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.label}</div>
    {data.columns && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '5px' }}>
        Columns: {data.columns.join(', ')}
      </div>
    )}
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
  const [showInputModal, setShowInputModal] = useState(false);
  const [showDbModal, setShowDbModal] = useState(false);
  const [inputConfig, setInputConfig] = useState({
    label: '',
    dataType: 'string',
    dbTable: '',
    dbColumn: ''
  });
  const [dbConfig, setDbConfig] = useState({
    tableName: '',
    columns: []
  });

  const nodeTypes = useMemo(() => ({
    pageNode: PageNode,
    componentNode: ComponentNode,
    inputNode: InputNode,
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

  const addNode = (type, nodeType, label, data = {}) => {
    const newNode = {
      id: `${Date.now()}`,
      type: nodeType,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label, type, ...data },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addInputNode = () => {
    const newNode = {
      id: `${Date.now()}`,
      type: 'inputNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: inputConfig.label,
        dataType: inputConfig.dataType,
        dbTable: inputConfig.dbTable,
        dbColumn: inputConfig.dbColumn
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowInputModal(false);
    setInputConfig({ label: '', dataType: 'string', dbTable: '', dbColumn: '' });
  };

  const addDatabaseNode = () => {
    const newNode = {
      id: `${Date.now()}`,
      type: 'databaseNode',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: {
        label: dbConfig.tableName,
        columns: dbConfig.columns
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowDbModal(false);
    setDbConfig({ tableName: '', columns: [] });
  };

  const addColumn = () => {
    setDbConfig(prev => ({
      ...prev,
      columns: [...prev.columns, '']
    }));
  };

  const updateColumn = (index, value) => {
    setDbConfig(prev => ({
      ...prev,
      columns: prev.columns.map((col, i) => i === index ? value : col)
    }));
  };

  const removeColumn = (index) => {
    setDbConfig(prev => ({
      ...prev,
      columns: prev.columns.filter((_, i) => i !== index)
    }));
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
            Add Page
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
            Header
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
            Footer
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
            Image Gallery
          </button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '10px' }}>Form Elements</h3>
          <button 
            onClick={() => setShowInputModal(true)}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #06b6d4',
              background: '#ecfeff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Input Field
          </button>
          <button 
            onClick={() => addNode('Image', 'inputNode', 'Image Upload', { dataType: 'file' })}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #06b6d4',
              background: '#ecfeff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Image Upload
          </button>
          <button 
            onClick={() => addNode('Date', 'inputNode', 'Date Picker', { dataType: 'date' })}
            style={{ 
              width: '100%', 
              padding: '8px', 
              marginBottom: '5px',
              border: '1px solid #06b6d4',
              background: '#ecfeff',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Date Picker
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
            API Endpoint
          </button>
          <button 
            onClick={() => setShowDbModal(true)}
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
            SQL Table
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
            Generate Website
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

      {/* Input Configuration Modal */}
      {showInputModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px'
          }}>
            <h3>Configure Input Field</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Label:</label>
              <input
                type="text"
                value={inputConfig.label}
                onChange={(e) => setInputConfig(prev => ({ ...prev, label: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., Username, Email"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Data Type:</label>
              <select
                value={inputConfig.dataType}
                onChange={(e) => setInputConfig(prev => ({ ...prev, dataType: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="string">String</option>
                <option value="integer">Integer</option>
                <option value="float">Float</option>
                <option value="boolean">Boolean</option>
                <option value="date">Date</option>
                <option value="email">Email</option>
                <option value="file">File</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Database Table:</label>
              <input
                type="text"
                value={inputConfig.dbTable}
                onChange={(e) => setInputConfig(prev => ({ ...prev, dbTable: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., users, products"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Database Column:</label>
              <input
                type="text"
                value={inputConfig.dbColumn}
                onChange={(e) => setInputConfig(prev => ({ ...prev, dbColumn: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., username, email"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addInputNode}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Input
              </button>
              <button
                onClick={() => setShowInputModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Database Configuration Modal */}
      {showDbModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3>Create SQL Table</h3>
            
            <div style={{ marginBottom: '15px' }}>
              <label>Table Name:</label>
              <input
                type="text"
                value={dbConfig.tableName}
                onChange={(e) => setDbConfig(prev => ({ ...prev, tableName: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., users, products"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Columns:</label>
              {dbConfig.columns.map((column, index) => (
                <div key={index} style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                  <input
                    type="text"
                    value={column}
                    onChange={(e) => updateColumn(index, e.target.value)}
                    style={{ flex: 1, padding: '8px' }}
                    placeholder="Column name"
                  />
                  <button
                    onClick={() => removeColumn(index)}
                    style={{
                      padding: '8px',
                      background: '#dc2626',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addColumn}
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '5px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Add Column
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addDatabaseNode}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#8b5cf6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Create Table
              </button>
              <button
                onClick={() => setShowDbModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
