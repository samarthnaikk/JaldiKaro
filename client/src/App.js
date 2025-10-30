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
  NodeResizer,
} from 'reactflow';
import 'reactflow/dist/style.css';

const style = document.createElement('style');
style.textContent = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

:root { 
  /* Enhanced Color System */
  --primary: #3b82f6; --primary-light: #60a5fa; --primary-dark: #1d4ed8;
  --secondary: #8b5cf6; --secondary-light: #a78bfa; --secondary-dark: #6d28d9;
  --success: #10b981; --success-light: #34d399; --success-dark: #047857;
  --error: #ef4444; --error-light: #f87171; --error-dark: #dc2626;
  --warning: #f59e0b; --warning-light: #fbbf24; --warning-dark: #d97706;
  --info: #06b6d4; --info-light: #22d3ee; --info-dark: #0891b2;
  
  /* Professional Light Theme */
  --bg: #ffffff; --bg-secondary: #f8fafc; --bg-tertiary: #f1f5f9;
  --text: #0f172a; --text-secondary: #64748b; --text-tertiary: #94a3b8;
  --sidebar: #ffffff; --sidebar-border: #e2e8f0; 
  --border: #e2e8f0; --border-light: #f1f5f9; --border-dark: #cbd5e1;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05); 
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  
  /* Enhanced Typography */
  --font-xs: 12px; --font-sm: 14px; --font-base: 16px; --font-lg: 18px; 
  --font-xl: 20px; --font-2xl: 24px; --font-3xl: 30px; --font-4xl: 36px;
  --line-height-tight: 1.25; --line-height-normal: 1.5; --line-height-relaxed: 1.75;
  
  /* Enhanced Spacing */
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-5: 1.25rem; --space-6: 1.5rem; --space-8: 2rem; --space-10: 2.5rem;
  --space-12: 3rem; --space-16: 4rem; --space-20: 5rem;
  
  /* Border Radius */
  --radius-sm: 0.125rem; --radius: 0.25rem; --radius-md: 0.375rem; 
  --radius-lg: 0.5rem; --radius-xl: 0.75rem; --radius-2xl: 1rem; --radius-full: 9999px;
  
  /* Transitions */
  --transition-fast: 0.15s ease-out; --transition: 0.2s ease-out; --transition-slow: 0.3s ease-out;
}

[data-theme="dark"] { 
  /* Professional Dark Theme */
  --bg: #0f172a; --bg-secondary: #1e293b; --bg-tertiary: #334155;
  --text: #f8fafc; --text-secondary: #cbd5e1; --text-tertiary: #94a3b8;
  --sidebar: #1e293b; --sidebar-border: #334155;
  --border: #334155; --border-light: #475569; --border-dark: #1e293b;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.3); 
  --shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.4), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.3);
}

/* Enhanced Base Styles with Performance Optimization */
*, *::before, *::after { 
  margin: 0; padding: 0; box-sizing: border-box; 
}

html { font-size: 16px; scroll-behavior: smooth; }

body { 
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  background: var(--bg); color: var(--text); 
  transition: background var(--transition-slow), color var(--transition-slow);
  line-height: var(--line-height-normal);
  -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* Professional Animation Library */
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.8; } }
@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }

/* Enhanced Interactive Elements */
.interactive { 
  cursor: pointer; transition: all var(--transition); 
  transform-origin: center; will-change: transform, box-shadow;
}
.interactive:hover { transform: translateY(-1px); box-shadow: var(--shadow-md); }
.interactive:active { transform: translateY(0); box-shadow: var(--shadow); }

/* Enhanced Form Elements */
input, textarea, select { 
  width: 100%; padding: var(--space-3) var(--space-4); 
  border: 1px solid var(--border); border-radius: var(--radius-md);
  background: var(--bg); color: var(--text); font-size: var(--font-sm);
  transition: all var(--transition); font-family: inherit;
}
input:hover, textarea:hover, select:hover { 
  border-color: var(--primary-light); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); 
}
input:focus, textarea:focus, select:focus { 
  outline: none; border-color: var(--primary); 
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); 
}
input:disabled, textarea:disabled, select:disabled {
  opacity: 0.6; cursor: not-allowed; background: var(--bg-secondary);
}

