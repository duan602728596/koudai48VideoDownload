const React = require('react');
const ReactRouterDom = require('react-router-dom');
const { Component } = React;
const { Link } = ReactRouterDom;


class Video extends Component {
  render() {
    const item = this.props.location.query ? this.props.location.query.item : {};
    return (
        <div>
          { /* 视频展示 */}
          <div className="index-videoBox">
            <video height="100%" controls>
              <source src={ item.streamPath } type="video/mp4" />
              <source src={ item.streamPath } type="video/ogg" />
              <source src={ item.streamPath } type="video/webm" />
            </video>
          </div>
          <div className="index-videoClose">
            <div className="clearfix">
              <Link className="pull-right btn btn-danger" to="/">
                <span className="glyphicon glyphicon-off index-icon" />
                <span>关闭</span>
              </Link>
            </div>
            <div className="index-videoData">
              <h4>视频信息</h4>
              <p>
                <b>liveId：</b>
                <span>{ item.liveId }</span>
              </p>
              <p>
                <b>title：</b>
                <span>{ item.title }</span>
              </p>
              <p>
                <b>subTitle：</b>
                <span>{ item.subTitle }</span>
              </p>
              <p>
                <b>streamPath：</b>
                <span>{ item.streamPath }</span>
              </p>
              <p>
                <b>startTime：</b>
                <span>{ item.startTime }</span>
              </p>
            </div>
          </div>
        </div>
    );
  }
}

module.exports = Video;
