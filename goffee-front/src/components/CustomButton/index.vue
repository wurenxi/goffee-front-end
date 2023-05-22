<template>
  <div :class="`custom-button-${type}`" ref="dom">
    <p>
      <slot></slot>
    </p>
    <span>
      <slot name="endesc"></slot>
    </span>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    type?: 'danger' | 'info' | 'success' | 'primary'
    /**
     * 按钮宽度，需传入number属性为指定的rem像素值
     * 默认11rem
     */
    x?: number
    /**
     * 按钮高度
     * 默认为4rem
     */
    y?: number
    /**
     * 主题字符的中间间隔 需传入number属性，默认为rem单位
     * 默认1.4rem
     */
    spacing?: number
    mainTextSize?: number
    subTextSize?: number
  }>(),
  {
    type: () => 'primary',
    x: () => 11,
    y: () => 4,
    spacing: () => 1.4,
    mainTextSize: () => 1.5,
    subTextSize: () => 0.8
  }
)

let dom = ref<HTMLDivElement>()
onMounted(() => {
  dom.value?.style.setProperty('--x', props.x.toString() + 'rem')
  dom.value?.style.setProperty('--y', props.y.toString() + 'rem')
  dom.value?.style.setProperty('--spcing', props.spacing.toString() + 'rem')
  dom.value?.style.setProperty('--mainTextSize', props.mainTextSize.toString() + 'rem')
  dom.value?.style.setProperty('--subTextSize', props.subTextSize.toString() + 'rem')
})
</script>

<style lang="less" scoped>
.custom-button {
  .button();
}

@x: var(--x);
@y: var(--y);
@spacing: var(--spcing);
@mainTextSize: var(--mainTextSize);
@subTextSize: var(--subTextSize);
.button() {
  background: url('./img/button.png') no-repeat;
  width: @x;
  height: @y;
  background-size: 100% 100%;
  .flex-multi(column, center, center);
  padding-top: 2px;
  font-weight: 600;
  overflow: hidden;
  color: #000;
  transition: all 0.2s ease;
  .cursor-pointer();
  p {
    align-items: center;
    text-indent: @spacing;
    letter-spacing: @spacing;
    line-height: 1;
    font-size: @mainTextSize;
  }
  span {
    font-size: @subTextSize;
    line-height: 1;
  }
}
.custom-button-primary {
  .button();
  &:hover {
    color: #fff;
    background: url('./img/button-primary-hover.png') no-repeat;
    background-size: 100% 100%;
  }
}
.custom-button-danger {
  .button();
  &:hover {
    color: #fff;
    background: url('./img/button-danger-hover.png') no-repeat;
    background-size: 100% 100%;
  }
}
.custom-button-success {
  .button();
  &:hover {
    color: #fff;
    background: url('./img/button-success-hover.png') no-repeat;
    background-size: 100% 100%;
  }
}
.custom-button-info {
  .button();
  &:hover {
    color: #fff;
    background: url('./img/button-info-hover.png') no-repeat;
    background-size: 100% 100%;
  }
}
</style>