/* Professional Button System */
.btn { 
  display: inline-flex; align-items: center; justify-content: center; gap: var(--space-2);
  padding: var(--space-3) var(--space-6); border: none; border-radius: var(--radius-md);
  font-size: var(--font-sm); font-weight: 500; font-family: inherit;
  cursor: pointer; transition: all var(--transition); text-decoration: none;
  position: relative; overflow: hidden; user-select: none;
}
.btn:focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }
.btn:disabled { opacity: 0.6; cursor: not-allowed; transform: none !important; }

.btn-primary { background: var(--primary); color: white; }
.btn-primary:hover:not(:disabled) { background: var(--primary-dark); transform: translateY(-1px); box-shadow: var(--shadow-md); }

.btn-secondary { background: var(--bg-secondary); color: var(--text); border: 1px solid var(--border); }
.btn-secondary:hover:not(:disabled) { background: var(--bg-tertiary); border-color: var(--border-dark); }

.btn-success { background: var(--success); color: white; }
.btn-success:hover:not(:disabled) { background: var(--success-dark); }

.btn-error { background: var(--error); color: white; }
.btn-error:hover:not(:disabled) { background: var(--error-dark); }

.btn-ghost { background: transparent; color: var(--text-secondary); }
.btn-ghost:hover:not(:disabled) { background: var(--bg-secondary); color: var(--text); }

.btn-sm { padding: var(--space-2) var(--space-4); font-size: var(--font-xs); }
.btn-lg { padding: var(--space-4) var(--space-8); font-size: var(--font-lg); }

/* Enhanced Typography */
h1, h2, h3, h4, h5, h6 { font-weight: 600; line-height: var(--line-height-tight); margin: 0; }
h1 { font-size: var(--font-3xl); color: var(--text); }
h2 { font-size: var(--font-2xl); color: var(--text); }
h3 { font-size: var(--font-xl); color: var(--text); }
h4 { font-size: var(--font-lg); color: var(--text-secondary); font-weight: 500; }
h5 { font-size: var(--font-base); color: var(--text-secondary); font-weight: 500; }
h6 { font-size: var(--font-sm); color: var(--text-tertiary); font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em; }

p { line-height: var(--line-height-relaxed); color: var(--text-secondary); }
label { color: var(--text); font-size: var(--font-sm); font-weight: 500; display: block; margin-bottom: var(--space-1); }

/* Professional Card System */
.card { 
  background: var(--bg); border: 1px solid var(--border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm); transition: all var(--transition);
}
.card:hover { box-shadow: var(--shadow-md); border-color: var(--border-dark); }
.card-header { padding: var(--space-6); border-bottom: 1px solid var(--border); }
.card-body { padding: var(--space-6); }
.card-footer { padding: var(--space-6); border-top: 1px solid var(--border); background: var(--bg-secondary); }

/* Enhanced Tables */
table { width: 100%; border-collapse: collapse; border-spacing: 0; }
table th, table td { 
  padding: var(--space-4); text-align: left; border-bottom: 1px solid var(--border-light);
  font-size: var(--font-sm);
}
table th { 
  background: var(--bg-secondary); font-weight: 600; color: var(--text-secondary);
  position: sticky; top: 0; z-index: 10;
}
table tbody tr:hover { background: var(--bg-secondary); }
table tbody tr:nth-child(even) { background: rgba(0,0,0,0.02); }
[data-theme="dark"] table tbody tr:nth-child(even) { background: rgba(255,255,255,0.02); }

