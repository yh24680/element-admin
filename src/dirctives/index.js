// import Vue from 'vue'
// // 自定义指令
// Vue.directive('imgerror', {
//   // 指令所在的标签插入到DOM中的时候就会执行
//   inserted (el, binding) {
//     // el.src = binding.value
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   },
//   // 数据更新的时候就执行
//   update (el, binding) {
//     // el.src = binding.value
//     el.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
//   }
// })

// 自定义指令
export const imgerror = {
  // 数据更新的时候就执行
  // update (el, binding) {
  //   // el.src = binding.value
  //   el.onerror = function () {
  //     this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
  //   }
  // }

  inserted (el, binding) {
    // el.src = binding.value
    el.onerror = function () {
      this.src = 'http://ihrm.itheima.net/static/img/head.b6c3427d.jpg'
    }
  }
}
