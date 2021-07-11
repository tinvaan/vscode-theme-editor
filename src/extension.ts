
import * as vscode from 'vscode';


function colorThemes() {
    return vscode.extensions.all
        .filter(ext => ext.packageJSON.contributes?.themes)
        .map(ext => ext.packageJSON.contributes.themes
            .map((theme: Object) =>
                Object({
                    'id': theme.id,
                    'label': theme.label,
                    'uiTheme': theme.uiTheme,
                    'uri': ext.packageJSON.extensionLocation
                })
            )
        )
        .reduce((previous, current) => previous.concat(current));
}


export function activate(context: vscode.ExtensionContext) {
    let show = vscode.commands.registerCommand('miser.themes', () => {
        vscode.window.showQuickPick(colorThemes(), {
            onDidSelectItem: async (item: vscode.Event<void>) => {
                const stateFile = item.label + '.json';
                const edit = new vscode.WorkspaceEdit();
                const uri = vscode.Uri.joinPath(
                    context.globalStorageUri, 'customizations', stateFile);

                edit.createFile(uri, { ignoreIfExists: true, overwrite: false });
                await vscode.workspace.applyEdit(edit);
                await vscode.window.showTextDocument(uri, { preview: false });
            }
        });	
    });

    context.subscriptions.push(show);
}


export function deactivate() {}
