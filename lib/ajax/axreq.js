const SCRIPTTYPERE = /^(?:text|application)\/javascript/i;
const XMLTYPERE = /^(?:text|application)\/xml/i;
const JSONTYPE = 'application/json';
const HTMLTYPE = 'text/html';
/**
 * 进行对象复制
 */
function extend(...restParams) {
    let target = restParams[0] || {};
    // 目标对象, 需要复制到的对象
    let i = 1;
    // 当前复制哪个对象
    let length = restParams.length;
    let deep = false;
    // 是否需要进行深度复制
    let currObj;
    let src;
    let copy;
    let copyIsArray;
    let clone;
    // 判断是否需要进行深度复制
    if (typeof target === 'boolean') {
        deep = target;
        // 重置目标对象
        target = restParams[i] || {};
        i++;
    }
    if (typeof target !== 'object') {
        target = {};
    }
    // 循环复制每一个对象
    for (; i < length; i++) {
        // 只复制 非 空或undefined 对象
        currObj = restParams[i];
        if (currObj) {
            for (let name in currObj) {
                src = target[name]; // 原始值
                copy = currObj[name]; // 需要复制的值
                if (src === copy) {
                    continue;
                }
                if (deep && copy && isPlainObject(copy)) {
                    copyIsArray = Array.isArray(copy);
                    // 允许数组对象的合并去重
                    if (copyIsArray === true) {
                        copyIsArray = false;
                        clone = Array.isArray(src) ? src : [];
                    }
                    else {
                        clone = isPlainObject(src) ? src : {};
                    }
                    target[name] = extend(deep, clone, copy);
                }
                else if (copy !== void 0 && copy !== null) {
                    target[name] = copy;
                }
            }
        }
    }
    return target;
}
/**
 * 根据 mime 匹配期望的数据类型
 * @param {string} mime text/plain;charset=utf-8
 * @returns {string} html, json, script, xml, text, 默认 text
 */
function mimeToResponseType(mime) {
    if (mime)
        mime = mime.split(';')[0];
    return (mime && (mime === HTMLTYPE ? 'html' : mime === JSONTYPE ? 'json' :
        SCRIPTTYPERE.test(mime) ? 'script' : XMLTYPERE.test(mime) && 'xml')) || 'text';
}
/**
 * 是否是原始对象:
 *  1. Object
 *  2. Not Null
 *  3. Not window or dom(bom)
 * @param obj
 * @returns {boolean} true -- 是原始对象
 */
