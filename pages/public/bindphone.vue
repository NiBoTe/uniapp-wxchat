<template>
	<view class="container">
		
		<view class="header">
			<u-icon name="close" @click="toBack()"></u-icon>
		</view>
		
		<view class="title">绑定手机号</view>
		
		<view class="form">
			<view class="form-item">
				<view class="ipt">
					<u-input v-model="form.phone" placeholder-style="placeholderStyle" type="number" maxlength="11" :clearable="clearable" placeholder="请输入您的手机号" />
				</view>
				<view class="code" @click="getCode()">
					<text>{{tips}}</text>
					<u-verification-code :seconds="seconds" change-text="XS后重新获取" @end="end" @start="start" ref="uCode" @change="codeChange">
					</u-verification-code>
				</view>
			</view>

			<view class="form-item">
				<view class="ipt">
					<u-input type="number" maxlength="25" placeholder-style="placeholderStyle" :clearable="clearable" v-model="form.password" placeholder="请输入您的验证码" />
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="u-flex">
				<button :disabled="btnDisabled" :loading="btnLoading" type="primary" class="submit" :class="btnDisabled ? 'disabled' : ''" @click="toAuthRegister">
					<text>立即绑定</text>
				</button>
			</view>

		</view>
	</view>
</template>
<script>
	import {
		mpWechatLogin,
		wechatH5Login,
		login
	} from '@/api/login';

	export default {
		data() {
			return {
				btnDisabled: true,
				btnLoading: false,
				appAgreementDefaultSelect: this.$mSettingConfig.appAgreementDefaultSelect, // 是否允许点击登录按钮
				appName: this.$mSettingConfig.appName,
				wxcode: null,
				form: {
					phone: '',
					password: '',
				},
				tips: '获取验证码',
				seconds: 60,
				clearable: false,
				placeholderStyle: {
					fontSize: '26rpx !important',
					color: '#9E9E9E !important',
					fontWeight: '400 !important'
				}
			};
		},
		onShow() {
			this.btnLoading = false;
			if (uni.getStorageSync('accessToken')) {
				this.$mRouter.reLaunch({
					route: '/pages/index/index'
				});
			}
		},
		onLoad(options) {
			this.$mStore.commit('logout');

			// 如果不是第一次进来 就不需要强制阅读协议
			if (!uni.getStorageSync('notFirstTimeLogin')) {
				if (!this.appAgreementDefaultSelect) {
					this.appAgreementDefaultSelect = false;
				}
			} else {
				this.appAgreementDefaultSelect = true;
			}
		},
		methods: {
			// 通用跳转
			navTo(route) {
				this.$mRouter.redirectTo({
					route
				});
			},
			// 注册
			toAuthRegister(e) {
				this.btnLoading = true;
				if (!this.appAgreementDefaultSelect) {
					this.$mHelper.toast('请阅读并同意协议', 1.5 * 1000);
					this.btnLoading = false;
					return;
				}
				if (e.detail.errMsg === 'getPhoneNumber:ok') {
					this.thirdPartyRegister();
				} else {
					this.btnLoading = false;
				}

			},
			thirdPartyRegister() {
				const data = {
					userName: this.form.phone,
					endpoint: 'APP',
					password: this.form.password
				}
				this.$http.post(login, data).then(async r => {
					await this.$mStore.commit('setToken', r.token);
					await this.$mStore.commit('login', r);
					this.$mHelper.toast('已为您授权登录');
					this.$mRouter.redirectTo({
						route: '/pages/index/index'
					});
					this.btnLoading = false;
				}).catch(e => {
					console.log(e)
					const err = JSON.parse(e.data)
					this.$mHelper.toast(err.message)
					this.btnLoading = false;
				});
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					setTimeout(() => {
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}, 2000);
				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				this.$u.toast('倒计时结束');
			},
			start() {
				this.$u.toast('倒计时开始');
			},
			toBack(){
				this.$mRouter.back()
			}
		}
	};
</script>
<style lang="scss">
	.container {
		background-color: #fff;
		padding: 0 48rpx;
		
		.header {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		
		.title {
			margin-top: 102rpx;
			margin-bottom: 126rpx;
			text-align: center;
			font-size: 36rpx;
			font-weight: 800;
			color: #333333;
		}
		
		.form {
			&-item {
				
				margin-top: 48rpx;
				font-size: 26rpx;
				color: #1B1B1B;
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #E9E9E9;

				&:first-of-type {
					margin-top: 68rpx;
				}

				.ipt {
					flex: 1;
					padding: 12rpx 0;
				}

				.code {
					color: $u-type-primary;
					font-weight: 800;
					
				}
			}
		}

		.footer {
			margin-top: 42rpx;
			width: 100%;

			&-protocol {
				font-size: 22rpx;
				color: $u-type-primary;

				.content {
					color: #1B1B1B;
				}
			}

			.u-flex {
				.submit {
					margin-top: 42rpx;
					width: 100%;
					border: none;
					height: 96rpx;
					text-align: center;
					line-height: 96rpx;
					background: $u-type-primary;
					border-radius: 48rpx;
					font-size: 32rpx;
					color: #FFFFFF;

					&.disabled{
						background: rgba(44, 58, 255, 0.3);
						opacity: 1;
					}
					
					&:after {
						border: none;
					}
				}
			}
		}

		/deep/ .u-checkbox__label {
			margin-right: 0 !important;
		}
		
		/deep/ .u-input__input{
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
		}
	}
</style>
