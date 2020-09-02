import Handwriting from '../../components/hand-writing/hand-writing.js';
// import { pbApi } from '../../utils/api'
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectColor: 'black',
    slideValue: 75,
    img_src: '',
    writing_done: false,
    loadingHidden: false,
    btnDisable: true,
    handTitle1: '请用正楷签署您的姓名'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.handwriting = new Handwriting(this, {
      lineColor: this.data.lineColor,
      slideValue: this.data.slideValue, // 0, 25, 50, 75, 100
    })
    this.toast = this.selectComponent("#toast");
    this.listenNetcallEvent()
  },

  onMyEvent:function(e){
    console.log("执行了模板中的函数", e)
  },

  // 选择画笔颜色
  selectColorEvent(event) {
    var color = event.currentTarget.dataset.colorValue;
    var colorSelected = event.currentTarget.dataset.color;
    this.setData({
      selectColor: colorSelected
    })
    this.handwriting.selectColorEvent(color)
  },
  retDraw() {
    this.handwriting.retDraw()
  },
  subCanvas() {
    var _self = this
    console.log(this.handwriting.startLine);
    if (this.handwriting.startLine > 0) {
      this.handwriting.subCanvas().then(res => {
        console.log(res)
        _self.setData({
          writing_done: true,
          img_src: res
        })
        _self.sendImageToUrl(res)
      }).catch(res => {
        console.log(res)
      })
    }
    else {
      _self.toast.showToast('请签字');
    }
  },
  sendImageToUrl(filePath) {
    var _self = this
    _self.setData({
      loadingHidden: true,
      btnDisable: true
    })
    wx:wx.navigateTo({
      url: "/pages/detail/info",
      events: (events) =>{
        console.log(events)
      },
      success: (result) => {},
      fail: (res) => {},
      complete: (res) => {},
    })
    // wx.uploadFile({
    //   url: app.globalData.ENVIRONMENT_CONFIG.apiurl + pbApi.signContract, //签署征信授权书
    //   filePath: filePath,
    //   name: "file",
    //   header: {
    //     'content-type': 'multipart/form-data',
    //     "TOKEN": app.globalData.sessionid
    //   },
    //   formData: {
    //     orderNumber: app.globalData.orderInfo.orderNumber
    //   },
    //   success: function (res) {
    //     var data = JSON.parse(res.data);
    //     _self.setData({
    //       loadingHidden: false
    //     })
    //     if (data.code == 200) {
    //       wx.reLaunch({
    //         url: '/pages/home/index',
    //       })
    //     }
    //     else if(data.code === 1100){
    //       _self.toast.showToast(data.info)
    //       wx.reLaunch({
    //         url: '/pages/login/index',
    //       })
    //     }
    //     else {
    //       _self.toast.showToast(data.info);
    //     }
    //   },
    //   fail: function (res) {
    //     _self.setData({
    //       loadingHidden: false
    //     })
    //     _self.toast.showToast('网络异常');
    //     console.log(res);
    //   },
    //   complete: function (res) {
    //     _self.setData({
    //       btnDisable: false
    //     })
    //   }
    // });
  },
  // 笔迹粗细滑块
  onTouchStart(event) {
    this.startY = event.touches[0].clientY;
    this.startValue = this.format(this.data.slideValue)
  },
  onTouchMove(event) {
    const touch = event.touches[0];
    this.deltaY = touch.clientY - this.startY;
    this.updateValue(this.startValue + this.deltaY);
  },
  onTouchEnd() {
    this.updateValue(this.data.slideValue, true);
  },
  updateValue(slideValue, end) {
    slideValue = this.format(slideValue);
    this.setData({
      slideValue,
    });
    this.handwriting.selectSlideValue(this.data.slideValue)
  },
  format(value) {
    return Math.round(Math.max(0, Math.min(value, 100)) / 25) * 25;
  },
  listenNetcallEvent(){
    let _this = this
    app.globalData.writeEmitter.on('startLine', (data) => {
      console.log(data)
      _this.setData({
        btnDisable: data
      })
    })
  },
  onUnload(){
    app.globalData.writeEmitter.off('startLine')
  }
})
