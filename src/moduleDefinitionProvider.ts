import fs from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import type {
    CancellationToken,
    Definition,
    DefinitionLink,
    DefinitionProvider,
    LocationLink,
    TextDocument,
} from 'vscode';
import { Position, Range, Uri } from 'vscode';

import { isDirectory, pathExists } from './utils';

const indexFileExts = ['js', 'jsx', 'ts', 'tsx'];
const indexFileNames = new Set(indexFileExts.map((ext) => `index${ext}`));

export class ModuleDefinitionProvider implements DefinitionProvider {
    async provideDefinition(
        document: TextDocument,
        position: Position,
        _token: CancellationToken,
    ): Promise<Definition | LocationLink[] | undefined> {
        const { fileName } = document;
        const directory = dirname(fileName);

        const line = document.lineAt(position);
        const lineText = line.text;
        const importStatementRegexp = /^\s*import\s+(.*?)?["'](.*?)["']/;
        const matchArray = lineText.match(importStatementRegexp);
        const modulePath = matchArray?.[2];
        if (modulePath === undefined) return;

        const createDefinition = (vueFile: string) => {
            const modulePathIndex = lineText.indexOf(modulePath);
            const startPosition = new Position(line.range.start.line, modulePathIndex);
            const endPosition = new Position(
                line.range.start.line,
                modulePathIndex + modulePath.length,
            );
            const definitionLink: DefinitionLink = {
                originSelectionRange: new Range(startPosition, endPosition),
                targetUri: Uri.file(vueFile),
                targetRange: new Range(new Position(0, 0), new Position(0, 0)),
            };
            return [definitionLink];
        };

        const isRelativePath = modulePath.startsWith('.');
        if (isRelativePath) {
            const absPath = resolve(directory, modulePath);
            const isPathExists = await pathExists(absPath);
            if (
                isPathExists &&
                (await isDirectory(absPath)) &&
                (await fs.readdir(absPath)).every((filename) => !indexFileNames.has(filename))
            ) {
                const vueIndex = resolve(absPath, 'index.vue');
                if (await pathExists(vueIndex)) {
                    return createDefinition(vueIndex);
                }
            } else if (
                !isPathExists &&
                (
                    await Promise.all(
                        indexFileExts.map(async (ext) => {
                            return !(await pathExists(`${absPath}.${ext}`));
                        }),
                    )
                ).every(Boolean)
            ) {
                const vueIndex = `${absPath}.vue`;
                if (await pathExists(vueIndex)) {
                    return createDefinition(vueIndex);
                }
            }
        }

        return undefined;
    }
}
