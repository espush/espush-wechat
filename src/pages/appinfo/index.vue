<template>
  <div class="container">
    <div class="img-box">
      <canvas canvas-id="mycanvas" class="qrcanvas" />
    </div>
    <div class="card">
      <div class="group">
        <label for="imeival">产品编号</label>
        <p id="imeival">{{appid}}</p>
      </div>
      <div class="group">
        <label for="imeival">产品接入密钥</label>
        <p id="imeival">{{appkey_display}}</p>
      </div>
      <div class="group">
        <label for="imeival">创建时间</label>
        <p id="imeival">{{created_at}}</p>
      </div>
      <div class="group">
        <label for="imeival">创建备注信息</label>
        <p id="imeival">{{note}}</p>
      </div>
  </div>    
    <div class="btn-container">
      <button type="primary" @click="nav_back">返回</button>
    </div>
  </div>
</template>

<script>
import ESPush from '../../utils/espush';
import store from '../../store';
import {hex2ascii, wxGetSystemInfo, wxStartPullDownRefresh} from '../../utils/index';
import mixin from '../../utils/mixin';
var QRCode = require('../../utils/weapp-qrcode');


export default {
  mixins: [mixin],
  data() {
    return {
      note: '',
      created_at: '',
    }
  },
  computed: {
    appid() {
      return store.state.appinfo.appid;
    },
    appkey() {
      return store.state.appinfo.appkey;
    },
    appkey_display() {
      return store.state.appinfo.appkey.slice(0, 8) + '...';
    }
  },
  mounted() {
    wxGetSystemInfo().then(res => {
      console.log('system info: ');
      console.table(res);
    });
    this.load_appinfo();
    this.create_qr();
  },
  methods: {
    load_appinfo() {
      let {appid, appkey} = store.state.appinfo;
      let sdk = new ESPush(appid, appkey);
      let req = sdk.AppInfo();
      req.then(res => {
        this.note = res.data.note;
        this.created_at = res.data.created_at;
      }).catch(err=> {
        this.showInfo('出错啦', '加载应用信息出错，错误: ' + err);
      });
    },
    nav_back() {
      wx.navigateBack();
    },
    create_qr() {
      let uri = "https://nb.longmain.cn/api/v1/qr/" + this.appid + "/?k=" + this.appkey;      
      var qrcode = new QRCode('mycanvas', {
        text: uri,
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.L,
      });
    }
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

.img-box {
  margin-top: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.card {
  margin: 20rpx 40rpx 0 40rpx;
  border-radius: 20rpx;
  padding: 10rpx 20rpx;
  border: 1px solid #dcdcdc;
  background: #ecf0f5;
}

.group p, .group a {
  float: right;
}

.qrcanvas {
  width: 380rpx;
  height: 380rpx;
}

.group {
  margin-top: 10rpx;
}

.btn-container {
  margin: 50rpx 40rpx 0 40rpx;
}

</style>
