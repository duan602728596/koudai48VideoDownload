Promise.all([
    System.import('../script/index.js'),
    System.import('../script/video.js'),
    System.import('../script/download.js'),
    System.import('../script/chromeDownloadInit.js')
]).then(function(modules){
    const React = node_require('react');
    const ReactDOM = node_require('react-dom');
    const ReactRouterDom = node_require('react-router-dom');
    const { Component } = React;
    const { HashRouter, Route } = ReactRouterDom;

    const [Index, Video, Download, chromeDownloadInit] = modules;
    chromeDownloadInit(window._shareData);

    ReactDOM.render(

        <HashRouter>
            <div className="index-app">
                <Route exact path="/" component={ Index } />
                <Route exact path="/video" component={ Video } />
                <Route exact path="/download" component={ Download } />
            </div>
        </HashRouter>

        , document.getElementById('ReactBody')
    );
});
