const vscode = require("vscode");
const path = require("path");
const { exec } = require("child_process");

function playAudio(filePath) {
    const platform = process.platform;
    const safePath = path.normalize(filePath);

    let command = "";

    if (platform === "win32") {
        command = `powershell -c "(New-Object System.Media.SoundPlayer '${safePath}').PlaySync()"`;
    } else if (platform === "darwin") {
        command = `afplay "${safePath}"`;
    } else {
        command = `aplay "${safePath}" || paplay "${safePath}" || mpg123 "${safePath}"`;
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("Erro no áudio:", stderr || error.message);
            vscode.window.showErrorMessage(`Erro ao tocar som: ${stderr || error.message}`);
        }
    });
}

function activate(context) {
    let disposableCommand = vscode.commands.registerCommand("faahh-arrow.playSound", () => {
        const audioPath = path.join(context.extensionPath, "src", "sounds", "fah.wav");

        try {
            playAudio(audioPath);
        } catch (error) {
            vscode.window.showErrorMessage(`Erro ao executar som: ${error.message}`);
        }
    });

    let provider = vscode.languages.registerCompletionItemProvider(
        ["javascript", "typescript", "javascriptreact", "typescriptreact"],
        {
            provideCompletionItems(document, position) {
                const completionItem = new vscode.CompletionItem("fa", vscode.CompletionItemKind.Snippet);

                completionItem.detail = "⚡ () => {})";
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
