const app = getApp();

const studentunions = [
    "校学生会",
    "建筑学院学生会",
    "土木系学生会",
    "水利系学生会",
    "环境学院学生会",
    "机械系学生会",
    "精仪系学生会",
    "能动系学生会",
    "车辆学院学生会",
    "工业工程学生会",
    "电机系学生会",
    "电子系学生会",
    "计算机系学生会",
    "自动化系学生会",
    "微纳电子系学生会",
    "航院学生会",
    "工物系学生会",
    "化工系学生会",
    "材料学院学生会",
    "数学系学生会",
    "物理系学生会",
    "化学系学生会",
    "生命学院学生会",
    "经管学院学生会",
    "人文学院学生会",
    "社科学院学生会",
    "美术学院学生会",
    "医学院学生会",
    "药学院学生会",
    "新雅书院学生会"
]

Page({

    data: {
        studentunionlist: studentunions,
        step: 1,
        manual_switch: false,
        openid: '',
        current: '',
        name: '', //用户部门
        department: '', //用户所在院系
        class: '', //用户班级
        studentunion: '', //用户所在单位
        sector: '',  //用户所在部门
        phone: '', //用户电话
        email: '', //用户邮箱
        level: 0
    },

    // 注册界面

    onLoad: function (options) {
        if (app.globalData.openid) {
            this.setData({
                openid: app.globalData.openid
            })
        }
    },

    // 数据更新接口

    getUserName: function (e) {
        this.setData({
            name: e.detail.value
        })
    },

    getUserDepar: function (e) {
        this.setData({
            department: e.detail.value
        })
    },

    getUserClass: function (e) {
        this.setData({
            class: e.detail.value
        })
    },

    getUserUnion: function (e) {
        this.setData({
            studentunion: studentunions[e.detail.value[0]]
        })
    },

    getUserSector: function (e) {
        this.setData({
            sector: e.detail.value
        })
    },

    getUserPhone: function (e) {
        this.setData({
            phone: e.detail.value
        })
    },

    getUserEmail: function (e) {
        this.setData({
            email: e.detail.value
        })
    },

    // 查询数据，如果没有查到就提示更新数据

    nextStep: function () {
        var flag = 1
        if (!this.data.openid) {
            wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                    app.globalData.openid = res.result.openid
                    this.setData({
                        openid: res.result.openid
                    })
                },
                fail: err => {
                    this.goHome()
                    wx.showToast({
                        icon: 'none',
                        title: '登陆失败'
                    })
                }
            })
        }
        const db = wx.cloud.database() //从数据库中查询用户信息
        db.collection('UserInfo').where({
            _openid: this.data.openid
        }).get({
            success: res => {
                var QueryData
                QueryData = res.data
                this.setData({
                    name: QueryData[0].name,
                    department: QueryData[0].department,
                    class: QueryData[0].class,
                    studentunion: QueryData[0].studentunion,
                    sector: QueryData[0].sector,
                    phone: QueryData[0].phone,
                    email: QueryData[0].email,
                    current: QueryData[0]._id,
                    level: QueryData[0].level
                })
            },
            fail: err => {
            }
        })
        this.setData({
            step: this.data.step + 1
        })
    },

    goHome: function () {
        const pages = getCurrentPages()
        if (pages.length === 2) {
            wx.navigateBack()
        } else if (pages.length === 1) {
            wx.redirectTo({
                url: '../index/index',
            })
        } else {
            wx.reLaunch({
                url: '../index/index',
            })
        }
    },

    modify: function () {
        this.setData({
            step: this.data.step + 1,
            manual_switch: true
        })
    },

    commit: function () {
        const db = wx.cloud.database()
        var curTime = new Date()
        if (!(this.data.name && this.data.department && this.data.class && this.data.sector && this.data.phone && this.data.email)) {
            wx.showToast({
                icon: "none",
                title: "请完整输入个人信息"
            })
            return
        }
        var userdata = {
            name: this.data.name,
            department: this.data.department,
            studentunion: this.data.studentunion,
            class: this.data.class,
            sector: this.data.sector,
            phone: this.data.phone,
            email: this.data.email,
            level: this.data.level
        }
        if (this.data.current) {
            db.collection('UserInfo').doc(this.data.current).update({
                data: userdata,
                success: res => {
                    wx.showToast({
                        title: '更新记录成功',
                    })
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '更新记录失败'
                    })
                    console.error('[数据库] [新增记录] 失败：', err)
                }
            })
        } else {
            db.collection('UserInfo').add({
                data: userdata,
                success: res => {
                    // 在返回结果中会包含新创建的记录的 _id
                    wx.showToast({
                        title: '添加记录成功',
                    })
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '添加记录失败'
                    })
                }
            })
        }
        this.goHome()
    }
})