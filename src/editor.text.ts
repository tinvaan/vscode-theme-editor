
import * as vscode from 'vscode';
import { Disposable } from './dispose';


export class ThemeDocument extends Disposable implements vscode.TextDocument {
    private _data: Uint8Array;
    private readonly _uri: vscode.Uri;
    private readonly _version: number;
    private readonly _fileName: string;
    private readonly _languageId: string;
    private readonly _isDirty: boolean;
    private readonly _isClosed: boolean;
    private readonly _isUntitled: boolean;

    constructor(uri: vscode.Uri, data: Uint8Array) {
        super();
        this._uri = uri;
        this._data = data;
    }

    public get data(): Uint8Array { return this._data; }
    public get uri(): vscode.Uri { return this._uri; }
    public get version(): number { return this._version; }
    public get fileName(): string { return this._fileName; }
    public get languageId(): string { return this._languageId; }
    public get isDirty(): boolean { return this._isDirty; }
    public get isClosed(): boolean { return this._isClosed; }
    public get isUntitled(): boolean { return this._isUntitled; }

    getText(range?: vscode.Range): string {
        const editor = vscode.window.activeTextEditor;
        return (editor ? editor.document.getText() : "");
    }

    save(): Thenable<boolean> {
        try {
            let config = vscode.workspace.getConfiguration;
            let settings = JSON.parse(this.getText());
            Object.keys(settings).forEach(section => {
                let current = config(section),
                    modified = settings[section];
                config().update(
                    section, Object.assign(modified, current), true);
            });
            return Promise.resolve(true);
        } catch (err) {
            return Promise.resolve(false);
        }
    }
};


export class ThemeEditor implements vscode.CustomTextEditorProvider {
    public static readonly viewType = 'themes.customize';

    constructor(
        private readonly _context: vscode.ExtensionContext
    ) { }

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            ThemeEditor.viewType,
            new ThemeEditor(context)
        );
    }

    resolveCustomTextEditor(
        document: vscode.TextDocument,
        panel: vscode.WebviewPanel,
        _token: vscode.CancellationToken
    ): Thenable<void> {
        panel.webview.options = { enableScripts: true };
        panel.webview.html = this.getHtmlForWebView(panel.webview);

        const changeDocumentSubscription = vscode.workspace.onDidChangeTextDocument(
            (event: vscode.TextDocumentChangeEvent) => {
                if (event.document.uri.toString() === document.uri.toString()) {
                    panel.webview.postMessage({
                        type: 'update',
                        text: document.getText()
                    });
                }
            }
        );
        panel.onDidDispose(() => changeDocumentSubscription.dispose());
        panel.webview.postMessage({ type: 'update', text: document.getText() });

        return Promise.resolve();
    }

    private getHtmlForWebView(webview: vscode.Webview): string {
        return /*html */`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Theme Customizer</title>
            </head>
            <body>
                <h1>Hello World</h1>
            </body>
        `;
    }
}
