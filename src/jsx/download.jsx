const fs = node_require('fs');
const React = node_require('react');
const ReactRouterDom = node_require('react-router-dom');
const { Component } = React;
const { Link } = ReactRouterDom;
const store = require('./store.js');

const T = 500;


/* 进度条渲染相关 */
function progress(item){
    return (item.nowSize / item.fileSize).toFixed(2);
}
function style(item){
    const s = progress(item);
    return `${ s * 100 }%`;
}
function progressText(item){
    const s = progress(item);
    return `${ s * 100 }`.split('.')[0];
}

/* 进度条 */
class Progress extends Component{
    constructor(props){
        super(props);

        this.state = {
            w: style(this.props.item),
            t: progressText(this.props.item)
        };

        // 初始化进度条
        store.dispatch({
            type: 'UP_PROGRESS',
            nowSize: 0,
            search: this.search,
            _this: this,
            index: this.props.index,
            T: T,
            callback: (x)=>{
                this.setState({
                    w: style(x),
                    t: progressText(x)
                });
            }
        });

        // 谷歌回调函数
        window._shareData.chromeCallback = (x)=>{
            this.setState({
                w: style(x),
                t: progressText(x),
            });
            this.props.chromeCallback();
        };
    }
    // 进度条计算
    search(_this, item, index, T){
        fs.stat(item.current + '.crdownload', (err, state)=>{
            if(!err && state){
                store.dispatch({
                    type: 'UP_PROGRESS',
                    nowSize: state.size,
                    search: _this.search,
                    _this: _this,
                    index: index,
                    T: T,
                    callback: (x)=>{
                        _this.setState({
                            w: style(x),
                            t: progressText(x)
                        });
                    }
                });
            }
        });
    }
    render(){
        return (
            <div className="download-progressBox clearfix">
                <div className="pull-left progress download-progress">
                    <div className="progress-bar progress-bar-success"
                         style={{ width: this.state.w }}
                         role="progressbar"
                         aria-valuenow={ this.state.t }
                         aria-valuemin="0"
                         aria-valuemax="100" />
                </div>
                <b className="pull-right download-progressNumber">{ this.state.t }%</b>
            </div>
        );
    }
}

class Download extends Component{
    constructor(props){
        super(props);

        this.state = {
            downloadList: store.getState().downloadList // 下载列表
        };

        this.chromeCallback = function(){
            this.setState({
                downloadList: store.getState().downloadList
            });
        };
    }
    // 取消下载
    onCancel(item, event){
        chrome.downloads.cancel(item.id);
    }
    vState(item){
       /** 状态码
        * 未下载：0
        * 下载中：1
        * 已完成：2
        * 已取消：3
        */
       switch(item.state){
           case 1:
               return (
                   <button className="btn btn-danger btn-sm" onClick={ this.onCancel.bind(this, item) }>
                       <span className="glyphicon glyphicon-remove-circle index-icon" />
                       <span>取消下载</span>
                   </button>
               );
           case 2:
               return (
                   <b>下载完成</b>
               );
           case 3:
               return (
                   <b>取消下载</b>
               );
       }
    }
    vProgress(item, index, chromeCallback){
        switch(item.state){
            case 1:
                return (
                    <tr className="active">
                        <td colSpan="4">
                            <Progress item={ item }
                                      index={ index }
                                      chromeCallback={ chromeCallback }/>
                        </td>
                    </tr>
                );
        }
    }
    // 渲染列表
    downloadListView(){
        const _this = this;
        return this.state.downloadList.map(function(item, index){
            return (
                <tbody key={ index }>
                    <tr>
                        <td>{ item.infor.subTitle }</td>
                        <td>{ item.filename }</td>
                        <td>{ item.infor.streamPath }</td>
                        <td>{ _this.vState.call(_this, item) }</td>
                    </tr>
                    { _this.vProgress(item, index, _this.chromeCallback.bind(_this)) }
                </tbody>
            );
        });
    }
    render(){
        return (
            <div className="download">
                <header className="bg-warning download-header clearfix">
                    <h4 className="pull-left">下载列表：</h4>
                    <Link className="pull-right btn btn-danger" to="/">
                        <span className="glyphicon glyphicon-off index-icon">{}</span>
                        <span>关闭</span>
                    </Link>
                </header>
                <div className="download-body">
                    <table className="table">
                        <thead>
                            <tr className="info">
                                <th className="download-table-td0">直播标题</th>
                                <th className="download-table-td1">文件名</th>
                                <th className="download-table-td2">视频地址</th>
                                <th className="download-table-td3">操作</th>
                            </tr>
                        </thead>
                        { this.downloadListView() }
                    </table>
                </div>
            </div>
        );
    }
}

module.exports = Download;