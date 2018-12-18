import axreq from './axreq'

let install = function (Vue, opts) {
  opts = opts || {}

  /**
   * 请求 json 格式的数据, 参数参考：
   *   https://www.npmjs.com/package/axreq -- json
   */
  Vue.prototype.$json = function () {
    if (typeof opts.handler === 'function') {
      let al = arguments.length - 1, cb = arguments[al], params = [].slice.apply(arguments, [0, al])
      params.push(function (err, res) {
        if (err) {
          cb(err)
        } else {
          opts.handler(res, cb)
        }
      })
      axreq.json.apply(this, params)
    } else {
      axreq.json.apply(this, arguments)
    }
  }

  Vue.prototype.$jsonm = function () {
    if (this.ajaxHandling === true) {
      return
    }
    this.ajaxHandling = true
    let al = arguments.length - 1, cb = arguments[al], params = [].slice.apply(arguments, [0, al])
    params.push(function (err, res) {
      this.ajaxHandling = false
      if (typeof opts.handler === 'function' && res != null) {
        opts.handler(res, cb)
      } else {
        cb(err, res)
      }
    }.bind(this))
    axreq.json.apply(this, params)
  }
}

export default install
