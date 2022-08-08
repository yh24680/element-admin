<template>
  <div>
    <el-upload
      action="#"
      list-type="picture-card"
      accept="image/jpg,image/gif,image/png,image/jpeg"
      :limit="limit"
      :on-change="handleChange"
      :class="{ hidden: filesList.length === limit }"
      :file-list="filesList"
      :http-request="handleRequest"
    >
      <i slot="default" class="el-icon-plus"></i>
      <div slot="file" slot-scope="{ file }">
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <i class="el-icon-zoom-in"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <i class="el-icon-download"></i>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </span>
      </div>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" title="预览">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
    <el-progress :percentage="percent"></el-progress>
  </div>
</template>

<script>
import COS from 'cos-js-sdk-v5'
var cos = new COS({
  SecretId: 'AKIDb1JL8eutcDZeSzGGzRcXBYeU3LM8dsqW',
  SecretKey: 'SdXAXdS0IJ4ZonVw6zbwzmIXVCcldhV2'
})
console.log(cos)
export default {
  props: {
    limit: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,
      filesList: [],
      percent: 0
    }
  },
  methods: {
    // 删除
    handleRemove (file) {
      console.log(file)
      this.filesList = this.filesList.filter(item => item.uid !== file.uid)
    },
    handlePictureCardPreview (file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    handleDownload (file) {
      console.log(file)
    },
    // 选择图片
    handleChange (file, fileList) {
      console.log(fileList)
      this.filesList = fileList
    },
    // 上传
    handleRequest (obj) {
      var that = this
      console.log(12)
      cos.putObject({
        Bucket: 'lonely-1313062313', /* 必须 */
        Region: 'ap-shanghai', /* 存储桶所在地域，必须字段 */
        Key: 'obj.file.name' + Date.now(), /* 必须 */
        StorageClass: 'STANDARD',
        Body: obj.file, // 上传文件对象
        onProgress: function (progressData) {
          // console.log(JSON.stringify(progressData))
          that.percent = Math.ceil(progressData.loaded / progressData.total * 100)
        }
      }, function (err, data) {
        console.log(err || data)
        // this.src = data.Location
      })
    }
  }
}
</script>

<style scoped lang="scss">
// 原理：hidden类名是动态绑定
.hidden ::v-deep .el-upload--picture-card {
  display: none;
}
</style>
