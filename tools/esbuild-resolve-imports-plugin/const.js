/**
 * Default RegEx filter for EsBuild. Detect ts/js files.
*/
export const defaultFilter = /\.[cm]?[tj]sx?$/;
/**
 * RegEx pattern to detect ESM import/export statements. Does not affect dynamic imports.
*/
export const importRegex = /(^|[;\s]+)(import|export)\s*(([\*\w\d]+\s*(as\s*[\w\d]+)?,?\s*)?(\{[^\}]*\}\s*)?from\s*)?$/;
/**
 * RegEx pattern to detect CJS require statements.
*/
export const requireRegex = /[^;\s]\s*require\s*\(\s*$/;
/**
 * RegEx pattern to detect dynamic ESM import statements.
*/
export const dynamicImportRegex = /[^;\s]\s*import\s*\(\s*$/;
/**
 * Chars used to detect strings.
*/
export const stringChars = `"'\``;
/**
 * RegEx used to capture string content.
*/
export const stringRegex = new RegExp(`^([${stringChars}])([^$]+)\\1$`);
/**
 * RegEx used to check if an import path is relative.
*/
export const relativePathRegex = /^\.{1,2}(\/|$)/;
