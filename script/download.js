/**
 * 状态码
 * 未下载：0
 * 下载中：1
 * 已完成：2
 * 已取消：3
 */
((_window)=>{
    const fs = node_require('fs');
    const downloadList = window._shareData.downloadList;
    const T = 1000;
    const map = new Map();

    /* 进度条 */
    function search(item){
        fs.stat(item.current + '.crdownload', function(err, state){
            if(!err && state){
                item.nowSize = state.size;
                item.timer = setTimeout(search, T, item);
            }
        });
    }

    /* 下载和取消 */
    chrome.downloads.onChanged.addListener((infor)=>{

        let index;
        for(let i = 0, j = downloadList.length; i < j; i++){
            if(infor.id === downloadList[i].id){
                index = i;
                break;
            }
        }

        // 开始下载
        if(infor.filename){
            downloadList[index].current = infor.filename.current;
            downloadList[index].fileSize = map.get(infor.id);
            downloadList[index].state = 1;
            downloadList[index].timer = setTimeout(search, T, downloadList[index]);
            map.delete(infor.id);
        }

        // 点击取消时
        if(infor.error && infor.error.current === 'USER_CANCELED'){
            downloadList[index].state = 3;
            map.delete(infor.id);
        }

        // 结束时
        if(infor.endTime){
            downloadList[index].nowSize = downloadList[index].fileSize;
            downloadList[index].state = 2;
            clearTimeout(downloadList[index].timer);
        }

    });

    // 文件创建时
    chrome.downloads.onCreated.addListener((infor)=>{
        map.set(infor.id, infor.fileSize);
    });

    chrome.downloads.onErased.addListener((infor)=>{
        console.log(infor);
    });


})(window);