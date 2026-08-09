const vscode = require("vscode");
const path = require("path");
const sound = require("sound-play");

function activate(context) {
    let disposableCommand = vscode.commands.registerCommand("faahh-arrow.playSound", () => {
        const audioPath = path.join(context.extensionPath, "src", "sounds", "fah.mp3");

        sound.play(audioPath).catch((error) => {
            vscode.window.showErrorMessage(`Erro ao tocar som: ${error.message}`);
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
