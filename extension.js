// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "addruby" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('addruby.narou', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		// vscode.window.showInformationMessage('Hello World from addRuby!');

		let editor = vscode.window.activeTextEditor;	// エディタ情報の取得
		let selection = editor.selection	// 選択範囲の情報を取得
		let text = editor.document.getText(selection)	// 選択範囲の情報をテキストに（選択範囲の文字列を取得）
		let url = new RegExp('https.*')
		let ruby = new RegExp('\\x7c')

		// console.log(text.length)

		if(url.test(text)==true){	// URLの場合、専用形式に置き換える
			let re_id = new RegExp('(?<=https://)[0-9]*')
			let re_icode = new RegExp('(?<=https://.*.mitemin.net/)[i0-9]*')
			let id=text.match(re_id)[0]	
			let icode=text.match(re_icode)[0]	
			let img=("<"+icode+"|"+id+">")
			editor.edit(builder => builder.replace(selection, img)) // 選択してた文字列を、newTextに置き換え（カッコを追加）	
	
		}else{
			if(ruby.test(text)==true){	// ルビ振り済み（読みなし）の場合（選択文字列が記号|から始まる場合）
				// 読み仮名のカッコ内が空白の場合
				let re_rubied = new RegExp('(?<=\\x7c).*(?=《》)')	// 識別用の正規表現
				let rubied = text.match(re_rubied)[0]	// re_rubiedにマッチした文字列を取得
				let emphasis_Text=""
				for(let i=0; i<rubied.length; i++){	// 1文字ずつ処理
					// console.log(rubied[i]);
					let emphasis = ("|"+rubied[i]+"《・》");	// i文字目の1文字に対し、ルビ記号（読み指定に傍点）を付与
					emphasis_Text+=emphasis	// emphasis_Text に結合（ループで繰り返されることで、文字列の1文字1文字にルビ記号と傍点が付与されるように）
				}
				console.log(emphasis_Text)
				editor.edit(builder => builder.replace(selection, emphasis_Text)) // 選択してた文字列を、newTextに置き換え（カッコを追加）
				let position = editor.selection.active // カーソル位置の取得
				let newPosition = position.with(position.line, (editor.selection.start.character+emphasis_Text.length)); // 新しいカーソル位置の定義（文字列の選択開始位置までの文字数 + 選択範囲に記号を付与した文字数-shift）
				let newSelection = new vscode.Selection(newPosition, newPosition); // 新たな選択位置の定義（範囲が同じ位置,同じ位置 ＝カーソルが動くだけ）
				editor.selection = newSelection;	// 定義した選択位置を適用

			}else{
				let newText = ("|"+text+"《》")	// newTextの定義（元文字列にカッコを付与したもの）
				editor.edit(builder => builder.replace(selection, newText)) // 選択してた文字列を、newTextに置き換え（カッコを追加）
				let position = editor.selection.active // カーソル位置の取得
				var shift=1	//カーソル位置をずらす用の変数（通常1、後述で2に変化させる）
				if(text.length==0){	//文字列が選択されていない（選択文字列textの長さ==0の）場合
					var shift=2
				}
				let newPosition = position.with(position.line, (editor.selection.start.character+newText.length-shift)); // 新しいカーソル位置の定義（文字列の選択開始位置までの文字数 + 選択範囲に記号を付与した文字数-shift）
				let newSelection = new vscode.Selection(newPosition, newPosition); // 新たな選択位置の定義（範囲が同じ位置,同じ位置 ＝カーソルが動くだけ）
				editor.selection = newSelection;	// 定義した選択位置を適用
			}
		}
	});

	context.subscriptions.push(disposable);



}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
