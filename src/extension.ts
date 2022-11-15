import vscode from 'vscode';

import { configuration, updateConfiguration } from './configuration';
import { ModuleDefinitionProvider } from './moduleDefinitionProvider';

export function activate({ subscriptions }: vscode.ExtensionContext) {
    vscode.workspace.onDidChangeConfiguration(() => {
        updateConfiguration();
    }, subscriptions);

    if (configuration.moduleDefinition.enable) {
        subscriptions.push(
            vscode.languages.registerDefinitionProvider(['vue'], new ModuleDefinitionProvider()),
        );
    }
}

export function deactivate() {}
