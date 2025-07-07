#!/usr/bin/env node

// Simple server starter for production
const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = 'production';
process.env.PORT = process.env.PORT || '3000';

console.log('Starting OWOWLOVE production server...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);

// Start Next.js server
let nextBin, spawnOptions;

if (process.platform === 'win32') {
  nextBin = 'cmd';
  spawnOptions = {
    args: ['/c', 'npm', 'start'],
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname,
    shell: true
  };
} else {
  nextBin = path.join(__dirname, 'node_modules', '.bin', 'next');
  spawnOptions = {
    args: ['start'],
    stdio: 'inherit',
    env: process.env,
    cwd: __dirname
  };
}

const server = spawn(nextBin, spawnOptions.args, {
  stdio: spawnOptions.stdio,
  env: spawnOptions.env,
  cwd: spawnOptions.cwd,
  shell: spawnOptions.shell
});

server.on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nReceived SIGINT, shutting down gracefully...');
  server.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nReceived SIGTERM, shutting down gracefully...');
  server.kill('SIGTERM');
});
