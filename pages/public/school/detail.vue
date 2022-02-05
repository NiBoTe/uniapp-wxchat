<template>
	<view class="detail">
		<u-parse :html="detail.detail"></u-parse>
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
		border-top: 2rpx solid #E9E9E9;
		padding: 26rpx 32rpx 26rpx 36rpx;
	}

</style>
