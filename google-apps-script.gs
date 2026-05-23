const DONE_VALUE = 'Y';
const ALLOWED_SHEET_NAMES = ['수연', '민근'];

function doGet(e) {
  try {
    const sheetName = getSheetNameFromGet_(e);

    if (e && e.parameter && e.parameter.action === 'markDone') {
      const row = Number(e.parameter.rowNumber || e.parameter.row || 0);
      const memorized = String(e.parameter.memorized || DONE_VALUE).trim() || DONE_VALUE;
      const result = markDone_(sheetName, row, memorized);
      return output_(result, e);
    }

    const sheet = getSheet_(sheetName);
    const lastRow = sheet.getLastRow();

    if (lastRow < 2) {
      return output_({ success: true, sheetName, words: [] }, e);
    }

    const startRow = 2;
    const values = sheet.getRange(startRow, 1, lastRow - 1, 3).getValues();
    const words = values
      .map((row, index) => ({
        row: startRow + index,
        rowNumber: startRow + index,
        word: String(row[0] || '').trim(),
        meaning: String(row[1] || '').trim(),
        memorized: String(row[2] || '').trim()
      }))
      .filter(item => item.word);

    return output_({ success: true, sheetName, words }, e);
  } catch (error) {
    return output_({ success: false, error: error.message }, e);
  }
}

function doPost(e) {
  try {
    const payload = parsePayload_(e);
    const sheetName = validateSheetName_(payload.sheetName);
    const memorized = String(payload.memorized || DONE_VALUE).trim() || DONE_VALUE;
    const row = Number(payload.rowNumber || payload.row || 0);

    if (row > 0) {
      return json_(markDone_(sheetName, row, memorized));
    }

    const sheet = getSheet_(sheetName);
    const word = String(payload.word || '').trim();
    if (!word) {
      throw new Error('row 또는 word 값이 필요합니다.');
    }

    const lastRow = sheet.getLastRow();
    if (lastRow < 1) {
      throw new Error('시트에 데이터가 없습니다.');
    }

    const words = sheet.getRange(1, 1, lastRow, 1).getValues();
    const foundIndex = words.findIndex(rowValue => String(rowValue[0] || '').trim() === word);

    if (foundIndex === -1) {
      throw new Error('단어를 찾을 수 없습니다: ' + word);
    }

    const foundRow = foundIndex + 1;
    sheet.getRange(foundRow, 3).setValue(memorized);
    return json_({ success: true, sheetName, row: foundRow, rowNumber: foundRow, memorized });
  } catch (error) {
    return json_({ success: false, error: error.message });
  }
}

function markDone_(sheetName, row, memorized) {
  if (!row || row < 1) {
    throw new Error('유효한 rowNumber 값이 필요합니다.');
  }

  const sheet = getSheet_(sheetName);
  sheet.getRange(row, 3).setValue(memorized);
  return { success: true, sheetName, row, rowNumber: row, memorized };
}

function getSheetNameFromGet_(e) {
  const sheetName = e && e.parameter ? e.parameter.sheetName : '';
  return validateSheetName_(sheetName);
}

function validateSheetName_(sheetName) {
  const normalized = String(sheetName || '').trim();

  if (!ALLOWED_SHEET_NAMES.includes(normalized)) {
    throw new Error('허용되지 않은 시트 이름입니다: ' + normalized);
  }

  return normalized;
}

function getSheet_(sheetName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = spreadsheet.getSheetByName(sheetName);

  if (!sheet) {
    throw new Error('시트를 찾을 수 없습니다: ' + sheetName);
  }

  return sheet;
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    return {};
  }

  return JSON.parse(e.postData.contents);
}

function json_(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function output_(data, e) {
  const callback = e && e.parameter ? String(e.parameter.callback || '').trim() : '';

  if (callback) {
    return ContentService
      .createTextOutput(callback + '(' + JSON.stringify(data) + ');')
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }

  return json_(data);
}
