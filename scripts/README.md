# Vulnerability Scanning System

This directory contains the vulnerability scanning system for JaldiKaro.

## Quick Start

### Check for vulnerabilities
```bash
npm run audit:check
```

### Fix vulnerabilities
```bash
npm run audit:fix
```

### Generate detailed report
```bash
npm run audit:report
```

### Setup pre-commit hooks
```bash
npm run setup:hooks
```

## Files

- **`scan-vulnerabilities.js`** - Main scanning orchestrator script
  - Scans all workspaces (root, client, server)
  - Generates JSON reports with severity classification
  - Provides color-coded console output
  - Can perform automatic fixes

- **`setup-hooks.js`** - Git hooks setup utility
  - Configures pre-commit vulnerability scanning
  - Blocks commits on critical vulnerabilities
  - Warns about high-severity issues

- **`../SECURITY.md`** - Comprehensive security documentation
  - Complete vulnerability management guide
  - Step-by-step remediation procedures
  - CI/CD integration details
  - Security best practices
  - FAQ and troubleshooting

- **`../.github/workflows/vulnerability-scan.yml`** - GitHub Actions workflow
  - Runs on push, PR, and scheduled basis
  - Generates artifacts and reports
  - Posts comments on PRs
  - Can auto-fix vulnerabilities

- **`../.npmauditignore`** - Ignore file for false positives
  - Document reviewed vulnerabilities
  - Provide justification for ignoring issues
  - Track accepted risks

## Output Files

After running a scan, the following files are generated:

- **`vulnerability-report.json`** - Machine-readable report
  - JSON format for parsing and analysis
  - Contains detailed vulnerability information
  - Organized by workspace

- **`vulnerability-report.log`** - Human-readable log
  - Timestamped entries
  - Easy-to-read format
  - Good for monitoring and debugging

## Integration

### GitHub Actions
- Automatically scans on push and PR
- Posts vulnerability summary on PRs
- Can be manually triggered for auto-fixing
- Runs on schedule (daily at 2 AM UTC)

### Git Hooks
- Pre-commit hook blocks critical vulnerabilities
- Warns about high-severity issues
- Run `npm run setup:hooks` to enable

### npm Scripts
- Added to root `package.json`
- Easy command-line access
- Can be integrated into other workflows

## Severity Levels

| Level | Color | Symbol | Action |
|-------|-------|--------|--------|
| Critical | Red | 🔴 | Fix immediately |
| High | Yellow | 🟡 | Fix soon |
| Moderate | Orange | 🟠 | Monitor and update |
| Low | Green | 🟢 | Address in maintenance |

## Recommendations

1. **Daily**: CI/CD scans run automatically
2. **Weekly**: Developers run `npm run audit:check` locally
3. **Monthly**: Review and update dependencies
4. **Before Deployment**: Always run audit scan

## See Also

- **SECURITY.md** - Complete security policy and procedures
- **Contributing.md** - Development guidelines including security
- GitHub Issues - Report security concerns

## Questions?

See **SECURITY.md** for detailed documentation and troubleshooting.
