<template>
	<view class="register">
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
					<u-input type="number" maxlength="6" placeholder-style="placeholderStyle" :clearable="clearable" v-model="form.code" placeholder="请输入您的验证码" />
				</view>
			</view>
			
			<view class="form-item">
				<view class="ipt">
					<u-input type="password" placeholder-style="placeholderStyle" :clearable="clearable" v-model="form.password" placeholder="请输入新密码（最少8位数字+字母）" />
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
				<button :disabled="btnLoading" :loading="btnLoading" type="primary" class="register" @click="toSubmit">
					<text>注册</text>
				</button>
			</view>

		</view>
	</view>
</template>
<script>
	import {
		register,
		sendSmsCode
	} from '@/api/login';

	export default {
		data() {
			return {
				btnLoading: false,
				appAgreementDefaultSelect: this.$mSettingConfig.appAgreementDefaultSelect, // 是否允许点击登录按钮
				appName: this.$mSettingConfig.appName,
				wxcode: null,
				form: {
					phone: '',
					code: '',
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
			toSubmit(e) {
				this.btnLoading = true;
				if (!this.appAgreementDefaultSelect) {
					this.$mHelper.toast('请阅读并同意协议', 1.5 * 1000);
					this.btnLoading = false;
					return;
				}
				this.thirdPartyRegister();

			},
			thirdPartyRegister() {
				const data = {
					mobile: this.form.phone,
					platform: 'miniapp',
					code: this.form.code,
					password: this.form.password
				}
				this.$http.post(register, data).then(async r => {
					const data = r.data;
					await this.$mStore.commit('setToken', data.token);
					await this.$mStore.commit('login', data.user);
					this.$mHelper.toast('已为您授权登录');
					this.$mRouter.reLaunch({
						route: '/pages/index/index'
					});
					this.btnLoading = false;
				}).catch(e => {
					this.$mHelper.toast(e.msg)
					this.btnLoading = false;
				});
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
						type: 6
					}).then(res => {
						uni.hideLoading();
						this.$mHelper.toast('验证码已发送');
						this.$refs.uCode.start();
					}).catch(err => {
						uni.hideLoading();
						this.$mHelper.toast(err.msg);
					})
				} else {
					this.$mHelper.toast('倒计时结束后再发送');
				}
			},
			end() {
				// this.$u.toast('倒计时结束');
			},
			start() {
				// this.$u.toast('倒计时开始');
			},
			toBack(){
				this.$mRouter.back()
			}
		}
	};
</script>
<style lang="scss">
	.register {
		background-color: #fff;
		padding: 0 48rpx;

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
				.register {
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
