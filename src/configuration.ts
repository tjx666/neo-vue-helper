import vscode from 'vscode';

interface Configuration {
    moduleDefinition: {
        enable: boolean;
    };
}

export const configuration: Configuration = {
    moduleDefinition: {},
} as Configuration;
updateConfiguration();

export function updateConfiguration() {
    const moduleDefinitionConfig = vscode.workspace.getConfiguration('vueHelper.moduleDefinition');
    configuration.moduleDefinition.enable = moduleDefinitionConfig.get('enable')!;
}
