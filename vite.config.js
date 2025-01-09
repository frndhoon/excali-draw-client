import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Excalidraw가 Node.js의 process.env를 필요로 하므로
  // 브라우저 환경에서도 빈 객체라도 제공해주어야 함
  // 이는 Node.js 환경의 process.env를 브라우저에서 흉내내는 역할을 함
  define: {
    'process.env': {},
  },
});
