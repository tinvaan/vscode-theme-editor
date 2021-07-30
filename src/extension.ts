
import { ThemeEditor } from './editor.texteditor';
import { themes, ColorTheme } from './addons';
import { Uri, window, commands, ExtensionContext } from 'vscode';


export function activate(context: ExtensionContext) {
    // Register custom editor
    context.subscriptions.push(ThemeEditor.register(context));

    // Register commands
    context.subscriptions.push(commands.registerCommand('miser.themes', () => {
        const picker = window.createQuickPick();
        picker.items = themes();
        picker.onDidAccept(async () => {
            let item = picker.activeItems[0] as ColorTheme,
                theme = `${item.label}.jsonc`,
                uri = Uri.joinPath(context.globalStorageUri, 'data', theme);

            context.globalState.update('activeState', item);
            commands.executeCommand('vscode.openWith', uri, ThemeEditor.viewType);
        });
        picker.show();
    }));
}
