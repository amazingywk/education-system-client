import { http } from '@/utils/request'

export function updateTimetable(data) {
    return http({
        url: '/timetable-update',
        method: 'POST',
        data,
    })
}