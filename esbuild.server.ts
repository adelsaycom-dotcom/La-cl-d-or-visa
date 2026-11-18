import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'es2022',
  outfile: 'dist/server.cjs',
  format: 'cjs',
  minify: true,
  treeShaking: true,
  external: ['express', 'vite', '@prisma/client', 'mysql2', 'mysql2/*', 'firebase-admin', 'firebase-admin/*'],
}).catch(() => process.exit(1));
