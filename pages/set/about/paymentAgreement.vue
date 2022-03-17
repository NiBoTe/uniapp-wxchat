<template>
	<view class="container">
		<web-view :src="webUrl + 'payment_agreement.html'"></web-view>
	</view>
</template>
<script>
	export default {
		data() {
			return {
				webUrl: this.$mConfig.webUrl
			};
		}
	}
</script>
<style>
	.container {
		padding: 24rpx;
	}
</style>
