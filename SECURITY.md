# 🔒 Security Policy & Vulnerability Management

This document outlines the security practices and vulnerability management process for the **JaldiKaro** project.

## Table of Contents

- [Vulnerability Scanning System](#vulnerability-scanning-system)
- [Running Scans](#running-scans)
- [Understanding Reports](#understanding-reports)
- [Fixing Vulnerabilities](#fixing-vulnerabilities)
- [CI/CD Integration](#cicd-integration)
- [Security Best Practices](#security-best-practices)
- [Reporting a Vulnerability](#reporting-a-vulnerability)
- [Troubleshooting](#troubleshooting)

---

## Vulnerability Scanning System

JaldiKaro uses an automated vulnerability scanning system to identify security issues in project dependencies. The system:

✅ **Automatically scans** all project workspaces (root, client, server)  
✅ **Generates detailed reports** with severity classifications  
✅ **Integrates with CI/CD** to catch vulnerabilities early  
✅ **Provides actionable recommendations** for remediation  

### Supported Tools

The system uses:
- **npm audit** - Built-in Node.js dependency vulnerability checker
- **Custom scanning script** - Orchestrates scans across all workspaces
- **GitHub Actions** - Automated scanning on push, PR, and scheduled runs

---

## Running Scans

### 1. Local Vulnerability Scan (Check Mode)

Check for vulnerabilities without making changes:

```bash
npm run audit:check
```

**Output:**
- Console log with color-coded severity levels
- JSON report: `vulnerability-report.json`
- Detailed log: `vulnerability-report.log`

### 2. Generate Detailed Report

Generate a comprehensive JSON report for analysis:

```bash
npm run audit:report
```

This creates:
- `vulnerability-report.json` - Full vulnerability details
- `vulnerability-report.log` - Timestamped scanning log

### 3. Auto-Fix Vulnerabilities

Attempt to automatically fix vulnerabilities (non-breaking fixes):

```bash
npm run audit:fix
```

⚠️ **Important:** This uses `npm audit fix --force`, which may:
- Update package versions (including major versions)
- Potentially introduce breaking changes
- Always review changes after running this command

**After fixing, always:**
1. Review the changes in `package.json` and `package-lock.json`
2. Test the application thoroughly
3. Commit changes with a clear message: `chore: fix dependency vulnerabilities`

### 4. Setup Git Hooks (Optional)

Enable pre-commit vulnerability scanning:

```bash
npm run setup:hooks
```

This installs a pre-commit hook that:
- ✅ **Blocks commits** if critical vulnerabilities are detected
- ⚠️ **Warns** about high-severity vulnerabilities
- Allows commits with low/moderate vulnerabilities only

---

## Understanding Reports

### Report Structure

```json
{
  "timestamp": "2025-10-28T12:34:56.789Z",
  "scanDuration": "1234ms",
  "workspaces": {
    "root": {
      "vulnerabilities": 0,
      "critical": 0,
      "high": 0,
      "moderate": 0,
      "low": 0,
      "details": {}
    },
    "client": {
      "vulnerabilities": 2,
      "critical": 0,
      "high": 1,
      "moderate": 1,
      "low": 0,
      "details": { /* vulnerability details */ }
    },
    "server": {
      "vulnerabilities": 0,
      ...
    }
  },
  "summary": {
    "totalVulnerabilities": 2,
    "critical": 0,
    "high": 1,
    "moderate": 1,
    "low": 0,
    "totalAffectedPackages": 2
  }
}
```

### Severity Levels

| Level | Symbol | Color | Action |
|-------|--------|-------|--------|
| **Critical** | 🔴 | Red | Fix immediately - blocks deployment |
| **High** | 🟡 | Yellow | Fix soon - prioritize in next release |
| **Moderate** | 🟠 | Orange | Monitor and fix in regular updates |
| **Low** | 🟢 | Green | Address in long-term maintenance |

---

## Fixing Vulnerabilities

### Step-by-Step Remediation

1. **Identify the vulnerability workspace**
   ```bash
   npm run audit:check
   # Look at the output to see which workspace has issues
   ```

2. **Navigate to the affected workspace**
   ```bash
   cd client  # or 'server' or root directory
   ```

3. **Check available updates**
   ```bash
   npm audit
   # Shows detailed vulnerability info and suggested fixes
   ```

4. **Update specific package** (recommended for critical/high)
   ```bash
   npm install package-name@latest
   # For example: npm install react-dom@latest
   ```

5. **Or attempt automatic fix** (use with caution)
   ```bash
   npm audit fix
   # Or for breaking changes: npm audit fix --force
   ```

6. **Verify the fix**
   ```bash
   npm run audit:check
   # Ensure vulnerabilities are resolved
   ```

7. **Test the application**
   ```bash
   npm run dev  # Test locally
   npm test     # Run tests if available
   ```

8. **Commit the changes**
   ```bash
   git add package*.json
   git commit -m "fix: resolve dependency vulnerabilities in client workspace"
   git push
   ```

### Manual Package Updates

If automatic fixes don't work or introduce breaking changes:

1. Read the security advisory for the vulnerable package
2. Check the package changelog for migration guides
3. Update manually while testing application functionality
4. Document breaking changes in commit message

---

## CI/CD Integration

### GitHub Actions Workflow

The workflow file is located at: `.github/workflows/vulnerability-scan.yml`

**Triggers:**
- ✅ On push to `master`, `main`, or `develop` branches
- ✅ On pull requests to `master`, `main`, or `develop`
- ✅ Daily scheduled scan at 2 AM UTC (to catch newly disclosed vulnerabilities)
- ✅ Manual trigger via GitHub Actions UI

**Workflow Steps:**

1. **Setup** - Checkout code and setup Node.js environment
2. **Scan** - Run vulnerability scan on all workspaces
3. **Report** - Generate detailed JSON report
4. **Artifact** - Upload report as GitHub artifact
5. **PR Comment** - Add vulnerability summary to pull requests
6. **Quality Gate** - Fail workflow if critical vulnerabilities found
7. **Optional Auto-Fix** - Can be triggered manually to auto-fix vulnerabilities

### Managing CI/CD Results

#### For Pull Requests

- Workflow automatically comments with vulnerability summary
- Shows vulnerabilities by workspace and severity
- Blocks merge if critical vulnerabilities exist
- Provides recommendations for fixing

#### For Branches

- Artifacts are retained for 30 days
- Can be downloaded from "Artifacts" tab in workflow run
- Review reports to track vulnerability trends

#### For Scheduled Runs

- Scans for newly disclosed vulnerabilities daily
- Proactively alerts about new security issues
- Allows time to fix before new PRs are created

---

## Security Best Practices

### 1. Keep Dependencies Updated

```bash
# Regularly update dependencies
npm outdated  # See what can be updated
npm update    # Update to latest compatible versions
```

### 2. Use Exact Versions

⚠️ **Avoid** using `*` or `latest` in package.json:
```json
// ❌ Bad
"express": "*"

// ✅ Good
"express": "4.18.2"
```

### 3. Use package-lock.json

- Ensure `package-lock.json` is committed to version control
- Prevents unexpected dependency version changes
- Use `npm ci` in CI/CD instead of `npm install`

### 4. Regular Audit Runs

```bash
# Run weekly during development
npm run audit:check

# Or create a scheduled task
crontab -e
# Add: 0 2 * * 0 npm run audit:check  # Weekly Sunday 2 AM
```

### 5. Monitor Security Advisories

- Subscribe to npm security alerts: https://www.npmjs.com/advisories
- Follow GitHub's security updates for your dependencies
- Check project security page regularly

### 6. Review Dependencies

- Regularly review `package.json` for unused packages
- Remove deprecated or unmaintained dependencies
- Prefer packages with active maintenance

```bash
# Find unused packages
npm ls --depth=0 --all
```

---

## Reporting a Vulnerability

### If You Discover a Vulnerability

1. **Do NOT create a public GitHub issue**
2. **Email details to:** [security contact - add your email]
3. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if known)

### For Vulnerabilities in Dependencies

- Report directly to the package maintainer
- Follow the package's SECURITY.md file
- Check https://www.npmjs.com/advisories for reporting guidelines

---

## Troubleshooting

### Issue: "No package-lock.json found"

**Solution:** Run `npm install` in the workspace first
```bash
cd client
npm install
npm audit
```

### Issue: Vulnerabilities not detected in scan

**Solution:** Ensure npm cache is clean
```bash
npm cache clean --force
npm run audit:check
```

### Issue: Pre-commit hook not working

**Solution:** Reinstall git hooks
```bash
npm run setup:hooks
```

### Issue: "Cannot find module: jq"

**Solution:** Install jq (used in GitHub Actions):
```bash
# macOS
brew install jq

# Ubuntu
sudo apt-get install jq

# Or use alternative JSON parser in scripts
```

### Issue: Auto-fix introduces breaking changes

**Solution:** Use manual approach instead
```bash
# Revert changes
git checkout package*.json

# Check advisory
npm audit | grep "package-name"

# Read security bulletin
# Update manually or wait for non-breaking fix
```

### Issue: Different vulnerabilities across workspaces

**Solution:** Deduplicate packages
```bash
# In root directory
npm dedupe

# Then in each workspace
cd client && npm dedupe
cd ../server && npm dedupe
```

---

## FAQ

### Q: Should I fix all vulnerabilities immediately?

**A:** Prioritize by severity:
- 🔴 **Critical:** Fix within 24 hours
- 🟡 **High:** Fix within 1 week
- 🟠 **Moderate:** Fix within 1 month
- 🟢 **Low:** Fix during regular maintenance

### Q: What if there's no fix for a vulnerability?

**A:** 
1. Contact the package maintainer
2. Switch to an actively maintained alternative
3. Implement workarounds in your code
4. File an issue with the maintainer

### Q: Can I ignore vulnerabilities?

**A:** Not recommended, but options:
- Document the reason in issue/PR
- Have security team approval
- Set a deadline to fix
- Implement compensating controls

### Q: How often should I run scans?

**A:** 
- Daily via CI/CD (automated) ✅
- Weekly during development (manual)
- Before each release (manual)
- Always before deploying to production ✅

---

## Additional Resources

- [npm Security Documentation](https://docs.npmjs.com/cli/audit)
- [OWASP Dependency Check](https://owasp.org/www-project-dependency-check/)
- [Snyk Security Platform](https://snyk.io/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Last Updated:** October 28, 2025  
**Maintainer:** JaldiKaro Security Team  
**Questions?** Open an issue or contact the maintainers.
