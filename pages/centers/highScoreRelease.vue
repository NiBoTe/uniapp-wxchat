<template>
	<view class="center">
		<view class="content">
			<view class="title u-flex u-row-center">
				<input v-model="title" type="text" placeholder="输入标题" maxlength="20" />
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
							<view class="cover u-flex u-row-center">封面</view>
							<view class="close" @click.stop="deleteTap(index)">
								<u-icon name="minus-circle-fill" :color="themeColor" size="44"></u-icon>
							</view>
							<view class="remark u-flex u-row-center">添加描述</view>
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

			<u-gap height="16" bg-color="#F7F7F7" margin-top="40"></u-gap>



			<view class="list">
				<view class="item u-flex u-row-between">
					<view class="left">商品价格</view>
					<view class="right u-flex">
						<input class="price" type="digit" placeholder="输入商品价格" maxlength="10"
							placeholder-style="font-size:26rpx;font-weight: 400;" />
						<text class="unit">元</text>
					</view>
				</view>

				<view class="item u-flex u-row-between" @click="selectTap">
					<view class="left">选择科目</view>
					<view class="right u-flex u-row-center">
						<input type="text" v-model="subjectName" disabled placeholder="科目/内容" />
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">允许查看高清图数量</view>
					<view class="right u-flex u-row-center">
						<input type="number" placeholder="请输入张数" maxlength="10" />
					</view>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">是否需要发货</view>
					<view class="right u-flex u-row-center">
						<u-switch v-model="checked" :active-color="themeColor" inactive-color="#E8E9EB"></u-switch>
					</view>
				</view>

				<view class="item u-flex u-row-between" v-if="checked">
					<view class="left">发货内容说明</view>
					<view class="right u-flex u-row-center">
						<input type="text" placeholder="请输入发货内容说明" />
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" :class="content === '' ? 'disabled' : ''" @click="submitTap">发布</view>
		</view>

		<!-- 添加描述 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="24" closeable>
			<view class="pop-content">
				<view class="pop-header">
					<image :src="list[selectIndex]"></image>
				</view>

				<view class="pop-textarea">
					<textarea placeholder="请输入作品描述…" maxlength="120"
						placeholder-style="font-size:24rpx;font-weight: 400;color: #B0B3BF;" />
					<view class="pop-textarea-length">{{remark.length}}/120</view>
				</view>
			</view>
			<view class="pop-footer">
				<view class="btn u-flex u-row-center">确认提交</view>
			</view>
		</u-popup>
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
				imgsList: [],
				checked: true,
				subjectName: '',
				subject: {},
				popShow: true,
				selectIndex: 0,
				remark: ''
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
						_this.handleUploadFile(res.tempFiles, 0);
					}
				});
			},
			// 上传头像
			handleUploadFile(list, i) {
				console.log(list)
				const _this = this;
				let filePath = list[i].tempFilePath;
				console.log(filePath)
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
			},
			selectTap() {
				uni.$on('selectAccount', (data) => {
					this.subjectName = `${data.subject.name}/${data.subjectType.name}`
					this.subject = data
				})
				uni.navigateTo({
					url: '/pages/centers/selectAccount'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		min-height: 100vh;
		background-color: #fff;

		.content {
			padding-bottom: 160rpx;
		}

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
			padding-bottom: 40rpx;

			.item {
				position: relative;
				text-align: center;
				width: 220rpx;
				height: 220rpx;

				image {
					width: 100%;
					height: 100%;
				}


				.cover {
					position: absolute;
					top: 6rpx;
					left: 6rpx;
					width: 70rpx;
					height: 36rpx;
					background: #FF334D;
					font-size: 26rpx;
					color: #FFF9F9;
				}

				.close {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}

				.remark {
					position: absolute;
					width: 100%;
					bottom: 0;
					height: 44rpx;
					background: rgba(33, 33, 33, 0.7);
					font-size: 24rpx;
					color: #FFFFFF;
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



	.list {
		.item {
			margin: 0 32rpx;
			padding: 38rpx 0;
			border-bottom: 2rpx solid #D8D8D8;

			&:last-of-type {
				border-bottom: none;
			}

			.left {
				font-size: 24rpx;
				font-weight: bold;
				color: #3A3D71;
			}

			.right {
				flex: 1;
				text-align: right;
				justify-content: flex-end;

				input,
				textarea {
					flex: 1;
					font-size: 26rpx;
					color: #3A3D71;
				}



				.price {
					font-size: 32rpx;
					font-weight: bold;
				}

				text {
					margin-left: 20rpx;
					font-size: 24rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				image {
					margin-left: 24rpx;
					width: 16rpx;
					height: 28rpx;
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

	.pop-content {
		padding: 0 32rpx 28rpx 36rpx;
		
		.pop-header {
			margin: 46rpx 0 28rpx 0;

			image {
				width: 116rpx;
				height: 116rpx;
			}
		}

		.pop-textarea {
			position: relative;
			height: 320rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			border: 2rpx solid #D8D8D8;
			padding: 16rpx 24rpx;

			textarea {
				font-size: 24rpx;
				color: #3A3D71;
			}
			
			
			&-length{
				position: absolute;
				right: 22rpx;
				bottom: 18rpx;
				font-size: 24rpx;
				font-weight: 300;
				color: #8F9091;
			}
		}

	}

	.pop-footer {
		padding: 14rpx 34rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;
		
		.btn{
			height: 88rpx;
			background: #EFF2FF;
			box-shadow: 0px 6rpx 14rpx 2px rgba(235, 235, 235, 0.14);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: $u-type-primary;
		}
	}
</style>
