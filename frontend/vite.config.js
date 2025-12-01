import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
    const plugins = [react()]

    // If ANALYZE=true is set in the environment, produce a bundle analysis HTML file
    if (process.env.ANALYZE === 'true') {
        plugins.push(
            visualizer({
                filename: './dist/bundle-stats.html',
                title: 'Bundle Analysis',
                sourcemap: true,
            }),
        )
    }

    return { plugins }
})