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
        → {data.dbMapping}
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

// Page Container Component
const PageElement = ({ data, selected }) => (
  <div style={{
    width: data.width || '800px',
    height: data.height || '600px',
    background: data.backgroundColor || '#ffffff',
    border: selected ? '3px solid #ff6b6b' : '2px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    <div style={{
      position: 'absolute',
      top: '-15px',
      left: '10px',
      background: '#3b82f6',
      color: 'white',
      padding: '4px 8px',
      fontSize: '12px',
      borderRadius: '4px',
      fontWeight: 'bold'
    }}>
      📄 {data.pageName || 'Page'}
    </div>
    <div style={{
      width: '100%',
      height: '100%',
      border: '1px dashed #d1d5db',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#9ca3af',
      fontSize: '14px'
    }}>
      Drop form elements here
    </div>
  </div>
);

// Enhanced Input Element with required field support
const EnhancedInputElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '60px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
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
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Dropdown/Select Element
const SelectElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '60px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <select
      style={{
        width: data.width || '200px',
        height: data.height || '40px',
        padding: `${data.paddingY || 8}px ${data.paddingX || 12}px`,
        border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
        borderRadius: data.borderRadius || '4px',
        fontSize: data.fontSize || '14px',
        background: data.backgroundColor || 'white'
      }}
    >
      <option value="">{data.placeholder || 'Select an option'}</option>
      {data.options && data.options.map((option, index) => (
        <option key={index} value={option}>{option}</option>
      ))}
    </select>
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Radio Button (MCQ) Element
const RadioElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '8px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <div style={{
      border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
      borderRadius: data.borderRadius || '4px',
      padding: '8px',
      background: data.backgroundColor || 'white'
    }}>
      {data.options && data.options.map((option, index) => (
        <div key={index} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
          <input
            type="radio"
            name={data.name || 'radio-group'}
            value={option}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontSize: '14px' }}>{option}</span>
        </div>
      ))}
    </div>
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Checkbox Element
const CheckboxElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '8px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <div style={{
      border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
      borderRadius: data.borderRadius || '4px',
      padding: '8px',
      background: data.backgroundColor || 'white'
    }}>
      {data.options && data.options.map((option, index) => (
        <div key={index} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            value={option}
            style={{ marginRight: '8px' }}
          />
          <span style={{ fontSize: '14px' }}>{option}</span>
        </div>
      ))}
    </div>
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Textarea Element
const TextareaElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '80px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <textarea
      placeholder={data.placeholder || ''}
      rows={data.rows || 4}
      style={{
        width: data.width || '250px',
        padding: `${data.paddingY || 8}px ${data.paddingX || 12}px`,
        border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
        borderRadius: data.borderRadius || '4px',
        fontSize: data.fontSize || '14px',
        background: data.backgroundColor || 'white',
        resize: 'vertical'
      }}
    />
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Date Picker Element
const DatePickerElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '60px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <input
      type="date"
      placeholder={data.placeholder || ''}
      min={data.min}
      max={data.max}
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
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Slider (Range) Element
const SliderElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '80px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <div style={{
      border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
      borderRadius: data.borderRadius || '4px',
      padding: '12px',
      background: data.backgroundColor || 'white'
    }}>
      <input
        type="range"
        min={data.min || 0}
        max={data.max || 100}
        step={data.step || 1}
        defaultValue={data.defaultValue || 50}
        style={{
          width: '100%',
          accentColor: data.accentColor || '#3b82f6'
        }}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        fontSize: '10px', 
        color: '#6b7280',
        marginTop: '4px'
      }}>
        <span>{data.min || 0}</span>
        <span>{data.max || 100}</span>
      </div>
    </div>
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Switch (Toggle) Element
const SwitchElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '50px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    <div style={{
      border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
      borderRadius: data.borderRadius || '4px',
      padding: '12px',
      background: data.backgroundColor || 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <div style={{
        position: 'relative',
        width: '44px',
        height: '24px',
        background: data.checked ? (data.activeColor || '#3b82f6') : '#d1d5db',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'background 0.3s'
      }}>
        <div style={{
          position: 'absolute',
          top: '2px',
          left: data.checked ? '22px' : '2px',
          width: '20px',
          height: '20px',
          background: 'white',
          borderRadius: '50%',
          transition: 'left 0.3s',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }}></div>
      </div>
      {data.label && (
        <label style={{ 
          fontSize: '14px',
          color: data.labelColor || '#374151',
          fontWeight: data.required ? 'bold' : 'normal',
          cursor: 'pointer'
        }}>
          {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}
    </div>
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
  </div>
);

// Color Picker Element
const ColorPickerElement = ({ data, selected }) => (
  <div style={{ 
    position: 'relative',
    resize: data.resizable ? 'both' : 'none',
    overflow: 'auto',
    minWidth: '100px',
    minHeight: '70px'
  }}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label style={{ 
        display: 'block', 
        fontSize: '12px', 
        marginBottom: '4px',
        color: data.labelColor || '#374151',
        fontWeight: data.required ? 'bold' : 'normal'
      }}>
        {data.label} {data.required && <span style={{ color: '#ef4444' }}>*</span>}
      </label>
    )}
    <div style={{
      border: selected ? '2px solid #ff6b6b' : `1px solid ${data.borderColor || '#d1d5db'}`,
      borderRadius: data.borderRadius || '4px',
      padding: '12px',
      background: data.backgroundColor || 'white',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    }}>
      <input
        type="color"
        defaultValue={data.defaultColor || '#3b82f6'}
        style={{
          width: '60px',
          height: '40px',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      />
      <div style={{ fontSize: '12px', color: '#6b7280' }}>
        {data.defaultColor || '#3b82f6'}
      </div>
    </div>
    {(data.tableName && data.columnName) && (
      <div style={{ fontSize: '10px', color: '#8b5cf6', marginTop: '2px' }}>
        → {data.tableName}.{data.columnName}
      </div>
    )}
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
    <div style={{ fontWeight: 'bold', color: '#8b5cf6' }}>Database</div>
    <div style={{ fontSize: '12px', color: '#666' }}>SQL Storage</div>
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
  // Page Container
  {
    id: 'page-1',
    type: 'pageElement',
    position: { x: 50, y: 50 },
    data: { 
      pageName: 'Home Page',
      width: '600px',
      height: '400px'
    },
  },
  
  // Backend Layer
  {
    id: 'api-1',
    type: 'apiNode',
    position: { x: 750, y: 150 },
    data: { method: 'POST', endpoint: '/api/users' },
  },
  {
    id: 'db-1',
    type: 'databaseNode',
    position: { x: 950, y: 150 },
    data: {},
  },
];

const initialEdges = [];

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('design'); // 'design' or 'flow'
  const [showInputModal, setShowInputModal] = useState(false);
  const [inputConfig, setInputConfig] = useState({
    label: '',
    inputType: 'text',
    placeholder: '',
    tableName: '',
    columnName: '',
    required: false
  });

  const nodeTypes = useMemo(() => ({
    // Pages
    pageElement: PageElement,
    
    // UI Elements
    buttonElement: ButtonElement,
    inputElement: InputElement,
    enhancedInputElement: EnhancedInputElement,
    selectElement: SelectElement,
    radioElement: RadioElement,
    checkboxElement: CheckboxElement,
    textareaElement: TextareaElement,
    datePickerElement: DatePickerElement,
    sliderElement: SliderElement,
    switchElement: SwitchElement,
    colorPickerElement: ColorPickerElement,
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
    // Get the highest z-index to ensure new elements appear on top
    const maxZIndex = Math.max(...nodes.map(n => n.zIndex || 0), 0);
    
    const newNode = {
      id: `ui-${Date.now()}`,
      type: `${type}Element`,
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      zIndex: maxZIndex + 1,
      data: { ...data, resizable: true },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const addInputElement = () => {
    const maxZIndex = Math.max(...nodes.map(n => n.zIndex || 0), 0);
    
    const newNode = {
      id: `ui-${Date.now()}`,
      type: 'enhancedInputElement',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      zIndex: maxZIndex + 1,
      data: {
        label: inputConfig.label,
        inputType: inputConfig.inputType,
        placeholder: inputConfig.placeholder,
        tableName: inputConfig.tableName,
        columnName: inputConfig.columnName,
        required: inputConfig.required,
        resizable: true
      },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowInputModal(false);
    setInputConfig({ label: '', inputType: 'text', placeholder: '', tableName: '', columnName: '', required: false });
  };

  const addBackendNode = (type, data = {}) => {
    const maxZIndex = Math.max(...nodes.map(n => n.zIndex || 0), 0);
    
    const newNode = {
      id: `${type}-${Date.now()}`,
      type: `${type}Node`,
      position: { x: 400 + Math.random() * 200, y: Math.random() * 300 },
      zIndex: maxZIndex + 1,
      data: { ...data },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const generateWebsite = async () => {
    try {
      console.log('🚀 Starting website generation...');
      console.log('Nodes:', nodes);
      console.log('Edges:', edges);

      // Send the nodes and edges directly as the backend expects
      const websiteData = {
        nodes: nodes,
        edges: edges
      };

      // Send to backend
      const response = await fetch('http://localhost:3001/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(websiteData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Website generation successful:', result);
        alert(`Website generated successfully! File saved to: ${result.filePath}`);
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to generate website:', errorText);
        alert('Failed to generate website. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error generating website:', error);
      alert('Error generating website. Make sure the backend is running.');
    }
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
              <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Pages & Elements</h3>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>PAGES</h4>
                <button 
                  onClick={() => addUIElement('page', { pageName: 'New Page', width: '600px', height: '400px' })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #3b82f6',
                    background: '#eff6ff',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  📄 Add Page
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>FORM ELEMENTS</h4>
                <button 
                  onClick={() => setShowInputModal(true)}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Input Field
                </button>
                <button 
                  onClick={() => addUIElement('select', { 
                    label: 'Dropdown', 
                    placeholder: 'Select option',
                    options: ['Option 1', 'Option 2', 'Option 3']
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Dropdown
                </button>
                <button 
                  onClick={() => addUIElement('radio', { 
                    label: 'Multiple Choice', 
                    options: ['Option A', 'Option B', 'Option C'],
                    name: 'mcq-' + Date.now()
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Multiple Choice
                </button>
                <button 
                  onClick={() => addUIElement('checkbox', { 
                    label: 'Checkboxes', 
                    options: ['Choice 1', 'Choice 2', 'Choice 3']
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Checkboxes
                </button>
                <button 
                  onClick={() => addUIElement('textarea', { 
                    label: 'Text Area', 
                    placeholder: 'Enter long text...',
                    rows: 4
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  Text Area
                </button>
                <button 
                  onClick={() => addUIElement('datePicker', { 
                    label: 'Date Picker', 
                    placeholder: 'Select date'
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  📅 Date Picker
                </button>
                <button 
                  onClick={() => addUIElement('slider', { 
                    label: 'Slider', 
                    min: 0,
                    max: 100,
                    step: 1,
                    defaultValue: 50
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  🎚️ Slider
                </button>
                <button 
                  onClick={() => addUIElement('switch', { 
                    label: 'Toggle Switch',
                    checked: false
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  🔘 Switch
                </button>
                <button 
                  onClick={() => addUIElement('colorPicker', { 
                    label: 'Color Picker',
                    defaultColor: '#3b82f6'
                  })}
                  style={{ 
                    width: '100%', 
                    padding: '8px', 
                    marginBottom: '4px',
                    border: '1px solid #10b981',
                    background: '#ecfdf5',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    textAlign: 'left'
                  }}
                >
                  🎨 Color Picker
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px', color: '#6b7280' }}>UI ELEMENTS</h4>
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
                  onClick={() => addUIElement('button', { text: 'Submit' })}
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
                  onClick={() => addBackendNode('database', {})}
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
                  Database
                </button>
              </div>
            </>
          )}
        </div>

        {/* Generate Button */}
        <div style={{ padding: '20px', borderTop: '1px solid #e2e8f0' }}>
          <button 
            onClick={generateWebsite}
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
              <label>Input Type:</label>
              <select
                value={inputConfig.inputType}
                onChange={(e) => setInputConfig(prev => ({ ...prev, inputType: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="file">File</option>
              </select>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Placeholder:</label>
              <input
                type="text"
                value={inputConfig.placeholder}
                onChange={(e) => setInputConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., Enter your username"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>
                <input
                  type="checkbox"
                  checked={inputConfig.required}
                  onChange={(e) => setInputConfig(prev => ({ ...prev, required: e.target.checked }))}
                  style={{ marginRight: '8px' }}
                />
                Required field
              </label>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Database Table Name:</label>
              <input
                type="text"
                value={inputConfig.tableName}
                onChange={(e) => setInputConfig(prev => ({ ...prev, tableName: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., users, products, orders"
              />
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label>Database Column Name:</label>
              <input
                type="text"
                value={inputConfig.columnName}
                onChange={(e) => setInputConfig(prev => ({ ...prev, columnName: e.target.value }))}
                style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                placeholder="e.g., username, email, first_name"
              />
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={addInputElement}
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
    </div>
  );
}

export default App;
