import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
<<<<<<< Updated upstream
            '/api': {
                target: 'https://gateway-service-w2gi.onrender.com',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
=======
             // Proxy cho Room Service (meeting rooms, agora APIs)
            '/api/room': {
                target: 'https://gss-room-service.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api\/room/, '/api'),
            },
            '/api': {
                target: 'https://gateway-service-w2gi.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
           
>>>>>>> Stashed changes
        },
    },
});