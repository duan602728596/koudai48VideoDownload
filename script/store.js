const Redux = require('redux');
const { createStore } = Redux;

// 加载列表
function loadingReviewList(state, action){
  const reviewList = action.list.content.reviewList;
  state.reviewList = state.reviewList.concat(reviewList);
  state.startTime = reviewList[reviewList.length - 1].startTime;
  action.callback();
}
// 重新加载列表
function reloadingReviewList(state, action){
  const reviewList = action.list.content.reviewList;
  state.reviewList = reviewList;
  state.startTime = reviewList[reviewList.length - 1].startTime;
  action.callback();
}
// 添加到下载列表
function addDownloadList(state, action) {
  state.downloadList.push(action.obj);
}
// 开始下载
function downloadStart(state, action){
  const downloadList = state.downloadList;
  const index = action.index;
  downloadList[index].current = action.current;
  downloadList[index].fileSize = action.fileSize;
  downloadList[index].state = action.state;
  if (action.callback) action.callback({
    nowSize: downloadList[index].nowSize,
    fileSize: downloadList[index].fileSize,
  });
}
// 取消下载
function downloadCancel(state, action){
  const downloadList = state.downloadList;
  const index = action.index;
  downloadList[index].state = action.state;
  clearTimeout(downloadList[index].timer);
  if (action.callback) action.callback({
    nowSize: downloadList[index].nowSize,
    fileSize: downloadList[index].fileSize,
  });
}
// 结束下载
function downloadEnd(state, action){
  const downloadList = state.downloadList;
  const index = action.index;
  downloadList[index].nowSize = downloadList[index].fileSize;
  downloadList[index].state = action.state;
  clearTimeout(downloadList[index].timer);
  if (action.callback) action.callback({
    nowSize: 1,
    fileSize: 1,
  });
}
// 更新进度条
function upProgress(state, action){
  const downloadList = state.downloadList;
  const index = action.index;
  const _this = action._this;
  downloadList[index].nowSize = action.nowSize;
  action.callback({
    nowSize: downloadList[index].nowSize,
    fileSize: downloadList[index].fileSize
  });
  downloadList[index].timer = setTimeout(_this.search, action.T, _this, _this.props.item, _this.props.index, action.T);
}

/* reducer */
function reducer(state, action){
  switch (action.type) {
    case 'LOADING_REVIEWLIST':
      loadingReviewList(state, action);
      break;
    case 'RELOADING_REVIEWLIST':
      reloadingReviewList(state, action);
      break;
    case 'ADD_DOWNLOADLIST':
      addDownloadList(state, action);
      break;
    case 'DOWNLOAD_START':
      downloadStart(state, action);
      break;
    case 'DOWNLOAD_CANCEL':
      downloadCancel(state, action);
      break;
    case 'DOWNLOAD_END':
      downloadEnd(state, action);
      break;
    case 'UP_PROGRESS':
      upProgress(state, action);
      break;
    default:
      break;
  }
  return state;
}

const store = createStore(reducer, window._shareData);

module.exports = store;