<template>
	
	<view class="page-index">
		
		<u-navbar title="设置" titleColor="#1B1B1B" :background="background" :border-bottom="false">
			
		</u-navbar>
		
		<view class="contenBox">
			<view class="content-view">
				<view class="item" @tap="toAccount">
					<view class="menu-title">账户与安全</view>
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
					<view class="menu-title">我的收货地址</view>
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
					<view class="menu-title">用户协议</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">隐私政策</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">切换角色</view>
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
					<view class="menu-title">专业评画价格</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">绑定收款账号</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">教师认证</view>
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
					<view class="menu-title">当前版本</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">关于易考绘</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">清除缓存</view>
					<view class="right">
						<view class="subtitle">
							56.8MB
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
				<view class="item">
					<view class="menu-title">意见反馈</view>
					<view class="right">
						<view class="subtitle">
						</view>
						<image src="../../../static/public/arrow_right.png" mode=""></image>
					</view>
				</view>
			</view>
			
		</view>
		
		<view class="bottom">
			<view class="loginOut" @tap="saveRequest">
				退出登录
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
				background: "#0680FD",
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
		  toAccount:function() {
			  // uni.navigateTo({
			  // 	url: '/pages/set/account/index'
			  // })
			  
			  uni.navigateTo({
			  	url: '/pages/set/changePhone/index'
			  })
		  }
	

	  },
	}
</script>

<style lang="scss" scoped>

	.page-index {
		background-color: #F3F3F3;
		height: 100vh;
		overflow-x: hidden;
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
	
	
	.bottom{
		width: 100%;
		height: 112rpx;
		display: flex;
		align-items: center;
		flex-direction: row;
		justify-content: center;
		margin-top: 24rpx;
		.loginOut{
			border-radius: 24rpx;
			width: 682rpx;
			height: 112rpx;
			background: #fff;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #2C3AFF;
			text-align: center;
			line-height: 112rpx;
		}
	}
	

</style>
