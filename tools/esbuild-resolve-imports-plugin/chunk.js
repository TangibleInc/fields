// Local
import { stringChars } from './const.js';
/** Which mode the lexer for chunking is currently in. */
const LexerMode = {
    Code: 0,
    String: 1,
    TemplateString: 2,
    TemplateExpression: 3
};
/**
 * Splits the JS content into a linked list of logic and strings.
 * Useful for altering strings in a file, whilst leaving the rest untouched.
 * @param fileContents Contents of the JS file.
*/
export default function chunkFileContents(fileContents) {
    const modeStack = [LexerMode.Code];
    const mode = () => modeStack[modeStack.length - 1];
    const pushMode = (m) => modeStack.push(m);
    const popMode = () => modeStack.pop();
    let stringQuote = null;
    let currentChunk = {
        content: '',
        kind: 'code',
        stringQuote: null
    };
    const chunks = [];
    const pushChunk = () => {
        if (currentChunk.content.length === 0) {
            currentChunk.kind = 'code';
            currentChunk.stringQuote = null;
            currentChunk.inTemplate = undefined;
            return;
        }
        chunks.push(currentChunk);
        const next = {
            content: '',
            kind: 'code',
            stringQuote: null
        };
        next.prev = currentChunk;
        currentChunk.next = next;
        currentChunk = next;
    };
    const isEscaped = (i) => {
        let count = 0;
        for (let j = i - 1; j >= 0; j--) {
            if (fileContents[j] !== '\\')
                break;
            count++;
        }
        return count % 2 === 1;
    };
    for (let i = 0; i < fileContents.length; i++) {
        const char = fileContents[i];
        const next = fileContents[i + 1];
        switch (mode()) {
            // Code and TemplateExpression
            case LexerMode.Code:
            case LexerMode.TemplateExpression: {
                if (mode() === LexerMode.TemplateExpression) {
                    if (char === '`') {
                        // Push previous contents first
                        if (currentChunk.content.length > 0) {
                            currentChunk.kind = 'templateExpression';
                            currentChunk.inTemplate = true;
                            pushChunk();
                        }
                        currentChunk.kind = 'template';
                        currentChunk.stringQuote = '`';
                        currentChunk.content += char;
                        pushMode(LexerMode.TemplateString);
                        break;
                    }
                    // End template expression
                    if (char === '}') {
                        // Push inner contents first
                        if (currentChunk.content.length > 0) {
                            currentChunk.kind = 'templateExpression';
                            currentChunk.inTemplate = true;
                            pushChunk();
                        }
                        // Closing bracket in its own chunk
                        currentChunk.kind = 'templateExpressionEnd';
                        currentChunk.content = '}';
                        pushChunk();
                        popMode();
                        break;
                    }
                    // Expression content
                    currentChunk.kind = 'templateExpression';
                    currentChunk.inTemplate = true;
                    currentChunk.content += char;
                    break;
                }
                // Opening string
                if (stringChars.includes(char)) {
                    pushChunk();
                    const isTemplate = char === '`';
                    currentChunk.kind = isTemplate
                        ? 'template'
                        : 'string';
                    currentChunk.stringQuote = char;
                    currentChunk.content += char;
                    stringQuote = char;
                    pushMode(isTemplate
                        ? LexerMode.TemplateString
                        : LexerMode.String);
                    break;
                }
                currentChunk.content += char;
                break;
            }
            // Inside string
            case LexerMode.String: {
                currentChunk.content += char;
                if (char === stringQuote &&
                    !isEscaped(i)) {
                    pushChunk();
                    stringQuote = null;
                    popMode();
                }
                break;
            }
            // Template string
            case LexerMode.TemplateString: {
                // Close template string
                if (char === '`' && !isEscaped(i)) {
                    currentChunk.kind = 'template';
                    currentChunk.stringQuote = '`';
                    currentChunk.content += char;
                    pushChunk();
                    // Exit template mode
                    popMode();
                    break;
                }
                // Start ${
                if (char === '$' && next === '{') {
                    pushChunk();
                    currentChunk.kind = 'templateExpressionStart';
                    currentChunk.content = '${';
                    pushChunk();
                    pushMode(LexerMode.TemplateExpression);
                    i++;
                    break;
                }
                currentChunk.kind = 'template';
                currentChunk.stringQuote = '`';
                currentChunk.content += char;
                break;
            }
        }
    }
    pushChunk();
    if (chunks.length) {
        chunks[chunks.length - 1].next = undefined;
    }
    return chunks;
}
