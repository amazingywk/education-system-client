import { http } from '@/utils/request'

// 新建班级
export function createCourse(data) {
    return http({
        url: '/course-create',
        method: 'POST',
        data,
    })
}

// 编辑班级
export function updateCourse(data) {
    return http({
        url: '/course-update',
        method: 'POST',
        data,
    })
}

// 按条件获取课程列表
export function queryCourseList(data) {
    return http({
        url: '/course-list',
        method: 'POST',
        data,
    })
}

// 获取全部课程可选项
export function getCourseOptions() {
    return http({
        url: '/course-options',
        method: 'GET',
    })
}