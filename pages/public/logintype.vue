<template>
	<view class="login-type">
		<view class="header">
			<u-icon name="close" @click="toBack()"></u-icon>
			<view class="btn" @click="navTo('/pages/public/register')">注册</view>
		</view>

		<view class="title">{{loginType === 'code' ? '手机快捷登录' : '账号密码登录'}}</view>
		<view class="subtitle" v-if="loginType === 'code'">未注册过的手机号将自动创建账号</view>
		<view class="subtitle" v-else> </view>
		<view class="form">
			<view class="form-item">
				<view class="ipt">
					<u-input v-model="form.phone" placeholder-style="placeholderStyle" type="number" maxlength="11"
						:clearable="clearable" placeholder="请输入您的手机号" />
				</view>
				<view class="code" @click="getCode()" v-if="loginType === 'code'">
					<text>{{tips}}</text>
					<u-verification-code :seconds="seconds" change-text="XS后重新获取" @end="end" @start="start" ref="uCode"
						@change="codeChange">
					</u-verification-code>
				</view>
			</view>

			<view class="form-item" v-if="loginType === 'code'">
				<view class="ipt">
					<u-input type="number" maxlength="25" placeholder-style="placeholderStyle" :clearable="clearable"
						v-model="form.code" placeholder="请输入您的验证码" />
				</view>
			</view>

			<view class="form-item" v-if="loginType === 'password'">
				<view class="ipt">
					<u-input type="password" placeholder-style="placeholderStyle" :clearable="clearable"
						v-model="form.password" placeholder="请输入您的密码" />
				</view>
			</view>
		</view>
		<view class="footer">
			<!-- 协议 -->
			<u-checkbox v-model="appAgreementDefaultSelect" size="24" icon-size="16" shape="circle">
				<view class="footer-protocol u-flex">
					<text class="content">登录即代表阅读并同意{{appName}}</text>
					<!-- 协议地址 -->
					<navigator url="/pages/set/about/detail?field=protocol_register&title=使用协议">《使用协议》</navigator>
					<text>和</text>
					<navigator url="/pages/set/about/detail?field=protocol_privacy&title=隐私协议">《隐私政策》</navigator>
				</view>
			</u-checkbox>
			<view class="u-flex">
				<button :disabled="btnLoading" :loading="btnLoading" type="primary" class="login" @click="toAuthLogin">
					<text>立即登录</text>
				</button>
			</view>

			<view class="footer-other">
				<button class="other-btn" @click="loginType = 'password'" v-if="loginType === 'code'">
					<text>账号密码登录</text>
				</button>
				<button class="other-btn" @click="loginType = 'code'" v-if="loginType === 'password'">
					<text>手机号快捷登录</text>
				</button>
				<view class="line" v-if="loginType === 'password'"></view>
				<button class="other-btn" @click="navTo('/pages/public/forgotPassword')"
					v-if="loginType === 'password'">
					<text>忘记密码</text>
				</button>
			</view>
		</view>

		<view class="login-other">
			<u-divider color="#9E9E9E" fontSize="24" half-width="250" border-color="#E9E9E9">其他方式登录</u-divider>
			<button @click="wxLogin">
				<image src="/static/login_wechat.png"></image>
			</button>
		</view>

	</view>
