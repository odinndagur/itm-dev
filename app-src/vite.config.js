import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    base: '/itm-dev/',
    plugins: [
        react({
            include: '**/*.tsx',
        }),
    ],
    // build: {
    //   watch: {
    //     // https://rollupjs.org/guide/en/#watch-options
    //   }
    // }
})
