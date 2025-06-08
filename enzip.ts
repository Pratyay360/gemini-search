import { zipSync, unzipSync } from 'cross-zip';

// Zip the 'dist' folder into 'gemini-search.zip'
zipSync('dist', 'gemini-search.zip');

// Unzip 'gemini-search.zip' into a folder
// unzipSync('gemini-search.zip', 'output-folder');
