import { login, getUserInfo, getUserDetailById } from '@/api/user'
import { setToken, getToken, removeToken, setTime } from '@/utils/auth'
import { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userInfo: []
}
const mutations = {
  setToken (state, payload) {
    state.token = payload
  },
  setUserInfo (state, payload) {
    state.userInfo = payload
  },
  removeToken (state) {
    state.token = null
    removeToken()
  },
  removeUserInfo (state) {
    state.userInfo = {}
  }
}
const actions = {
  async login (context, data) {
    const res = await login(data)
    context.commit('setToken', res)
    setToken(res)
    setTime(Date.now())
  },
  async getUserInfo (context) {
    const res = await getUserInfo()
    const res1 = await getUserDetailById(res.userId)
    // console.log(res1)
    // console.log(res)
    context.commit('setUserInfo', { ...res, ...res1 })
    return res
  },
  logout (context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    // 把vuex中的permission/routes 清空一下
    context.commit('permission/setRoutes', [], { root: true })
    // 子模块调用子模块的action 可以将 commit 的第三个参数设置成{root：true} 就表示当前的context 不是子模块了，而是父模块
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

