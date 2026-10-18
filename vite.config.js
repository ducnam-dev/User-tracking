import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/User-tracking/', // Đảm bảo đúng tên repo trên GitHub
})