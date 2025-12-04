import { readFileSync, existsSync } from 'fs';
import { resolve, dirname, extname, join } from 'path';

/**
 * Read file content safely
 */
function readFile(filePath) {
  try {
    return readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`⚠️  Could not read file: ${filePath}`);
    return null;
  }
}

/**
 * Check if a file exists
 */
function fileExists(filePath) {
  return existsSync(filePath);
}

/**
 * Parse ES6 imports from file content
 * Matches: import ... from 'path' or import('path')
 */
function parseImports(content) {
  const imports = [];
  
  // Match static imports: import ... from '...'
  const staticImportRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = staticImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  // Match dynamic imports: import('...')
  const dynamicImportRegex = /import\s*\(\s*['"]([^'"]+)['"]\s*\)/g;
  while ((match = dynamicImportRegex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  
  return imports;
}

/**
 * Check if an import path is a local file (not node_modules)
 */
function isLocalImport(importPath) {
  // Local imports start with ./ or ../ or @/ (alias)
  return importPath.startsWith('./') || 
         importPath.startsWith('../') || 
         importPath.startsWith('@/');
}

/**
 * Resolve import path to actual file path
 * Handles extensions like .ts, .tsx, .js, .jsx
 */
function resolveImportPath(importPath, fromFile) {
  const baseDir = dirname(fromFile);
  
  // Handle path alias @/ -> src/
  let resolvedPath = importPath;
  if (importPath.startsWith('@/')) {
    resolvedPath = importPath.replace('@/', 'src/');
  } else {
    resolvedPath = resolve(baseDir, importPath);
  }
  
  // If path already has extension and exists, return it
  if (extname(resolvedPath) && fileExists(resolvedPath)) {
    return resolvedPath;
  }
  
  // Try common extensions
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.mjs'];
  
  // Try with extensions
  for (const ext of extensions) {
    const withExt = resolvedPath + ext;
    if (fileExists(withExt)) {
      return withExt;
    }
  }
  
  // Try index files
  for (const ext of extensions) {
    const indexPath = join(resolvedPath, `index${ext}`);
    if (fileExists(indexPath)) {
      return indexPath;
    }
  }
  
  return null;
}

/**
 * Find test file for a given source file
 * Patterns: Component.test.tsx, Component.spec.tsx, __tests__/Component.tsx
 */
function findTestFile(filePath) {
  const dir = dirname(filePath);
  const ext = extname(filePath);
  const baseName = filePath.slice(0, -ext.length);
  
  // Pattern 1: Component.test.tsx
  const testPath1 = `${baseName}.test${ext}`;
  if (fileExists(testPath1)) {
    return testPath1;
  }
  
  // Pattern 2: Component.spec.tsx
  const specPath = `${baseName}.spec${ext}`;
  if (fileExists(specPath)) {
    return specPath;
  }
  
  // Pattern 3: __tests__/Component.tsx
  const fileName = filePath.split('/').pop();
  const testsDir = join(dir, '__tests__', fileName);
  if (fileExists(testsDir)) {
    return testsDir;
  }
  
  return null;
}

/**
 * Recursively collect all local dependencies for a file
 */
function collectDependencies(filePath, visited = new Set()) {
  // Avoid circular dependencies
  if (visited.has(filePath)) {
    return [];
  }
  
  visited.add(filePath);
  
  const content = readFile(filePath);
  if (!content) {
    return [];
  }
  
  const dependencies = [];
  const imports = parseImports(content);
  
  for (const importPath of imports) {
    if (!isLocalImport(importPath)) {
      continue;
    }
    
    const resolvedPath = resolveImportPath(importPath, filePath);
    if (!resolvedPath || visited.has(resolvedPath)) {
      continue;
    }
    
    dependencies.push(resolvedPath);
    
    // Recursively collect dependencies of this file
    const nestedDeps = collectDependencies(resolvedPath, visited);
    dependencies.push(...nestedDeps);
  }
  
  return dependencies;
}

/**
 * Build complete context for code review
 * Returns: { changedFiles, dependencies, testFiles, allFiles }
 */
export function buildContext(changedFiles) {
  const context = {
    changedFiles: [],
    dependencies: [],
    testFiles: [],
    allFiles: new Set()
  };
  
  console.log('\n🔨 Building context...\n');
  
  // Process each changed file
  for (const filePath of changedFiles) {
    if (!fileExists(filePath)) {
      console.warn(`⚠️  File not found: ${filePath}`);
      continue;
    }
    
    // Read the changed file
    const content = readFile(filePath);
    if (!content) {
      continue;
    }
    
    context.changedFiles.push({
      path: filePath,
      content: content
    });
    context.allFiles.add(filePath);
    
    console.log(`📄 ${filePath}`);
    
    // Find and collect dependencies
    const deps = collectDependencies(filePath);
    for (const dep of deps) {
      if (!context.allFiles.has(dep)) {
        const depContent = readFile(dep);
        if (depContent) {
          context.dependencies.push({
            path: dep,
            content: depContent
          });
          context.allFiles.add(dep);
          console.log(`  ├─ 🔗 ${dep}`);
        }
      }
    }
    
    // Find related test file
    const testFile = findTestFile(filePath);
    if (testFile && !context.allFiles.has(testFile)) {
      const testContent = readFile(testFile);
      if (testContent) {
        context.testFiles.push({
          path: testFile,
          content: testContent
        });
        context.allFiles.add(testFile);
        console.log(`  └─ 🧪 ${testFile}`);
      }
    }
  }
  
  return context;
}

/**
 * Print context summary
 */
export function printContextSummary(context) {
  console.log('\n📊 Context Summary');
  console.log('─'.repeat(60));
  console.log(`Changed files:     ${context.changedFiles.length}`);
  console.log(`Dependencies:      ${context.dependencies.length}`);
  console.log(`Test files:        ${context.testFiles.length}`);
  console.log(`Total files:       ${context.allFiles.size}`);
  console.log('─'.repeat(60));
}
