import { http } from '@/utils/request'

// 新建题目
export function createProblem(data) {
    return http({
        url: '/problem-create',
        method: 'POST',
        data,
    })
}

// 编辑题目
export function updateProblem(data) {
    return http({
        url: '/problem-update',
        method: 'POST',
        data,
    })
}

// 根据题目_id获取题目信息
export function getProblemInfo(_id) {
    return http({
        url: `/problem-info/${_id}`,
        method: 'GET'
    })
}

// 按条件获取题目列表
export function queryProblemList(data) {
    return http({
        url: '/problem-list',
        method: 'POST',
        data,
    })
}

// 获取并提交综合测评成绩
export function submitTestScore(data) {
    return http({
        url: '/problem-test-score',
        method: 'POST',
        data,
    })
}

