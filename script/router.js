const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouterDom = require('react-router-dom');
const { Component } = React;
const { HashRouter, Route } = ReactRouterDom;
require('../style/index.sass');
require('../style/download.sass');
const Index = require('./Index');
const Video = require('./Video');
const Download = require('./Download');
const chromeDownloadInit = require('./chromeDownloadInit');

chromeDownloadInit(window._shareData);

ReactDOM.render(

  <HashRouter>
    <div className="index-app">
      <Route exact path="/" component={ Index }/>
      <Route exact path="/video" component={ Video }/>
      <Route exact path="/download" component={ Download }/>
    </div>
  </HashRouter>

  , document.getElementById('ReactBody')
);