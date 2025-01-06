<script setup lang="ts">
</script>

<template>
  <div class="docMenu navChild">
    <ul class="menuList">
      <li>
        <router-link class="menu-router" to="/home">
          <svg class="my-icon icon-zhuyemian" width="20" height="20">
            <use xlink:href="#icon-zhuyemian" />
          </svg>
          &nbsp;
          <span>首页</span>
        </router-link>
      </li>
      <li>
        <router-link class="menu-router" to="/articles">
          <svg class="my-icon icon-16" width="20" height="20">
            <use xlink:href="#icon-16" />
          </svg>
          &nbsp;
          <span>文章</span>
        </router-link>
      </li>
      <li>
        <router-link class="menu-router" to="/edit">
          <svg class="my-icon icon-bianji" width="20" height="20">
            <use xlink:href="#icon-bianji" />
          </svg>
          &nbsp;
          <span>发表文章</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

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

      span {
        font-family: '幼圆', serif;
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

        .my-icon {
          fill: white;
          filter: drop-shadow(0 0.2rem 0.3rem rgb(0 0 0 / 0.5));
        }
      }
    }
  }
}
</style>
