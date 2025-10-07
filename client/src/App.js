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

// UI Element Components (Figma-style)
const ButtonElement = ({ data, selected }) => (
  <div style={{ 
    background: data.backgroundColor || '#3b82f6',
    color: data.textColor || 'white',
    padding: `${data.paddingY || 10}px ${data.paddingX || 20}px`,
    borderRadius: data.borderRadius || '6px',
    border: selected ? '2px solid #ff6b6b' : 'none',
    cursor: 'pointer',
    fontSize: data.fontSize || '14px',
    fontWeight: data.fontWeight || 'normal',
    minWidth: data.width || 'auto',
    minHeight: data.height || 'auto',
    display: 'inline-block'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.text || 'Button'}
  </div>
);

const InputElement = ({ data, selected }) => (
  <div style={{ position: 'relative' }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151'
      }}>
        {data.label}
      </label>
    )}
    <input
      type={data.inputType || 'text'}
      placeholder={data.placeholder || ''}
      style={{
        width: data.width || '200px',
        height: data.height || '40px',
        padding: `${data.paddingY || 8}px ${data.paddingX || 12}px`,
        border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
        borderRadius: data.borderRadius || '4px',
        fontSize: data.fontSize || '14px',
        background: data.backgroundColor || 'white'
      }}
    />
    {data.dbMapping && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.dbTable}.{data.dbColumn}
      </div>
    )}
  </div>
);

const TextElement = ({ data, selected }) => (
  <div style={{
    color: data.color || '#000',
    fontSize: data.fontSize || '16px',
    fontWeight: data.fontWeight || 'normal',
    fontFamily: data.fontFamily || 'Arial, sans-serif',
    textAlign: data.textAlign || 'left',
    border: selected ? '2px dashed #ff6b6b' : '2px dashed transparent',
    padding: '4px',
    minWidth: '50px',
    minHeight: '20px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.text || 'Text Element'}
  </div>
);

const ImageElement = ({ data, selected }) => (
  <div style={{
    width: data.width || '200px',
    height: data.height || '150px',
    border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
    borderRadius: data.borderRadius || '4px',
    overflow: 'hidden',
    background: data.backgroundColor || '#f3f4f6',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.src ? (
      <img src={data.src} alt={data.alt || ''} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    ) : (
      <div style={{ color: '#9ca3af', fontSize: '12px' }}>Image Placeholder</div>
    )}
  </div>
);

const ContainerElement = ({ data, selected }) => (
  <div style={{
    width: data.width || '300px',
    height: data.height || '200px',
    background: data.backgroundColor || '#f9fafb',
    border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#e5e7eb'}`,
    borderRadius: data.borderRadius || '8px',
    padding: data.padding || '16px',
    position: 'relative'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    <div style={{ color: '#6b7280', fontSize: '12px' }}>
      {data.label || 'Container'}
    </div>
  </div>
);

// Backend Flow Components (n8n-style)
const APINode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #f59e0b', 
    borderRadius: '8px', 
    padding: '12px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Left} />
    <div style={{ fontWeight: 'bold', color: '#f59e0b' }}>API Endpoint</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.method || 'POST'} {data.endpoint || '/api/submit'}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const DatabaseNode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #8b5cf6', 
    borderRadius: '8px', 
    padding: '12px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Left} />
    <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>SQL Table</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.tableName || 'users'}</div>
    {data.columns && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '4px' }}>
        {data.columns.slice(0, 3).join(', ')}
        {data.columns.length > 3 && '...'}
      </div>
    )}
    <Handle type="source" position={Position.Right} />
  </div>
);

const ValidationNode = ({ data }) => (
  <div style={{ 
    background: '#fff', 
    border: '2px solid #ef4444', 
    borderRadius: '8px', 
    padding: '12px',
    minWidth: '150px'
  }}>
    <Handle type="target" position={Position.Left} />
    <div style={{ fontWeight: 'bold', color: '#ef4444' }}>Validation</div>
    <div style={{ fontSize: '12px', color: '#666' }}>{data.type || 'Required'}</div>
    <Handle type="source" position={Position.Right} />
  </div>
);

const initialNodes = [
  // UI Layer
  {
    id: 'ui-1',
    type: 'inputElement',
    position: { x: 50, y: 100 },
    data: { 
      label: 'Username', 
      placeholder: 'Enter username',
      width: '200px',
      dbMapping: true,
      dbTable: 'users',
      dbColumn: 'username'
    },
  },
  {
    id: 'ui-2',
    type: 'buttonElement',
    position: { x: 50, y: 200 },
    data: { text: 'Submit', backgroundColor: '#10b981' },
  },
  
  // Backend Layer
  {
    id: 'api-1',
    type: 'apiNode',
    position: { x: 400, y: 150 },
    data: { method: 'POST', endpoint: '/api/users' },
  },
  {
    id: 'db-1',
    type: 'databaseNode',
    position: { x: 650, y: 150 },
    data: { tableName: 'users', columns: ['id', 'username', 'email', 'created_at'] },
  },
];

