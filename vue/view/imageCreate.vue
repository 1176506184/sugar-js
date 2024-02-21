<template>
  <div class="container">
    <el-form>
      <div style="display: flex">
        <el-form-item label="初始图标">
          <el-upload
              class="avatar-uploader"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-upload
              class="avatar-uploader"
              style="margin-left:10px"
              :show-file-list="false"
              :on-success="handleAvatarSuccess2"
          >
            <img v-if="imageUrl2" :src="imageUrl2" class="avatar"/>
            <el-icon v-else class="avatar-uploader-icon">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
      </div>
      <div>
        <el-form-item v-for="(item,index) in imageSizeList" :key="item.width" :label="`${item.width}×${item.height}`"
                      style="display: inline-flex;margin-right: 10px">
          <div class="avatar-uploader">
            <img :src="item.src" class="avatar" alt=""/>
          </div>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button type="primary" @click="save">保存到本地</el-button>
      </el-form-item>


    </el-form>

  </div>
</template>

<script setup>
import {ref} from 'vue'
import {Plus} from '@element-plus/icons-vue'

const imageUrl = ref('')
const imageUrl2 = ref('')
const imageSizeList = ref([{
  width: 16,
  height: 16
}, {
  width: 32,
  height: 32
}, {
  width: 57,
  height: 57
}, {
  width: 60,
  height: 60
}, {
  width: 72,
  height: 72
}, {
  width: 76,
  height: 76
}, {
  width: 96,
  height: 96
}, {
  width: 114,
  height: 114
}, {
  width: 120,
  height: 120
}, {
  width: 144,
  height: 144
}, {
  width: 152,
  height: 152
}, {
  width: 180,
  height: 180
}, {
  width: 192,
  height: 192
}, {
  width: 200,
  height: 200
}, {
  width: 512,
  height: 512
}])

const handleAvatarSuccess = (
    response,
    uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
  imageSizeList.value.forEach(async (item, index) => {
    if (index < 2) {
      item.src = await createImage(imageUrl.value, item)
    }
  })
}

const handleAvatarSuccess2 = (
    response,
    uploadFile
) => {
  imageUrl2.value = URL.createObjectURL(uploadFile.raw)
  imageSizeList.value.forEach(async (item, index) => {
    if (index >= 2) {
      item.src = await createImage(imageUrl2.value, item)
    }
  })
}

function save() {
  let zip = new JSZip();
  imageSizeList.value.forEach(async (item, index) => {
    zip.file(`${item.width}x${item.height}.png`, base64ToBlob(item.src))
  })

  zip.generateAsync({type: "blob"})
      .then(function (content) {
        // 保存文件
        saveAs(content, "icon.zip");
      }, function (err) {
        // 处理错误
        console.error("Error while generating ZIP file:", err);
      });

}

async function createImage(url, size) {
  return new Promise((r, j) => {
    let img = new Image();
    if (url instanceof Blob) {
      let reader = new FileReader();
      reader.onload = function (event) {
        img.src = event.target.result;
      };
      reader.readAsDataURL(url);
    } else { // 如果是URL直接赋值给src属性
      img.src = url;
    }
    img.onload = () => {
      // 获取原始图片尺寸
      let width = img.width;
      let height = img.height;
      // 计算缩放比例和新尺寸
      let scale = Math.min(size.width / width, size.height / height);
      let newWidth = width * scale;
      let newHeight = height * scale;
      // 创建canvas元素
      let canvas = document.createElement('canvas');
      canvas.width = newWidth;
      canvas.height = newHeight;
      let ctx = canvas.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, newWidth, newHeight);
      ctx.fillStyle = 'rgba(0, 0, 0, 0)';
      ctx.fillRect(0, 0, newWidth, newHeight);
      // 绘制调整尺寸后的图片到canvas上
      ctx.drawImage(img, 0, 0, newWidth, newHeight);
      // 将canvas内容转为base64编码
      let base64Data = canvas.toDataURL('image/png' /* 或 'image/png' */, 0.8 /* 可选的质量参数 */).split(',')[1];
      r("data:image/png;base64," + base64Data)
    }
  })
}

function base64ToBlob(base64String, type = 'application/octet-stream') {
  // 将base64字符串去掉前缀并按字节分割
  let binaryString = window.atob(base64String.split(',')[1]);

  // 创建一个Uint8Array数组来存放每个字节
  let arrayBuffer = new ArrayBuffer(binaryString.length);
  let uint8Array = new Uint8Array(arrayBuffer);

  // 将每个字符转为8位无符号整数存入Uint8Array
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }

  // 使用ArrayBuffer和MIME类型创建Blob对象
  return new Blob([uint8Array], {type: type});
}

</script>

<style scoped>
.container {
  width: 100%;
  border: 1px solid #f0f0f0;
  padding: 20px;
}
</style>

<style>
.avatar-uploader .avatar {
  width: 60px;
  height: 60px;
  display: block;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 60px;
  height: 60px;
  text-align: center;
}
</style>