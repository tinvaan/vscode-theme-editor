
import * as assert from 'assert';
import * as vscode from 'vscode';

import { tmpdir } from 'os';
import { before, after } from 'mocha';

import { themes, populate, ColorTheme } from '../../addons';


suite('Addons test suite', () => {
    const fs = vscode.workspace.fs;
    const notepad = vscode.Uri.file(tmpdir() + '/test.jsonc');

    before(async () => {
        const tmp = new vscode.WorkspaceEdit();
        tmp.createFile(notepad, { overwrite: true });
        await vscode.workspace.applyEdit(tmp);
    });

    test('Fetch all themes', () => {
        const installed = themes();
        assert.strictEqual(typeof installed, 'object');
        assert.strictEqual(installed.length > 0, true);
    });

    test('Populate default notepad', async () => {
        const theme = { label: 'test-theme', key: 'test' } as ColorTheme;
        const given = (await fs.readFile(notepad)).toString();
        populate(notepad, theme);
        const expected = (await fs.readFile(notepad)).toString();

        assert.notStrictEqual(before, after);
    });

    after(async () => {
        const tmp = new vscode.WorkspaceEdit();
        tmp.deleteFile(notepad);
        await vscode.workspace.applyEdit(tmp);
    });
});
