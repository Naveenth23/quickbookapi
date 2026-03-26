import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'
import react from '@vitejs/plugin-react'

export default defineConfig({
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        allowedHosts: ['.localhost'],
        watch: {
            usePolling: true,
        },
        hmr: {
            host: 'localhost', // Browser looks here for updates
        },
    },
    plugins: [
        laravel({
            input: ['resources/js/main.jsx', 'resources/css/app.css'],
            refresh: true,
        }),
        react(),
    ],
});