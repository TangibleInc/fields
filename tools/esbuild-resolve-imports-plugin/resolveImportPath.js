// Path
import { dirname, extname, join, relative, resolve } from 'node:path';
// Fs
import { existsSync, statSync } from 'node:fs';
// Validation
import { equal, ok } from 'node:assert/strict';
// Local
import { relativePathRegex } from './const.js';
/**
 * Simple stat wrapper with catch to undefined.
*/
const safeStat = (path) => {
    try {
        return statSync(path);
    }
    catch { }
};
/**
 * Returns the first file extension that resolves to an existing file.
*/
const firstValidExt = (path, extensions) => {
    if (typeof extensions === 'string')
        extensions = [extensions];
    for (let i = 0; i < extensions.length; i++) {
        const ext = extensions[i];
        if (safeStat(path + ext)?.isFile())
            return ext;
    }
};
/**
 * Cleanup relative path.
*/
const cleanRelPath = (path) => (!path.startsWith('.')
    ? `./` + path
    : path).replaceAll('\\', '/');
/**
 * Resolves the import path for a file. Includes file extension.
*/
export default function resolveImportPath(options) {
    // Validation
    equal(typeof options.filePath, 'string', "filePath must be a string");
    equal(typeof options.importPath, 'string', "importPath must be a string");
    options.tsConfigPaths !== undefined && equal(typeof options.tsConfigPaths, 'object', "tsConfigPaths must be an Object");
    options.rootDir !== undefined && equal(typeof options.rootDir, 'string', "rootDir must be a string");
    options.inputExtension !== undefined && ok(typeof options.inputExtension === 'string' ||
        typeof options.inputExtension === 'object', "inputExtension must be a string, an Object or an Array");
    options.outputExtension !== undefined && equal(typeof options.outputExtension, 'string', "outputExtension must be a string");
    options.pathCache !== undefined && ok(options.pathCache instanceof Map, "pathCache must be a map");
    const filePath = options.filePath;
    const importPath = options.importPath;
    const parentDir = dirname(filePath);
    const isRelative = relativePathRegex.test(importPath);
    const rootDir = options.rootDir ?? process.cwd();
    // File extensions
    const importerExt = extname(filePath);
    let inputExtensions;
    if (typeof options.inputExtension === 'object') {
        if (options.inputExtension instanceof Array)
            inputExtensions = [...options.inputExtension];
        else {
            const indexed = options.inputExtension[importerExt] ?? importerExt;
            inputExtensions = indexed instanceof Array
                ? [...indexed]
                : [indexed];
        }
    }
    else
        inputExtensions = [importerExt];
    // Add TS/JS/TSX/JSX
    if (['.ts', '.tsx', '.js', '.jsx'].includes(importerExt)) {
        !inputExtensions.includes('.ts') && inputExtensions.push('.ts');
        !inputExtensions.includes('.tsx') && inputExtensions.push('.tsx');
        !inputExtensions.includes('.js') && inputExtensions.push('.js');
        !inputExtensions.includes('.jsx') && inputExtensions.push('.jsx');
    }
    const outputExt = options.outputExtension ?? '.js';
    // Absolute path of the resolved file
    // Cache is only appended to for non-relative imports
    let resolvedFilePath = options.pathCache?.get(importPath);
    if (!resolvedFilePath &&
        !isRelative &&
        options.tsConfigPaths) {
        for (const k in options.tsConfigPaths) {
            // If the path ends with /*, it is a dynamic path
            const isDynamicPath = k.endsWith('/*');
            // Remove /* from the path
            const prefixPath = isDynamicPath
                ? k.slice(0, -2)
                : k;
            // Import path must be identical or start with the prefix
            if (k === importPath ||
                (isDynamicPath && importPath.startsWith(prefixPath + '/'))) {
                // Everything after the first /
                const rest = importPath.slice(prefixPath.length + 1);
                // Find the first resolving path
                let resolved;
                const paths = options.tsConfigPaths[k];
                ok(paths instanceof Array, `tsconfigPaths['${k}'] must be an array of string`);
                for (let j = 0; j < paths.length; j++) {
                    const path = paths[j];
                    equal(typeof path, 'string', `tsconfigPaths['${k}'][${j}] must be a string`);
                    // File path to try
                    const tryImportPath = path.replace(/\/\*$/, '/' + rest);
                    const joinedPath = resolve(rootDir, tryImportPath);
                    if (existsSync(joinedPath)) {
                        resolved = joinedPath;
                        break;
                    }
                    else {
                        const validExt = firstValidExt(joinedPath, inputExtensions);
                        if (validExt !== undefined) {
                            resolved = joinedPath + validExt;
                            break;
                        }
                    }
                }
                if (resolved) {
                    resolvedFilePath = resolved;
                    break;
                }
            }
        }
    }
    // Default to relative import
    const resultingPath = resolvedFilePath ?? join(filePath, '..', importPath);
    const resultingExt = extname(resultingPath);
    const cleanImportStat = safeStat(resultingPath);
    const result = {
        inputExtension: resolvedFilePath
            ? resultingExt
            : importerExt,
        outputExtension: outputExt,
        isIndexFile: false,
        resolvedInput: resultingPath,
        resolvedOutput: importPath,
        pathCache: options.pathCache
    };
    switch (true) {
        // Folder / Clean file import
        case cleanImportStat !== undefined: {
            if (cleanImportStat.isFile()) {
                const rel = cleanRelPath(relative(parentDir, resultingPath))
                    .slice(0, -resultingExt.length) +
                    outputExt;
                !isRelative && options.pathCache?.set(importPath, resultingPath);
                result.resolvedOutput = rel;
                break;
            }
            const indexFile = join(resultingPath, 'index');
            const validExt = firstValidExt(indexFile, inputExtensions);
            if (validExt !== undefined) {
                const joined = join(resultingPath, 'index' + outputExt);
                const rel = cleanRelPath(relative(parentDir, joined));
                !isRelative && options.pathCache?.set(importPath, joined);
                result.resolvedInput = indexFile;
                result.resolvedOutput = rel;
                result.isIndexFile = true;
                break;
            }
        }
        // File import without extension
        default: {
            const resultingValidExt = firstValidExt(resultingPath, inputExtensions);
            if (resultingValidExt === undefined)
                break;
            const rel = cleanRelPath(relative(parentDir, resultingPath) +
                outputExt);
            !isRelative && options.pathCache?.set(importPath, resultingPath + outputExt);
            result.resolvedInput = resultingPath + resultingValidExt;
            result.resolvedOutput = rel;
            break;
        }
    }
    return result;
}
/**
 * Enables tsconfig path resolution for the builder.
 * @param build EsBuild Builder.
 * @param pluginOptions Initial Plugin Options + Some explicit options.
 * @param pathCache Optional cache to use when resolving imports from tsconfig paths.
*/
export function enablePathResolver(build, pluginOptions, pathCache = new Map()) {
    // Create a regex for all TsConfig import paths
    const allImports = Object
        .keys(pluginOptions.tsConfigPaths)
        .map(k => k
        .replace(/\/\*$/, '\/.*')
        .replaceAll('|', '\\|'))
        .join(')|(');
    const filter = new RegExp(`^((${allImports}))$`);
    build.onResolve({ filter }, async (args) => {
        const result = await resolveImportPath({
            filePath: args.importer,
            importPath: args.path,
            inputExtension: pluginOptions.inputExtension,
            outputExtension: pluginOptions.outputExtension,
            tsConfigPaths: pluginOptions.tsConfigPaths,
            rootDir: pluginOptions.rootDir,
            pathCache
        });
        return { path: result.resolvedInput };
    });
}
