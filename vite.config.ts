import {defineConfig, loadEnv} from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig((config) =>{
    const env = loadEnv(config.mode, process.cwd(), '');
    return {
        plugins: [react()],
        base: env.VITE_BASE,
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src')
            },
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', 'css']
        },
        server:{
            port: 5175,
            proxy:{
                '/identityApi': {
                    target: env.VITE_IDENTITY_API,
                    changeOrigin: true,
                    rewrite: (path:string) => path.replace(/^\/identityApi/, '')
                },
                '/groupApi': {
                    target: env.VITE_GROUP_API,
                    changeOrigin: true,
                    rewrite: (path:string) => path.replace(/^\/groupApi/, '')
                },
                '/agentApi': {
                    target: env.VITE_AGENT_API,
                    changeOrigin: true,
                    rewrite: (path:string) => path.replace(/^\/agentApi/, '')
                },
            }
        },
        build: {
            outDir: `build/order`,
        }
    }
})
