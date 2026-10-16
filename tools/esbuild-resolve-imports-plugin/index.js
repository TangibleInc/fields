// Path
import { extname } from 'node:path';
// External
// import { getTsconfig } from 'get-tsconfig';
// Local
import chunkFileContents from './chunk.js';
import { defaultFilter } from './const.js';
import fixImportsAndRequires from './fixImports.js';
import resolveImportPath, { enablePathResolver } from './resolveImportPath.js';
/**
 * EsBuild plugin which fixes issues related to import/require differences between ESM/CJS.
 * Based on https://github.com/ignwombat/esbuild-fix-imports MIT License (c) 2026 ignwombat
 */
export function esbuildResolveImportsPlugin(options = {}) {
    /**
     * EsBuild plugin which fixes issues related to import/require differences between ESM/CJS.
     */
    const plugin = {
        name: 'esbuild-fix-imports',
        setup(build) {
            let rootDir;
            let tsConfigPaths;
            let tsconfig;
            // if (options.rootDir !== false &&
            //     options.tsConfigPaths !== false) {
            //     tsconfig = getTsconfig()?.config;
            // }
            if (options.rootDir !== false) {
                rootDir = typeof options.rootDir === 'string'
                    ? options.rootDir
                    : tsconfig?.compilerOptions?.rootDir;
            }
            if (options.tsConfigPaths !== false) {
                if (typeof options.tsConfigPaths === 'object')
                    tsConfigPaths = options.tsConfigPaths;
                else {
                    const pathConfig =
                      // typeof options.tsConfigPaths === 'string'
                      //   ? getTsconfig(options.tsConfigPaths)?.config
                      //   :
                      tsconfig;
                    if (pathConfig)
                        tsConfigPaths = pathConfig.compilerOptions?.paths;
                }
            }
            const pathCache = new Map();
            const loader = options.loader;
            const resolveLoader = typeof loader === 'string'
                ? () => loader
                : typeof loader === 'function'
                    ? loader
                    : ext => (['.ts', '.mts', '.cts'].includes(ext)
                        ? 'ts'
                        : ext === '.tsx'
                            ? 'tsx'
                            : ['.js', '.cjs', '.mjs'].includes(ext)
                                ? 'js'
                                : ext === '.jsx'
                                    ? 'jsx'
                                    : 'text');
            // If bundling is enabled, all this plugin will do is resolve the import from tsconfig paths
            if (build.initialOptions.bundle)
                return enablePathResolver(build, {
                    ...options,
                    tsConfigPaths: tsConfigPaths,
                    rootDir: rootDir ?? process.cwd()
                }, pathCache);
            build.onLoad({ filter: options.filter ?? defaultFilter }, async (args) => {
                const result = await fixImportsAndRequires({
                    filePath: args.path,
                    writeToFile: false,
                    inputExtension: options.inputExtension,
                    outputExtension: options.outputExtension,
                    ignoreDynamicImports: options.ignoreDynamicImports,
                    tsConfigPaths,
                    rootDir,
                    pathCache
                });
                return {
                    contents: result.newContents,
                    loader: resolveLoader(extname(args.path), args.path)
                };
            });
        }
    };
    return plugin;
}
;
// Other exports for consumer convenience
export { chunkFileContents, fixImportsAndRequires, resolveImportPath };
