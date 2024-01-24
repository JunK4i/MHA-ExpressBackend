import fs from "fs";
import path from "path";
import { stringify } from "csv-stringify/sync";
import { parse } from "csv-parse/sync";
import StorageService from "./storageService.js";

class CSVStorageService extends StorageService {
  constructor(filePath) {
    super();
    this.filePath = path.resolve(filePath);
  }

  read() {
    try {
      const fileContent = fs.readFileSync(this.filePath);
      const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
      });
      records.map((record) => {
        record.price = Number(record.price);
        record.quantity = Number(record.quantity);
        return record;
      });
      return records;
    } catch (err) {
      console.error(err.message);
      return []; // or handle the error as appropriate
    }
  }

  write(data) {
    const csvString = stringify(data, { header: true });
    fs.writeFileSync(this.filePath, csvString);
  }
}

export default CSVStorageService;
