import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  run: {
    tasks: {
      verify: {
        command: ['vp check', 'vp test', 'vp run test', 'vp run test:e2e', 'vp run build'],
        cache: false,
      },
    },
  },
  test: {
    include: ['src/**/*.vite-spec.ts'],
    exclude: ['e2e/**', 'src/**/*.spec.ts'],
    passWithNoTests: true,
  },
  lint: {
    jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
    rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
    options: { typeAware: true, typeCheck: true },
  },
  fmt: {
    printWidth: 100,
    singleQuote: true,
    sortPackageJson: false,
    ignorePatterns: [],
  },
});
