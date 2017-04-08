// pages/detail/detail.js
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    title: '详情',
    detail: {},
    hidden: false,
    content: '',
    id: '',
    replies: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log('options.id: ' + options.id);
    this.setData({ id: options.id });
    this.fetchData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  fetchData: function (data) {
    var p = this;
    console.log('p.data.id: ' + p.data.id);
    wx.request({
      url: 'https://www.datageekers.com/t/' + p.data.id + '.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        //console.log(res.data.data); 
        var result = res.data;
        var content = result.post_stream.posts[0].cooked;
        //console.log(content);      
        //头像URL和UTC时间格式需要转换
        for (var index = 0; index < result.post_stream.posts.length; index++) {
          //头像URL
          var temp_ = result.post_stream.posts[index].avatar_template;
          result.post_stream.posts[index].avatar_template = 'https://www.datageekers.com' + temp_.replace('{size}','60');
          //UTC时间
          var datetime = new Date(result.post_stream.posts[index].created_at);
          result.post_stream.posts[index].created_at = datetime. toLocaleString();
        }
        // p.setData({ detail: result, hidden: true });
        WxParse.wxParse('content', 'html', content, p, 5);
        console.log("头像URL："+result.post_stream.posts[0].avatar_template)
        //获取评论列表
        var repliesArray = result.post_stream.posts;
        repliesArray = repliesArray.slice(1,repliesArray.length);//需要忽略第一元素，第一元素是楼主发布的文章
        var l = 100;
        if (repliesArray.length < l) {
          l = repliesArray.length;
        }
        var replyArr = [];
        for (var i = 0; i < l; i++) {
          if (repliesArray[i].cooked) {
            var c = repliesArray[i].cooked;
            if (c.length > 0) {
              //需要HTML渲染
              replyArr.push(repliesArray[i].cooked);
            }
          }
        }
        /**
        * WxParse.wxParseTemArray(temArrayName,bindNameReg,total,that)
        * 1.temArrayName: 为你调用时的数组名称
        * 3.bindNameReg为循环的共同体 如绑定为reply1，reply2...则bindNameReg = 'reply'
        * 3.total为reply的个数
        */
        console.log('replies:' + replyArr.length);
        if (replyArr.length > 0) {
          for (let i = 0; i < replyArr.length; i++) {
            WxParse.wxParse('reply' + i, 'html', replyArr[i], p);
            if (i === replyArr.length - 1) {
              WxParse.wxParseTemArray("replyTemArray", 'reply', replyArr.length, p)
            }
          }
        }
        //repliesArray    
        p.setData({ detail: result, replies: repliesArray, hidden: true });
      }
    });
  }
})