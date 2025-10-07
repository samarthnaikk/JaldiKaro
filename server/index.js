const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Function to print a separator line
const printSeparator = (title) => {
  console.log('\n' + '='.repeat(60));
  console.log(`  ${title}`);
  console.log('='.repeat(60));
};

// Function to print subsection
const printSubsection = (title) => {
  console.log('\n' + '-'.repeat(40));
  console.log(`  ${title}`);
  console.log('-'.repeat(40));
};

// Placeholder endpoint for code generation
app.post('/generate', (req, res) => {
  const { nodes, edges } = req.body;
  
  // Initialize output content
  let output = '';
  
  // Helper function to add to output
  const addLine = (text = '') => {
    output += text + '\n';
    console.log(text);
  };
  
  addLine('='.repeat(80));
  addLine('                          WEBSITE GENERATION REPORT');
  addLine('                          Generated on: ' + new Date().toLocaleString());
  addLine('='.repeat(80));
  addLine();

  // Organize nodes by type
  const pages = nodes.filter(node => node.type === 'pageElement');
  const formElements = nodes.filter(node => ['inputElement', 'selectElement', 'radioElement', 'checkboxElement', 'textareaElement'].includes(node.type));
  const uiElements = nodes.filter(node => ['buttonElement', 'textElement', 'imageElement', 'linkElement'].includes(node.type));
  const apiElements = nodes.filter(node => node.type === 'apiElement');
  const databaseElements = nodes.filter(node => node.type === 'databaseElement');

  // Pages Summary
  addLine('📄 PAGES OVERVIEW');
  addLine('-'.repeat(50));
  if (pages.length === 0) {
    addLine('❌ No pages found');
  } else {
    pages.forEach((page, index) => {
      addLine(`${index + 1}. Page: "${page.data.label}"`);
      addLine(`   ID: ${page.id}`);
      addLine(`   Position: (${Math.round(page.position.x)}, ${Math.round(page.position.y)})`);
      if (page.data.width && page.data.height) {
        addLine(`   Size: ${page.data.width}px × ${page.data.height}px`);
      }
      addLine();
    });
  }

  // Form Elements
  addLine('� FORM ELEMENTS');
  addLine('-'.repeat(50));
  if (formElements.length === 0) {
    addLine('❌ No form elements found');
  } else {
    formElements.forEach((element, index) => {
      addLine(`${index + 1}. ${element.type.toUpperCase()}`);
      addLine(`   Label: "${element.data.label}"`);
      addLine(`   ID: ${element.id}`);
      addLine(`   Position: (${Math.round(element.position.x)}, ${Math.round(element.position.y)})`);
      
      if (element.data.database) {
        addLine(`   📊 Database Mapping:`);
        addLine(`      Table: ${element.data.database.table}`);
        addLine(`      Column: ${element.data.database.column}`);
      }
      
      if (element.data.options && element.data.options.length > 0) {
        addLine(`   Options: ${element.data.options.join(', ')}`);
      }
      
      if (element.data.placeholder) {
        addLine(`   Placeholder: "${element.data.placeholder}"`);
      }
      
      if (element.data.required) {
        addLine(`   ✅ Required field`);
      }
      
      addLine();
    });
  }

  // UI Elements
  addLine('🎨 UI ELEMENTS');
  addLine('-'.repeat(50));
  if (uiElements.length === 0) {
    addLine('❌ No UI elements found');
  } else {
    uiElements.forEach((element, index) => {
      addLine(`${index + 1}. ${element.type.toUpperCase()}`);
      addLine(`   Label: "${element.data.label}"`);
      addLine(`   ID: ${element.id}`);
      addLine(`   Position: (${Math.round(element.position.x)}, ${Math.round(element.position.y)})`);
      
      if (element.data.url) {
        addLine(`   URL: ${element.data.url}`);
      }
      
      if (element.data.text) {
        addLine(`   Text: "${element.data.text}"`);
      }
      
      addLine();
    });
  }

  // API Elements
  addLine('🔌 API ENDPOINTS');
  addLine('-'.repeat(50));
  if (apiElements.length === 0) {
    addLine('❌ No API elements found');
  } else {
    apiElements.forEach((element, index) => {
      addLine(`${index + 1}. API: "${element.data.label}"`);
      addLine(`   ID: ${element.id}`);
      addLine(`   Position: (${Math.round(element.position.x)}, ${Math.round(element.position.y)})`);
      
      if (element.data.endpoint) {
        addLine(`   Endpoint: ${element.data.endpoint}`);
      }
      
      if (element.data.method) {
        addLine(`   Method: ${element.data.method}`);
      }
      
      addLine();
    });
  }

  // Database Elements
  addLine('🗄️  DATABASE CONNECTIONS');
  addLine('-'.repeat(50));
  if (databaseElements.length === 0) {
    addLine('❌ No database elements found');
  } else {
    databaseElements.forEach((element, index) => {
      addLine(`${index + 1}. Database: "${element.data.label}"`);
      addLine(`   ID: ${element.id}`);
      addLine(`   Position: (${Math.round(element.position.x)}, ${Math.round(element.position.y)})`);
      
      if (element.data.connectionString) {
        addLine(`   Connection: ${element.data.connectionString}`);
      }
      
      addLine();
    });
  }

  // Connections
  addLine('🔗 ELEMENT CONNECTIONS');
  addLine('-'.repeat(50));
  if (edges.length === 0) {
    addLine('❌ No connections found');
  } else {
    edges.forEach((edge, index) => {
      const sourceNode = nodes.find(n => n.id === edge.source);
      const targetNode = nodes.find(n => n.id === edge.target);
      
      addLine(`${index + 1}. Connection`);
      addLine(`   From: ${sourceNode ? sourceNode.data.label : edge.source} (${sourceNode ? sourceNode.type : 'unknown'})`);
      addLine(`   To: ${targetNode ? targetNode.data.label : edge.target} (${targetNode ? targetNode.type : 'unknown'})`);
      addLine(`   Edge ID: ${edge.id}`);
      addLine();
    });
  }

  // Generate Database Schema
  if (formElements.length > 0) {
    addLine('�️  AUTO-GENERATED DATABASE SCHEMA');
    addLine('-'.repeat(50));
    
    // Group by table
    const tableGroups = {};
    formElements.forEach(element => {
      if (element.data.database && element.data.database.table) {
        const tableName = element.data.database.table;
        if (!tableGroups[tableName]) {
          tableGroups[tableName] = [];
        }
        tableGroups[tableName].push(element);
      }
    });

    if (Object.keys(tableGroups).length === 0) {
      addLine('❌ No database mappings found');
    } else {
      Object.keys(tableGroups).forEach(tableName => {
        addLine(`CREATE TABLE ${tableName} (`);
        addLine(`  id INT PRIMARY KEY AUTO_INCREMENT,`);
        
        tableGroups[tableName].forEach(element => {
          const columnName = element.data.database.column;
          let dataType = 'VARCHAR(255)';
          
          switch (element.type) {
            case 'inputElement':
              dataType = element.data.placeholder && element.data.placeholder.includes('email') ? 'VARCHAR(255)' : 'VARCHAR(255)';
              break;
            case 'textareaElement':
              dataType = 'TEXT';
              break;
            case 'selectElement':
            case 'radioElement':
              dataType = 'VARCHAR(100)';
              break;
            case 'checkboxElement':
              dataType = 'BOOLEAN';
              break;
          }
          
          const required = element.data.required ? ' NOT NULL' : '';
          addLine(`  ${columnName} ${dataType}${required},`);
        });
        
        addLine(`  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,`);
        addLine(`  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        addLine(`);`);
        addLine();
      });
    }
  }

  // Statistics
  addLine('� STATISTICS SUMMARY');
  addLine('-'.repeat(50));
  addLine(`Total Elements: ${nodes.length}`);
  addLine(`├── Pages: ${pages.length}`);
  addLine(`├── Form Elements: ${formElements.length}`);
  addLine(`├── UI Elements: ${uiElements.length}`);
  addLine(`├── API Elements: ${apiElements.length}`);
  addLine(`└── Database Elements: ${databaseElements.length}`);
  addLine(`Total Connections: ${edges.length}`);
  addLine();
  addLine('='.repeat(80));
  addLine('                            REPORT COMPLETE');
  addLine('='.repeat(80));

  // Write to file
  const filePath = path.join(__dirname, 'all_page.txt');
  fs.writeFileSync(filePath, output, 'utf8');
  
  console.log(`\n📁 Report saved to: ${filePath}`);
  
  res.json({ 
    success: true, 
    message: 'Website details generated and saved to all_page.txt',
    filePath: filePath,
    stats: {
      totalElements: nodes.length,
      pages: pages.length,
      formElements: formElements.length,
      uiElements: uiElements.length,
      apiElements: apiElements.length,
      databaseElements: databaseElements.length,
      connections: edges.length
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 JaldiKaro Server running on port ${PORT}`);
  console.log(`📡 Ready to generate websites...`);
});
