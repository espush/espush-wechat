<template>
  <div class="container">
    <div class="logoview">
      <img src="/static/img/devices.png" alt="" class="avatar" v-if="online" title="点击复制">
      <img src="/static/img/dev_offline.png" alt="" class="avatar" v-if="!online" title="点击复制">
      <div class="name">
        <p>{{name}}</p>
      </div>
    </div>
    <div class="card">
      <div class="group">
        <label for="nameval" class="name">设备编号</label>
        <p id="nameval">{{devid}}</p>
      </div>
      <div class="group">
        <label for="imeival">imei</label>
        <p id="imeival">{{imei}}</p>
      </div>
      <div class="group">
        <label for="firmval">Firmware</label>
        <p id="firmval">{{fwversion_display}}</p>
      </div>
      <div class="group">
        <label for="statval">Status</label>
        <p id="statval" v-if="online"> ONLINE </p>
        <p id="statval" v-if="!online"> OFFLINE </p>
      </div>
      <div class="group" v-if="!sndview">
        <label for="upcount">UP</label>
        <p id="upcount">{{up_count}}</p>
      </div>
      <div class="group" v-if="!sndview">
        <label for="downcount">DOWN</label>
        <p id="downcount">{{down_count}}</p>
      </div>
      <div class="group" v-if="!sndview">
        <label for="createdatval">CreatedAt</label>
        <p id="createdatval">{{created_at}}</p>
      </div>
      <div class="group" v-if="!sndview">
        <label for="uuidval">Latest</label>
        <p id="uuidval">{{latest}}</p>
      </div>
      <div class="group">
        <label for="datalistval">数据列表</label>
        <a @click="nav_data_list(devid)" id="datalistval">点击打开数据列表</a> 
      </div>
    </div>
    <div class="card coapcard" v-show="sndview">
      <textarea v-model="snd_data" class="coapinput" maxlength="512" rows="4" placeholder="此处输入的内容，将转换为 ASCII 编码发送 CoAP 数据到NB模组" ></textarea>
    </div>
    <div class="btns">
      <button type="primary" class="btn sndbtn" @click="snd_input_show" v-show="!sndview" >下行 CoAP 数据</button>
      <button type="primary" class="btn sndbtn" @click="send_coap" v-show="sndview">发送</button>
      <button type="default" class="btn sndbtn" @click="cancel_send_view" v-show="sndview">取消</button>
      <button type="warn" class="btn rmbtn" @click="remove_device_confirm(devid)" v-show="!sndview">删除</button>
    </div>
  </div>
</template>

<script>
import ESPush from '../../utils/espush';
import store from '../../store';
import {str2hex, wxShowModal} from '../../utils/index';
import mixin from '../../utils/mixin';

let company_extract = (fwversion) => {
  if("Lierda" in fwversion) {
    return "Lierda";
  } else if("Quectel" in fwversion) {
    return "Quectel";
  } else if('XUJUN' in fwversion) {
    return 'GuoPai';
  } else if('Neul' in fwversion) {
    return 'Neul';
  }
  return 'Unknown';
}

let fwversion_keyinfo_extract = (fwversion) => {
  if(!!!fwversion) {
    return '';
  }

  return company_extract(fwversion) + '...';
}

export default {
  mixins: [mixin],
  computed: {
    fwversion_display() {
      return fwversion_keyinfo_extract(this.fwversion);
    }
  },
  data() {
    return {
      name: '',
      devid: NaN,
      imei: '',
      fwversion: '',
      online: false,
      up_count: 0,
      down_count: 0,
      created_at: '',
      latest: '',
      sndview: false,
      snd_data: '',
    }
  },
  methods: {
    remove_device(devid) {
      let {appid, appkey} = store.state.appinfo;
      let iotsdk = new Espush(appid, appkey);
      let req = iotsdk.RemoveDevice(devid);
      req.then(res => {
        console.log('删除设备成功');
        wx.navigateBack();
      }).catch(err => {
        console.info('删除设备失败 ' + err);
      })
    },
    remove_device_confirm(devid) {
      let title = '确认删除设备 ' + this.name + " ?";
      let content = "删除设备后，对应的设备数据也将同步被删除，确认删除吗?";
      let req = wxShowModal(title, content).then(res=>{
        if(res.cancel) {
          return;
        }

        if(res.confirm) {
          this.remove_device(devid);
        }
      });
    },
    nav_data_list(devid) {
      wx.navigateTo({
        url: '/pages/datalist/datalist?devid=' + devid
      });      
    },
    snd_input_show() {
      this.sndview = true;
    },
    cancel_send_view() {
      this.sndview = false;
    },
    send_coap() {
      if(!!!this.snd_data) {
        return;
      }
      if(isNaN(this.devid)) {
        return;
      }

      let hexdata = str2hex(this.snd_data);
      let {appid, appkey} = store.state.appinfo;
      let iotsdk = new ESPush(appid, appkey);

      let req = iotsdk.AddDeviceData(this.devid, hexdata);
      req.then(res => {
        console.log(res);
        this.showToast('发送成功');
        this.cancel_send_view();
      }).catch(err => {
        console.info(err);
      });
    },
    load_device_detail(devid) {
      let {appid, appkey} = store.state.appinfo;
      let iotsdk = new ESPush(appid, appkey);
      let req = iotsdk.DeviceDetail(devid);
      req.then(res => {
        console.log(res);
        let rsp = res.data;
        this.name = rsp.name;
        this.devid = rsp.id;
        this.imei = rsp.imei;
        this.fwversion = rsp.fwversion;
        this.online = rsp.online;
        this.up_count = rsp.up_count;
        this.down_count = rsp.down_count;
        this.created_at = rsp.created_at;
        this.latest = rsp.latest;
      }).catch(err => {
        console.info(err);
      });
    }
  },
  mounted() {
    let devid = parseInt(this.$root.$mp.query.devid);
    this.load_device_detail(devid);
  },
  created() {
    //console.info('dev detail.');
  },
  onUnload() {
    this.sndview = false;
  }
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

.logoview {
  display: flex;
  flex-direction: column;
  align-items: center;
}

img.avatar {
  width: 180rpx;
  height: 180rpx;
  margin: 20rpx 0;
}

.card {
  margin: 40rpx 20rpx;
  border: 1px solid #dcdcdc;
  padding: 10rpx 10rpx;
  border-radius: 20rpx;
}

.group {
  margin: 10rpx 0;
}

.group label {
  color: #a7a7a7;
}

.group p, .group a {
  float: right;
}

a#datalistval {
  color: blue;
}

p#uuidval {
  word-break: break-all;
}

.btn {
  margin: 20rpx 20rpx;

}

.coapcard {
  margin: 20rpx 20rpx;
}

.coapinput {
  height: 174rpx;
}
</style>
