/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());
    return {
        plugins: [react(), tailwindcss()],
        base: './',
        server: {
            proxy: {
                '/api/room': {
                    target: env.VITE_ROOM_SERVICE_URL,
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/api\/room/, '/api'),
                },
                '/api': {
                    target: env.VITE_GATEWAY_SERVICE_URL,
                    changeOrigin: true,
                    secure: true,
                    rewrite: (path) => path.replace(/^\/api/, '/api'),
                },
            },
        },
    };
});