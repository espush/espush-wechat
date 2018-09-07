<template>
  <div class="container">
    <p class="page-title">GPIO 状态与操作 <span></span></p>
    <div class="gpio-lists">
      <ul>
        <li class="item" v-for="(item, pos) in gpios" :key="pos">
          <label class="touchabled">
            <span class="pin-name">{{item.name}} <span class="pin-no">GPIO {{item.pin}}</span></span>
            <switch :checked="item.edge" @change="edge_change(item.pin, $event)" ></switch>
          </label>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import ESPush from '../../utils/espush';
import store from '../../store';
import {hex2ascii, wxGetSystemInfo, wxStartPullDownRefresh} from '../../utils/index';
import mixin from '../../utils/mixin';
var QRCode = require('../../utils/weapp-qrcode');

/*
gpio: []
{
  pin: 1,
  name: '',
  edge: true
}
*/
export default {
  mixins: [mixin],
  data() {
    return {
      devid: NaN,
      gpios: []
    }
  },
  computed: {
    key() {
      return store.state.appinfo.key;
    },
    password() {
      return store.state.appinfo.password;
    }
  },
  mounted() {
    this.devid = parseInt(this.$root.$mp.query.devid);
    this.load_gpio(this.devid);
  },
  created() {
    //
  },
  methods: {
    nav_back() {
      wx.navigateBack();
    },
    load_gpio(devid) {
      if(isNaN(this.devid)) {
        console.log('devid is NaN, ignore.');
        return;
      }

      let {key, password} = store.state.appinfo;
      let iotsdk = new ESPush(key, password);
      let req = iotsdk.GetGPIO(this.devid);
      req.then(res => {
        if(!('status' in res.data)) {
          console.log('cannot found status in res.data');
          return;
        }
        if(res.data.status.length && res.data.status.length === 16) {
          // ok.
        } else {
          console.log('res.data.status.length not match 16');
          return;
        }

        let status = res.data.status;
        let rsp = [];
        for(let i=0; i != status.length; ++i) {
          rsp.push({
            pin: i,
            name: '',
            edge: status[i] === '1'
          });
        }
        rsp = rsp.filter(item => item.pin < 6 || item.pin > 9 && item.pin !== 11);
        console.log(rsp);
        this.gpios = rsp;
      }).catch(er=>{
        console.log(err);
      });
    },
    edge_change(pin, evt) {
      let edge = evt.target.value;
      let {key, password} = store.state.appinfo;
      let iotsdk = new ESPush(key, password);
      let req = iotsdk.SetGPIO(this.devid, pin, edge);
      req.then(res=>{
        console.log(res.data);
      }).catch(err=>{
        console.error(err);
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

.page-title, .item {
  padding: 10rpx 20rpx;
}

.touchabled {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 6rpx;
  border-bottom: 1rpx solid #F2F2F2;
}
</style>
