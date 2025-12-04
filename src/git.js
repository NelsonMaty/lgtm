import { execSync } from 'child_process';

/**
 * Execute a git command and return the output
 */
function execGit(command) {
  try {
    return execSync(command, { encoding: 'utf-8' }).trim();
  } catch (error) {
    throw new Error(`Git command failed: ${command}\n${error.message}`);
  }
}

/**
 * Get the current branch name
 */
export function getCurrentBranch() {
  return execGit('git rev-parse --abbrev-ref HEAD');
}

/**
 * Find the merge-base between current HEAD and develop branch
 */
export function getMergeBase() {
  return execGit('git merge-base HEAD develop');
}

/**
 * Get the list of changed files between merge-base and HEAD
 */
export function getChangedFiles(mergeBase) {
  const diffOutput = execGit(`git diff --name-only ${mergeBase}...HEAD`);
  return diffOutput ? diffOutput.split('\n').filter(Boolean) : [];
}

/**
 * Get the full diff content between merge-base and HEAD
 */
export function getDiff(mergeBase) {
  return execGit(`git diff ${mergeBase}...HEAD`);
}

/**
 * Check if we're in a git repository
 */
export function isGitRepo() {
  try {
    execGit('git rev-parse --git-dir');
    return true;
  } catch {
    return false;
  }
}

/**
 * Check if develop branch exists
 */
export function developBranchExists() {
  try {
    execGit('git rev-parse --verify develop');
    return true;
  } catch {
    return false;
  }
}
