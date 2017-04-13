Promise.all([
    System.import('../script/Common/vue.min.js'),
    System.import('../script/modules/date.js'),
    System.import('../script/modules/post.js')
]).then(function (modules){
    const [Vue, date, post] = modules;

    const App = new Vue({
        el: '#app',
        data: {
            startTime: 0,          // 时间
            reviewList: [],        // 数据
            videoSrc: null,       // 视频地址
            loading: false,       // 加载动画
            inputText: '',        // 表单输入的文字
            keywords: []          // 关键字
        },
        methods: {
            // date
            date: date,
            /* 列表 */
            // 加载列表
            loadingReviewList(){
                const _this = this;
                this.loading = true;
                post(this.startTime, function(jsonData){
                    const newList = _this.reviewList.concat(jsonData.content.reviewList);
                    _this.reviewList = newList;
                    _this.startTime = newList[newList.length - 1].startTime;
                    _this.loading = false;
                });
            },
            // 刷新列表
            reloadReviewList(){
                const _this = this;
                this.loading = true;
                this.reviewList = [];
                post(0, function(jsonData){
                    const newList = _this.reviewList.concat(jsonData.content.reviewList);
                    _this.reviewList = newList;
                    _this.startTime = newList[newList.length - 1].startTime;
                    _this.loading = false;
                });
            },
            // 打开播放页面
            goToPlay(streamPath){
                this.videoSrc = streamPath;
            },
            // 关闭播放
            videoClose(){
                this.videoSrc = null;
            },
            // 搜索框文本改变
            keywordsChange(event){
                this.inputText = event.target.value;
            },
            // 搜索
            search(){
                if(/^\s*$/.test(this.inputText)){
                    this.keywords = [];
                }else{
                    this.keywords = this.inputText.split(/\s+/);
                }
            },
            // 过滤
            guoLv(text){
                let r = false;
                const length = this.keywords.length;

                if(length === 0){
                    r = true;
                }else{
                    for(let i = 0, j = length; i < j; i++){
                        const reg = new RegExp(`.*${ this.keywords[i] }.*`);
                        if(reg.test(text)){
                            r = true;
                            break;
                        }
                    }
                }

                return r;
            }
        }
    });
});
