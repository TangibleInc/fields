// Fs
import { readFile, writeFile } from 'node:fs/promises';
// Local
import { dynamicImportRegex, importRegex, requireRegex } from './const.js';
import chunkFileContents from './chunk.js';
import resolveImportPath from './resolveImportPath.js';
/**
 * Automatically adds file extensions and index files to import/require statements.
 * Returns new contents and optionally writes to the file.
 * @param options Options for fixing imports in a single file.
 */
export default async function fixImportsAndRequires(options) {
    // Paths
    const filePath = options.filePath;
    const rootDir = typeof options.rootDir === 'string'
        ? options.rootDir
        : process.cwd();
    // File contents (cast to string to prevent TypeScript errors)
    let fileContents = options.contents;
    // Optionally read the file.
    if (typeof fileContents !== 'string')
        await readFile(filePath, 'utf8')
            .then(contents => fileContents = contents)
            .catch(err => {
            throw new Error(`Failed to read file ${filePath}`, { cause: err });
        });
    const chunks = chunkFileContents(fileContents);
    // Map chunks to create new contents
    const mappedChunks = await Promise.all(chunks.map(async (chunk) => {
        // Check for import/require statements
        // Current chunk must be a string
        // Previous chunk must NOT be a string
        // Previous chunk must match the import or require RegEx
        if (chunk.stringQuote !== null &&
            !chunk.content.slice(1).startsWith('node:') && // No need to resolve node imports
            chunk.prev?.stringQuote === null &&
            (importRegex.test(chunk.prev.content) ||
                (requireRegex.test(chunk.prev.content) &&
                    // Only pure require(string) calls
                    chunk.next?.content.match(/^\s*\)/)) ||
                (!options.ignoreDynamicImports &&
                    // Only pure import(string) calls
                    dynamicImportRegex.test(chunk.prev.content) &&
                    chunk.next?.content.match(/^\s*\)/)))) {
            const quote = chunk.stringQuote;
            const quoteLen = quote.length;
            const importPath = chunk.content.slice(quoteLen, -quoteLen);
            const result = resolveImportPath({
                filePath,
                importPath,
                inputExtension: options.inputExtension,
                outputExtension: options.outputExtension,
                rootDir,
                pathCache: options.pathCache,
                tsConfigPaths: options.tsConfigPaths
            });
            return quote + result.resolvedOutput + quote;
        }
        return chunk.content;
    }));
    const newContents = mappedChunks.join('');
    const result = {
        newContents,
        oldContents: fileContents,
        filePath,
        written: false
    };
    if (options.writeToFile === true) {
        await writeFile(filePath, newContents, 'utf8')
            .catch(err => {
            throw new Error(`Failed to write to file ${filePath}`, { cause: err });
        });
        result.written = true;
    }
    return result;
}
