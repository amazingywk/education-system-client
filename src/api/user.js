import { http } from '@/utils/request'

// 按条件获取用户列表
export function queryUserList(data) {
    return http({
        url: '/user-list',
        method: 'POST',
        data
    })
}

// 更新用户
export function updateUser(data) {
    return http({
        url: '/user-update',
        method: 'POST',
        data,
    })
}

// 启用用户
export function enableOneUser(data) {
    return http({
        url: '/user-enable',
        method: 'POST',
        data
    })
}

// 禁用用户
export function disableOneUser(data) {
    return http({
        url: '/user-disable',
        method: 'POST',
        data
    })
}

// 根据用户_id查询用户信息
export function getUserInfo(_id) {
    return http({
        url: `/user-information/${_id}`,
        method: 'GET',
    })
}

// 获取学生列表
export function queryStudentList() {
    return http({
        url: '/student-list',
        method: 'GET',
    })
}

// 获取教师列表
export function queryTeacherList() {
    return http({
        url: '/teacher-list',
        method: 'GET',
    })
}

// 根据用户名获取权限
export function queryAuthority(_id) {
    return http({
        url: `/user-authority/${_id}`,
        method: 'GET',
    })
}

// 获取各类人员的数量
export function getUserNum() {
    return http({
        url: '/user-num',
        method: 'GET',
    })
}

// 根据学生_id获取班级、课表信息
export function getStudentTimetable(_id) {
    return http({
        url: `/student-timetable/${_id}`,
        method: 'GET',
    })
}