/* Utility Classes */
.fade-in { animation: fadeIn var(--transition-slow) ease; }
.fade-in-up { animation: fadeInUp var(--transition-slow) ease; }
.fade-in-down { animation: fadeInDown var(--transition-slow) ease; }
.slide-in-left { animation: slideInLeft var(--transition-slow) ease; }
.slide-in-right { animation: slideInRight var(--transition-slow) ease; }
.scale-in { animation: scaleIn var(--transition) ease; }
.float { animation: float 3s ease-in-out infinite; }

.text-center { text-align: center; }
.text-left { text-align: left; }
.text-right { text-align: right; }
.font-mono { font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace; }

/* Loading States */
.loading { position: relative; overflow: hidden; }
.loading::after {
  content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0% { left: -100%; } 100% { left: 100%; } }

/* Accessibility Enhancements */
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
@media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; } }
.focus-visible { outline: 2px solid var(--primary); outline-offset: 2px; }

/* Enhanced Scrollbars */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: var(--bg-secondary); }
::-webkit-scrollbar-thumb { background: var(--border-dark); border-radius: var(--radius-full); }
::-webkit-scrollbar-thumb:hover { background: var(--text-tertiary); }

/* Enhanced Responsive Design */
@media (max-width: 1280px) {
  [data-sidebar] { width: 260px !important; }
  .btn { padding: var(--space-2) var(--space-4); font-size: var(--font-xs); }
}

@media (max-width: 1024px) {
  [data-sidebar] { width: 240px !important; }
  h1 { font-size: var(--font-2xl) !important; }
  h2 { font-size: var(--font-xl) !important; }
  h3 { font-size: var(--font-lg) !important; }
  .card { margin: var(--space-4); }
}

@media (max-width: 768px) { 
  :root { --font-xs: 11px; --font-sm: 12px; --font-base: 14px; --font-lg: 16px; }
  
  [data-sidebar] { 
    width: 100% !important; position: fixed; bottom: 0; left: 0; right: 0;
    height: auto; max-height: 60vh; overflow-y: auto; z-index: 1000;
    border-right: none; border-top: 1px solid var(--border); 
    padding: var(--space-4) !important; background: var(--sidebar);
    box-shadow: var(--shadow-xl); border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  }
  
  [data-canvas] { height: 40vh; overflow: hidden; }
  
  .btn { padding: var(--space-2) var(--space-3); font-size: var(--font-xs); }
  [data-tab-button] { padding: var(--space-2) var(--space-3); font-size: var(--font-xs); }
  
  input, textarea, select { 
    font-size: 16px !important; padding: var(--space-3); 
    -webkit-appearance: none; border-radius: var(--radius-md);
  }
  
  h1 { font-size: var(--font-xl) !important; }
  h2 { font-size: var(--font-lg) !important; }
  h3 { font-size: var(--font-base) !important; }
  h4 { font-size: var(--font-sm) !important; }
  
  table th, table td { padding: var(--space-2); font-size: var(--font-xs); }
  .card { margin: var(--space-2); border-radius: var(--radius-md); }
  .card-body, .card-header, .card-footer { padding: var(--space-4); }
}

@media (max-width: 480px) {
  [data-sidebar] { max-height: 70vh; padding: var(--space-3) !important; }
  [data-canvas] { height: 30vh; }
  .btn { padding: var(--space-1) var(--space-2); }
  h1 { font-size: var(--font-lg) !important; }
  h2 { font-size: var(--font-base) !important; }
  input, textarea, select { padding: var(--space-2); }
}

/* High Contrast Mode Support */
@media (prefers-contrast: high) {
  :root {
    --border: #000000; --border-light: #333333; --border-dark: #000000;
    --text-secondary: #000000; --text-tertiary: #333333;
  }
  [data-theme="dark"] {
    --border: #ffffff; --border-light: #cccccc; --border-dark: #ffffff;
    --text-secondary: #ffffff; --text-tertiary: #cccccc;
  }
}

