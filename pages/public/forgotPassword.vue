<template>
	<view class="forgotPassword">
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
					<u-input type="number" maxlength="25" placeholder-style="placeholderStyle" :clearable="clearable" v-model="form.code" placeholder="请输入验证码" />
				</view>
			</view>
			
			<view class="form-item">
				<view class="ipt">
					<u-input type="password" placeholder-style="placeholderStyle" :clearable="clearable" v-model="form.password" placeholder="请设置新密码" />
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="u-flex">
				<button :disabled="btnLoading" :loading="btnLoading" type="primary" class="submit" @click="toSubmit">
					<text>确定</text>
				</button>
			</view>

		</view>
	</view>
</template>
<script>
	import {
		resetPassword,
		sendSmsCode
	} from '@/api/login';

	export default {
		data() {
			return {
				btnLoading: false,
				form: {
					phone: '',
					code:'',
					password: '',
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
			this.btnLoading = false;
			if (uni.getStorageSync('accessToken')) {
				this.$mRouter.reLaunch({
					route: '/pages/index/index'
				});
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
					mobile: this.form.phone,
					code: this.form.code,
					password: this.form.password
				}
				this.$http.post(resetPassword, data).then(async r => {
					this.$mHelper.toast('重置成功');
					this.$mRouter.back();
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
						type: 2
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
			toBack(){
				this.$mRouter.back()
			}
		}
	};
</script>
<style lang="scss"scoped>
	.forgotPassword {
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
		
		/deep/ .u-input__input{
			font-size: 30rpx;
			font-weight: 500;
			color: #333;
		}
	}
</style>
