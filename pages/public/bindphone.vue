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
					<u-input type="number" maxlength="25" placeholder-style="placeholderStyle" :clearable="clearable" v-model="form.code" placeholder="请输入您的验证码" />
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="u-flex">
				<button :disabled="btnDisabled" :loading="btnLoading" type="primary" class="submit" :class="btnDisabled ? 'disabled' : ''" @click="toSubmit">
					<text>立即绑定</text>
				</button>
			</view>

		</view>
	</view>
</template>
<script>
	import {
		loginOrRegisterBySmsCode,
		sendSmsCode,
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
					ticket: '',
					code: ''
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
		onLoad(options) {
			if(options.ticket) this.form.ticket = options.ticket
		},
		computed:{
			btnDisabled(){
				return this.form.phone === '' || this.form.code === ''
			}
		},
		methods: {
			toSubmit() {
				this.btnLoading = true;
				const data = {
					mobile: this.form.phone,
					platform: 'miniapp',
					code: this.form.code,
					ticket: this.form.ticket
				}
				this.$http.post(loginOrRegisterBySmsCode, data).then(async r => {
					const data = r.data;
					await this.$mStore.commit('setToken', data.token);
					await this.$mStore.commit('login', Object.assign(data.user, {
						openid: data.openid
					}));
					this.$mHelper.toast('已为您授权登录');
					if(data.roleSelect) {
						this.$mRouter.reLaunch({
							route: '/pages/index/index'
						});
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
