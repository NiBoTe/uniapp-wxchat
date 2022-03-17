<template>
	<view class="container">
		<view class="form">

			<view class="form-item">
				<view class="ipt">
					<u-input type="text" v-model="form.realname" placeholder="姓名"
						maxlength="20" :clearable="clearable" />
				</view>
			</view>
			<view class="form-item">
				<view class="ipt">
					<u-input type="number" maxlength="11" :clearable="clearable" v-model="form.mobile"
						placeholder="请输入手机号" />
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
					<u-input type="number" :clearable="clearable" v-model="form.code" placeholder="请输入验证码"
						maxlength="6" />
				</view>
			</view>

			<view class="form-item">
				<view class="form-item-mark" @click.stop="selectTap"></view>
				<view class="ipt">
					<u-input type="text" v-model="form.provinceName" placeholder="请选择专业擅长省份，可多选" disabled />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>

			<view class="form-item">
				<view class="ipt">
					<u-input type="idcard" :clearable="clearable" v-model="form.idcard" placeholder="请输入身份证号码"
						maxlength="18" />
				</view>
			</view>
		</view>

		<view class="card" @click="updatePositiveTap">
			<view class="card-box" v-if="form.idcardPortrait === ''">
				<view class="card-img">
					<image :src="setSrc('my/positive.png')"></image>
				</view>
				<text>点击上传人像面</text>
			</view>
			<view class="card-upload" v-else>
				<image :src="form.idcardPortrait"></image>
			</view>
		</view>

		<view class="card" @click="updateBackTap">
			<view class="card-box" v-if="form.idcardNationalEmblem === ''">
				<view class="card-img">
					<image :src="setSrc('my/back.png')"></image>
				</view>
				<text>点击上传国徽面</text>
			</view>

			<view class="card-upload" v-else>
				<image :src="form.idcardNationalEmblem"></image>
			</view>
		</view>

		<view class="footer">
			<view class="u-flex">
				<button :disabled="btnLoading" :loading="btnLoading" type="primary" class="submit" @click="toSubmit">
					<text>提交</text>
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
		getMyInfo,
		getLatestTeacherAuth,
		submitTeacherAuthV2
	} from '@/api/userInfo.js'

	import {
		generatePostPolicy
	} from '@/api/basic.js'
	export default {
		data() {
			return {
				btnLoading: false,
				wxcode: null,
				form: {
					code: "",
					realname: "",
					idcard: "",
					idcardNationalEmblem: "",
					idcardPortrait: "",
					mobile: "",
					provinceName: ""
				},
				tips: '获取验证码',
				seconds: 60,
				clearable: false,
				hasLogin: false,
				userInfo: {},
			};
		},
		onShow() {
			this.hasLogin = this.$mStore.getters.hasLogin
			if (this.hasLogin) {
				this.initData()
			} else {
				uni.navigateTo({
					url: '/pages/public/logintype'
				})
			}
		},
		methods: {
			initData() {
				this.$http.post(getLatestTeacherAuth).then(res => {
					if (res.data) {
						let data = res.data;
						data.provinceName = data.provinceName.replace(/,/g, ' ')
						this.form = data;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			// 通用跳转
			navTo(route) {
				this.$mRouter.redirectTo({
					route
				});
			},
			// 注册
			toSubmit(e) {
				this.btnLoading = true;
				let params = JSON.parse(JSON.stringify(this.form));
				params.provinceName = params.provinceName.replace(/ /g, ',')
				this.$http.post(submitTeacherAuthV2, params).then(async r => {
					this.$mHelper.toast('提交成功');
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
				if (!this.$mHelper.checkMobile(this.form.mobile)) {
					this.$mHelper.toast('手机号码输入有误，请检查')
					return
				}
				if (this.$refs.uCode.canGetCode) {
					// 模拟向后端请求验证码
					uni.showLoading({
						title: '正在获取验证码'
					})
					this.$http.post(sendSmsCode, {
						mobile: this.form.mobile,
						type: 5
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
			// 上传身份证照片
			updatePositiveTap() {
				// 从相册选择图片
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_this.handleUploadFile(res.tempFilePaths[0], 'positive');
					}
				});
			},
			// 上传反面图片
			updateBackTap() {
				// 从相册选择图片
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_this.handleUploadFile(res.tempFilePaths[0], 'back');
					}
				});
			},
			// 上传
			handleUploadFile(filePath, type) {
				const _this = this;
				_this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(res => {
					let data = res.data;
					_this.$http
						.upload(data.host, {
							filePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(r => {
							switch (type) {
								case 'positive':
									_this.form.idcardPortrait = r
									break;
								case 'back':
									_this.form.idcardNationalEmblem = r
									break;
							}
						});
				}).catch(err => {
					console.log(err)
				})
			},
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.post(getMyInfo)
					.then(async r => {
						let user = r.data.user;
						this.userInfo = r.data.user;
						this.$mStore.commit('login', this.userInfo);
						this.$mRouter.back();
					});
			},
			selectTap() {
				let data = []
				uni.$on('select', (list) => {
					console.log(list)
					list.map(item => {
						data.push(item.name)
					})
					this.form.provinceName = data.join(' ')
				})

				uni.navigateTo({
					url: `/pages/set/selectProvince?names=${this.form.provinceName}`
				})
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {

		min-height: 100vh;
		background-color: #F3F3F3;
		padding: 0 34rpx 160rpx;

		.form {
			padding-top: 26rpx;

			&-item {
				position: relative;
				margin-bottom: 28rpx;
				padding: 0 30rpx;
				height: 112rpx;
				background: #FFFFFF;
				border-radius: 24rpx;
				font-size: 26rpx;
				color: #1B1B1B;
				display: flex;
				align-items: center;


				&-mark {
					position: absolute;
					top: 0;
					left: 0;
					right: 0;
					bottom: 0;
					z-index: 999999;
				}

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


				.right {
					image {
						width: 12rpx;
						height: 22rpx;
					}
				}
			}
		}



		.card {
			height: 380rpx;
			box-sizing: border-box;
			position: relative;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 28rpx;
			padding: 36rpx 0 42rpx 0;
			background: #FFFFFF;
			border-radius: 16rpx;

			&-box {
				.card-img {
					image {
						width: 438rpx;
						height: 260rpx;
					}
				}
			}

			text {
				display: inline-block;
				font-size: 24rpx;
				color: #B0B3BF;
			}


			&-upload {
				position: absolute;
				top: 0;
				left: 0;
				right: 0;
				bottom: 0;
				border-radius: 16rpx;
				overflow: hidden;

				image {
					width: 100%;
					height: 100%;
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
