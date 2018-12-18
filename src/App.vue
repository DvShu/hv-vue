<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  data: function () {
    return {
      ajaxHandling: false
    }
  },
  created: function () {
    this.$bar.start()
    this.$jsonm('get', { d: 1 }, 'get', function (e) {
      this.$jsonm()
    }.bind(this))
    setTimeout(() => {
      this.$bar.finish()
    }, 2000)
  },
  components: {
    HelloWorld
  }
}
</script>
<style lang="stylus">
#app
  font-family 'Avenir', Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50
  margin-top 60px
</style>
