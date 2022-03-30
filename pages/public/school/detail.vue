<template>
	<view class="detail">
		<scroll-view scroll-y="true">
			<u-parse :html="detail.detail"></u-parse>
		</scroll-view>
	</view>
</template>

<script>
	import { schoolDetail } from '@/api/school.js'
	export default {
		data() {
			return {
				universityId: null,
				detail: {},
			};
		},
		onLoad(options) {
			console.log(options)
			if(options.universityId) this.universityId = options.universityId
			this.initData();
		},
		methods:{
			initData(){
				console.log('========')
				this.$http.get(schoolDetail, {
					universityId: this.universityId
				}).then(res => {
					console.log(res)
					this.detail = res.data
					uni.setNavigationBarTitle({
						title: this.detail.name
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.detail{
		height: 100vh;
		border-top: 2rpx solid #E9E9E9;
		padding: 26rpx 32rpx 26rpx 36rpx;
	}

</style>
