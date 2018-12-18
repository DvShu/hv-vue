import bar from './progress_bar'
import ajaxInstall from './ajax/install'

let HcVue = Object.create({})

HcVue.install = function (Vue, opts) {
  opts = opts || {}

  if (opts.hasOwnProperty('bar')) {
    bar.setOptions(opts.bar)
  }
  Vue.prototype.$bar = bar

  ajaxInstall(Vue, opts.ajax)
}

export default HcVue
