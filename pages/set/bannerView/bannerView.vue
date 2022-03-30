<template>
	<view class="container">
		<web-view :src="webUrl"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				webUrl: '',
				name: ''
			};
		},
		onLoad(options) {
			this.webUrl = options.url;
			this.name = options.name;
			uni.setNavigationBarTitle({
				title:this.name
			})
		}
	}
</script>
<style>
	.container {
		padding: 24rpx;
	}
</style>
