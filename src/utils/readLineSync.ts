import { stdin } from "process";

export default function readLineSync(): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    stdin.resume()
    stdin.setEncoding("utf8");
    
    stdin.on("data", function (chunk) {
      stdin.pause();
      resolve(chunk.toString().trim());// 把回车去掉
    });
  });
}
