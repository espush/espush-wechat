const BASE_ADDR = "https://espush.cn";
const BASE_PATH = "/api/server";
import { md5 } from './md5';


let serialize = (obj) => {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

let calcSign = (urlpath, method, key, password, timestamp) => {
  let M = method;
  let P = urlpath;
  let C = "key=" + key + "timestamp=" + timestamp;
  let K = password;
  let S = ("" + M + P + C + K).toLowerCase();
  let R = md5(S);
  let sign = R.toLowerCase();
  console.info('S=[' + S + '], sign=[' + sign + ']');
  return sign;
};


class ESPush {
  constructor(key, password) {
    this.key = key;
    this.password = password;
  }

  newRequest(method, fullurl, data, key, timestamp, sign) {
    return new Promise((resolve, reject) => {
      wx.request({
        method: method,
        url: fullurl,
        data: data,
        header: {
          Key: key,
          Timestamp: timestamp,
          Sign: sign
        },
        success: res => {
          resolve(res);
        },
        fail: err => {
          reject(err);
        },
      });
    });
  }

  commonRequest(uri, method, params, data) {
    if (!!!uri.startsWith("/")) {
      uri = "/" + uri;
    }

    let timestamp = Date.parse(new Date()) / 1000;
    let fullurl = BASE_ADDR + BASE_PATH + uri;
    let urlpath = BASE_PATH + uri;
    let sign = calcSign(urlpath, method, this.key, this.password, timestamp);

    return this.newRequest(method, fullurl, data, this.key, timestamp, sign);
  }

  ListDevices(page, count) {
    let uri = "/devices";
    let method = "GET";
    if (page < 0 || count < 0) {
      throw "page or count must bigger than zero.";
      return;
    }

    let params = {
      page: page,
      count: count
    };

    return this.commonRequest(uri, method, params, null);
  }

  DeviceDetail(devid) {
    if (isNaN(devid)) {
      throw 'devid cannot be NaN.';
      return;
    }
    let uri = "/devices/" + devid;
    let method = "GET";

    return this.commonRequest(uri, method, {}, null);
  }

  DeviceDataList(devid, page, count) {
    if (isNaN(devid)) {
      throw 'devid cannot be NaN.';
      return;
    }
    let uri = "/devices/" + devid + "/messages";
    let method = "GET";
    let params = {
      page: page,
      count: count
    };

    return this.commonRequest(uri, method, params, null);
  }

  DataDetail(dataid) {
    if (isNaN(dataid)) {
      throw 'dataid cannot be NaN.';
      return;
    }
    let uri = "/messages/" + dataid;
    let method = "GET";

    return this.commonRequest(uri, method, {}, null);
  }

  RemoveDevice(devid) {
    if (isNaN(devid)) {
      throw 'devid cannot be NaN.';
      return;
    }

    let uri = "/devices/" + devid;
    let method = "DELETE";

    return this.commonRequest(uri, method, {}, null);
  }

  AddDevice(name, imei) {
    let uri = "/devices";
    let method = "POST";
    let data = JSON.stringify({
      imei: imei,
      name: name
    });

    return this.commonRequest(uri, method, {}, data);
  }

  AddDeviceData(devid, hexdata) {
    let uri = "/devices/" + devid + "/messages";
    let method = "POST";
    let data = JSON.stringify({
      hex: hexdata
    });

    return this.commonRequest(uri, method, {}, data);
  }

  AppInfo() {
    let uri = "/appinfo";
    let method = "GET";

    return this.commonRequest(uri, method, {}, null);
  }

  GetGPIO(devid) {
    let uri = "/gpio/" + devid;
    let method = "GET";

    return this.commonRequest(uri, method, {}, null);
  }

  SetGPIO(devid, pin, edge) {
    let uri = "/gpio/" + devid;
    let method = "POST";
    let args = {
      pin: pin,
      edge: edge
    };

    return this.commonRequest(uri, method, {}, args);
  }
}


export default ESPush;