const initialEdges = [
  { id: 'e1', source: 'ui-2', target: 'api-1', type: 'smoothstep' },
  { id: 'e2', source: 'api-1', target: 'db-1', type: 'smoothstep' },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'flow'
  const [showElementModal, setShowElementModal] = useState(false);
  const [elementType, setElementType] = useState('');

  const nodeTypes = useMemo(() => ({
    // UI Elements
    buttonElement: ButtonElement,
    inputElement: InputElement,
    textElement: TextElement,
    imageElement: ImageElement,
    containerElement: ContainerElement,
    
    // Backend Flow
    apiNode: APINode,
    databaseNode: DatabaseNode,
    validationNode: ValidationNode,
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

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node.id);
  }, []);

  const addUIElement = (type, data = {}) => {
    const newNode = {
      id: `ui-${Date.now()}`,
      type: `${type}Element`,
      position: { x: Math.random() * 300, y: Math.random() * 300 },
      data: { ...data },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addBackendNode = (type, data = {}) => {
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: `${type}Node`,
      position: { x: 400 + Math.random() * 200, y: Math.random() * 300 },
      data: { ...data },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const TabButton = ({ id, label, active, onClick }) => (
    <button
      onClick={() => onClick(id)}
      style={{
        padding: '8px 16px',
        background: active ? '#3b82f6' : '#f3f4f6',
        color: active ? 'white' : '#374151',
        border: 'none',
        borderRadius: '6px 6px 0 0',
        cursor: 'pointer',
        fontWeight: active ? 'bold' : 'normal'
      }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex' }}>
      {/* Sidebar */}
      <div style={{ 
        width: '280px', 
        background: '#f8fafc', 
        borderRight: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Tab Headers */}
        <div style={{ 
          display: 'flex', 
          padding: '10px',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <TabButton 
            id="design" 
            label="Design" 
            active={activeTab === 'design'} 
            onClick={setActiveTab} 
          />
          <TabButton 
            id="flow" 
            label="Backend Flow" 
            active={activeTab === 'flow'} 
            onClick={setActiveTab} 
          />
        </div>

        {/* Tab Content */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {activeTab === 'design' && (
            <>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>UI Elements</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>BASIC</h4>
                <button 
                  onClick={() => addUIElement('text', { text: 'Heading', fontSize: '24px', fontWeight: 'bold' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Text
                </button>
                <button 
                  onClick={() => addUIElement('button', { text: 'Button' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Button
                </button>
                <button 
                  onClick={() => addUIElement('image', { width: '200px', height: '150px' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Image
                </button>
                <button 
                  onClick={() => addUIElement('container', { width: '300px', height: '200px' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Container
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>FORM ELEMENTS</h4>
                <button 
                  onClick={() => addUIElement('input', { 
                    label: 'Input Field', 
                    placeholder: 'Enter text',
                    inputType: 'text'
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Input Field
                </button>
                <button 
                  onClick={() => addUIElement('input', { 
                    label: 'Email', 
                    placeholder: 'Enter email',
                    inputType: 'email'
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Email Input
                </button>
                <button 
                  onClick={() => addUIElement('input', { 
                    label: 'Password', 
                    placeholder: 'Enter password',
                    inputType: 'password'
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #d1d5db',
                    background: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Password Input
                </button>
              </div>
            </>
          )}

          {activeTab === 'flow' && (
            <>
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Backend Flow</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>API</h4>
                <button 
                  onClick={() => addBackendNode('api', { method: 'POST', endpoint: '/api/submit' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #f59e0b',
                    background: '#fffbeb',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  API Endpoint
                </button>
                <button 
                  onClick={() => addBackendNode('validation', { type: 'Required Field' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #ef4444',
                    background: '#fef2f2',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Validation
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>DATABASE</h4>
                <button 
                  onClick={() => addBackendNode('database', { 
                    tableName: 'new_table', 
                    columns: ['id', 'name', 'email'] 
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #8b5cf6',
                    background: '#faf5ff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  SQL Table
                </button>
              </div>
            </>
          )}
        </div>

        {/* Generate Button */}
        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
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
      <div style={{ flex: 1, position: 'relative' }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background variant="dots" gap={20} size={1} />
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              if (node.type?.includes('Element')) return '#3b82f6';
              if (node.type === 'apiNode') return '#f59e0b';
              if (node.type === 'databaseNode') return '#8b5cf6';
              return '#6b7280';
            }}
          />
        </ReactFlow>

        {/* Canvas Info */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          background: 'rgba(255,255,255,0.9)',
          padding: '8px 12px',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#6b7280'
        }}>
          {activeTab === 'design' ? 'Design Canvas - Drag UI elements here' : 'Flow Canvas - Connect elements to backend'}
        </div>
      </div>
    </div>
  );
}

export default App;
