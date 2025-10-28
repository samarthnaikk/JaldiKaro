#!/bin/bash

# 🔒 Vulnerability Scanning System - Quick Start

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   JaldiKaro Vulnerability Scanning System                ║"
echo "║   Quick Start Guide                                      ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}📦 Step 1: Install Dependencies${NC}"
echo "Command: npm install"
echo ""

echo -e "${BLUE}🔐 Step 2: Setup Git Hooks (Optional but Recommended)${NC}"
echo "Command: npm run setup:hooks"
echo "This enables automatic vulnerability scanning before each commit."
echo ""

echo -e "${BLUE}🔍 Step 3: Run Initial Scan${NC}"
echo "Command: npm run audit:check"
echo "This scans all workspaces for vulnerabilities."
echo ""

echo -e "${BLUE}🔧 Step 4: Fix Vulnerabilities (if any found)${NC}"
echo "Command: npm run audit:fix"
echo "This attempts to automatically fix vulnerabilities."
echo "⚠️  Always test your application after running this!"
echo ""

echo -e "${BLUE}📊 Step 5: Review Detailed Report${NC}"
echo "Command: npm run audit:report"
echo "This generates a detailed JSON report: vulnerability-report.json"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Available Commands                                     ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${GREEN}npm run audit:check${NC}    - Check for vulnerabilities (read-only)"
echo -e "${GREEN}npm run audit:fix${NC}      - Auto-fix vulnerabilities"
echo -e "${GREEN}npm run audit:report${NC}   - Generate detailed JSON report"
echo -e "${GREEN}npm run setup:hooks${NC}    - Setup pre-commit hooks"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Additional Resources                                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${YELLOW}📖 Full Documentation:${NC}"
echo "   • SECURITY.md - Comprehensive security guide"
echo "   • VULNERABILITY_SYSTEM_SUMMARY.md - Implementation details"
echo "   • scripts/README.md - Quick command reference"
echo ""

echo -e "${YELLOW}🚀 GitHub Actions:${NC}"
echo "   • Automatically scans on push and PR"
echo "   • Runs daily scheduled scans"
echo "   • Posts results in PR comments"
echo ""

echo -e "${YELLOW}🔐 Git Hooks:${NC}"
echo "   • Blocks commits with critical vulnerabilities"
echo "   • Warns about high-severity issues"
echo "   • Automatic check before each commit"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Severity Levels                                        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo -e "${RED}🔴 Critical${NC}   - Fix immediately (blocks deployment)"
echo -e "${YELLOW}🟡 High${NC}       - Fix soon (within 1 week)"
echo -e "${YELLOW}🟠 Moderate${NC}   - Monitor (within 1 month)"
echo -e "${GREEN}🟢 Low${NC}        - Address in maintenance"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   Workflow Integration                                   ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "Your project now has:"
echo ""
echo "✅ Automated vulnerability scanning (npm audit)"
echo "✅ GitHub Actions CI/CD integration"
echo "✅ Pre-commit hooks for local protection"
echo "✅ Detailed JSON and log reports"
echo "✅ Multi-workspace support (root, client, server)"
echo "✅ Severity classification and recommendations"
echo "✅ Comprehensive documentation"
echo ""

echo -e "${BLUE}📝 Next Actions:${NC}"
echo ""
echo "1. Read the comprehensive guide:"
echo "   cat SECURITY.md"
echo ""
echo "2. Setup git hooks (recommended):"
echo "   npm run setup:hooks"
echo ""
echo "3. Run your first scan:"
echo "   npm run audit:check"
echo ""
echo "4. Fix any vulnerabilities found:"
echo "   npm run audit:fix"
echo ""

echo "╔══════════════════════════════════════════════════════════╗"
echo "║   ✨ Your project is now secure-scanned ready! ✨        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
