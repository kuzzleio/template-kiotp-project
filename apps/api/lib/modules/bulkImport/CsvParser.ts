import { JSONObject } from 'kuzzle';

export function parseCsv(content: string): JSONObject {
  const lineBreakerUsed = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = content.split(lineBreakerUsed).filter((line) => line.length > 0);
  const data: JSONObject[] = [];
  const headers = parseRow(lines[0]);

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const row = parseRow(line);
    if (row.length !== headers.length) {
      throw new Error('Invalid CSV file');
    }
    const object: JSONObject = {};
    for (let j = 0; j < headers.length; j++) {
      const header = headers[j];
      object[header] = row[j];
    }
    data.push(object);
  }

  return data;
}

const parseRow = (line: string): string[] => {
  const row: string[] = [];
  const characters: string[] = [];
  let insideQuote = false;
  let quoteType = '';

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"' || char === "'") {
      if (!insideQuote) {
        insideQuote = true;
        quoteType = char;
        continue;
      }
      if (insideQuote && quoteType === char) {
        insideQuote = false;
        continue;
      }
    }

    if (char === ',' && !insideQuote) {
      row.push(characters.join(''));
      characters.length = 0;
      continue;
    }

    if ((char === ' ' || char === '\t') && !insideQuote) {
      continue;
    }

    characters.push(char);
  }

  row.push(characters.join(''));
  return row;
};
