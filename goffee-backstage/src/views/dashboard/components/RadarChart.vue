<!-- 雷达图 -->
<template>
  <el-card>
    <template #header> 雷达图 </template>
    <div :id="id" :class="className" :style="{ height, width }" />
  </el-card>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';

const props = defineProps({
  id: {
    type: String,
    default: 'radarChart'
  },
  className: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '200px',
    required: true
  },
  height: {
    type: String,
    default: '200px',
    required: true
  }
});

const options = {
  grid: {
    left: '2%',
    right: '2%',
    bottom: '10%',
    containLabel: true
  },
  legend: {
    x: 'center',
    y: 'bottom',
    data: ['一', '二', '三'],
    textStyle: {
      color: '#999'
    }
  },
  radar: {
    // shape: 'circle',
    radius: '60%',
    indicator: [
      { name: '1' },
      { name: '2' },
      { name: '3' },
      { name: '4' },
      { name: '5' },
      { name: '6' }
    ]
  },
  series: [
    {
      name: 'Budget vs spending',
      type: 'radar',
      itemStyle: {
        borderRadius: 6,
        color: function (params: any) {
          //自定义颜色
          const colorList = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C'];
          return colorList[params.dataIndex];
        }
      },
      data: [
        {
          value: [400, 400, 400, 400, 400, 400],
          name: '预定数量'
        },
        {
          value: [300, 300, 300, 300, 300, 300],
          name: '下单数量'
        },
        {
          value: [200, 200, 200, 200, 200, 200],
          name: '发货数量'
        }
      ]
    }
  ]
};

onMounted(() => {
  const chart = echarts.init(
    document.getElementById(props.id) as HTMLDivElement
  );
  chart.setOption(options);

  window.addEventListener('resize', () => {
    chart.resize();
  });
});
</script>
