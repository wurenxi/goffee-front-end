<template>
  <div class="docMenu navChild">
    <ul class="menuList">
      <li>
        <router-link class="menu-router" to="/home">
          <el-icon>
            <HomeFilled />
          </el-icon>
          <span>首页</span>
        </router-link>
      </li>
      <li>
        <router-link class="menu-router" to="/articles">
          <el-icon>
            <List />
          </el-icon>
          <span>文章</span>
        </router-link>
      </li>
      <li>
        <router-link class="menu-router" to="/edit">
          <el-icon>
            <EditPen />
          </el-icon>
          <span>发表文章</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { HomeFilled, List, EditPen } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const handleCommand = (command: string | number | object) => {
  ElMessage(`click on item ${command}`)
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .menuList {
    display: none;
  }
}

@media screen and (min-width: 992px) {
  .menuList {
    display: flex;
    justify-content: center;

    li {
      padding: 0 1rem;
      display: flex;
      align-items: center;

      .menu-router {
        display: flex;
        align-items: center;
      }

      a {
        position: relative;
        &:hover {
          .cursor-pointer();
        }

        &::after {
          content: '';
          width: 100%;
          position: absolute;
          left: 0;
          bottom: -1px;
          height: 3px;
          background: #fff;
          border-radius: 5px;
          transform-origin: right;
          transform: scaleX(0);
          transition: transform 0.5s;
        }

        &:hover::after {
          transform-origin: left;
          transform: scaleX(1);
        }

        span {
          font-family: '幼圆';
        }
        .el-icon {
          filter: drop-shadow(0 0.2rem 0.3rem rgb(0 0 0 / 0.5));
        }
      }
    }
  }
}
</style>
