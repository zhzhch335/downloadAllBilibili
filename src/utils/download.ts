import axios from 'axios';
import { isBv } from './justifyBv.js';
import { urlKey } from './urlKey.js';
import { logError } from './log.js';
import readLineSync from './readLineSync.js';

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const downloadPath = path.join(__dirname, '../../download/');

// if skip exist file
let alwaySkipExists = false;
let alwayCoverExists = false;
// if download lower quality video
// let downloadLowerQuality = false;
// main entry
export default function download(vid: string, cookie?: string): Promise<any | null> {
  return new Promise(async (resolve, reject) => {
    try {
      let cid: Array<VideoInfo> = await getCid(vid);
      if (cid.length === 1) {
        const url = await getVideoLink(vid, cid[0].cid, cookie);
        try {
          await downloadVideo(url, vid, cid[0].name);
          resolve(null);
        }
        catch (e) {
          logError(e)
          reject(e);
        }
      }
      else {
        console.log(`mutiple videos, there are ${cid.length} videos`)
        const errorList: Array<Error> = []
        for (let i = 0; i < cid.length; i++) {
          const url: string = await getVideoLink(vid, cid[i].cid, cookie);
          try {
            await downloadVideo(url, vid, cid[i].name, i + 1);
          }
          catch (e) {
            errorList.push(e);
          }
        }
        if (errorList.length) {
          logError(errorList)
          reject(errorList)
        }
        else {
          resolve(null);
        }
      }
    }
    catch (e) {
      reject(e);
    }
  })
}

// get cid
function getCid(vid: string): Promise<Array<VideoInfo>> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${urlKey.getCid}?` + (isBv(vid) ? `bvid=${vid}` : `aid=${vid}`))
      .then(res => {
        if (!res.data.code) {
          resolve(res.data.data.pages.map((p, index) => new VideoInfo(p.cid, res.data.data.title + (index ? `-p${index}` : ''))));
        }
        else {
          reject(`get cid error, please check the validation of bvid or aid \noriginal error message: ${res.data.message}`);
        }
      })
  })
}

// get videoLink
function getVideoLink(vid: string, cid: string, cookie?: string): Promise<string> {
  return new Promise((resolve, reject) => {
    axios
      .get(`${urlKey.getVideoLink}?` + (isBv(vid) ? `bvid=${vid}` : `aid=${vid}`) + `&cid=${cid}`, cookie ? {
        headers: {
          Cookie: cookie
        }
      } : {})
      .then(res => {
        if (!res.data.code) {
          resolve(res.data.data.durl[0].url);
        }
        else {
          logError(res.data.message);
          reject(res.data.message);
        }
      })
  })
}

/**
 * download video from real url
 * @param url real url of the video
 * @param vid to set headers
 * @param name save name of the video
 * @param index to set headers(if mutiple video)
 * @returns 
 */
async function downloadVideo(url: string, vid: string, name: string, index?: number): Promise<null> {
  return new Promise(async (resolve, reject) => {
    if (!alwayCoverExists) {
      const fileExist = fs.existsSync(`${downloadPath}${name}.mp4`)
      if (fileExist) {
        if (alwaySkipExists) {
          resolve(null);
          return;
        }
        let alreadyChoose = false;
        while (!alreadyChoose) {
          alreadyChoose = true;
          console.warn(`文件${name}.mp4已存在，是否覆盖？(N)否 (Y)是 (AN)一直否 (AY)一直是`);
          const coverable: string = await readLineSync();
          switch (coverable) {
            case 'N': case 'n':
              resolve(null);
              return;
            case 'Y': case 'y':
              break;
            case 'AN': case 'an':
              alwaySkipExists = true;
              resolve(null);
              return;
            case 'AY': case 'ay':
              alwayCoverExists = true;
              break;
            default:
              console.warn("命令无效，请重新输入")
              alreadyChoose = false;
              break;
          }
        }
      }
    }
    console.log(`downloadVideo name=${name}`)
    axios.get(url, {
      responseType: 'stream',
      headers: { 'Referer': "https://www.bilibili.com/video/" + (isBv(vid) ? `bvid=${vid}` : `aid=${vid}` + (index ? `&p=${index + 1}` : '')) }
    }).then(res => {
      let writer = fs.createWriteStream(`${downloadPath}${name.replace(/[\\\/:*?"<>|]/,"")}.mp4`);
      writer.on('finish', () => {
        console.log(`downloadVideo name=${name} finished`)
        writer.close()
        resolve(null);
      });
      res.data.pipe(writer)
    })
  })
}

class VideoInfo {
  cid: string;
  name: string;

  constructor(cid, name) {
    this.cid = cid
    this.name = name
  }
}


// (async function () {
//   try {
//     await download("BV1uP4y1U72P")
//     console.log("下载执行完毕")
//   }
//   catch {
//     console.log("下载执行完毕，存在错误请查看日志")
//   }
//   process.exit()
// })();