import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    server: {
        proxy: {
            // Proxy cho Gateway Service (authentication, user APIs)
            '/api/authentication': {
                target: 'https://gateway-service-w2gi.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
            '/api/user': {
                target: 'https://gateway-service-w2gi.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
            // Proxy cho Room Service (meeting rooms, agora APIs)
            '/api': {
                target: 'https://gss-room-service.onrender.com',
                changeOrigin: true,
                secure: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'),
            },
        },
    },
});