import download from "./utils/download.js";
import getVideoList from "./utils/getVideoList.js";
import readLineSync from "./utils/readLineSync.js";

(async function () {
  console.log("请输入要下载的up的mid:")
  let correctMid = false;
  let mid: string;
  while (!correctMid) {
    mid = await readLineSync()
    if (isNaN(Number(mid))) {
      console.error("mid格式不合法，请重新输入（mid为纯数字）");
    }
    else {
      correctMid = true;
    }
  }
  const videoList = await getVideoList(Number(mid))
  if (videoList.length) {
    console.log(`找到${videoList.length}条视频`)
    console.warn("输入cookie可以缓存1080P视频（输入空则缓存1080P下最高画质）：")
    const cookie:string = await readLineSync();
    for (let i = 0; i < videoList.length; i++) {
      await download(videoList[i], cookie)
    }
    process.exit();
  }
  else {
    console.log(`未找到该账号下任何视频`)
    process.exit()
  }
})();