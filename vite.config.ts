import { fileURLToPath, URL } from 'url';
import * as childProcess from 'child_process';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const commitHash = childProcess
  .execSync('git rev-parse --short HEAD')
  .toString();

console.log(commitHash);

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    '__GIT_REV': JSON.stringify(commitHash),
  }, 
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
