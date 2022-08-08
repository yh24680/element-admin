// 封装插件， 在main.js引入全局  公共组件就可以直接在全局使用了
import PageTool from './PageTool'
import UploadImage from './UploadImage'
import FullScreen from './FullScreen'
import TagsView from './TagsView'

export default {
  install (Vue) {
    Vue.component('PageTool', PageTool)
    Vue.component('UploadImage', UploadImage)
    Vue.component('FullScreen', FullScreen)
    Vue.component('TagsView', TagsView)
  }
}
