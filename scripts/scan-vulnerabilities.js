#!/usr/bin/env node



const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKSPACES = ['root', 'client', 'server'];
const REPORT_FILE = path.join(__dirname, '..', 'vulnerability-report.json');
const LOG_FILE = path.join(__dirname, '..', 'vulnerability-report.log');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

/**
 * Log with timestamp
 */
function log(message, color = colors.reset) {
  const timestamp = new Date().toISOString();
  const formatted = `[${timestamp}] ${message}`;
  console.log(color + formatted + colors.reset);
  fs.appendFileSync(LOG_FILE, formatted + '\n');
}

/**
 * Get the directory path for a workspace
 */
function getWorkspacePath(workspace) {
  if (workspace === 'root') {
    return path.join(__dirname, '..');
  }
  return path.join(__dirname, '..', workspace);
}

/**
 * Run npm audit on a specific workspace
 */
function runAudit(workspace, options = {}) {
  const workspacePath = getWorkspacePath(workspace);
  const { fix = false, json = false } = options;
  
  let command = 'npm audit';
  if (fix) command += ' fix --force';
  if (json) command += ' --json';
  
  try {
    log(`Scanning ${workspace}...`, colors.cyan);
    
    // Check if package-lock.json or node_modules exists
    const lockFile = path.join(workspacePath, 'package-lock.json');
    if (!fs.existsSync(lockFile)) {
      log(`⚠️  No package-lock.json found in ${workspace}, skipping...`, colors.yellow);
      return null;
    }
    
    const result = execSync(command, {
      cwd: workspacePath,
      encoding: 'utf-8',
      stdio: json ? 'pipe' : 'inherit'
    });
    
    if (json) {
      return JSON.parse(result);
    }
    return null;
  } catch (error) {
    // npm audit returns exit code 1 if vulnerabilities are found
    if (json && error.stdout) {
      try {
        return JSON.parse(error.stdout);
      } catch (e) {
        log(`Error parsing JSON output from ${workspace}: ${e.message}`, colors.red);
        return null;
      }
    }
    
    // For non-json mode, the error is expected when vulnerabilities exist
    if (!json) {
      return null;
    }
    
    log(`Error scanning ${workspace}: ${error.message}`, colors.red);
    return null;
  }
}

/**
 * Generate comprehensive vulnerability report
 */
