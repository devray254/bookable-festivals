
const { execSync } = require('child_process');

console.log('🔍 Installing only essential dependencies...');

// Core React and UI dependencies
const coreDependencies = [
  'react@^18.3.1',
  'react-dom@^18.3.1',
  'react-router-dom@^6.26.2',
  '@tanstack/react-query@^5.56.2',
  'clsx@^2.1.1',
  'tailwind-merge@^2.5.2',
  'date-fns@^3.6.0',
  'sonner@^1.5.0',
  'lucide-react@^0.462.0',
  'zod@^3.24.2',
  'react-hook-form@^7.53.0',
  '@hookform/resolvers@^3.9.0'
];

// Install core dependencies
try {
  console.log('Installing core dependencies...');
  execSync(`npm install ${coreDependencies.join(' ')} --no-audit --no-fund`, { stdio: 'inherit' });
  console.log('✅ Core dependencies installed successfully.');
} catch (error) {
  console.error('❌ Error installing core dependencies:', error.message);
}

// Radix UI dependencies (install separately to avoid dependency conflicts)
const radixDependencies = [
  '@radix-ui/react-dialog@^1.1.2',
  '@radix-ui/react-label@^2.1.0',
  '@radix-ui/react-slot@^1.1.0',
  '@radix-ui/react-toast@^1.2.1',
  '@radix-ui/react-tooltip@^1.1.4'
];

try {
  console.log('Installing Radix UI dependencies...');
  execSync(`npm install ${radixDependencies.join(' ')} --no-audit --no-fund`, { stdio: 'inherit' });
  console.log('✅ Radix UI dependencies installed successfully.');
} catch (error) {
  console.error('❌ Error installing Radix UI dependencies:', error.message);
}

console.log('🎉 Safe install completed!');
console.log('If you need additional dependencies, install them individually.');
