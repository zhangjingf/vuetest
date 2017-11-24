import axios from 'axios'
import query from 'lib/json/query';

let instance = axios.create({
    timeout: 20000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded'
    }
});

// code状态码200判断
instance.interceptors.response.use((res) => {
    if (res.status === 654) { // 百度云请求超时检测
        console.log('请求超时！');
        return Promise.reject({ type: -1, msg: "请求超时！", res: res });
    }
    if (res.data.code !== 0) {
        console.log('暂无数据！');
        return Promise.reject({ type: 0, msg: res.data.msg, res: res.data });
    }
    return res.data;
}, (error) => {
    console.log('promise error:' + error);
    return Promise.reject({ type: -2, msg: "请求出错!", res: error })
});

//对POST请求数据做处理
instance.interceptors.request.use((res) => {
    if (res.method === "post" && res.data) {
        // let params = new URLSearchParams();
        // Object.keys(res.data).forEach((key) => {
        //     params.append(key, res.data[key]);
        // });
        // res.data = params;
        res.data = query.stringify(res.data);
    }
    return res;
});

export default instance;