const app = getApp()

Page({
	data: {
		_openid: app.globalData.openid
	},

	onLoad: function () {
		if (app.globalData.level < 1) {
			const db = wx.cloud.database()
			var response = db.collection('UserInfo').where({ _openid: this.data._openid })
			response.get({
				success: res => {
					this.setData({ _level: res.data[0].level })
					getApp().globalData.level = res.data[0].level
				},
				fail: res => { }
			})
		} else { this.setData({ _level: app.globalData.level }) }
	}
})