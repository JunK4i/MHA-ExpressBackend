import fs from "fs";
import path from "path";
import StorageService from "./storageService.js";

class JSONStorageService extends StorageService {
  constructor(filePath) {
    super();
    this.filePath = path.resolve(filePath);
  }

  read() {
    const data = fs.readFileSync(this.filePath);
    return JSON.parse(data);
  }

  write(data) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }
}

export default JSONStorageService;
