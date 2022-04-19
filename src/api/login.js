import { http } from '@/utils/request'

export function login(data) {
    return http({
        url: '/login',
        method: 'POST',
        data
    })
}

export function register(data) {
    return http({
        url: '/register',
        method: 'POST',
        data
    })
}