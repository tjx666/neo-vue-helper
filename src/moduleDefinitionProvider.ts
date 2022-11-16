import { dirname } from 'node:path';
import type { AsyncOpts } from 'resolve';
import _resolve from 'resolve';
import type { CancellationToken, DefinitionLink, DefinitionProvider, TextDocument } from 'vscode';
import { Position, Range, Uri } from 'vscode';

function resolveModule(modulePath: string, opts: AsyncOpts) {
    return new Promise<string | void>((resolve) => {
        _resolve(modulePath, opts, (err, moduleAbsPath) => {
            if (err) {
                resolve();
                return;
            }
            resolve(moduleAbsPath);
        });
    });
}

export class ModuleDefinitionProvider implements DefinitionProvider {
    async provideDefinition(
        document: TextDocument,
        position: Position,
        _token: CancellationToken,
    ): Promise<DefinitionLink[] | undefined> {
        const line = document.lineAt(position);
        const lineText = line.text;
        const importStatementRegexp = /^\s*import\s+(.*?)?["'](.*?)["']/;
        const matchArray = lineText.match(importStatementRegexp);
        const modulePath = matchArray?.[2];
        if (modulePath === undefined) return;

        const createDefinition = async (targetFile: string) => {
            const modulePathIndex = lineText.indexOf(modulePath);
            const startPosition = new Position(line.range.start.line, modulePathIndex);
            const endPosition = new Position(
                line.range.start.line,
                modulePathIndex + modulePath.length,
            );
            const definitionLink: DefinitionLink = {
                originSelectionRange: new Range(startPosition, endPosition),
                targetUri: Uri.file(targetFile),
                targetRange: new Range(new Position(0, 0), new Position(0, 0)),
            };
            return [definitionLink];
        };

        const { fileName } = document;
        const directory = dirname(fileName);
        const baseOptions: AsyncOpts = {
            basedir: directory,
            extensions: ['.tsx', '.ts', '.jsx', '.js', '.vue'],
        };
        let moduleAbsPath = await resolveModule(modulePath, {
            ...baseOptions,
            // get real path
            preserveSymlinks: false,
        });
        if (moduleAbsPath) {
            const isWorkspaceDep = !moduleAbsPath.includes('node_modules');
            if (!isWorkspaceDep) {
                moduleAbsPath = await resolveModule(modulePath, {
                    ...baseOptions,
                    // use local deps, but not pnpm cache
                    preserveSymlinks: true,
                });
            }
            if (moduleAbsPath) {
                return createDefinition(moduleAbsPath);
            }
        }

        return undefined;
    }
}
