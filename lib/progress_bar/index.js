import ProgressBar from './ProgressBar.vue'

const bar = new Vue(ProgressBar).$mount()
document.body.appendChild(bar.$el)

export default bar
