
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup process...');

// Check if node_modules exists and delete it
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (fs.existsSync(nodeModulesPath)) {
  console.log('Deleting node_modules folder...');
  try {
    if (process.platform === 'win32') {
      // On Windows, use rimraf to avoid path length issues
      execSync('npx rimraf node_modules');
    } else {
      execSync('rm -rf node_modules');
    }
    console.log('✅ node_modules deleted successfully.');
  } catch (error) {
    console.error('❌ Error deleting node_modules:', error.message);
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
  execSync('npm cache clean --force');
  console.log('✅ npm cache cleared successfully.');
} catch (error) {
  console.error('❌ Error clearing npm cache:', error.message);
}

// Reinstall dependencies
console.log('Reinstalling dependencies...');
try {
  execSync('npm install --no-audit', { stdio: 'inherit' });
  console.log('✅ Dependencies reinstalled successfully.');
} catch (error) {
  console.error('❌ Error reinstalling dependencies:', error.message);
}

console.log('🎉 Cleanup process completed!');
