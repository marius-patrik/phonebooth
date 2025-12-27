import { defineConfig } from '@rsbuild/core';
import { pluginBasicSsl } from '@rsbuild/plugin-basic-ssl';
import { pluginReact } from '@rsbuild/plugin-react';

export default defineConfig({
  plugins: [pluginReact(), pluginBasicSsl()],

  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },

  source: {
    // Resolve .js imports to .ts/.tsx files
    alias: {},
  },

  tools: {
    rspack: {
      resolve: {
        extensionAlias: {
          '.js': ['.ts', '.tsx', '.js'],
        },
      },
    },
  },
});