function isPlainObject(obj) {
    let isNotNullObj = false;
    if (typeof obj === 'object') {
        isNotNullObj = !(obj === null);
    }
    return isNotNullObj && Object.getPrototypeOf(obj) === Object.prototype;
}
// Empty function, used as default callback
function empty() {
}
// 序列化对象数据
function serializeData(a, add) {
    let value = null;
    for (let key in a) {
        value = a[key];
        if (Array.isArray(value)) {
            value.forEach(function (v) {
                add(key, v);
            });
        }
        else if (isPlainObject(value)) {
            serializeData(value, add);
        }
        else {
            add(key, value);
        }
    }
}
// 序列化 form 节点
function serializeForm(form, add) {
    let elems = form.elements;
    let oField;
    for (let i = 0, len = elems.length; i < len; i++) {
        oField = elems[i];
        if (!oField.hasAttribute('name')) {
            continue;
        }
        if (oField.tagName === 'SELECT') {
            add(oField.name, oField.options[oField.selectedIndex].value);
        }
        else if (oField.type === 'radio' || oField.type === 'checkbox') {
            if (oField.checked) {
                add(oField.name, oField.value);
            }
        }
        else {
            add(oField.name, oField.value);
        }
    }
}
// 序列化一个 form 节点数组或者一个 key-value 为一个查询字符串
let serialize = function (o) {
    let s = [];
    let add = function (key, valueOrFunc) {
        let value = (typeof valueOrFunc === 'function') ? valueOrFunc() : valueOrFunc;
        s.push(encodeURIComponent(key) + '=' + encodeURIComponent(value == null ? '' : value));
    };
    // 处理 form 表单节点
    if (o instanceof HTMLElement && o.tagName.toLowerCase() === 'form') {
        serializeForm(o, add);
    }
    else {
        serializeData(o, add);
    }
    return s.join('&');
};
// 执行一个 request 请求
let request = function (setting, cb) {
    // 默认配置
    let defaultSettings = {
        method: 'GET',
        processData: true,
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        complete: empty,
        headers: {} // 设置请求头
    };
    let opts = extend(defaultSettings, setting); // 合并配置
    let xhr = new XMLHttpRequest();
    let responseType = opts.responseType;
    if (opts.data && opts.processData === true && (typeof opts.data !== 'string')) { // 进行数据操作
        opts.data = serialize(opts.data);
    }
    // 转换数据到 get 请求 url 上
    let method = opts.method.toUpperCase();
    if (method === 'GET' && opts.data) {
        opts.url = opts.url + '?' + opts.data;
        opts.data = null;
    }
    // 监听
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) { // 请求完成
            xhr.onreadystatechange = empty;
            let result;
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) { // 请求成功
                // 期望返回的数据类型
                responseType = responseType || mimeToResponseType(opts.mimeType || xhr.getResponseHeader('content-type'));
                if (xhr.responseType === 'arraybuffer' || xhr.responseType === 'blob') {
                    result = xhr.response;
                    cb(null, result);
                }
                else {
                    result = xhr.responseText;
                    try {
                        if (responseType === 'json') {
                            result = JSON.parse(result);
                        }
                        cb(null, result);
                    }
                    catch (e) {
                        console.error(e);
                        cb(new Error('parseError - ' + e.message), null);
                    }
                }
            }
            else {
                cb(new Error(xhr.status + ' - ' + xhr.statusText || ''), null);
            }
        }
    };
    // open
    xhr.open(method, opts.url);
    // 设置请求头
    if (opts.data && method !== 'GET' && opts.contentType) {
        xhr.setRequestHeader('Content-Type', opts.contentType);
    }
    for (let key in opts.headers) {
        xhr.setRequestHeader(key, opts.headers[key]);
    }
    // send
    xhr.send(opts.data ? opts.data : null);
};
let getPost = function (url, method, ...restParams) {
    let data = null;
    let cb = empty;
    if (restParams.length === 2) { // 传递了 data 参数
        data = restParams[0];
        cb = restParams[1];
    }
    else { // 只传了一个参数
        let param0Typeof = typeof restParams[0];
        // 如果参数类型为 function 则为回调函数
        if (param0Typeof === 'function') {
            cb = restParams[0];
        }
        else {
            data = restParams[0];
        }
    }
    request({
        url: url,
        data: data,
        method: method
    }, cb);
};
// 执行 get 请求
let get = function (url, ...restParams) {
    getPost(url, 'GET', ...restParams);
};
// 执行 post 请求
let post = function (url, ...restParams) {
    getPost(url, 'POST', ...restParams);
};
// 请求 json 格式的数据
let json = function (url, ...restParams) {
    let data = null;
    let method = 'GET';
    let paramJson = false;
    let argmentsLen = restParams.length;
    let cb = empty;
    if (argmentsLen === 1) { // 共传递了2个参数, [url ,cb]
        cb = restParams[0];
    }
    else if (argmentsLen === 2) { // 共传递了 3 个参数 [url, data, cb]
        data = restParams[0];
        cb = restParams[1];
    }
    else if (argmentsLen === 3) { // 共传递了 4 个参数 [url, data, method|paramJson, cb]
        data = restParams[0];
        let param1Typeof = typeof restParams[1];
        if (param1Typeof === 'string') { // method
            method = restParams[1];
        }
        else if (param1Typeof === 'boolean') { // paramJson
            paramJson = restParams[1];
        }
        cb = restParams[2];
    }
    else if (argmentsLen === 4) { // 共传递了 5 个参数
        data = restParams[0];
        method = restParams[1];
        paramJson = restParams[2];
        cb = restParams[3];
    }
    let opt = {
        url: url,
        data: data,
        method: method,
        responseType: 'json'
    };
    if (paramJson === true) { // 请求参数是 json 格式
        opt.contentType = 'application/json;charset=utf-8';
        if (typeof data === 'object') {
            opt.data = JSON.stringify(data);
        }
        opt.processData = false;
    }
    request(opt, cb);
};
export default {
    serialize,
    request,
    get,
    post,
    json
};
