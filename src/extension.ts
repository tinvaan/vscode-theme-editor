
import { themes, populate, ColorTheme } from './addons';
import {
    Uri,
    window,
    commands,
    workspace,
    TextDocument,
    WorkspaceEdit,
    ExtensionContext
} from 'vscode';


export function activate(context: ExtensionContext) {
    let show = commands.registerCommand('miser.themes', () => {
        const picker = window.createQuickPick();
        picker.items = themes();
        picker.onDidAccept(async () => {
            const item = picker.activeItems[0];
            const themeFile = `${item.label}.jsonc`;
            const edit = new WorkspaceEdit();
            const uri = Uri.joinPath(
                context.globalStorageUri, 'customizations', themeFile);

            edit.createFile(uri, { ignoreIfExists: true, overwrite: false });
            await workspace.applyEdit(edit);
            await populate(uri, item as ColorTheme);
            await window.showTextDocument(uri);
        });
        picker.show();
    });

    let save = workspace.onDidSaveTextDocument((event: TextDocument) => {
        let config = workspace.getConfiguration;
        let settings = JSON.parse(event.getText());
        Object.keys(settings).forEach(section => {
            let current = config(section),
                modified = settings[section];
            config().update(section, Object.assign(modified, current), true);
        });
    });

    context.subscriptions.push(show);
    context.subscriptions.push(save);
}


export function deactivate() {}
