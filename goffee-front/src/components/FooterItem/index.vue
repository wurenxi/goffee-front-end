<template>
  <footer class="footer">
    <aside class="left">
      <p class="one">Goffee-blog</p>
      <p class="two">仅供学习使用 本博客为个人用途 无任何盈利用途</p>
      <p class="three">
        备案/许可证编号：<a href="https://beian.miit.gov.cn" target="_blank">苏ICP备2023015258号</a>
      </p>
    </aside>
    <div class="right">
      <p>Copyright © 2023-present goffee.cn</p>
      <div class="my">
        <a title="我的Github地址" href="https://github.com/wurenxi" target="_blank">
          <svg width="30" height="30">
            <use xlink:href="#icon-github" />
          </svg>
        </a>
        <el-popover placement="top" title="联系我" :width="200" trigger="hover">
          <qrcode-vue
            style="width: 100%; height: 100%"
            value="https://qm.qq.com/cgi-bin/qm/qr?k=EqlSblNBXxn-BC8iGxb3dyeZKiPvZGF1&noverify=0&personal_qrcode_source=3"
          />
          <template #reference>
            <svg width="35" height="35">
              <use xlink:href="#icon-QQ" />
            </svg>
          </template>
        </el-popover>
        <a title="加入我的团体" href="#" target="_blank">
          <svg width="30" height="30">
            <use xlink:href="#icon-QQgroup" />
          </svg>
        </a>
      </div>
    </div>
  </footer>
</template>

<script lang="ts">
export default {
  name: 'FooterItem'
}
</script>
<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .footer {
    width: 100%;
    .flex-multi(column, center, center);
    padding: 1rem;
    text-align: center;
    flex-wrap: wrap;
    margin-top: 20px;
    background-color: var(--footer-bg);
    .font-normal();

    .one {
      font-size: 2rem;
    }

    .two {
      font-size: 1rem;
    }

    .three {
      font-size: 0.8rem;

      a {
        color: rgb(207, 0, 112);
      }
    }

    .right {
      flex-shrink: 0;
      font-size: 0.8rem;
      text-align: center;

      .my {
        .flex-multi(row, flex-start, center);

        svg {
          margin-right: 1rem;
          fill: var(--common-font-color);
        }
      }
    }
  }
}

@media screen and (min-width: 460px) {
  .footer {
    justify-content: space-between;
    flex-direction: row;
    text-align: unset;

    .right {
      text-align: right;
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .footer {
    padding: 0.5rem 5rem;
  }
}
</style>
