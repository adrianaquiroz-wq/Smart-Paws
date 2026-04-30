import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    // El 'base' debe coincidir exactamente con el nombre de tu repo en GitHub
    base: '/Smart-Paws/', 
    
    plugins: [react(), tailwindcss()],
    
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    
    resolve: {
      alias: {
        // Esto permite usar '@' para referenciar la carpeta 'src'
        '@': path.resolve(__dirname, './src'),
      },
    },
    
    server: {
      // Mantiene el HMR activo a menos que se desactive por env
      hmr: env.DISABLE_HMR !== 'true',
      port: 5173,
    },

    build: {
      // Opcional: asegura que los assets se generen en la ruta correcta
      outDir: 'dist',
    }
  };
});
