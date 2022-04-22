const express = require("express");
const { google } = require("googleapis");

const app = express();
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
const spreadsheetId = "1L8ALAmG11nCy5pHUcu05NkM_eLSvWCLpjV_vSp7dg1o";


app.post("/", async (req, res) => {
  const { request, name } = req.body;

  const auth = new google.auth.GoogleAuth({
    keyFile: "Keys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });

  // Create client instance for auth
  const client = await auth.getClient();

  // Instance of Google Sheets API
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const spreadsheetId = "1L8ALAmG11nCy5pHUcu05NkM_eLSvWCLpjV_vSp7dg1o";

  // Get metadata about spreadsheet
  const metaData = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,
  });

  // Read rows from spreadsheet
  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "Sheet1",
  });

  // inserting values
  await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Sheet1!A:B",
    valueInputOption: "RAW",
    resource: {
      values: [[request,name]],
    },
  });

  res.send("Successfully submitted! Thank you!");
});



app.listen(8050, (req, res) => console.log("running on 8050"));
