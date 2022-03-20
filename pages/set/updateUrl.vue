<template>
	<view class="container u-flex">
		<view class="content">
			<image :src="userInfo.bgUrl" mode="widthFix"></image>
		</view>

		<view class="footer u-flex u-row-center">
			<view class="footer-btn" @click="updateBgTap">更换背景</view>
		</view>
	</view>
</template>

<script>
	import {
		getMyInfo,
		updateBgUrl
	} from '@/api/userInfo.js'
	import {
		generatePostPolicy
	} from '@/api/basic.js'

	export default {
		data() {
			return {
				userInfo: {},
			};
		},
		onLoad() {
			this.getMemberInfo();
		},
		methods: {
			// 获取用户信息
			async getMemberInfo() {
				await this.$http
					.post(getMyInfo)
					.then(async r => {
						let data = r.data;
						this.userInfo = data.user;
						this.$mStore.commit('login', data.user);
					})
					.catch((err) => {
						this.userInfo = {};
					});
			},
			// 更换背景图
			updateBgTap() {
				// 从相册选择图片
				const _this = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_this.handleUploadFile(res.tempFilePaths[0]);
					}
				});
			},
			// 上传头像
			handleUploadFile(filePath) {
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
							console.log(r)
							uni.$emit('updateUrl', true)
							_this.setUpdateBgUrl(r)
						});
				}).catch(err => {
					console.log(err)
				})
			},

			setUpdateBgUrl(bgUrl) {
				this.$http.post(updateBgUrl, {
					bgUrl
				}).then(res => {
					this.getMemberInfo()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {

		height: 100vh;
		background: #000102;


		.content {
			image {
				width: 100vw;
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 14rpx 34rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		z-index: 9999;
		text-align: center;

		&-btn {
			width: 360rpx;
			height: 84rpx;
			line-height: 84rpx;
			background: #34343A;
			border-radius: 16rpx;
			text-align: center;
			font-size: 28rpx;
			font-weight: 500;
			color: #FFFFFF;
		}
	}
</style>
