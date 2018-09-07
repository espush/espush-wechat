const mixin = {
  methods: {
    showInfo(title, msg) {
      wx.showModal({
        title: title,
        content: msg,
        showCancel: false,
      });
    },
    showToast(content) {
      wx.showToast({
        title: content,
        icon: 'success',
        duration: 2000
      });
    }
  }
};

export default mixin;