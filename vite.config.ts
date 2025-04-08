/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default ({ mode }: { mode: string }) => {
  const env = loadEnv(mode, process.cwd()); // 获取.env文件里定义的环境变量

  return defineConfig({
    base: './',
    publicDir: 'public',
    build: {
      target: 'modules', // 浏览器兼容目标
      outDir: 'dist', // 打包输出路径
      assetsDir: 'assets', // 静态资源存放路径
      cssCodeSplit: true, // 允许 css 代码拆分
      sourcemap: false, // 不生成 sourceMap 文件
      minify: 'terser', // 缩小文件体积
      terserOptions: {
        compress: {
          drop_console: true, // 取消 console
          drop_debugger: true, // 取消 debugger
        },
      },
    },
    plugins: [react()],
    server: {
      host: 'localhost', // 指定监听的IP地址
      port: 8000, // 指定服务器端口
      open: true, // 开发服务器启动时，自动在浏览器打开
      strictPort: false, // 若端口已被占用，就尝试下一个可用端口
      // https: false, // 不开启 https 服务
      cors: true, // 允许跨域
      // 配置代理
      proxy: {
        '/api': {
          // target: 'http://172.30.165.61:8080/api', // 接口地址
          target: env.VITE_APP_HTTP_URL,
          changeOrigin: true, // 接口跨域
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  });
};

// https://vite.dev/config/
