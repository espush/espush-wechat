function formatNumber(n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

export function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()

  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  const t1 = [year, month, day].map(formatNumber).join('/')
  const t2 = [hour, minute, second].map(formatNumber).join(':')

  return `${t1} ${t2}`
}

export function wxScanQrCode(opt) {
  return new Promise((resolve, reject) => {
    wx.scanCode(Object.assign({
      success: (res) => {
        resolve(res);
      },
      fail: (err) => {
        reject(err);
      }
    }, opt));
  });
}

export function wxGetStorage(key) {
  return new Promise((resolve, reject) => {
    wx.getStorage({
      key: key,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

export function wxShowModal(title, content) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    });
  });
}

export function str2ab(str) {
  var buf = new ArrayBuffer(str.length * 2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

export function str2hex(str) {
  let rsp = "";
  let buffer = str2ab(str);
  let u16view = new Uint16Array(buffer);
  for (let i = 0; i != u16view.length; ++i) {
    let cur = u16view[i].toString(16);
    if (cur.length === 1) {
      cur = '0' + cur;
    }
    rsp += cur;
  }
  return rsp.toUpperCase();
}

export function hex2ascii(hexx) {
  var hex = hexx.toString();
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

export function wxGetSystemInfo(opt) {
  return new Promise((resolve, reject) => {
    wx.getSystemInfo(Object.assign({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    }, opt));
  });
}

export function wxStartPullDownRefresh(opt) {
  return new Promise((resolve, reject) => {
    wx.startPullDownRefresh(Object.assign({
      success: res => {
        resolve(res);
      },
      fail: err => {
        reject(err);
      }
    }, opt));
  });
}