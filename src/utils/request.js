import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getTime } from './auth'
import router from '@/router'

const request = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 添加响应拦截器
request.interceptors.response.use(function (responce) {
  // console.log(responce)
  const { data, success, message } = responce.data
  if (success) {
    return data
  } else {
    // console.log(message)
    Message.error(message)
    return Promise.reject(new Error(message))
  }
}, function (error) {
  if (error.response && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  }
  return Promise.reject(error)
})

// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = store.state.user.token
  if (token) {
    const time = Date.now() - getTime()
    // console.log('token存入时间' + getTime())
    // console.log('token已存入' + time + '毫秒')
    // 两个小时 === 7200000毫秒，超过这个时间，token自动失效
    if (time > 14400000) {
      store.dispatch('user/logout')
      router.push('/login')
    }
    config.headers['Authorization'] = 'Bearer ' + token
    // config.headers = {
    //   Authorization: 'Bearer ' + token
    // }
  }
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

export default request
