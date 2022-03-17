<template>
	<view class="container">
		<view class="logo">
			<image src="/static/logo.png"></image>
			<text>{{appName}}</text>
			<view class="version">Version1.0</view>
		</view>
		
		
		<view class="footer">
			<view class="link">{{appName}}软件许可及 <text @click="detailTap(0)">《使用协议》</text>和<text @click="detailTap(1)">《隐私政策》</text></view>
			<view class="copyright">浙江韬璞（TOP）科技有限公司 版权所有</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				appAgreementDefaultSelect: this.$mSettingConfig.appAgreementDefaultSelect, // 是否允许点击登录按钮
				appName: this.$mSettingConfig.appName,
			};
		},
		methods:{
			detailTap(type){
				if(type === 0){
					uni.navigateTo({
						url: '/pages/set/about/agreement'
					})
				} else {
					uni.navigateTo({
						url: '/pages/set/about/detail'
					})
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.container{
		padding-top: 120rpx;
		.logo{
			display: flex;
			flex-direction: column;
			align-items: center;
			
			image{
				width: 120rpx;
				height: 120rpx;
			}
			
			text{
				display: inline-block;
				margin-top: 48rpx;
				font-size: 36rpx;
				font-weight: bold;
				color: #1B1B1B;
				
				&.version{
					margin-top: 0;
					font-size: 32rpx;
					font-weight: 400;
					color: #1B1B1B;
				}
			}
		}
		
		.footer{
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 60rpx 34rpx;
			padding-bottom: calc(60rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(60rpx + env(safe-area-inset-bottom));
			z-index: 9999;
			
			
			.link{
				margin: 0 auto;
				width: 312rpx;
				text-align: center;
				font-size: 24rpx;
				font-weight: bold;
				color: #3A3D71;

			}
			
			.copyright{
				text-align: center;
				font-size: 24rpx;
				color: #8F9091;
			}
		}
	}

</style>
