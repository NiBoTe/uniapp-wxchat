<template>
	<view class="center">
		<view class="title u-flex u-row-center">
			<input v-model="title" type="text" placeholder="输入标题" maxlength="25" />
		</view>
		<view class="header">
			<textarea v-model="content" placeholder="输入详情内容…" maxlength="200" />
			<view class="header-length">{{content.length}}/200</view>
		</view>

		<view class="upload">
			<u-row gutter="12">
				<u-col span="4" v-for="(item, index) in imgsList" :key="index">
					<view class="item" @click="prevTap(index)">
						<image :src="item"></image>
						<view class="close" @click.stop="deleteTap(index)">
							<u-icon name="minus-circle-fill" :color="themeColor" size="28"></u-icon>
						</view>
					</view>
				</u-col>
				<u-col span="4">
					<view class="add u-flex u-row-center" @click="addTap()">
						<u-icon name="plus" color="#9E9E9E" size="80"></u-icon>
						<view class="add-tips" v-show="!imgsList.length">仅支持.JPG、MP4格式</view>
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
		snsSave
	} from '@/api/sns.js'
	export default {
		data() {
			return {
				title: '',
				content: '',
				themeColor: this.$mConstDataConfig.themeColor,
				imgsList: []
			};
		},
		methods: {
			addTap() {
				// 从相册选择图片
				const _this = this;
				uni.chooseMedia({
					count: 9,
					mediaType: ['image', 'video'],
					sourceType: ['album', 'camera'],
					sizeType: ['original', 'compressed'],
					maxDuration: 60,
					success: function(res) {
						
						console.log(res)
						_this.handleUploadFile(res.tempFilePaths, 0);
					}
				});
			},
			// 上传头像
			handleUploadFile(list, i) {
				console.log(list)
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
							_this.imgsList.push(r);
							if (list.length - 1 > i) {
								_this.handleUploadFile(list, i + 1);
							}
						});
				}).catch(err => {
					console.log(err)
				})
			},
			// 删除
			deleteTap(index) {
				this.imgsList.slice(index, 1);
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
				this.imgsList.map(item => imgs.push({
					hdImg: item
				}));
				this.$http.post(snsSave, {
					content: this.content,
					noComment: this.checked,
					snsImgs: imgs
				}).then(res => {
					this.$mHelper.toast('发布成功')
					setTimeout(() => {
						uni.switchTab({
							url: '/pages/circle/index'
						})
					}, 1500)
				}).catch(err => {
					this.$mHelper.toast(err.msg);
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		min-height: 100vh;
		background-color: #fff;

		.title {
			margin: 0 32rpx;
			padding: 24rpx 0;
			border-bottom: 2rpx solid #D8D8D8;

			input {
				flex: 1;
				font-size: 26rpx;
				color: #3A3D71;
			}
		}

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
			}
		}

		.upload {
			margin: 38rpx 34rpx;

			.item {
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
					font-size: 20rpx;
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
		padding: 14rpx 34rpx;
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
