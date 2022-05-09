import { http } from '@/utils/request'

// 新建试卷
export function createPaper(data) {
    return http({
        url: '/paper-create',
        method: 'POST',
        data,
    })
}

// 编辑试卷
export function updatePaper(data) {
    return http({
        url: '/paper-update',
        method: 'POST',
        data,
    })
}

// 按条件获取试卷列表
export function queryPaperList(data) {
    return http({
        url: '/paper-list',
        method: 'POST',
        data,
    })
}

// 获取试卷可选项
export function getPaperOptions() {
    return http({
        url: '/paper-options',
        method: 'GET'
    })
}

// 获取综合测评试卷
export function getTestPaper() {
    return http({
        url: '/paper-test',
        method: 'GET'
    })
}

// 根据班级_id获取信息与课表信息
export function getPaperInfo(_id) {
    return http({
        url: `/paper-info/${_id}`,
        method: 'GET',
    })
}
