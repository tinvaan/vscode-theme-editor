
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
    const notepad = Uri.joinPath(context.globalStorageUri, 'notepad.jsonc');

    const open = commands.registerCommand('miser.themes', () => {
        const picker = window.createQuickPick();
        picker.items = themes();
        picker.onDidAccept(async () => {
            const item = picker.activeItems[0];
            const edit = new WorkspaceEdit();

            edit.createFile(notepad, { ignoreIfExists: true, overwrite: false });
            await workspace.applyEdit(edit);
            await populate(notepad, item as ColorTheme);
            await window.showTextDocument(notepad);
        });
        picker.show();
    });

    const save = workspace.onDidSaveTextDocument((document: TextDocument) => {
        const config = workspace.getConfiguration,
              settings = JSON.parse(document.getText());
        Object.keys(settings).forEach(section => {
            const current = config(section),
                  modified = settings[section];
            config().update(section, Object.assign(modified, current), true);
        });
    });

    const close = workspace.onDidCloseTextDocument(async (document: TextDocument) => {
        if (notepad.toString() === document.uri.toString()) {
            const edit = new WorkspaceEdit();
            edit.deleteFile(notepad);
            await workspace.applyEdit(edit);
        }
    });

    context.subscriptions.push(open);
    context.subscriptions.push(save);
    context.subscriptions.push(close);
}
