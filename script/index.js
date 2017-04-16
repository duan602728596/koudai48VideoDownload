Promise.all([
    System.import('https://cdn.bootcss.com/vue/2.2.6/vue.min.js'),
    System.import('../script/modules/date.js'),
    System.import('../script/modules/post.js')
]).then(function (modules){
    const [Vue, date, post] = modules;

    const App = new Vue({
        el: '#app',
        data: {
            /* 数据查询相关 */
            startTime: 0,          // 时间
            reviewList: [],        // 数据
            loading: false,       // 加载动画
            /* 视频相关 */
            videoData: null,
            /* 表单查询功能 */
            inputText: '',        // 表单输入的文字
            keywords: [],          // 关键字
            /* 下载列表显示隐藏 */
            downloadDisplay: false,
            downloadList: window._shareData.downloadList
        },
        methods: {
            /* 数据加载 */
            // date
            date: date,
            /* 列表 */
            // 加载列表
            loadingReviewList(event){
                const _this = this;
                this.loading = true;
                post(this.startTime, function(data, status, headers){
                    const jsonData = JSON.parse(data, null, 4);
                    const newList = _this.reviewList.concat(jsonData.content.reviewList);
                    _this.reviewList = newList;
                    _this.startTime = newList[newList.length - 1].startTime;
                    _this.loading = false;
                });
            },
            // 刷新列表
            reloadReviewList(event){
                const _this = this;
                this.loading = true;
                this.reviewList = [];
                post(0, function(data, status, headers){
                    const jsonData = JSON.parse(data, null, 4);
                    const newList = _this.reviewList.concat(jsonData.content.reviewList);
                    _this.reviewList = newList;
                    _this.startTime = newList[newList.length - 1].startTime;
                    _this.loading = false;
                });
            },
            /* 视频播放 */
            // 打开播放页面
            goToPlay(event, item){
                this.videoData = item;
            },
            // 关闭播放
            videoClose(event){
                this.videoData = null;
            },
            /* 搜索 */
            // 搜索框文本改变
            keywordsChange(event){
                this.inputText = event.target.value;
            },
            // 搜索
            search(event){
                let kg;
                if(/^\s*$/.test(this.inputText)){
                    kg = [];
                }else{
                    kg = this.inputText.split(/\s+/);
                }

                this.keywords = [];
                for(let i = 0, j = kg.length; i < j; i++){
                    this.keywords.push(new RegExp(`.*${ kg[i] }.*`));
                }
            },
            // 回车
            searchEnter(event){
                if(event.keyCode === 13){
                    this.search.call(this, event);
                }
            },
            // 重置
            reset(event){
                this.inputText = '';
                this.keywords = [];
            },
            // 过滤
            guoLv(text){
                let r = false;
                const length = this.keywords.length;

                if(length === 0){
                    r = true;
                }else{
                    for(let i = 0, j = length; i < j; i++){
                        if(this.keywords[i].test(text)){
                            r = true;
                            break;
                        }
                    }
                }

                return r;
            },
            /* 下载 */
            downloadOpen(event){
                this.downloadDisplay = true;
            },
            downloadClose(event){
                this.downloadDisplay = false;
            },
            download(item){
                const f = item.title + ' ' + date(item.startTime).replace(/\:/g, '-') + '.mp4';
                const options = {
                    url: item.streamPath,
                    filename: f,
                    conflictAction: 'prompt',
                    saveAs: true,
                    method: 'GET'
                };

                chrome.downloads.download(options, (dlId)=>{
                    this.downloadList.push({
                        id: dlId,
                        infor: item,
                        filename: f,
                        fileSize: 1,
                        nowSize: 0,
                        timer: null,
                        current: null,
                        state: 0,
                        create: true
                    });
                });
            },
            cancel(index, item){
                item.state = 3;
                chrome.downloads.cancel(item.id);
            },
            progress(item){
                return (item.nowSize / item.fileSize).toFixed(2);
            },
            style(item){
                const s = this.progress(item);
                return `width: ${ s * 100 }%;`;
            },
            progressText(item){
                const s = this.progress(item);
                return `${ s * 100 }`.split('.')[0];
            }
        }
    });
});
