
import { extensions, workspace, Uri, QuickPickItem } from "vscode";


const fs = workspace.fs,
      settings = workspace.getConfiguration,
      colors = {
        workbench: 'workbench.colorCustomizations',
        editor: {
            tokens: 'editor.tokenColorCustomizations',
            semantics: 'editor.semanticTokenColorCustomizations'
        }
      };


export interface ColorTheme extends QuickPickItem {
    key: string;
};


export const themes = () : Array<ColorTheme> => {
    return extensions.all
        .filter(ext => ext.packageJSON.contributes?.themes)
        .map(ext => {
            return ext.packageJSON.contributes.themes
                .map((theme: { id: string, label: string, uiTheme: string, path: string }) => {
                    return {
                        id: theme.id,
                        label: theme.label,
                        key: ext.packageJSON.isBuiltin ? theme.id : theme.label
                    };
                });
        })
        .reduce((previous, current) => previous.concat(current));
};


export const populate = async (file: Uri, theme: ColorTheme): Promise<Uint8Array> => {
    const key = "[" + theme.key + "]";
    const placeholder = {
        "workbench.colorCustomizations": {
            [key]: settings(colors.workbench).get(key) ||
            {

            }
        },
        "editor.semanticTokenColorCustomizations": {
            [key]: settings(colors.editor.semantics).get(key) ||
            {
                "rules": {

                }
            }
        },
        "editor.tokenColorCustomizations": {
            [key]: settings(colors.editor.tokens).get(key) ||
            {
                "textMateRules": [

                ]
            }
        }
    };
    fs.writeFile(file, Buffer.from(JSON.stringify(placeholder, null, 2)));
    return Buffer.from(JSON.stringify(placeholder, null, 2));
};
