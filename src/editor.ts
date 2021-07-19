
import * as vscode from 'vscode';
import { populate, ColorTheme } from './addons';
import { Disposable, disposeAll } from './dispose';


export class ThemeDocument extends Disposable implements vscode.CustomDocument {
    private _data: Uint8Array;
    private readonly _uri: vscode.Uri;

    private readonly _onDidDispose = this._register(new vscode.EventEmitter<void>());
    private readonly _onDidChangeDocument = this._register(
        new vscode.EventEmitter<{ readonly content?: Uint8Array; }>());
    private readonly _onDidChange = this._register(new vscode.EventEmitter<{
        readonly label: string,
        undo(): void,
        redo(): void
    }>());

    constructor(uri: vscode.Uri, data: Uint8Array) {
        super();
        this._uri = uri;
        this._data = data;
    }

    public static async create(
        uri: vscode.Uri,
        context: vscode.ExtensionContext
    ): Promise<ThemeDocument> {
        const theme = context.globalState.get('activeTheme');
        const data = theme
            ? await populate(uri, theme)
            : Buffer.from(JSON.stringify({}));
        return new ThemeDocument(uri, data);
    }

    public get uri(): vscode.Uri { return this._uri; }

    public get data(): Uint8Array { return this._data; }

    public readonly onDidChange = this._onDidChange.event;

    public readonly onDidDispose = this._onDidDispose.event;

    public readonly onDidChangeContent = this._onDidChangeDocument.event;

    dispose(): void {
        this._onDidDispose.fire();
        super.dispose();
    }

    getText(range?: vscode.Range): string {
        const editor = vscode.window.activeTextEditor;
        return (editor ? editor.document.getText() : "");
    }

    async save(cancellation?: vscode.CancellationToken): Promise<void> {
        if (cancellation && !cancellation.isCancellationRequested) {
            let config = vscode.workspace.getConfiguration;
            let settings = JSON.parse(this.getText());
            Object.keys(settings).forEach(section => {
                let current = config(section),
                    modified = settings[section];
                config().update(section, Object.assign(modified, current), true);
            });
        }
    }

    async saveAs(
        target: vscode.Uri, cancellation?: vscode.CancellationToken
    ): Promise<void> {
        // TODO: How should we handle?
    }

    async backup(
        destination: vscode.Uri, cancellation: vscode.CancellationToken
    ): Promise<void> {
        // TODO
    }

    async revert(cancellation?: vscode.CancellationToken): Promise<void> {
        // TODO
    }

};


export class ThemeEditor implements vscode.CustomEditorProvider<ThemeDocument> {
    private readonly _onDidChangeCustomDocument = new vscode.EventEmitter<vscode.CustomDocumentEditEvent<ThemeDocument>>();

    constructor(
        private readonly _context: vscode.ExtensionContext
    ) { }

    public static register(context: vscode.ExtensionContext): vscode.Disposable {
        return vscode.window.registerCustomEditorProvider(
            ThemeEditor.viewType,
            new ThemeEditor(context)
        );
    }
    public static readonly viewType = 'themes.customize';

    public readonly onDidChangeCustomDocument = this._onDidChangeCustomDocument.event;

    async resolveCustomEditor(
        doc: ThemeDocument,
        panel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> { }

    async openCustomDocument(
        uri: vscode.Uri,
        _ctx: vscode.CustomDocumentOpenContext,
        _token: vscode.CancellationToken
    ): Promise<ThemeDocument> {
        const listeners: vscode.Disposable[] = [];
        const document = await ThemeDocument.create(uri, this._context);

        listeners.push(document.onDidChange(e => {
            this._onDidChangeCustomDocument.fire({ document, ...e });
        }));
        listeners.push(document.onDidChangeContent(async (e) => {
            await document.save();
        }));

        document.onDidDispose(() => disposeAll(listeners));
        return document;
    }

    public saveCustomDocument(
        document: ThemeDocument,
        cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return document.save(cancellation);
    }

    public saveCustomDocumentAs(
        document: ThemeDocument,
        destination: vscode.Uri,
        cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return document.saveAs(destination, cancellation);
    }

    public revertCustomDocument(
        document: ThemeDocument,
        cancellation: vscode.CancellationToken
    ): Thenable<void> {
        return document.revert(cancellation);
    }

    public backupCustomDocument(
        document: ThemeDocument,
        context: vscode.CustomDocumentBackupContext,
        cancellation: vscode.CancellationToken
    ): Thenable<vscode.CustomDocumentBackup> {
        // return document.backup(context.destination, cancellation);
    }
};