function generateReport() {
  log('\n' + colors.bold + '═══════════════════════════════════════════' + colors.reset);
  log(colors.bold + '  Vulnerability Scan Report' + colors.reset, colors.bold);
  log(colors.bold + '═══════════════════════════════════════════' + colors.reset);
  
  // Clear previous report file and logs
  fs.writeFileSync(REPORT_FILE, '');
  fs.writeFileSync(LOG_FILE, '');
  
  const report = {
    timestamp: new Date().toISOString(),
    scanDuration: null,
    workspaces: {},
    summary: {
      totalVulnerabilities: 0,
      critical: 0,
      high: 0,
      moderate: 0,
      low: 0,
      totalAffectedPackages: 0
    }
  };
  
  const startTime = Date.now();
  
  WORKSPACES.forEach(workspace => {
    log(`\n${colors.cyan}Scanning ${workspace}...${colors.reset}`);
    
    const auditData = runAudit(workspace, { json: true });
    
    if (!auditData) {
      report.workspaces[workspace] = {
        vulnerabilities: 0,
        status: 'no_data'
      };
      log(`✓ ${workspace}: No vulnerabilities or unable to scan`, colors.green);
      return;
    }
    
    const metadata = auditData.metadata || {};
    const vulnerabilities = auditData.vulnerabilities || {};
    
    // Handle new npm audit format (7.x+) where vulnerabilities is an object
    let vulnCount, criticalCount, highCount, moderateCount, lowCount;
    
    if (metadata.vulnerabilities && typeof metadata.vulnerabilities === 'object' && !Array.isArray(metadata.vulnerabilities)) {
      // New format: { info, low, moderate, high, critical, total }
      vulnCount = metadata.vulnerabilities.total || 0;
      criticalCount = metadata.vulnerabilities.critical || 0;
      highCount = metadata.vulnerabilities.high || 0;
      moderateCount = metadata.vulnerabilities.moderate || 0;
      lowCount = metadata.vulnerabilities.low || 0;
    } else {
      // Legacy format: direct number fields
      vulnCount = metadata.vulnerabilities || 0;
      criticalCount = metadata.vulnerabilities_critical || 0;
      highCount = metadata.vulnerabilities_high || 0;
      moderateCount = metadata.vulnerabilities_moderate || 0;
      lowCount = metadata.vulnerabilities_low || 0;
    }
    
    report.workspaces[workspace] = {
      vulnerabilities: vulnCount,
      critical: criticalCount,
      high: highCount,
      moderate: moderateCount,
      low: lowCount,
      details: vulnerabilities,
      metadata: metadata
    };
    
    // Update summary
    report.summary.totalVulnerabilities += vulnCount;
    report.summary.critical += criticalCount;
    report.summary.high += highCount;
    report.summary.moderate += moderateCount;
    report.summary.low += lowCount;
    report.summary.totalAffectedPackages += Object.keys(vulnerabilities).length;
    
    // Log results for this workspace
    if (vulnCount === 0) {
      log(`✓ ${workspace}: No vulnerabilities found!`, colors.green);
    } else {
      log(`✗ ${workspace}: ${vulnCount} vulnerabilities detected`, colors.red);
      log(`  • Critical: ${criticalCount}`, colors.red);
      log(`  • High: ${highCount}`, colors.yellow);
      log(`  • Moderate: ${moderateCount}`, colors.yellow);
      log(`  • Low: ${lowCount}`, colors.yellow);
    }
  });
  
  report.scanDuration = `${Date.now() - startTime}ms`;
  
  // Write report to file
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2));
  log(`\n✓ Detailed report saved to: ${REPORT_FILE}`, colors.green);
  
  // Print summary
  log(`\n${colors.bold}═══════════════════════════════════════════${colors.reset}`);
  log(colors.bold + 'Summary' + colors.reset, colors.bold);
  log(colors.bold + '═══════════════════════════════════════════' + colors.reset);
  
  log(`Total Vulnerabilities: ${report.summary.totalVulnerabilities}`, colors.bold);
  log(`  • Critical: ${report.summary.critical}`, colors.red);
  log(`  • High: ${report.summary.high}`, colors.yellow);
  log(`  • Moderate: ${report.summary.moderate}`, colors.yellow);
  log(`  • Low: ${report.summary.low}`, colors.yellow);
  log(`\nAffected Packages: ${report.summary.totalAffectedPackages}`);
  log(`Scan Duration: ${report.scanDuration}`);
  
  // Recommendations
  log(`\n${colors.bold}═══════════════════════════════════════════${colors.reset}`);
  log(colors.bold + 'Recommendations' + colors.reset, colors.bold);
  log(colors.bold + '═══════════════════════════════════════════' + colors.reset);
  
  if (report.summary.critical > 0) {
    log('🔴 CRITICAL VULNERABILITIES DETECTED!', colors.red);
    log('Please address these immediately before deploying.', colors.red);
    log('  Run: npm run audit:fix (in affected workspace)', colors.cyan);
  } else if (report.summary.high > 0) {
    log('🟡 High-severity vulnerabilities found.', colors.yellow);
    log('Consider updating affected packages soon.', colors.yellow);
  } else if (report.summary.totalVulnerabilities > 0) {
    log('🟢 Only low/moderate vulnerabilities found.', colors.green);
    log('Monitor and update as part of regular maintenance.', colors.green);
  } else {
    log('✅ Excellent! No vulnerabilities detected in any workspace!', colors.green);
  }
  
  log(`\n${colors.cyan}For detailed information, see: ${REPORT_FILE}${colors.reset}`);
  log(colors.bold + '═══════════════════════════════════════════' + colors.reset);
  
  return report;
}

/**
 * Fix vulnerabilities in all workspaces
 */
function fixVulnerabilities() {
  log(`\n${colors.bold}Starting automatic vulnerability fixes...${colors.reset}`);
  
  WORKSPACES.forEach(workspace => {
    const workspacePath = getWorkspacePath(workspace);
    const lockFile = path.join(workspacePath, 'package-lock.json');
    
    if (!fs.existsSync(lockFile)) {
      log(`⚠️  No package-lock.json in ${workspace}, skipping...`, colors.yellow);
      return;
    }
    
    log(`\nFixing vulnerabilities in ${workspace}...`, colors.cyan);
    try {
      execSync('npm audit fix --force', {
        cwd: workspacePath,
        stdio: 'inherit'
      });
      log(`✓ ${workspace}: Vulnerabilities fixed`, colors.green);
    } catch (error) {
      log(`✗ ${workspace}: Error during fix - ${error.message}`, colors.red);
    }
  });
  
  log(`\nRe-generating report after fixes...`, colors.cyan);
  generateReport();
}

/**
 * Main execution
 */
function main() {
  const command = process.argv[2] || 'check';
  
  console.clear();
  log(`Starting vulnerability scan... (Mode: ${command})`, colors.cyan);
  
  switch (command) {
    case 'fix':
      fixVulnerabilities();
      break;
    case 'report':
    case 'check':
    default:
      const report = generateReport();
      
      // Exit with error code if critical vulnerabilities found
      if (report.summary.critical > 0) {
        process.exit(1);
      }
      break;
  }
}

// Run the scanner
main();
