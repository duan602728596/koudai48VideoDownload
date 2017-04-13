const nodegrass = node_require('nodegrass');

/* post数据 */
function postData(number = 0){
    return `{"lastTime":${ number },"limit":20,"groupId":0,"memberId":0,"type":0,"giftUpdTime":1490857731000}`;
}

/* post请求 */
function post(number, callback){
    const sharedData = window._sharedData;

    nodegrass.post(sharedData.url, (data, status, headers)=>{
        const jsonData = JSON.parse(data, null, 4);
        callback(jsonData);

    }, sharedData.headers, postData(number));
}

module.exports = post;