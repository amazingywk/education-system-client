/**
 * 配置
 */
const config = {
    SUCCESS:1,  //接口返回的成功的状态
    FAIL:0,     //接口返回的失败的状态

    adminAuthority: [
        {
            key: 'home-admin',
            title: '主页'
        },
        {
            key: 'recruit-manage',
            title: '招生管理',
        },
        {
            key: 'user-manage',
            title: '用户管理'
        },
        {
            key: 'course-manage',
            title: '课程管理'
        },
        {
            key: 'class-manage',
            title: '班级管理',
        },
    ],
    studentAuthority: [
        {
            key: 'home-student',
            title: '主页'
        },
    ],
    teacherAuthority: [
        {
            key: 'home-teacher',
            title: '主页'
        },
        {
            key: 'class-manage',
            title: '班级管理',
        },
    ],
    recruiterAuthority: [
        {
            key: 'home-recruiter',
            title: '主页'
        },
        {
            key: 'recruit-manage',
            title: '招生管理',
        },
    ],
    guestAuthority: [
        {
            key: 'home-guest',
            title: '主页'
        },
    ],

    requestTimeout: 6,  //请求接口最长时间
}

module.exports = config