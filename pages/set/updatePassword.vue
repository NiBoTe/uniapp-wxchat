<template>
	<view class="password">
		<view class="header">设置新密码需要先验证您的手机号{{userInfo.mobile}}</view>
		<view class="form">
			<view class="form-item">
				<view class="ipt">
					<u-input type="number" maxlength="6" placeholder-style="placeholderStyle" :clearable="clearable"
						v-model="form.code" placeholder="请输入验证码" />
				</view>
				<view class="line"></view>
				<view class="code" @click="getCode()">
					<text>{{tips}}</text>
					<u-verification-code :seconds="seconds" change-text="XS后重新获取" @end="end" @start="start" ref="uCode"
						@change="codeChange">
					</u-verification-code>
				</view>
			</view>

			<view class="form-item">
				<view class="ipt">
					<u-input type="password" placeholder-style="placeholderStyle" :clearable="clearable"
						v-model="form.password" placeholder="请设置新的登录密码" />
				</view>

			</view>
		</view>
		<view class="footer">
			<view class="u-flex">
				<button :disabled="btnLoading" :loading="btnLoading" type="primary" class="submit" @click="toSubmit">
					<text>确定提交</text>
				</button>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		newSetPassword,
		sendSmsCode
	} from '@/api/login';

	import {
		getMyInfo
	} from '@/api/userInfo.js'
	export default {
		data() {
			return {
				btnLoading: false,
				wxcode: null,
				form: {
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
				},
				hasLogin: false,
				userInfo: {}
			};
		},
		onShow() {
			this.hasLogin = this.$mStore.getters.hasLogin
			if (this.hasLogin) {
				this.userInfo = this.$mStore.state.userInfo;
			} else {
				uni.navigateTo({
					url: '/pages/public/logintype'
				})
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
				const data = {
					code: this.form.code,
					password: this.form.password
				}
				this.$http.post(newSetPassword, data).then(async r => {
					this.$mHelper.toast('设置成功');

					this.getMemberInfo();

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
				if (!this.$mHelper.checkMobile(this.userInfo.mobileFull)) {
					this.$mHelper.toast('手机号码输入有误，请检查')
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$http.post(sendSmsCode, {
						mobile: this.userInfo.mobileFull,
						type: 4
					}).then(res => {
						console.log(res)
						uni.hideLoading();
						// 这里此提示会被this.start()方法中的提示覆盖
						this.$mHelper.toast('验证码已发送');
						// 通知验证码组件内部开始倒计时
						this.$refs.uCode.start();
					}).catch(err => {
						console.log(err)
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
			toBack() {
				this.$mRouter.back()
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.post(getMyInfo)
					.then(async r => {
						let user = r.data.user;
						this.userInfo = r.data.user;
						this.$mStore.commit('login', this.userInfo);
						uni.$emit('update', this.userInfo.passwordIsset)
						this.$mRouter.back();
					});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.password {
		
		min-height: 100vh;
		background-color: #F3F3F3;
		padding: 0 34rpx;


		.header {
			padding: 28rpx 0;
			text-align: center;
			font-size: 26rpx;
			color: #8F9091;
		}

		.form {
			&-item {
				margin-bottom: 28rpx;
				padding: 0 30rpx;
				height: 112rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				font-size: 26rpx;
				color: #1B1B1B;
				display: flex;
				align-items: center;

				.ipt {
					flex: 1;
					padding: 12rpx 0;
				}

				.line {

					width: 4rpx;
					height: 44rpx;
					background: #D8D8D8;
				}

				.code {
					margin-left: 42rpx;
					color: $u-type-primary;
				}
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 999;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #fff;

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

					&:after {
						border: none;
					}
				}
			}
		}

		/deep/ .u-checkbox__label {
			margin-right: 0 !important;
		}

		/deep/ .u-input__input {
			font-size: 26rpx;
			color: #3A3D71;
		}
	}
</style>
