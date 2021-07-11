
import * as vscode from 'vscode';


function colorThemes() {
    return vscode.extensions.all
        .filter(ext => ext.packageJSON.contributes?.themes)
        .map(ext => ext.packageJSON.contributes.themes
            .map((theme: { id: any; label: any; uiTheme: any; }) => Object({
                'id': theme.id, 'label': theme.label, 'uiTheme': theme.uiTheme, 'uri': ext.extensionUri
            }))
        )
        .reduce((previous, current) => previous.concat(current));
}


export function activate(context: vscode.ExtensionContext) {
    let show = vscode.commands.registerCommand('miser.themes', () => {
        vscode.window.showQuickPick(colorThemes(), {
            onDidSelectItem: async (item: vscode.Event<void>) => {
                vscode.window.showInformationMessage(JSON.stringify(item, null, 2));

                let uri = vscode.Uri.file('/home/harish/package.json');
                let edit = new vscode.WorkspaceEdit();
                edit.createFile(uri, { ignoreIfExists: true, overwrite: false });
                await vscode.workspace.applyEdit(edit);
                await vscode.window.showTextDocument(uri, { preview: false });
            }
        });	
    });

    context.subscriptions.push(show);
}


export function deactivate() {}
