import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    pages: [
      "^pages/index/index",
      "pages/gpio/gpio",
      "pages/appinfo/appinfo",
      "pages/devdetail/devdetail",
    ], // Will be filled in webpack
    // window: {
    //   backgroundTextStyle: 'light',
    //   navigationBarBackgroundColor: '#000000',
    //   navigationBarTitleText: 'WeChat',
    //   navigationBarTextStyle: 'white'
    // }
  }
}