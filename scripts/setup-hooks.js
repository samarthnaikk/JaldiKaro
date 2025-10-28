#!/usr/bin/env node



const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const HOOKS_DIR = path.join(__dirname, '..', '.githooks');
const GIT_HOOKS_DIR = path.join(__dirname, '..', '.git', 'hooks');

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function main() {
  log('\n' + colors.bold + 'Setting up Git hooks for vulnerability scanning...' + colors.reset);
  
  // Configure git to use custom hooks directory
  try {
    execSync('git config core.hooksPath .githooks', {
      cwd: path.join(__dirname, '..')
    });
    log(colors.green + '✓ Git configured to use .githooks directory' + colors.reset);
  } catch (error) {
    log(colors.yellow + '⚠️  Could not configure git hooks directory: ' + error.message + colors.reset);
  }
  
  // Make hooks executable
  const hooks = ['pre-commit'];
  
  hooks.forEach(hook => {
    const hookPath = path.join(HOOKS_DIR, hook);
    if (fs.existsSync(hookPath)) {
      try {
        fs.chmodSync(hookPath, '755');
        log(colors.green + `✓ ${hook} hook installed and made executable` + colors.reset);
      } catch (error) {
        log(colors.yellow + `⚠️  Could not make ${hook} executable: ${error.message}` + colors.reset);
      }
    }
  });
  
  log(colors.green + '\n✓ Git hooks setup completed successfully!' + colors.reset);
  log(colors.blue + '\nGit hooks are now active. The pre-commit hook will:' + colors.reset);
  log('  • Block commits if critical vulnerabilities are found');
  log('  • Warn about high-severity vulnerabilities');
  log('  • Run automatically before each commit\n');
}

main();
