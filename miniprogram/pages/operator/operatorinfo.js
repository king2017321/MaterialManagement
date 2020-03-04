const app = getApp()

Page({
	data: {
		_openid: app.globalData.openid,
		operatorname: '',
		operatorunion: '',
		operatorsector: '',
		operatorlevel: 0
	},

	onLoad: function () {
		const db = wx.cloud.database()
		var response = db.collection('UserInfo').where({ _openid: app.globalData.openid })
		response.get({
			success: res => {
				this.setData({
					operatorname: res.data[0].name,
					operatorunion: res.data[0].studentunion,
					operatorsector: res.data[0].sector,
					operatorlevel: res.data[0].level
				})
			},
			fail: res => { }
		})
	}
})