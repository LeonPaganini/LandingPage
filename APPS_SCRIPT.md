# Configuração do Apps Script

Implemente a função `doPost` no Apps Script vinculado à planilha de leads para receber os dados diretamente do frontend e gravá-los na aba "Leads".

```js
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    const nome = data.nome || "";
    const telefone = data.telefone || "";
    const sexo = data.sexo || "";
    const resultado = data.resultado || "";

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName("Leads") || ss.getSheets()[0];

    sheet.appendRow([nome, telefone, sexo, resultado]);

    return ContentService.createTextOutput(
      JSON.stringify({ ok: true })
    ).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ ok: false, error: String(err) })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}
```

Publique o Web App como "Qualquer pessoa com o link" usando o método `doPost` para permitir chamadas diretas do navegador.
