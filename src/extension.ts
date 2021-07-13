
import * as vscode from 'vscode';


function colorThemes() {
    return vscode.extensions.all
        .filter(ext => ext.packageJSON.contributes?.themes)
        .map(ext => ext.packageJSON.contributes.themes
            .map((theme: { id: any; label: any; }) =>
                Object({ 'id': theme.id, 'label': theme.label })
            )
        )
        .reduce((previous, current) => previous.concat(current));
}


export function activate(context: vscode.ExtensionContext) {
    let show = vscode.commands.registerCommand('miser.themes', () => {
        const picker = vscode.window.createQuickPick();
        picker.items = colorThemes();
        picker.onDidAccept(async () => {
            const item = picker.activeItems[0];
            const themeFile = `${item.label}.jsonc`;
            const edit = new vscode.WorkspaceEdit();
            const uri = vscode.Uri.joinPath(
                context.globalStorageUri, 'customizations', themeFile);

            edit.createFile(uri, { ignoreIfExists: true, overwrite: false });
            await vscode.workspace.applyEdit(edit);
            await vscode.window.showTextDocument(uri);
        });
        picker.show();
    });

    context.subscriptions.push(show);
}


export function deactivate() {}
