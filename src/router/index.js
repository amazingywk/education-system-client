import {createRouter,createWebHashHistory} from 'vue-router'

export const allRoutes = [
    {
        path: '/',
        redirect: '/post'
    },
    {
        path: '/post',
        name: 'POST',
        component: () => import('@/views/post')
    },
    {
        path: '/recruit-manage',
        name: 'RecruitManage',
        component: () => import('@/views/recruitManage')
    },
    {
        path: '/user-manage',
        name: 'UserManage',
        component: () => import('@/views/userManage')
    },
    {
        path: '/course-manage',
        name: 'CourseManage',
        component: () => import('@/views/courseManage')
    },
    {
        path: '/class-manage',
        name: 'ClassManage',
        component: () => import('@/views/classManage'),
    },
    {
        path: '/timetable-manage',
        name: 'TimetableManage',
        component: () => import('@/views/classManage/timetableManage')
    },
    {
        path: '/home-admin',
        name: 'HomeAdmin',
        component: () => import('@/views/home/admin'),
    },
    {
        path: '/home-student',
        name: 'HomeStudent',
        component: () => import('@/views/home/student'),
    },
    {
        path: '/home-teacher',
        name: 'HomeTeacher',
        component: () => import('@/views/home/teacher'),
    },
    {
        path: '/home-guest',
        name: 'HomeGuest',
        component: () => import('@/views/home/guest'),
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: allRoutes,
})

export default router