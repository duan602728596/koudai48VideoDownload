const store = require('./store');

/* 谷歌事件初始化 */
function chromeDownloadInit(shareData){
  chrome.downloads.onChanged.addListener((infor)=>{
    const downloadList = shareData.downloadList;

    let index;
    for(let i = 0, j = downloadList.length; i < j; i++){
      if (infor.id === downloadList[i].id) {
        index = i;
        break;
      }
    }

    // 开始下载
    if(infor.filename){
      store.dispatch({
        type: 'DOWNLOAD_START',
        current: infor.filename.current,
        fileSize: shareData.fileSizeMap.get(infor.id),
        state: 1,
        index: index
      });
      shareData.fileSizeMap.delete(infor.id);
    }

    // 点击取消时
    if(infor.error && infor.error.current === 'USER_CANCELED'){
      store.dispatch({
        type: 'DOWNLOAD_CANCEL',
        state: 3,
        index: index,
        callback: shareData.chromeCallback
      });
      shareData.fileSizeMap.delete(infor.id);
    }

    // 结束时
    if(infor.endTime){
      store.dispatch({
        type: 'DOWNLOAD_END',
        state: 2,
        index: index,
        callback: shareData.chromeCallback
      });
    }

  });

  // 文件创建时
  chrome.downloads.onCreated.addListener((infor)=>{
    shareData.fileSizeMap.set(infor.id, infor.fileSize);
  });
}

module.exports = chromeDownloadInit;