/* Print Styles */
@media print {
  * { background: white !important; color: black !important; box-shadow: none !important; }
  [data-sidebar] { display: none !important; }
  [data-canvas] { width: 100% !important; height: auto !important; }
}
`;
document.head.appendChild(style);

const ButtonElement = ({ data, selected }) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      aria-label={data.text || 'Button'}
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ 
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
        display: 'inline-block',
        transform: hover ? 'scale(1.05)' : 'scale(1)',
        opacity: hover ? 0.8 : 1,
        transition: 'all 0.2s ease'
      }}>
      <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
      {data.text || 'Button'}
    </button>
  );
};

const InputElement = ({ data, selected }) => (
  <div style={{ position: 'relative' }} role="group" aria-labelledby={`label-${data.id}`}>
    <Handle type="source" position={Position.Right} style={{ background: '#ff6b6b' }} />
    {data.label && (
      <label id={`label-${data.id}`} style={{ 
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
      aria-label={data.label || data.placeholder || 'Input field'}
      aria-required={data.required || false}
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '60px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={60}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
        width: '90%',
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '60px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={60}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
        width: '90%',
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
    width: '100%',
    height: '100%',
    minWidth: '100px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={80}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
    width: '100%',
    height: '100%',
    minWidth: '100px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={80}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '80px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={80}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '60px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={60}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '80px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={80}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '50px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={50}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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
    width: '100%',
    height: '100%',
    minWidth: '100px',
    minHeight: '70px'
  }}>
    <NodeResizer 
      isVisible={selected} 
      minWidth={100} 
      minHeight={70}
      lineStyle={{ borderColor: '#ff6b6b', borderWidth: 2 }}
      handleStyle={{ background: '#ff6b6b', width: 8, height: 8 }}
    />
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

const GenerateBtn = ({ onClick, loading }) => {
  const [h, setH] = useState(false);
  return (
    <button 
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{ 
        width: '100%', 
        padding: '12px', 
        background: loading ? '#9ca3af' : '#dc2626',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        transform: h && !loading ? 'scale(1.02)' : 'scale(1)',
        opacity: loading ? 0.7 : (h ? 0.9 : 1),
        transition: 'all 0.2s ease'
      }}
    >
      {loading ? '⏳ Generating...' : 'Generate Website'}
    </button>
  );
};

const SidebarBtn = ({ onClick, style, children }) => {
  const [h, setH] = useState(false);
  return (
    <button 
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        ...style,
        opacity: h ? 0.7 : 1,
        transition: 'opacity 0.2s ease'
      }}
    >
      {children}
    </button>
  );
};

const LoadingOverlay = () => (
  <div role="alert" aria-live="polite" aria-busy="true" style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{
      background: 'white',
      padding: '30px 40px',
      borderRadius: '12px',
      textAlign: 'center',
      boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
    }}>
      <div aria-label="Loading spinner" style={{
        width: '50px',
        height: '50px',
        border: '4px solid #f3f4f6',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 15px'
      }} />
      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#374151' }}>Generating Website...</div>
      <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>Please wait</div>
    </div>
  </div>
);

const Toast = ({ msg, type, onClose }) => (
  <div role="alert" aria-live="assertive" style={{
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6',
    color: 'white',
    padding: '12px 20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
    zIndex: 10000,
    animation: 'slideIn 0.3s ease',
    minWidth: '250px',
    cursor: 'pointer'
  }} onClick={onClose}>
    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
      {type === 'error' ? '❌ Error' : type === 'success' ? '✅ Success' : 'ℹ️ Info'}
    </div>
    <div style={{ fontSize: '13px' }}>{msg}</div>
  </div>
);

const ErrorPage = ({ code = '404', message = 'Page Not Found', onBack }) => (
  <div role="main" className="slide-up" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', background: 'var(--bg)', color: 'var(--text)', textAlign: 'center', padding: '20px' }}>
    <h1 aria-label={`Error ${code}`} style={{ fontSize: '120px', fontWeight: '700', margin: '0', color: 'var(--primary)' }}>{code}</h1>
    <h2 style={{ fontSize: '24px', fontWeight: '600', margin: '10px 0' }}>{message}</h2>
    <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '400px' }}>
      {code === '404' ? "The page you're looking for doesn't exist or has been moved." : "Something went wrong. Please try again later."}
    </p>
    <button onClick={onBack} aria-label="Go back to home page" style={{ padding: '12px 24px', background: 'var(--primary)', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
      ← Go Back Home
    </button>
  </div>
);

function App() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const [selectedNode, setSelectedNode] = useState(null);
  const [activeTab, setActiveTab] = useState('design');
  const [showInputModal, setShowInputModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [toast, setToast] = useState(null);
  const [showError, setShowError] = useState(false);
  const [inputConfig, setInputConfig] = useState({
    label: '',
    inputType: 'text',
    placeholder: '',
    tableName: '',
    columnName: '',
    required: false
  });

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

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
    setLoading(true);
    try {
      console.log('🚀 Starting website generation...');
      console.log('Nodes:', nodes);
      console.log('Edges:', edges);

      const websiteData = {
        nodes: nodes,
        edges: edges
      };

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
        showToast(`Website generated successfully!`, 'success');
      } else {
        const errorText = await response.text();
        console.error('❌ Failed to generate website:', errorText);
        showToast('Failed to generate website. Please try again.', 'error');
      }
    } catch (error) {
      console.error('❌ Error generating website:', error);
      showToast('Error: Make sure backend is running.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, active, onClick }) => {
    const [h, setH] = useState(false);
    return (
      <button
        className={`btn ${active ? 'btn-primary' : 'btn-ghost'} fade-in`}
        data-tab-button
        role="tab"
        aria-selected={active}
        aria-controls={`${id}-panel`}
        tabIndex={active ? 0 : -1}
        onClick={() => onClick(id)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick(id);
          }
        }}
        onMouseEnter={() => setH(true)}
        onMouseLeave={() => setH(false)}
        style={{
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          fontWeight: active ? '600' : '500',
          fontSize: 'var(--font-sm)',
          padding: 'var(--space-3) var(--space-6)',
          transform: h && !active ? 'translateY(-2px)' : 'translateY(0)',
          transition: 'all var(--transition)',
          border: 'none',
          position: 'relative'
        }}
      >
        {label}
        {active && (
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'var(--primary)',
            borderRadius: 'var(--radius-full)'
          }} />
        )}
      </button>
    );
  };

  return (
    <>
      {showError ? (
        <ErrorPage code="404" message="Page Not Found" onBack={() => setShowError(false)} />
      ) : (
        <>
      {loading && <LoadingOverlay />}
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      <div 
        data-theme={darkMode ? 'dark' : 'light'} 
        className="fade-in"
        style={{ 
          height: '100vh', 
          width: '100vw', 
          display: 'flex', 
          background: 'var(--bg)',
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
        }}
      >
      <div data-sidebar className="slide-in-left" style={{ 
        width: '320px', 
        background: 'var(--sidebar)', 
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: 'var(--shadow-md)',
        zIndex: 10
      }}>
        {/* Enhanced Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: 'var(--space-4)', 
          borderBottom: '1px solid var(--border)',
          background: 'var(--bg)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ 
              fontSize: 'var(--font-lg)', 
              fontWeight: '700', 
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: 'var(--success)',
                borderRadius: 'var(--radius-full)',
                animation: 'pulse 2s infinite'
              }} />
              JaldiKaro
            </div>
          </div>
          
          <button 
            className="btn btn-ghost btn-sm interactive"
            onClick={() => setDarkMode(!darkMode)} 
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setDarkMode(!darkMode);
              }
            }}
            aria-label={`Switch to ${darkMode ? 'light' : 'dark'} mode`}
            aria-pressed={darkMode}
            style={{ 
              fontSize: 'var(--font-lg)',
              borderRadius: 'var(--radius-full)',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>

        {/* Enhanced Tab Navigation */}
        <div role="tablist" style={{ 
          display: 'flex', 
          padding: 'var(--space-4) var(--space-4) 0',
          background: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border)'
        }}>
          <TabButton id="design" label="Design" active={activeTab === 'design'} onClick={setActiveTab} />
          <TabButton id="flow" label="Backend Flow" active={activeTab === 'flow'} onClick={setActiveTab} />
        </div>

        {/* Enhanced Tab Content */}
        <div style={{ 
          flex: 1, 
          padding: 'var(--space-6)', 
          overflowY: 'auto',
          background: 'var(--bg)'
        }}>
          {activeTab === 'design' && (
            <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 var(--space-4) 0', 
                  fontSize: 'var(--font-xl)',
                  fontWeight: '700',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span style={{
                    width: '4px',
                    height: '20px',
                    background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                    borderRadius: 'var(--radius-full)'
                  }} />
                  Design Elements
                </h3>
              </div>
              
              {/* Pages Section */}
              <div className="card">
                <div className="card-header" style={{ padding: 'var(--space-4)' }}>
                  <h6 style={{ margin: 0, color: 'var(--text-secondary)' }}>Pages</h6>
                </div>
                <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                  <button 
                    className="btn btn-primary interactive fade-in"
                    onClick={() => addUIElement('page', { pageName: 'New Page', width: '600px', height: '400px' })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                    }}
                  >
                    📄 Add New Page
                  </button>
                </div>
              </div>

              {/* Form Elements Section */}
              <div className="card">
                <div className="card-header" style={{ padding: 'var(--space-4)' }}>
                  <h6 style={{ margin: 0, color: 'var(--text-secondary)' }}>Form Elements</h6>
                </div>
                <div className="card-body" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => setShowInputModal(true)}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    📝 Input Field
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('select', { 
                      label: 'Dropdown', 
                      placeholder: 'Select option',
                      options: ['Option 1', 'Option 2', 'Option 3']
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    📋 Dropdown
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('radio', { 
                      label: 'Multiple Choice', 
                      options: ['Option A', 'Option B', 'Option C'],
                      name: 'mcq-' + Date.now()
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    ⚪ Multiple Choice
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('checkbox', { 
                      label: 'Checkboxes', 
                      options: ['Choice 1', 'Choice 2', 'Choice 3']
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    ☑️ Checkboxes
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('textarea', { 
                      label: 'Text Area', 
                      placeholder: 'Enter long text...',
                      rows: 4
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    📄 Text Area
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('datePicker', { 
                      label: 'Date Picker', 
                      placeholder: 'Select date'
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    📅 Date Picker
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('slider', { 
                      label: 'Slider', 
                      min: 0,
                      max: 100,
                      step: 1,
                      defaultValue: 50
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    🎚️ Slider
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('switch', { 
                      label: 'Toggle Switch',
                      checked: false
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    🔘 Toggle Switch
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addUIElement('colorPicker', { 
                      label: 'Color Picker',
                      defaultColor: '#3b82f6'
                    })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--success), var(--success-light))',
                      color: 'white'
                    }}
                  >
                    🎨 Color Picker
                  </button>
                </div>
              </div>

              {/* UI Elements Section */}
              <div className="card">
                <div className="card-header" style={{ padding: 'var(--space-4)' }}>
                  <h6 style={{ margin: 0, color: 'var(--text-secondary)' }}>UI Elements</h6>
                </div>
                <div className="card-body" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn btn-ghost interactive"
                    onClick={() => addUIElement('text', { text: 'Heading', fontSize: '24px', fontWeight: 'bold' })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      border: '1px solid var(--border-dark)'
                    }}
                  >
                    📝 Text
                  </button>
                  <button 
                    className="btn btn-ghost interactive"
                    onClick={() => addUIElement('button', { text: 'Submit' })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      border: '1px solid var(--border-dark)'
                    }}
                  >
                    🔘 Button
                  </button>
                  <button 
                    className="btn btn-ghost interactive"
                    onClick={() => addUIElement('image', { width: '200px', height: '150px' })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      border: '1px solid var(--border-dark)'
                    }}
                  >
                    🖼️ Image
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'flow' && (
            <div className="fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div>
                <h3 style={{ 
                  margin: '0 0 var(--space-4) 0', 
                  fontSize: 'var(--font-xl)',
                  fontWeight: '700',
                  color: 'var(--text)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)'
                }}>
                  <span style={{
                    width: '4px',
                    height: '20px',
                    background: 'linear-gradient(135deg, var(--warning), var(--error))',
                    borderRadius: 'var(--radius-full)'
                  }} />
                  Backend Flow
                </h3>
              </div>
              
              {/* API Section */}
              <div className="card">
                <div className="card-header" style={{ padding: 'var(--space-4)' }}>
                  <h6 style={{ margin: 0, color: 'var(--text-secondary)' }}>API Endpoints</h6>
                </div>
                <div className="card-body" style={{ padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addBackendNode('api', { method: 'POST', endpoint: '/api/submit' })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--warning), var(--warning-light))',
                      color: 'white'
                    }}
                  >
                    🔌 API Endpoint
                  </button>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addBackendNode('validation', { type: 'Required Field' })}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--error), var(--error-light))',
                      color: 'white'
                    }}
                  >
                    ✅ Validation
                  </button>
                </div>
              </div>

              {/* Database Section */}
              <div className="card">
                <div className="card-header" style={{ padding: 'var(--space-4)' }}>
                  <h6 style={{ margin: 0, color: 'var(--text-secondary)' }}>Database</h6>
                </div>
                <div className="card-body" style={{ padding: 'var(--space-4)' }}>
                  <button 
                    className="btn btn-secondary interactive"
                    onClick={() => addBackendNode('database', {})}
                    style={{ 
                      width: '100%',
                      justifyContent: 'flex-start',
                      gap: 'var(--space-3)',
                      background: 'linear-gradient(135deg, var(--secondary), var(--secondary-light))',
                      color: 'white'
                    }}
                  >
                    🗄️ Database
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Generate Button */}
        <div style={{ 
          padding: 'var(--space-6)', 
          borderTop: '1px solid var(--border)',
          background: 'var(--bg-secondary)',
          position: 'sticky',
          bottom: 0
        }}>
          <GenerateBtn onClick={generateWebsite} loading={loading} />
        </div>
      </div>

      {/* Enhanced Main Canvas */}
      <div data-canvas className="slide-in-right" style={{ 
        flex: 1, 
        position: 'relative',
        background: 'var(--bg-secondary)',
        overflow: 'hidden'
      }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          defaultEdgeOptions={{ 
            type: 'smoothstep',
            style: { strokeWidth: 2, stroke: 'var(--primary)' }
          }}
          style={{ background: 'var(--bg)' }}
        >
          <Background 
            variant="dots" 
            gap={20} 
            size={1} 
            color="var(--border)"
            style={{ opacity: 0.5 }}
          />
          <Controls 
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              if (node.type?.includes('Element')) return 'var(--primary)';
              if (node.type === 'apiNode') return 'var(--warning)';
              if (node.type === 'databaseNode') return 'var(--secondary)';
              return 'var(--text-tertiary)';
            }}
            style={{
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: 'var(--shadow-lg)'
            }}
          />
        </ReactFlow>

        {/* Enhanced Canvas Info */}
        <div className="card fade-in" style={{
          position: 'absolute',
          top: 'var(--space-4)',
          left: 'var(--space-4)',
          padding: 'var(--space-3) var(--space-4)',
          fontSize: 'var(--font-sm)',
          color: 'var(--text-secondary)',
          minWidth: '250px',
          backdropFilter: 'blur(10px)',
          background: 'rgba(255,255,255,0.9)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: '6px',
              height: '6px',
              background: activeTab === 'design' ? 'var(--success)' : 'var(--warning)',
              borderRadius: 'var(--radius-full)',
              animation: 'pulse 2s infinite'
            }} />
            {activeTab === 'design' ? 'Design Canvas - Drag UI elements here' : 'Flow Canvas - Connect elements to backend'}
          </div>
        </div>

        {/* Performance Indicator */}
        <div style={{
          position: 'absolute',
          top: 'var(--space-4)',
          right: 'var(--space-4)',
          padding: 'var(--space-2) var(--space-3)',
          background: 'var(--bg)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          fontSize: 'var(--font-xs)',
          color: 'var(--text-tertiary)',
          boxShadow: 'var(--shadow)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)'
        }}>
          <div style={{
            width: '4px',
            height: '4px',
            background: 'var(--success)',
            borderRadius: 'var(--radius-full)'
          }} />
          {nodes.length} elements • {edges.length} connections
        </div>
      </div>

      {/* Enhanced Input Configuration Modal */}
      {showInputModal && (
        <div className="fade-in" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(4px)'
        }}>
          <div className="card scale-in" style={{
            background: 'var(--bg)',
            padding: 'var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            width: '480px',
            maxWidth: '90vw',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid var(--border)'
          }}>
            <h3 style={{ 
              margin: '0 0 var(--space-6) 0',
              color: 'var(--text)',
              fontSize: 'var(--font-xl)',
              fontWeight: '700'
            }}>
              Configure Input Field
            </h3>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Label:</label>
              <input
                type="text"
                value={inputConfig.label}
                onChange={(e) => setInputConfig(prev => ({ ...prev, label: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: 'var(--space-3)', 
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-sm)'
                }}
                placeholder="e.g., Username, Email"
                required
              />
              {!inputConfig.label && <div className="error-msg">Label is required</div>}
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Input Type:</label>
              <select
                value={inputConfig.inputType}
                onChange={(e) => setInputConfig(prev => ({ ...prev, inputType: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: 'var(--space-3)', 
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-sm)'
                }}
              >
                <option value="text">Text</option>
                <option value="email">Email</option>
                <option value="password">Password</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
                <option value="file">File</option>
              </select>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Placeholder:</label>
              <input
                type="text"
                value={inputConfig.placeholder}
                onChange={(e) => setInputConfig(prev => ({ ...prev, placeholder: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: 'var(--space-3)', 
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-sm)'
                }}
                placeholder="e.g., Enter your username"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label style={{ 
                display: 'flex', 
                alignItems: 'center',
                gap: 'var(--space-2)',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={inputConfig.required}
                  onChange={(e) => setInputConfig(prev => ({ ...prev, required: e.target.checked }))}
                  style={{ width: '16px', height: '16px' }}
                />
                Required field
              </label>
            </div>

            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Database Table Name:</label>
              <input
                type="text"
                value={inputConfig.tableName}
                onChange={(e) => setInputConfig(prev => ({ ...prev, tableName: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: 'var(--space-3)', 
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-sm)'
                }}
                placeholder="e.g., users, products, orders"
              />
            </div>

            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label>Database Column Name:</label>
              <input
                type="text"
                value={inputConfig.columnName}
                onChange={(e) => setInputConfig(prev => ({ ...prev, columnName: e.target.value }))}
                style={{ 
                  width: '100%', 
                  padding: 'var(--space-3)', 
                  marginTop: 'var(--space-1)',
                  fontSize: 'var(--font-sm)'
                }}
                placeholder="e.g., username, email, first_name"
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <button
                className="btn btn-success interactive"
                onClick={() => {
                  if (!inputConfig.label) {
                    showToast('Label is required', 'error');
                    return;
                  }
                  addInputElement();
                  showToast('Input field added', 'success');
                }}
                style={{ flex: 1 }}
              >
                Add Input
              </button>
              <button
                className="btn btn-ghost interactive"
                onClick={() => setShowInputModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
        </>
      )}
    </>
  );
}

export default App;
