import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import rollupVue from 'rollup-plugin-vue';
import electron from 'vite-electron-plugin';
import { customStart } from 'vite-electron-plugin/plugin';
import inject from '@rollup/plugin-inject';
import postcss from 'rollup-plugin-postcss';
import typescript from '@rollup/plugin-typescript';
import styleLint from 'rollup-plugin-stylelint';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    typescript(),
    rollupVue(),
    styleLint(),
    postcss({
      extract: true
    }),
    electron({
      include: ['electron'],
      transformOptions: {
        sourcemap: !!process.env.VSCODE_DEBUG,
      },
      // Will start Electron via VSCode Debug
      plugins: process.env.VSCODE_DEBUG
        ? [customStart(debounce(() => console.log(/* For `.vscode/.debug.script.mjs` */'[startup] Electron App')))]
        : undefined,
    }),
    inject({
      process: "process"
    })
    ],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/main.ts',
      output: {
        format: 'cjs',
        sourcemap: true,
        exports: 'auto'
      },
      external: [
        'electron'
      ]
    }
  },
  optimizeDeps: {
    include: [
      'electron'
    ]
  }
})

function debounce<Fn extends (...args: any[]) => void>(fn: Fn, delay = 299) {
  let t: NodeJS.Timeout
  return ((...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }) as Fn
};