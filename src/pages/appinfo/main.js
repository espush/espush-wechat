import Vue from 'vue'
import App from './index'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    backgroundTextStyle: 'light',
    backgroundColor: '#fff',
    navigationBarBackgroundColor: '#000000',
    navigationBarTitleText: '应用信息',
    navigationBarTextStyle: 'white'
  }
}