</template>
<script>
	import {
		mpWechatLogin,
		sendSmsCode,
		loginOrRegisterBySmsCode,
		loginByMobilePassword,
	} from '@/api/login';

	export default {
		data() {
			return {
				btnLoading: false,
				appAgreementDefaultSelect: this.$mSettingConfig.appAgreementDefaultSelect, // 是否允许点击登录按钮
				appName: this.$mSettingConfig.appName,
				loginType: 'code',
				wxcode: null,
				form: {
					phone: '',
					password: '',
					code: '',
				},
				tips: '获取验证码',
				seconds: 120,
				clearable: false,
				placeholderStyle: {
					fontSize: '26rpx !important',
					color: '#9E9E9E !important',
					fontWeight: '400 !important'
				}
			};
		},
		onShow() {
			this.getWxCode()
			this.btnLoading = false;
			if (uni.getStorageSync('accessToken')) {
				this.$mRouter.back()
				// this.$mRouter.reLaunch({
				// 	route: '/pages/index/index'
				// });
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
			getWxCode() {
				let _this = this;
				uni.login({
					provider: 'weixin',
					success: function(loginRes) {
						console.log(loginRes)
						_this.wxcode = loginRes.code;
					}
				});
			},
			// 通用跳转
			navTo(route) {
				this.$mRouter.push({
					route
				});
			},
			// 授权登录
			toAuthLogin(e) {
				const _this = this;
				this.btnLoading = true;
				if (!this.appAgreementDefaultSelect) {
					this.$mHelper.toast('请阅读并同意协议', 1.5 * 1000);
					this.btnLoading = false;
					return;
				}
				
				if(this.loginType === 'code') {
					this.thirdPartyAuthLogin();
				} else {
					this.passwordLogin();
				}
				return
				// if (e.detail.errMsg === 'getPhoneNumber:ok') {
				// 	// 检查登录态是否过期
				// 	wx.checkSession({
				// 		success(res) {
							
				// 		},
				// 		fail(err) {
				// 			wx.login({
				// 				success: res => {
				// 					_this.wxcode = res.code
				// 					_this.thirdPartyAuthLogin();;
				// 				}
				// 			})
				// 		}
				// 	})

				// } else {
				// 	_this.btnLoading = false;
				// }

			},

			thirdPartyAuthLogin() {
				const params = {
					mobile: this.form.phone,
					platform: 'miniapp',
					code: this.form.code,
					jsCode: this.wxcode
				}
				
				this.$http.post(loginOrRegisterBySmsCode, params).then(async r => {
					const data = r.data;
					await this.$mStore.commit('setToken', data.token);
					await this.$mStore.commit('setOpenId', data.openid);
					await this.$mStore.commit('login', data.user);
					this.$mHelper.toast('已为您授权登录');
					this.$mRouter.back()
					this.btnLoading = false;
				}).catch(err => {
					if (err.code === 201) {
						this.$http.post(loginOrRegisterBySmsCode, Object.assign(data, {
							ticket: err.data.ticket
						})).then(async r => {
							const data = r.data;
							await this.$mStore.commit('setToken', data.token);
							await this.$mStore.commit('setOpenId', data.openid);
							await this.$mStore.commit('login', data.user);
							this.$mHelper.toast('已为您授权登录');
							this.$mRouter.back()
							// this.$mRouter.reLaunch({
							// 	route: '/pages/index/index'
							// });
							this.btnLoading = false;
						}).catch(e => {
							this.$mHelper.toast(e.msg)
							this.btnLoading = false;
						});
					} else {
						this.$mHelper.toast(err.msg)
						this.btnLoading = false;
					}
				})
				
			},
			
			// 手机号密码登录
			passwordLogin(){
				const data = {
					mobile: this.form.phone,
					platform: 'miniapp',
					password: this.form.password,
					jsCode: this.wxcode
				}
				this.$http.post(loginByMobilePassword, data).then(async r => {
					const data = r.data;
					await this.$mStore.commit('setToken', data.token);
					await this.$mStore.commit('login',  Object.assign(data.user, {
						openid: data.openid
					}));
					this.$mHelper.toast('已为您授权登录');
					
					if(data.user.roleSelect) {
						this.$mRouter.back()
					} else {
						this.$mRouter.push({
							route: '/pages/public/roleSelection'
						});
					}
					this.btnLoading = false;
				}).catch(e => {
					this.$mHelper.toast(e.msg)
					this.btnLoading = false;
				});
			},
			// 微信登录
			wxLogin() {
				this.$http.post(mpWechatLogin, {
					code: this.wxcode
				}).then(async r => {
					const data = r.data;
					await this.$mStore.commit('setToken', data.token);
					await this.$mStore.commit('setOpenId', data.openid);
					await this.$mStore.commit('login', data.user);
					this.$mHelper.toast('已为您授权登录');
					if(data.user.roleSelect) {
						this.$mRouter.back()
						// this.$mRouter.reLaunch({
						// 	route: '/pages/index/index'
						// });
					} else {
						this.$mRouter.push({
							route: '/pages/public/roleSelection'
						});
					}
				}).catch(err => {
					console.log(err)
					if (err.code === 201) {
						this.$mRouter.push({
							route: `/pages/public/bindphone?ticket=${err.data.ticket}`
						})
					} else {
						this.$mHelper.toast(err.msg)
					}
				})
			},
			codeChange(text) {
				this.tips = text;
			},
			getCode() {

				if (!this.$mHelper.checkMobile(this.form.phone)) {
					this.$mHelper.toast('手机号码格式有误')
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$http.post(sendSmsCode, {
						mobile: this.form.phone,
						type: 1
					}).then(res => {
						console.log(res)
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$u.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}).catch(err => {
						console.log(err)
					})

				} else {
					this.$u.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			toBack() {
				this.$mRouter.back()
			}
		}
	};
</script>
<style lang="scss">
	.login-type {
		background-color: #fff;
		padding: 0 48rpx;

		.header {
			margin-top: 40rpx;
			display: flex;
			justify-content: space-between;
			align-items: center;

			.btn {
				font-size: 28rpx;
				color: #3A3D71;
			}
		}

		.title {
			margin-top: 62rpx;
			font-size: 36rpx;
			font-weight: bold;
			color: #333333;
		}

		.subtitle {
			margin-top: 4rpx;
			height: 24rpx;
			font-size: 24rpx;
			color: #9E9E9E;
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
				.login {
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

					&:after {
						border: none;
					}
				}
			}

			// 其他
			.footer-other {
				display: flex;
				justify-content: center;
				align-items: center;

				button {
					margin: 0;
					padding: 0;
					border: none;
					height: 96rpx;
					text-align: center;
					line-height: 96rpx;
					font-size: 28rpx;
					color: #9E9E9E;
					background-color: transparent;

					&:after {
						border: none;
					}
				}

				.line {
					margin: 0 24rpx;
					width: 2rpx;
					height: 24rpx;
					background-color: #E9E9E9;
				}
			}
		}

		.login-other {
			position: fixed;
			left: 48rpx;
			right: 48rpx;
			bottom: 108rpx;
			text-align: center;

			button {
				margin-top: 40rpx;
				width: 80rpx;
				height: 80rpx;
				padding: 0;
				background-color: transparent;

				&:after {
					border: none;
				}

				image {
					width: 80rpx;
					height: 80rpx;
				}
			}
		}


		/deep/ .u-checkbox__label {
			margin-right: 0 !important;
		}

		/deep/ .u-input__input {
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
		}
	}
</style>
