import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOG_FOLDER = path.join(__dirname, "../../log/");


export function logError(err, name = "log") {
  var fileName = `${LOG_FOLDER}${name}-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.log`
  var data;
  if (typeof err == 'object' && err.constructor != Error && err.constructor != TypeError) {
    data = JSON.stringify(err)
  }
  else {
    data = err
  }
  data = "[err] " + new Date().toLocaleString() + " " + data + "\n";
  fs.writeFile(fileName, data, { flag: "a+" }, err => {
    if (err) throw err;
    // console.log(`错误已保存到文件${fileName}中`);
  })
}

export function logInfo(err, name = "log") {
  try {
    var fileName = `${LOG_FOLDER}${name}-${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}.log`
    var data;
    if (typeof err == 'object') {
      data = JSON.stringify(err)
    }
    else {
      data = err
    }
    data = "[info] " + new Date().toLocaleString() + " " + data + "\n";
    fs.writeFile(fileName, data, { flag: "a+" }, err => {
      if (err) throw err;
      // console.log(`日志已保存到文件${fileName}中`);
    })
  }
  catch { }
}