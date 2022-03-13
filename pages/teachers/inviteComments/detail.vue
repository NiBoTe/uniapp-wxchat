<template>
	<view class="inviteComments">
		<view class="header u-flex u-row-between">
			<u-avatar size="186" :src="detail.headUrl" mode="circle"></u-avatar>
			<view class="header-right">
				<view class="title">{{detail.fullName || ''}}</view>
				<view class="subtitle">已评：{{detail.paintEvaluateCount || 0}}副画</view>
			</view>
		</view>

		<view class="list">
			<view class="item u-flex">
				<view class="left">
					<view class="title">
						<text>{{activeItem.skilledMajorName}}</text>
						<text class="price">{{activeItem.paintEvaluate.price}}元/张</text>
					</view>
					<view class="subtitle">{{activeItem.paintEvaluate.description}}</view>
				</view>
			</view>

			<u-gap height="16" bg-color="#F7F7F7"></u-gap>


		</view>

		<view class="textarea">
			<textarea v-model="content" placeholder="请输入作品描述或希望获得哪方面的指导……" maxlength="120" />
			<view class="textarea-length" :class="content.length ? 'active' : ''">{{content.length}}/120</view>
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
					</view>
				</u-col>
			</u-row>
		</view>

		<view class="checkbox">
			<u-checkbox-group>
				<u-checkbox v-model="checked" size="28" icon-size="20" shape="circle"><text>我已阅读并同意 </text><text
						class="agreement">《付费内容使用协议》</text>
				</u-checkbox>
			</u-checkbox-group>
		</view>

		<view class="footer">
			<view class="footer-btn" :class="!checked ? 'disabled' : ''" @click="submitTap">提交</view>
		</view>

	</view>
</template>

<script>
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	import {
		orderLaunch,
	} from '@/api/order.js';
	import {
		teacherPaintEvaluateInfo
	} from '@/api/teacher.js'
	export default {
		data() {
			return {
				checked: true,
				teacherId: null,
				detail: {},
				list: [],
				activeIndex: 0,
				activeItem: {},
				imgsList: [],
				content: ''
			};
		},
		onLoad(options) {
			if (options.teacherId) {
				this.teacherId = options.teacherId;
				this.activeIndex = options.index;
				this.initData()
			}
		},
		methods: {
			initData() {
				this.$http.get(teacherPaintEvaluateInfo, {
					teacherId: this.teacherId
				}).then(res => {
					console.log(res)
					this.detail = res.data;
					this.list = res.data.paintEvaluateList || []
					this.activeItem = this.list[this.activeIndex]
					uni.setNavigationBarTitle({
						title: this.activeItem.skilledMajorName
					});
				}).catch(err => {
					console.log(err)
				})
			},
			addTap() {
				
				if(this.imgsList.length >= 9){
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
							_this.imgsList.push(r)
							console.log(list.length)
							console.log(i)
							if (list.length - 1 > i) {
								console.log('=========')
								
								
								if(_this.imgsList.length < 9) {
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
			// 去支付
			async submitTap() {
				if (!this.checked) {
					return this.$mHelper.toast('请先勾选阅读付费内容使用协议')
				}
				let params = {
					extraParams: JSON.stringify(this.imgsList),
					productId: this.activeItem.paintEvaluate.id,
					productType: 2,
					remark: this.content,
					total: this.imgsList.length
				}
				
				
				this.createOrder(params)
				
			},
			async createOrder(params) {
				this.$http.post(orderLaunch,
					params).then(res => {
						
					const data = res.data;
					let obj = {
						amount: data.amount,
						productName: data.productName,
						total: data.total,
						orderId: data.id,
						fullName: this.detail.fullName 
					}
					console.log(obj)
					uni.navigateTo({
						url: `/pages/teachers/inviteComments/comfirmOrder?params=${JSON.stringify(obj)}`
					})
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					uni.hideLoading()
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.inviteComments {
		.header {
			border-top: 2rpx solid #EDEDED;
			border-bottom: 2rpx solid #EDEDED;

			padding: 12rpx 42rpx;

			&-right {
				flex: 1;
				margin-left: 28rpx;

				.title {
					font-size: 40rpx;
					font-weight: 600;
					color: #1B1B1B;
				}

				.subtitle {
					margin-top: 22rpx;
					font-size: 26rpx;
					color: #3A3D71;
				}
			}
		}

		.list {

			.item {
				padding: 32rpx 30rpx 28rpx 34rpx;
				border-bottom: 2rpx solid #E9E9E9;

				&:last-of-type {
					border-bottom: none;
				}

				.left {
					flex: 1;
					margin-right: 38rpx;

					.title {
						text {
							font-size: 30rpx;
							font-weight: bold;
							color: #3A3D71;

							&.price {
								margin-left: 22rpx;
								font-size: 28rpx;
								font-weight: 300;
								color: #2C3AFF;
							}
						}
					}

					.subtitle {
						margin-top: 14rpx;
						font-size: 26rpx;
						color: #3A3D71;
						line-height: 36rpx;
					}
				}

				.right {
					image {
						width: 28rpx;
						height: 52rpx;
					}
				}
			}


		}

		.textarea {
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
				text-align: right;

				&.active {
					color: #1B1B1B;
				}
			}
		}


		.upload {
			margin: 40rpx 34rpx 0;

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
			}
		}



		.checkbox {
			padding: 28rpx 34rpx;

			text {
				font-size: 24rpx;
				color: #1B1B1B;

				&.agreement {
					font-size: 24rpx;
					color: #2C3AFF;
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

	}
</style>
