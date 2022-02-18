<template>
	
	<view class="page-index">
		
		<u-navbar title="设置" titleColor="#1B1B1B" :background="background" :border-bottom="false">
			
		</u-navbar>
		
		
		<view class="login-body">
			<view class="login-view">
				
				<view class="code-item">
					<input :adjust-position='false' type="number" placeholder-class='placeholder' :maxlength='11' placeholder="请输入原手机号" v-model="captcha" required
						style="font-size: 30rpx;" />

					<button class="code" style="border: none;" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="check">{{ text }}</button>

				</view>

				<view class="item">
					<!-- <image src="../../../static/images/login-phone.png"></image> -->
					<input :adjust-position='false' type="number" placeholder-class='placeholder' :maxlength='11' placeholder="请输入您的验证码" v-model="account" required
						style="font-size: 30rpx;" />
				</view>
				<view class="code-item">
					<input :adjust-position='false' type="number" placeholder-class='placeholder' :maxlength='11' placeholder="请输入新手机号" v-model="captcha" required
						style="font-size: 30rpx;" />
				
					<button class="code" style="border: none;" :disabled="disabled" :class="disabled === true ? 'on' : ''" @click="check">{{ text }}</button>
				
				</view>
				
				<view class="item">
					<!-- <image src="../../../static/images/login-phone.png"></image> -->
					<input :adjust-position='false' type="number" placeholder-class='placeholder' :maxlength='11' placeholder="请输入您的验证码" v-model="account" required
						style="font-size: 30rpx;" />
				</view>
				
			</view>
			
			<view class="bottom">
				<view class="submit">
					退出登录
				</view>
			</view>
			

		</view>
		
		
		
		
		
		
		
		
		
		


	
		
		
		
	</view>
</template>

<script>
	import sendVerifyCode from '@/mixins/SendVerifyCode';
	export default {
		mixins: [sendVerifyCode],
		components: {
		    },
	  data() {
	    return {
			background: {
				background: "#0680FD",
			},
			
			account: '',
			password: '',
			captcha: '',
			loginByaccount: true
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
			  uni.navigateTo({
			  	url: '/pages/set/account/index'
			  })
		  }
	

	  },
	}
</script>

<style lang="scss" scoped>
	
	button::after { border: none }
	.page-index {
		background-color: #fff;
		height: 100%;
		overflow-x: hidden;
	}
	
	.placeholder {

		font-size: 26rpx;
		font-family: PingFang-SC-Regular, PingFang-SC;
		font-weight: 400;
		color: #9E9E9E;
	}
	
	.login-body {
		width: 100%;
		background: #fff;
		padding: 0 48rpx;

	}
	
	.login-body .login-view {
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		.item {
			margin-top: 32rpx;
			width: 100%;
			border-bottom: 2rpx solid #E9E9E9;
			display: flex;
			justify-content: flex-start;
			align-items: center;
			padding: 24rpx 0;

			input{
				width: 80%;
			}

		}
		
	}
	
	
	.login-body .login-view .code-item {
		width: 100%;
		border-bottom: 2rpx solid #E9E9E9;
		padding: 24rpx 0 0 0;
		margin-top: 32rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		input{
			width: 60%;
		}

		.code {
			text-align: center;
			background: #fff;
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #2C3AFF;
			border: none;
		}
	}

	.bottom{
		width: 100%;
		height: 88rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		position: absolute;
		bottom: 98rpx;
		left: 0;
		.submit{
			border-radius: 44rpx;
			width: 682rpx;
			height: 88rpx;
			background: #2C3AFF;
			font-size: 32rpx;
			font-family: PingFangSC-Medium, PingFang SC;
			font-weight: 500;
			color: #fff;
			text-align: center;
			line-height: 88rpx;
			box-shadow: 0px 6px 14px 2px rgba(235, 235, 235, 0.14);
		}
	}
	

</style>
