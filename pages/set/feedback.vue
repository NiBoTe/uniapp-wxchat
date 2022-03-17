<template>
	<view class="feedback">
		<view class="header">
			<textarea v-model="content" placeholder="请输入意见反馈…" maxlength="120" />
			<view class="header-length" :class="content.length ? 'active' : ''">{{content.length}}/120</view>
		</view>

		<view class="subheader u-flex u-row-between">
			<view class="left">请上传图片</view>
		</view>

		<view class="upload">
			<u-row gutter="12">
				<u-col span="4" v-for="(item, index) in imgsList" :key="index">
					<view class="item" @click="prevTap(index)">
						<image :src="item"></image>
						<view class="close" @click.stop="deleteTap(index)">
							<u-icon name="minus-circle-fill" :color="themeColor" size="44"></u-icon>
						</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="add u-flex u-row-center" @click="addTap()">
						<u-icon name="plus" color="#9E9E9E" size="80"></u-icon>
						<view class="add-tips" v-show="!imgsList.length">仅支持.jpg格式</view>
					</view>
				</u-col>
			</u-row>
		</view>

		<view class="footer">
			<view class="footer-btn" :class="content === '' ? 'disabled' : ''" @click="submitTap">发布</view>
		</view>
	</view>
</template>

<script>
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	import {
		submitV2
	} from '@/api/basic'
	export default {
		data() {
			return {
				content: '',
				themeColor: this.$mConstDataConfig.themeColor,
				imgsList: []
			};
		},
		methods: {
			addTap() {

				if (this.imgsList.length >= 9) {
					return this.$mHelper.toast('最多只能上传9张')
				}
				// 从相册选择图片
				const _this = this;
				uni.chooseImage({
					count: 9,
					sizeType: ['original', 'compressed'],
					sourceType: ['album'],
					success: function(res) {
						_this.handleUploadFile(res.tempFilePaths, 0);
					}
				});
			},
			// 上传头像
			handleUploadFile(list, i) {
				const _this = this;
				let filePath = list[i];
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
							_this.imgsList.push(r)
							if (list.length - 1 > i) {
								if (_this.imgsList.length < 9) {
									_this.handleUploadFile(list, i + 1);
								} else {
									return _this.$mHelper.toast('最多只能上传9张图片')
								}

							}
						});
				}).catch(err => {
					console.log(err)
				})
			},
			// 删除
			deleteTap(index) {
				this.imgsList.splice(index, 1);
			},
			// 预览
			prevTap(current) {
				uni.previewImage({
					current,
					urls: this.imgsList
				})
			},
			// 提交
			submitTap() {
				if (this.content === '') {
					return this.$mHelper.toast('请输入此刻你的想法')
				}
				let imgs = []
				this.imgsList.map(item => imgs.push(item));
				this.$http.post(submitV2, {
					content: this.content,
					imgs
				}).then(res => {
					this.$mHelper.toast('反馈成功')
					setTimeout(() => {
						this.$mRouter.back();
					}, 1500)
				}).catch(err => {
					this.$mHelper.toast(err.msg);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.feedback {
		min-height: 100vh;
		background-color: #fff;
		padding-bottom: 200rpx;

		.header {
			height: 240rpx;
			margin: 48rpx 34rpx 0;
			position: relative;
			border-bottom: 2rpx solid #E9E9E9;

			textarea {
				height: 160rpx;
				font-size: 26rpx;
				color: #3A3D71;
			}

			&-length {
				position: absolute;
				bottom: 24rpx;
				right: 0;
				font-size: 28rpx;
				font-weight: 300;
				color: #8F9091;

				&.active {
					color: #1B1B1B;
				}
			}
		}

		.subheader {
			margin: 40rpx 32rpx;

			.left {
				font-size: 24rpx;
				font-weight: bold;
				color: #3A3D71;
			}
		}

		.upload {
			margin: 0 32rpx;

			.item {
				margin-bottom: 24rpx;
				position: relative;
				text-align: center;
				width: 220rpx;
				height: 220rpx;

				image {
					width: 100%;
					height: 100%;
				}

				.close {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}
			}

			.add {
				position: relative;
				background: #F3F3F3;
				width: 220rpx;
				height: 220rpx;

				&-tips {
					position: absolute;
					bottom: -40rpx;
					font-size: 24rpx;
					color: #B0B3BF;
				}
			}
		}
	}


	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
		padding: 14rpx 32rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;

		&-btn {
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: $u-type-primary;
			box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: #fff;

			&.disabled {
				background: #EDEFF2;
				color: #8F9091;
			}
		}
	}
</style>
