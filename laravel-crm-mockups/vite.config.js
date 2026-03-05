import { defineConfig } from 'vite';
import { resolve } from 'path';
import { glob } from 'glob';
import handlebars from 'vite-plugin-handlebars';

// Find all HTML files in src/admin and src/portal
const htmlFiles = glob.sync('src/{admin,portal}/**/*.html');

// Build input object for Vite
const input = {
  main: resolve(__dirname, 'index.html'),
};

htmlFiles.forEach(file => {
  const name = file.replace('src/', '').replace('.html', '');
  input[name] = resolve(__dirname, file);
});

export default defineConfig({
  root: '.',
  base: './',
  plugins: [
    handlebars({
      partialDirectory: [
        resolve(__dirname, 'src/shared/templates/partials'),
        resolve(__dirname, 'src/shared/templates/layouts'),
      ],
      context(pagePath) {
        // Determine theme based on path
        const isPortal = pagePath.includes('/portal/');
        return {
          theme: isPortal ? 'portal' : 'admin',
          isAdmin: !isPortal,
          isPortal: isPortal,
        };
      },
    }),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input,
    },
  },
  server: {
    open: '/src/admin/index.html',
  },
});
