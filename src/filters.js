/**
 * List of file patterns to exclude from review
 */
const EXCLUDED_FILES = [
  'yarn.lock',
  'package-lock.json',
  'pnpm-lock.yaml'
];

/**
 * List of binary file extensions to exclude
 */
const BINARY_EXTENSIONS = [
  '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico',
  '.woff', '.woff2', '.ttf', '.eot', '.otf',
  '.pdf', '.zip', '.tar', '.gz',
  '.mp4', '.mp3', '.wav',
  '.exe', '.dll', '.so', '.dylib'
];

/**
 * Check if a file should be excluded from review
 */
export function shouldExcludeFile(filePath) {
  // Check excluded filenames
  const fileName = filePath.split('/').pop();
  if (EXCLUDED_FILES.includes(fileName)) {
    return true;
  }

  // Check binary extensions
  const hasExcludedExtension = BINARY_EXTENSIONS.some(ext => 
    filePath.toLowerCase().endsWith(ext)
  );
  
  return hasExcludedExtension;
}

/**
 * Filter out excluded files from a list
 */
export function filterFiles(files) {
  return files.filter(file => !shouldExcludeFile(file));
}
