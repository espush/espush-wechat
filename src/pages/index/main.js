import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    backgroundTextStyle: 'light',
    backgroundColor: '#f8f8f8',
    navigationBarBackgroundColor: '#000000',
    navigationBarTitleText: 'ESPush',
    navigationBarTextStyle: 'white',
    //enablePullDownRefresh: true,
  }
}