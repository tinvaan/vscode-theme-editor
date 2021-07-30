
import * as vscode from 'vscode';
import { Disposable } from './dispose';


export class ThemeEditor implements vscode.TextEditor {
    private readonly _selection: vscode.Selection;
    private readonly _visibleRanges: vscode.Range[];
    private readonly _selections: vscode.Selection[];
    private readonly _document: vscode.TextDocument;
    private readonly _options: vscode.TextEditorOptions;
    private readonly _viewColumn?: vscode.ViewColumn;

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

    public get selection(): vscode.Selection { return this._selection; }
    public get visibleRanges(): vscode.Range[] { return this._visibleRanges; }
    public get selections(): vscode.Selection[] { return this._selections; }
    public get document(): vscode.TextDocument { return this._document; }
    public get options(): vscode.TextEditorOptions { return this._options; }
    public get viewColumn(): vscode.ViewColumn | undefined { return this._viewColumn; }

    edit(
        callback: (editBuilder: vscode.TextEditorEdit) => void,
        options?: { undoStopBefore: boolean, undoStopAfter: boolean }
    ): Thenable<boolean> {
        return Promise.resolve(true);
    }

    insertSnippet(
        snippet: vscode.SnippetString,
        location?: vscode.Position | vscode.Range | readonly vscode.Position[] | readonly vscode.Range[],
        options?: { undoStopBefore: boolean, undoStopAfter: boolean }
    ): Thenable<boolean> {
        return Promise.resolve(true);
    }

    setDecorations(
        decorationType: vscode.TextEditorDecorationType,
        rangesOrOptions: readonly vscode.Range[] | readonly vscode.DecorationOptions[]
    ): void { }

    revealRange(
        range: vscode.Range,
        revealType?: vscode.TextEditorRevealType
    ): void { }

    show(column: vscode.ViewColumn): void { }

    hide(): void { }
}
