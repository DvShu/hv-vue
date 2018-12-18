<template>
  <div class="progress" :style="{
    'width': percent+'%',
    'height': height,
    'background-color': color,
    'opacity': show ? 1 : 0
  }"></div>
</template>

<script>
export default {
  name: 'ProgressBar',
  data () {
    return {
      percent: 0,
      show: false,
      duration: 3000,
      height: '2px',
      color: '#009688'
    }
  },
  methods: {
    /**
     * 设置配置数据
     * @param d {Object}
     *   duration: 持续时间, Integer, 默认为 5000
     *   height:   进度条的高度, String, 默认 2px
     *   color:    进度条的颜色值, String, 默 #009688
     */
    setOptions (d) {
      ['duration', 'height', 'color'].forEach(function (key) {
        if (d.hasOwnProperty(key)) {
          this[key] = d[key]
        }
      }.bind(this))
    },
    /**
     * 开启进度条, 进度条则会定时自增
     * @return {default.methods}
     */
    start () {
      this.show = true
      if (this._timer) {
        clearInterval(this._timer)
        this.percent = 0
      }
      this._cut = 10000 / Math.floor(this.duration)
      this._timer = setInterval(() => {
        this.increase(this._cut * Math.random())
        if (this.percent > 100) {
          this.finish()
        }
      }, 100)
      return this
    },
    /**
     * 设置进度
     * @param num 百分比进度, 0~100
     * @return {default.methods}
     */
    set (num) {
      this.show = true
      this.percent = Math.floor(num)
      return this
    },
    /**
     * 获取当前进度
     * @return {number}
     */
    get () {
      return Math.floor(this.percent)
    },
    /**
     * 在现有的进度值的基础上添加进度, 0~100
     * @param num {Integer} 0~100
     * @return {default.methods}
     */
    increase (num) {
      this.percent = this.percent + Math.floor(num)
      return this
    },
    /**
     * 进度完成, 在请求完成后调用该函数
     * @return {default.methods}
     */
    finish () {
      this.percent = 100
      this._hide()
      return this
    },
    _hide () {
      clearInterval(this._timer)
      this._timer = null
      setTimeout(() => {
        this.show = false
        this.$nextTick(() => {
          setTimeout(() => {
            this.percent = 0
          }, 200)
        })
      }, 500)
      return this
    }
  }
}
</script>

<style lang="stylus">
  .progress
    position: fixed
    top: 0
    left: 0
    right: 0
    height: 2px
    width: 0
    transition: width 0.2s, opacity 0.4s
    opacity: 1
    background-color: #009688
    z-index: 999999
</style>
