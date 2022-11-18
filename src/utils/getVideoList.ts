import axios from 'axios';
import console from 'console';
import { logError } from './log.js';
import { urlKey } from './urlKey.js';

export default function getVideoList(mid: number): Promise<Array<string>> {
  let pageNumber: number = 1;
  let videoList = [];
  return new Promise(async (resolve, reject) => {
    await getOnePage()
    resolve(videoList.map(item => item.bvid))
  });
  function getOnePage() {
    return new Promise(async (resolve, reject) => {
      axios
        .get(`${urlKey.getVideoList}?mid=${mid}&ps=30&tid=0&pn=${pageNumber}&keyword=`, {
          headers: {
            'authority': 'api.bilibili.com',
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7,zh-TW;q=0.6',
            'cache-control': 'no-cache',
            'origin': 'https://space.bilibili.com',
            'pragma': 'no-cache',
            'referer': 'https://space.bilibili.com/3328498/video',
            'sec-ch-ua': '"Google Chrome";v="107", "Chromium";v="107", "Not=A?Brand";v="24"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36'
          }
        })
        .then(async res => {
          if (!res.data.code) {
            const newList = res.data.data.list.vlist;
            if (newList.length) {
              videoList = videoList.concat(newList);
              pageNumber += 1;
              setTimeout(async () => {
                await getOnePage();
                resolve(videoList);
              }, 1000)
            }
            else {
              resolve(videoList);
            }
          }
          else {
            logError(res.data.message);
            reject(res.data.message)
          }
          // resolve(res.data);
        })
        .catch(err => {
          logError(err.data.message);
          reject(err.data.message)
        })
    });
  }
}

// (async function () {
//   let videoList = await getVideoList(3328498)
//   console.log(videoList);
// })();