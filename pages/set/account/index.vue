<template>
	
	<view class="page-index">
		
		<u-navbar title="账号与安全" titleColor="#1B1B1B" :background="background" :border-bottom="false">
			
		</u-navbar>
		
		<view class="contenBox">
			<view class="content-view">
				<view class="item">
					<view class="menu-title">登录密码设置</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
					
				</view>
			</view>
		</view>
		
		<view class="contenBox">
			<view class="content-view">
				<view class="item">
					<view class="menu-title">手机号</view>
					<view class="right">
						<view class="subtitle">
							191****3789
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		
	
		
		
	</view>
</template>

<script>
	export default {
		components: {
		    },
	  data() {
	    return {
			background: {
				background: "#fff",
			},
	    }
	  },
	  onUnload() {
	
	  },

	  onLoad: function(options) {

	  },
	  
	  computed:{

	  },
	  methods: {
	

	  },
	}
</script>

<style lang="scss" scoped>

	.page-index {
		background-color: #F3F3F3;
		height: 100vh;
		overflow-x: hidden;
		padding-bottom: 180rpx;
	}
	
	
	.contenBox {
		padding: 0 30rpx;
		margin-top: 28rpx;
		
	}
	
	.content-view {
		border-radius: 24rpx;
		width: 100%;
		background: #fff;
	}
	
	
	.item {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0 28rpx;
		height: 112rpx;
		.menu-title {
			font-size: 26rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: #3A3D71;
		}

	}

	.item .right{
		display: flex;
		justify-content: flex-start;
		align-items: center;
		.subtitle {
			font-size: 26rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #8F9091;
			margin-right: 24rpx;
		}
		image{
			width: 15rpx;
			height: 28rpx;
		}
		
	} 
	
	

</style>
