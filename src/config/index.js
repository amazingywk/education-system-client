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
        {
            key: 'paper-manage',
            title: '试卷管理',
        },
        {
            key: 'problem-manage',
            title: '题库管理',
        },
        {
            key: 'test-manage',
            title: '综合测评',
        },
    ],
    studentAuthority: [
        {
            key: 'home-student',
            title: '主页'
        },
        {
            key: 'test-manage',
            title: '综合测评',
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
        {
            key: 'paper-manage',
            title: '试卷管理',
        },
        {
            key: 'problem-manage',
            title: '题库管理',
        },
        {
            key: 'test-manage',
            title: '综合测评',
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
        {
            key: 'test-manage',
            title: '综合测评',
        },
    ],
    guestAuthority: [
        {
            key: 'home-guest',
            title: '主页'
        },
        {
            key: 'test-manage',
            title: '综合测评',
        },
    ],

    requestTimeout: 6,  //请求接口最长时间
}

module.exports = config