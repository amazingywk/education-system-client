import { http } from '@/utils/request'

// 新建班级
export function createClass(data) {
    return http({
        url: '/class-create',
        method: 'POST',
        data,
    })
}

// 编辑班级
export function updateClass(data) {
    return http({
        url: '/class-update',
        method: 'POST',
        data,
    })
}

// 按条件获取班级列表
export function queryClassList(data) {
    return http({
        url: '/class-list',
        method: 'POST',
        data,
    })
}

// 给班级添加一份试卷
export function changeClassPaper(data) {
    return http({
        url: '/class-paper',
        method: 'POST',
        data
    })
}

// 根据班级_id获取信息与课表信息
export function classInfo(_id) {
    return http({
        url: `/class-information/${_id}`,
        method: 'GET',
    })
}
// 获取班级，课程
export function getSystemNum() {
    return http({
        url: '/system-num',
        method: 'GET',
    })
}
