<template>
  <div class="logo navChild">
    <svg @click="openPollup" class="icon-classification" width="40px" height="40px">
      <use xlink:href="#icon-icon_mulu"></use>
    </svg>
    <router-link to="/home">
      <span>Goffee</span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['openPollup'])
const openPollup = () => {
  emit('openPollup')
  const body = document.querySelector('body')
  body!.style.overflow = 'hidden'
  const topNavBar = document.querySelector('#page-header')
  topNavBar?.classList.remove('nav-fixed')
}
</script>

<style lang="less" scoped>
@media screen and (min-width: @mobile-device) {
  .logo {
    .cursor-pointer();
    width: 10rem;
    display: flex;
    align-items: center;

    .icon-classification {
      transform: all 1s ease;
      display: block;
      margin-right: 1rem;
    }

    span {
      width: 100%;
      height: auto;
    }
    svg {
      fill: var(--header-text-color);
      filter: drop-shadow(0 0.2rem 0.3rem rgb(0 0 0 / 0.5));
    }
  }
}

@media screen and (min-width: @smallpc-device) {
  .logo {
    font-size: 3rem;
    a {
      .cursor-pointer();
    }
    .icon-classification {
      transition: all 1s ease;
      display: none;
    }
  }
}
</style>
