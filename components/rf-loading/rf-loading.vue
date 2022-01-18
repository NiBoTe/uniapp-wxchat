<template>
  <!--加载动画-->
  <view class="cu-load load-modal">
    <image :src="src" mode="aspectFit"></image>
    <view class="gray-text">{{ content }}</view>
  </view>
</template>

<script>
  /**
   * @des 页面加载
   *
   */
  import $mAssetsPath from '@/config/assets.config.js'
	export default {
		name: 'rf-loading',
    props: {
      src: {
      	type: String,
        default: $mAssetsPath.logo
      },
      content: {
      	type: String,
        default: '加载中...'
      }
    }
	}
</script>

<style scoped>

</style>
