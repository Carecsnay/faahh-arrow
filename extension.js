const vscode = require("vscode");
const path = require("path");
const { exec } = require("child_process");

function activate(context) {
    let disposableCommand = vscode.commands.registerCommand("faahh-arrow.playSound", () => {
        const audioPath = path.join(context.extensionPath, "src", "sounds", "fah.mp3");

        const psScript = `
            Add-Type -AssemblyName presentationCore;
            $player = New-Object System.Windows.Media.MediaPlayer;
            $player.Open([Uri]'${audioPath}');
            $player.Play();
            Start-Sleep -s 2;
        `.replace(/\n/g, " ");

        const command = `powershell -c "${psScript}"`;

        exec(command, (error) => {
            if (error) {
                vscode.window.showErrorMessage(`Erro ao tocar som: ${error.message}`);
            }
        });
    });

    let provider = vscode.languages.registerCompletionItemProvider(
        ["javascript", "typescript", "javascriptreact", "typescriptreact"],
        {
            provideCompletionItems(document, position) {
                const completionItem = new vscode.CompletionItem("fa", vscode.CompletionItemKind.Snippet);

                completionItem.detail = "FAAHH Arrow Function";
                completionItem.insertText = new vscode.SnippetString("($1) => {\n\t$0\n}");

                completionItem.command = {
                    command: "faahh-arrow.playSound",
                    title: "Play FAAHH Sound",
                };

                return [completionItem];
            },
        },
    );

    context.subscriptions.push(disposableCommand, provider);
}

function deactivate() {}

module.exports = {
    activate,
    deactivate,
};
