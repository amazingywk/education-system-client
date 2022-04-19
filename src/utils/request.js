import { SUCCESS } from '@/config'
import { message } from 'ant-design-vue'
import axios from 'axios'
// import { requestTimeout } from '@/config'

//创建请求实例
const http = axios.create({
    // baseURL: process.env.VUE_APP_BASE_URL,
    baseURL: '/api',
    // timeout: requestTimeout,
})

/**
 * @description axios请求拦截器
 */
// http.interceptors.request.use(
//     (config) => {

//     }
// )

/**
 * @description axios响应拦截器
 */
http.interceptors.response.use(
    (response) => {
        return new Promise((resolve, reject) => {
            const { data } = response
            // console.log(response)
            if (data.status == SUCCESS) {
                resolve(data)
            } else {
                message.error(data.msg)
                reject('请求异常'+response.config.url)
            }
        })
    },
    (error) => {
        console.log('interceptors response error', error)
    }
)

export { http }