<template>
	<view class="detail">
		<u-parse :html="content"></u-parse>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				content: `
					<p>露从今夜白，月是故乡明</p>
					<img src="https://cdn.uviewui.com/uview/swiper/2.jpg" />
				`
			};
		}
	}
</script>

<style lang="scss" scoped>
	.detail{
		border-top: 2rpx solid #E9E9E9;
		padding: 26rpx 32rpx 26rpx 36rpx;
	}

</style>
