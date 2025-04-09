
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup process...');

// Force kill any processes that might be locking node_modules
try {
  if (process.platform === 'win32') {
    console.log('Attempting to close any processes that might lock files...');
    try {
      execSync('taskkill /F /IM node.exe /T', { stdio: 'ignore' });
    } catch (e) {
      // It's okay if this fails
    }
  }
} catch (error) {
  console.log('Process kill attempt completed');
}

// Check if node_modules exists and delete it
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('Deleting node_modules folder...');
  try {
    if (process.platform === 'win32') {
      // On Windows, use rimraf to avoid path length issues
      console.log('Using rimraf for Windows path length issues...');
      execSync('npx rimraf node_modules', { stdio: 'inherit' });
    } else {
      execSync('rm -rf node_modules');
    }
    console.log('✅ node_modules deleted successfully.');
  } catch (error) {
    console.error('❌ Error deleting node_modules:', error.message);
    console.log('Trying an alternative method...');
    
    try {
      // Try an alternative approach for Windows
      if (process.platform === 'win32') {
        execSync('rd /s /q node_modules', { stdio: 'inherit' });
      }
    } catch (altError) {
      console.error('❌ Alternative deletion also failed:', altError.message);
      console.log('Please manually delete the node_modules folder before continuing.');
    }
  }
} else {
  console.log('⚠️ No node_modules folder found.');
}

// Delete package-lock.json
const packageLockPath = path.join(__dirname, 'package-lock.json');
if (fs.existsSync(packageLockPath)) {
  console.log('Deleting package-lock.json...');
  try {
    fs.unlinkSync(packageLockPath);
    console.log('✅ package-lock.json deleted successfully.');
  } catch (error) {
    console.error('❌ Error deleting package-lock.json:', error.message);
  }
}

// Clear npm cache
console.log('Clearing npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ npm cache cleared successfully.');
} catch (error) {
  console.error('❌ Error clearing npm cache:', error.message);
}

// Reinstall dependencies with specific flags to avoid problematic packages
console.log('Reinstalling dependencies...');
try {
  console.log('💡 Using --no-optional to skip problematic packages like node-sass...');
  execSync('npm install --no-optional --no-audit --no-fund', { stdio: 'inherit' });
  console.log('✅ Dependencies reinstalled successfully.');
} catch (error) {
  console.error('❌ Error reinstalling dependencies:', error.message);
  console.log('Try running: npm install --no-optional --no-audit --no-fund');
}

console.log('🎉 Cleanup process completed!');
console.log('');
console.log('If you still encounter issues, please run this script with administrator privileges');
console.log('or manually delete the node_modules folder and run:');
console.log('npm install --no-optional --no-audit --no-fund');
