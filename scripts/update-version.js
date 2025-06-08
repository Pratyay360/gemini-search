#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const versionType = process.argv[2] || 'patch';

// Read current versions
const manifestPath = path.join(__dirname, '..', 'manifest.json');
const packagePath = path.join(__dirname, '..', 'package.json');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Parse current version
const currentVersion = manifest.version;
const versionParts = currentVersion.split('.').map(Number);

// Update version based on type
switch (versionType) {
  case 'major':
    versionParts[0]++;
    versionParts[1] = 0;
    versionParts[2] = 0;
    break;
  case 'minor':
    versionParts[1]++;
    versionParts[2] = 0;
    break;
  case 'patch':
  default:
    versionParts[2]++;
    break;
}

const newVersion = versionParts.join('.');

// Update manifest.json
manifest.version = newVersion;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

// Update package.json
packageJson.version = newVersion; // Use standard SemVer format
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + '\n');

console.log(`Version updated from ${currentVersion} to ${newVersion}`);
console.log(`Package.json version: ${packageJson.version}`);
console.log(`Manifest.json version: ${manifest.version}`);
