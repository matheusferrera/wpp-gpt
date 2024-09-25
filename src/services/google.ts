import { google } from "googleapis";
import fs from "fs";
import path from "path";

const keyFile = path.join(__dirname, "../credential_conta_servico.json");
const auth = new google.auth.GoogleAuth({
  keyFile,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets: any = google.sheets({ version: "v4", auth });

async function addRow(values: any) {
  try {
    const spreadsheetId = "1fVC7XZpiWjn6bjZaURqPwA5H8SA2fA9ylpgqyGi11ZA";
    const range = "mensagens!A1:D1"; // Altere conforme necessário

    const response: any = await sheets.spreadsheets.values.append({
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

const GoogleService = {
  addRow,
};

export default GoogleService;
