// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "python-autotag-versioning" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('python-autotag-versioning.helloWorld', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Python-AutoTag-Versioning!');
	});

	context.subscriptions.push(disposable);
	// Python-AutoTag-Versioning, is a tool to automatically update the __version__ variable with an automatic increment, following the Breaking.Feature.Fix.Update method (1.3.2.120).

	// create a function to increment the version of the file for Breaking and Update^^
	context.subscriptions.push(vscode.commands.registerCommand('python-autotag-versioning.incrementBreakingVersion', function () {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let text = document.getText();
		let version = text.match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1];
		let range = document.getWordRangeAtPosition(editor.selection.active, /__version__\s*=\s*['"]([^'"]*)['"]/);
		let versionArray = version.split('.');
		let breaking = parseInt(versionArray[0]);
		let feature = parseInt(versionArray[1]);
		let fix = parseInt(versionArray[2]);
		let update = parseInt(versionArray[3]);
		breaking++;
		feature = 0;
		fix = 0;
		update = 0;
		let newVersion = breaking + '.' + feature + '.' + fix + '.' + update;
		editor.edit(editBuilder => {
			editBuilder.replace(range, "__version__ = \'" + newVersion + "\'")
		});
	}));

	// create a function to increment the version of the file for Feature and Update^
	context.subscriptions.push(vscode.commands.registerCommand('python-autotag-versioning.incrementFeatureVersion', function () {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let text = document.getText();
		let version = text.match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1];
		let range = document.getWordRangeAtPosition(editor.selection.active, /__version__\s*=\s*['"]([^'"]*)['"]/);
		let versionArray = version.split('.');
		let breaking = parseInt(versionArray[0]);
		let feature = parseInt(versionArray[1]);
		let fix = parseInt(versionArray[2]);
		let update = parseInt(versionArray[3]);
		feature++;
		fix = 0;
		update = 0;
		let newVersion = breaking + '.' + feature + '.' + fix + '.' + update;
		editor.edit(editBuilder => {
			editBuilder.replace(range, "__version__ = \'" + newVersion + "\'")
		});
	}));

	// create a function to increment the version of the file for Fix and Update^
	context.subscriptions.push(vscode.commands.registerCommand('python-autotag-versioning.incrementFixVersion', function () {
		let editor = vscode.window.activeTextEditor;
		let document = editor.document;
		let text = document.getText();
		let version = text.match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1];
		let range = document.getWordRangeAtPosition(editor.selection.active, /__version__\s*=\s*['"]([^'"]*)['"]/);
		let versionArray = version.split('.');
		let versionFix = parseInt(versionArray[2]);
		let versionUpdate = parseInt(versionArray[3]);
		versionFix++;
		versionUpdate++;
		let newVersion = versionArray[0] + '.' + versionArray[1] + '.' + versionFix + '.' + versionUpdate;
		editor.edit(editBuilder => {
			editBuilder.replace(range, "__version__ = \'" + newVersion + "\'")
		});
	}));

	context.subscriptions.push(vscode.commands.registerCommand('python-autotag-versioning.incrementUpdateVersion', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		try {
			let editor = vscode.window.activeTextEditor;
			let document = editor.document;
			if (isPythonFile(document)) {
				vscode.window.showInformationMessage('Python file detected');
				// if __version__ is empty, set the only the content of this variable to 0.0.0.0 else get the version and add 1 to the last number^
				if (hasVersionString(document)) {
					vscode.window.showInformationMessage('Variable __version__ detected');
					setVersionToZero(document);
					let version = getVersion(document);
					let versionList = getVersionList(version);
					vscode.window.showInformationMessage('Current version: ' + version);

					versionList[3] = parseInt(versionList[3]) + 1;
					let newVersion = versionList.join('.');
					let text = document.getText();
					let range = document.getWordRangeAtPosition(editor.selection.active, /__version__\s*=\s*['"]([^'"]*)['"]/);
					editor.edit(editBuilder => {
						editBuilder.replace(range, "__version__ = \'" + newVersion + "\'")
					});
					console.log('Current version: ' + version);
					console.log('Version updated to ' + newVersion);
					vscode.window.showInformationMessage('Version updated to ' + newVersion);
				}
			}
			vscode.window.showInformationMessage('Incrementing Version!');
		}
		catch (error) {
			console.log(error);
			vscode.window.showErrorMessage('Error: ' + error);
		}
	}));



}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate,
	isPythonFile, hasVersionString, getVersion, getVersionList, setVersionToZero

}


// create a function to check if the file is a python file and write in console ^
function isPythonFile(document) {
	if (document.languageId === 'python') {
		console.log('Python file detected');
		return true;
	} else {
		console.log('Not a Python file');
		vscode.window.showErrorMessage('Not a Python file');
		return false;
	}
}


// create a function to check if the variable __version__ is in the file and is a string with a value^
function hasVersionString(document) {
	try {
		console.log("Variable version: " + document.getText().includes('__version__'));
		vscode.window.showInformationMessage("is variable version a string ? " + document.getText().match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1]);
		return document.getText().includes('__version__') && document.getText().match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1];
	} catch (error) {
		console.log(error);
		vscode.window.showErrorMessage('Error: ' + error);
		return false;
	}

}

// save the current version of the file in a variable
function getVersion(document) {
	let version = document.getText().match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1];
	return version;
}

// get the content of the variable __version__ which is a string and split it in a list of numbers^
function getVersionList(version) {
	let versionList = version.split('.');
	// force to be a list of 4 numbers^
	while (versionList.length < 4) {
		versionList.push(0);
	}
	return versionList;
}

// if the variable __version__ is empty, set the only the content of this variable to 0.0.0.0^
function setVersionToZero(document) {
	let editor = vscode.window.activeTextEditor;
	let text = document.getText();
	let version = text.match(/__version__\s*=\s*['"]([^'"]*)['"]/)[1];
	let range = document.getWordRangeAtPosition(editor.selection.active, /__version__\s*=\s*['"]([^'"]*)['"]/);
	if (version == '') {
		editor.edit(editBuilder => {
			editBuilder.replace(range, "__version__ = \'0.0.0.0\'")
		});
	}
}
