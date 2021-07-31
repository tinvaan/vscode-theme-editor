
import * as assert from 'assert';
import * as vscode from 'vscode';


suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Invoke theme selector', () => {
        const activate = vscode.commands.executeCommand('themes.select');
        assert.strictEqual(typeof activate, 'object');
	});
});
