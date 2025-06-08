# Release Automation

This directory contains scripts for automating the release process of the Gemini Search extension.

## Scripts

### `update-version.js`
Node.js script to automatically update version numbers in both `manifest.json` and `package.json`.

Usage:
```bash
node scripts/update-version.js [patch|minor|major]
```

### `auto-release.sh`
Complete release automation script that:
1. Updates version numbers
2. Builds the extension
3. Packages it into a zip file
4. Commits changes
5. Creates and pushes git tags
6. Triggers GitHub Actions for release creation

Usage:
```bash
./scripts/auto-release.sh [patch|minor|major]
```

## GitHub Actions

The `.github/workflows/release.yml` workflow automatically:
- Builds the extension on every push to main/master
- Creates GitHub releases when new tags are pushed
- Uploads the packaged extension as a release asset
- Generates release notes automatically

## Quick Release Commands

### Patch Release (1.0.0 → 1.0.1)
```bash
npm run prepare-release
```

### Manual Release with Custom Version Type
```bash
./scripts/auto-release.sh minor  # 1.0.0 → 1.1.0
./scripts/auto-release.sh major  # 1.0.0 → 2.0.0
```

### Individual Commands
```bash
npm run version:patch    # Update patch version
npm run version:minor    # Update minor version  
npm run version:major    # Update major version
npm run release          # Build and package
```
