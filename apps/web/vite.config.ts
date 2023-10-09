import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue2';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import { defineConfig, loadEnv } from 'vite';

import packageJson from './package.json';

const htmlPlugin = (htmlTitle?: string) => ({
  name: 'html-transform',
  transformIndexHtml(html: string) {
    if (typeof htmlTitle === 'undefined') {
      return html;
    }
    return html.replace(/<title>(.*?)<\/title>/, `<title>${htmlTitle}</title>`);
  },
});

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VUE');

  let htmlTitle: string | undefined;
  if (typeof packageJson?.title !== 'undefined') {
    htmlTitle = packageJson?.title;
  }

  if (typeof env.VUE_APP_TITLE !== 'undefined') {
    htmlTitle = env.VUE_APP_TITLE;
  }

  return {
    server: {
      port: 8080,
    },
    define: {
      'process.env': env,
    },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./src', import.meta.url)),
        '@': fileURLToPath(new URL('../../packages/frontend/src', import.meta.url)),
      },
    },
    css: {
      postcss: {
        plugins: [tailwindcss, autoprefixer],
      },
    },
    plugins: [vue(), htmlPlugin(htmlTitle)],
  };
});
