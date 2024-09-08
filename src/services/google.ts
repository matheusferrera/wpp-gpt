const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

const keyFile = path.join(__dirname, "../credential_conta_servico.json");
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

console.log("Sheets -> ", sheets);

// Exemplo de chamada à API do Google Sheets
async function accessSheet() {
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: "1fVC7XZpiWjn6bjZaURqPwA5H8SA2fA9ylpgqyGi11ZA",
    range: "mensagens!A1:D5",
  });
  console.log(response.data);
}
async function addRow() {
  try {
    const spreadsheetId = "1fVC7XZpiWjn6bjZaURqPwA5H8SA2fA9ylpgqyGi11ZA";
    const range = "mensagens!A1:D1"; // Altere conforme necessário
    const values = [
      ["Valor 1", "Valor 2", "Valor 3", "Valor 4"], // Valores da nova linha
    ];

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      resource: {
        values,
      },
    });

    console.log("Linha adicionada com sucesso:", response.data);
  } catch (error) {
    console.error("Erro ao adicionar linha:", error);
  }
}

accessSheet();
addRow();
