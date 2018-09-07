<template>
  <div class="container">
    <div class="noapp" v-if="newview">
      <div class="textbody">
        <p class="info">　　当前未关注任何 ESPush 应用，进入 https://espush.cn/ 后，点击产品管理，在某个具体的应用分类点击后，扫右侧二维码可关注、管理对应物联网设备。</p>
      </div>
      <button type="primary" class="scan" @click="scan_qrcode">扫一扫</button>
    </div>
    <div class="hasapp" v-if="!newview">
      <div hover hover-class="item_hover" class="item" v-for="device in devices" :key="device.id" @click="nav_dev_detail(device.id)">
        <div class="img-container">
          <img src="/static/img/devices.png" class="avatar" v-if="device.online === true">
          <img src="/static/img/dev_offline.png" class="avatar" v-if="device.online === false">
        </div>
        <div class="rightbody">
          <p class="latest">{{device.latest_display}}</p>
          <p class="name">{{device.name}}</p>
          <p class="uuid">{{device.uuid}}</p>
        </div>
      </div>
      <div class="floatbtn-container">
        <div hover hover-class="float_btn_hover"  class="floatbtn" @click="reset_app" v-show="show_popup">
          <img class="btn-img" src="/static/img/change.png">
        </div>

        <!-- <div hover hover-class="float_btn_hover" class="floatbtn" @click="nav_app_info" v-show="show_popup">
          <img class="btn-img" src="/static/img/appinfo.png">
        </div> -->
        
        <div hover hover-class="float_btn_hover" class="floatbtn base" @click="toggle_popup">
          <img class="btn-img" src="/static/img/action.png">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {wxScanQrCode, wxGetStorage, wxStartPullDownRefresh} from '../../utils/index';
import ESPush from '../../utils/espush';
import store from '../../store';
import mixin from '../../utils/mixin';


const STORAGE_SAVE_KEY = "ESPUSH_APP";


export default {
  mixins: [mixin],
  computed: {
    key() {
      return store.state.appinfo.key;
    },
    password() {
      return store.state.appinfo.password;
    },
    newview() {
      return !!!store.state.appinfo.key;
    }
  },
  methods: {
    hide_popup() {
      this.show_popup = false;
    },
    nav_app_info() {
      this.hide_popup();
      wx.navigateTo({
        url: '/pages/appinfo/appinfo'
      });
    },
    nav_add_newdev() {
      this.hide_popup();
    },
    toggle_popup() {
      this.show_popup = !this.show_popup;
    },
    nav_dev_detail(devid) {
      this.hide_popup();
      wx.navigateTo({
        url: '/pages/gpio/gpio?devid=' + devid
      });
    },
    load_app() {
      wx.getStorage({});
    },
    reset_app() {
      store.commit('reset_appinfo');
      wx.removeStorage({
        key: STORAGE_SAVE_KEY
      });
    },
    load_devices(key, password) {
      let sdk = new ESPush(key, password);
      let req = sdk.ListDevices(1, 20);
      req.then(res => {
        res.data.devices.forEach(item => {
          if(!!!item.latest) {
            item.latest_display = '暂无';
          } else {
            item.latest_display = item.latest;
          }
        });
        this.devices = res.data.devices;
      }).catch(err => {
        console.info(err);
      });
      return req;
    },
    scan_qrcode() {
      // 扫码
      let req = wxScanQrCode().then(res => {
        console.log(res);
        if(!!!res.result) {
          this.showInfo('出错啦', '二维码扫描失败');
          return;
        }
        if(!!!res.result.startsWith('https://espush.cn/')) {
          this.showInfo('出错啦', '二维码错误，请到 https://espush.cn 扫描正确的二维码。');
          return;
        }

        let key = parseInt(res.result.slice( res.result.indexOf('qr/') + 3, res.result.indexOf('/?k=')));
        let password = res.result.slice(res.result.indexOf('/?k=') + 4);
        store.commit('set_appinfo', {
          key: key,
          password: password
        });
        console.log(store.state.appinfo.key);
        wx.setStorage({
          key: STORAGE_SAVE_KEY,
          data: {
            key: key,
            password: password
          }
        });

        this.load_devices(key, password);
      }).catch(err=>{
        console.info(err);
        //this.showInfo('扫描未成功', '未扫描到结果');
      });
      return req;
    },
    main_show() {
      wxGetStorage(STORAGE_SAVE_KEY).then(res => {
        console.log('GET appinfo succ.');
        console.log(res);
        store.commit('set_appinfo', {
          key: res.data.key,
          password: res.data.password
        });
        let {key, password} = store.state.appinfo;
        this.load_devices(key, password);
      }).catch(err => {
        console.log('未读取到 APP KEY PASSWORD 数据');
      });
    }
  },
  data() {
    return {
      devices: [],
      show_popup: false,
    }
  },
  created() {
    //this.main_show();
  },
  onShow() {
    this.main_show();
  },
  onPullDownRefresh() {
    wxStartPullDownRefresh();

    let {key, password} = store.state.appinfo;
    let req = this.load_devices(key, password).catch(err=>{
      console.log('error: ' + err);
    });
    wx.stopPullDownRefresh();
  },
}
</script>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
}

.noapp {
  padding-top: 200rpx;
  align-self: center;
}

.textbody {
  margin: 0 40px;
}

.scan {
  width: 200px;
  margin-top: 60px;
}

.hasapp {
  width: 100%;
  height: 100%;
}

.item {
  display: flex;
  flex-direction: row;
  border-bottom: 1px solid #dcdcdc;
}

.avatar {
  width: 80rpx;
  height: 80rpx;
  min-width: 80rpx;
  min-height: 80rpx;
  margin: 12rpx 20rpx 12rpx 18rpx;
}

.rightbody {
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  height: 100%;
}

.latest {
  color: #dcdcdc;
  font-size: 20rpx;
  align-self: flex-end;
  margin: 20rpx 30rpx 0 0 ;
}

.name {
  font-size: 30rpx;
  margin: -10rpx 0 0 0;
}

.uuid {
  color: #dcdcdc;
  font-size: 20rpx;
  align-self: flex-start;
  margin-top: 10rpx;
  word-break: break-all;
}

.floatbtn-container {
  position: fixed;
  right: 10%;
  bottom: 10%;
}

.floatbtn {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50rpx;
  margin: 0;
  margin-bottom: 10rpx;
  border: none;
  padding: 0;
  background-color: #64dd17;
  box-shadow: 4rpx 4rpx 4rpx #888888;
  width: 100rpx;
  height: 100rpx;
}

.btn-img {
  min-width: 70rpx;
  min-height: 70rpx;
  max-width: 70rpx;
  max-height: 70rpx;
}

.cover-btn {
  min-width: 100rpx;
  min-height: 100rpx;
  max-width: 100rpx;
  max-height: 100rpx;  
}

.item_hover{
  background-color: #d9d9d9;
  /*animation: button_pressed 1s;*/
}

.float_btn_hover {
  animation: button_pressed 1s;
}

@keyframes button_pressed {
  from {background: green;}
  to {background: #66df20;}
}

</style>
