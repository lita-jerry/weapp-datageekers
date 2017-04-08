// pages/topics/topics.js
const initialCategorylist = [{ name: '最新', url: '/latest' }, { name: '热门', url: '/top/all' }]
Page({
  data: {
    title: '文章列表',
    postsList: [],
    hidden: false,
    page: 1,
    tab: initialCategorylist[0].url,
    categorylist: initialCategorylist
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.fetchData();
    this.getCategorylist();
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
  onTapTag: function (e) {
    var tabValue = e.currentTarget.id;
    console.log('tabValue: ' + tabValue);
    this.setData({ tab: tabValue, hidden: false });
    this.fetchData();
  },
  redictDetail: function (e) {
    console.log('我要看详情');
    var id = e.currentTarget.id;
    var url = '../detail/detail?id=' + id;
    console.log('url: ' + url);
    wx.navigateTo({
      url: url
    })
  },
  fetchData: function (data) {
    var page = this;
    console.log('page.data.tab: ' + page.data.tab);
    wx.request({
      url: 'https://www.datageekers.com' + page.data.tab + '.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res.data);
        // page.setData({ postsList: res.data, hidden: true });

        var list = res.data.topic_list.topics
        var contentList_ = []
        var names = res.data.users

        for (var i = 0; i < list.length; i++) {
          var item = list[i];
          //作者
          var authoriD = item.posters[0].user_id;
          var authorName = "";
          var avatar_ = "";
          for (var nameIndex = 0; nameIndex < names.length; nameIndex++) {
            if (authoriD == names[nameIndex].id) {
              authorName = names[nameIndex].username;
              avatar_ = 'https://www.datageekers.com' + names[nameIndex].avatar_template.replace('{size}','30');
              break
            }
          }
          contentList_.push({ id: item.id, title: item.title, numview: item.views, numreply: item.posts_count - 1, avatar: avatar_, author: authorName, tags: item.tags})
        }
        page.setData({postsList: contentList_, hidden: true });
        // wx.hideToast()
        // wx.stopPullDownRefresh()
      }
    });
  },
  getCategorylist: function () {
    var page = this;
    console.log('page.data.tab: ' + page.data.tab);
    wx.request({
      url: 'https://www.datageekers.com/categories.json',
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        var resdata = res.data.category_list.categories;
        var categorylist_ = initialCategorylist;
        for (var index = 0; index < resdata.length; index++) {
          categorylist_.push({ name: resdata[index].name, url: '/c/' + resdata[index].id + '-category' })
        }
        // categorylist_.push(res.data.category_list.categories)
        page.setData({ categorylist: categorylist_, hidden: true });
      }
    });
  },
  onPullDownRefresh: function () {
    this.fetchData()
  }
})