import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['server.ts'],
  bundle: true,
  platform: 'node',
  target: 'es2022',
  outfile: 'dist/server.cjs',
  format: 'cjs',
  external: ['express', 'vite', '@prisma/client'],
}).catch(() => process.exit(1));
