<template>
	<view class="top">

		<view class="handle u-flex" v-if="!isEnter">
			<view class="scan u-flex u-row-center" @click="scanCodeTap">扫码识别学生信息</view>
			<view class="scan u-flex u-row-center" @click="testRecordTap">上传记录</view>
		</view>

		<view class="search u-flex" v-if="!isEnter">
			<view class="label">准考证号</view>
			<view class="input u-flex">
				<input type="text" v-model="code" placeholder="请输入准考证号..." />
			</view>
			<view class="btn u-flex u-row-center" @click="searchTap">搜索</view>
		</view>

		<view class="draw" v-if="!isEnter">
			<drawingColumn v-if="examDetail.examSubjectList" ref="DrawingColumn" :list="examDetail.examSubjectList"
				key-name="subjectName" @change="tabChange"></drawingColumn>
		</view>

		<view class="table">
			<view class="tr t-head">
				<view class="td">姓名</view>
				<view class="td">科目</view>
				<view class="td">准考证号</view>
			</view>
			<view class="tr">
				<view class="td">{{studentDetail.name || ''}}</view>
				<view class="td">{{studentDetail.course || ''}}</view>
				<view class="td">{{studentDetail.admissionTicketCode || ''}}</view>
			</view>

			<view class="tr t-footer">
				<view class="td">{{studentDetail.examName || ''}}</view>
			</view>
		</view>


		<!-- 拍摄要求 -->
		<view class="tips" v-if="isEnter">
			<view class="title">
				<image src="/static/public/camera_fill.png"></image>
				<text>拍摄要求</text>
			</view>
			<view class="tips-item">一、避免曝光；</view>
			<view class="tips-item">二、让画面剧中于正中间，不要有左右偏转会影响最终的评画效 果、拍摄清晰不能使画面模糊不清；</view>
			<view class="tips-item">三、如有画面不居中可使用矫正功能把画面矫正；</view>
		</view>

		<u-gap v-if="isEnter" height="16" bg-color="#F7F7F7"></u-gap>
		<!-- 示例图 -->
		<view class="examples" v-if="isEnter">
			<view class="title">
				<image src="/static/public/image_icon.png"></image>
				<text>示例图</text>
			</view>

			<view class="examples-content">
				<image v-if="tempFilePath === ''"
					src="https://img0.baidu.com/it/u=1721391133,702358773&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=625" mode="widthFix">
				</image>
				<image v-else :src="tempFilePath" mode="widthFix" @click.stop="prevViewTap"></image>

				<view class="badge u-flex u-row-center" v-if="tempFilePath !== ''" @click.stop="prevViewTap">
					<image src="/static/public/search_white.png"></image>
				</view>
			</view>
		</view>

		<view v-if="!isEnter && Object.keys(this.studentDetail).length" class="submit u-flex u-row-center"
			@click="enterTap">确认</view>
		<view class="footer u-flex" v-if="isEnter && uploadState === 'not_uploaded'">
			<view class="footer-btn" @click="submitTap">{{tempFilePath === '' ? '拍摄试卷' : '重新拍摄'}}</view>
			<view class="footer-btn" style="margin-left: 30rpx;" v-if="tempFilePath !== ''" @click="uploadTap">上传试卷
			</view>
		</view>
		<top-tips ref="TopTips" @enterClick="enterClick"></top-tips>

	</view>
</template>

<script>
	import TopTips from './components/top-upload-tips.vue'
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import {
		examDetail,
		searchByAdmissionTicketCode,
		examPaperUpload
	} from '@/api/exam.js'

	import {
		generatePostPolicy
	} from '@/api/basic.js'
	export default {
		components: {
			drawingColumn,
			TopTips
		},
		data() {
			return {
				id: null,
				examDetail: {},
				drawList: [],
				type: 0,
				examSubjectItem: {},
				code: '',
				studentDetail: {},
				isEnter: false,
				tempFilePath: '',
				uploadState: 'not_uploaded'
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.type = options.type;
				if (options.code) this.code = options.code;
				if (options.uploadState) this.uploadState = options.uploadState;
				this.initData()
			}

		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					this.examDetail = res.data
					this.examSubjectItem = this.examDetail.examSubjectList[0]
					if (this.code !== '') {
						this.searchTap();
					}
				}).catch(err => {
					console.log(err)
				})
			},
			tabChange(e) {
				this.examSubjectItem = e.item;
			},
			// 搜索
			searchTap() {
				this.$http.post(searchByAdmissionTicketCode, {
					admissionTicketCode: this.code,
					course: this.examSubjectItem.subjectName
				}).then(res => {

					this.studentDetail = res.data ? res.data[0] : {},
						this.id = this.studentDetail.examId
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},

			// 确认
			enterTap() {
				if (Object.keys(this.studentDetail).length) {
					this.isEnter = true;
				}
			},
			// 扫码
			scanCodeTap() {
				const _this = this
				uni.scanCode({
					success: function(res) {
						let result = res.result;
						if (result.indexOf("#") !== -1) {
							let arr = result.split("#");
							_this.$set(_this.examSubjectItem, 'subjectName', arr[0])
							_this.code = arr[1]
						} else {
							_this.code = result
						}

						_this.searchTap();
					}
				});
			},
			// 拍摄试卷
			submitTap() {

				const _this = this
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册选择
					success: function(res) {
						_this.tempFilePath = res.tempFilePaths[0]
					}
				});
			},
			// 上传试卷
			uploadTap() {
				const checked = uni.getStorageSync('uploadChecked')
				if (checked) {
					this.enterClick()
				} else {
					this.$refs.TopTips.open();
				}
			},
			// 上传记录
			testRecordTap() {
				uni.navigateTo({
					url: `/pages/public/top/takeRecord?id=${this.id}&type=${this.type}`
				})
			},
			enterClick() {
				const _this = this
				_this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(res => {
					console.log(res)
					let data = res.data;
					_this.$http
						.upload(data.host, {
							filePath: _this.tempFilePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(r => {
							_this.testUpload(r)
						});
				}).catch(err => {
					console.log(err)
				})
			},
			testUpload(url) {
				this.$http.post(examPaperUpload, {
					admissionTicketCode: this.code,
					course: this.examSubjectItem.subjectName ? this.examSubjectItem.subjectName : this
						.studentDetail.course,
					examId: this.id,
					img: url
				}).then(res => {
					this.$mRouter.back()
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 预览图片
			prevViewTap() {
				uni.previewImage({
					urls: [this.tempFilePath],
					current: 0
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		min-height: 100vh;
		background-color: #fff;

		.handle {
			margin: 30rpx 40rpx;

			.scan {
				flex: 1;
				height: 88rpx;
				background: rgba(32, 75, 214, 0.08);
				border-radius: 44rpx;
				font-size: 24rpx;
				font-weight: 600;
				color: #2C3AFF;

				&:first-of-type {
					margin-right: 24rpx;
				}
			}
		}


		.search {
			margin: 0 40rpx;

			.label {
				font-size: 26rpx;
				font-weight: 500;
				color: #3A3D71;
			}

			.input {
				flex: 1;
				margin: 0 26rpx 0 20rpx;
				padding: 0 22rpx;
				height: 60rpx;
				background: #F3F3F3;
				border-radius: 30rpx;

				input {
					font-size: 26rpx;
					color: #3A3D71;
				}
			}

			.btn {
				width: 120rpx;
				height: 60rpx;
				background: $u-type-primary;
				border-radius: 30rpx;
				font-size: 24rpx;
				color: #FFFFFF;
			}

		}

		.draw {
			margin-top: 32rpx;
		}

		.table {
			margin: 30rpx 40rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 16rpx;
			overflow: hidden;

			.tr {
				display: flex;
				align-items: center;
				border-bottom: 2rpx solid #E9E9E9;

				.td {
					height: 64rpx;
					flex: 1;
					display: flex;
					justify-content: center;
					align-items: center;
					font-size: 26rpx;
					color: #3A3D71;
					border-right: 2rpx solid #E9E9E9;

					&:last-of-type {
						border-right: none;
					}
				}

				&:last-of-type {
					border-bottom: none;
				}

				&.t-head {
					background: #8EA7F7;
					border-radius: 16rpx 16rpx 0px 0px;

					.td {
						height: 60rpx;
						color: #fff;
						border-right: 2rpx solid #8EA7F7;
					}
				}

				&.t-footer {
					display: flex;
					justify-content: center;

					.td {
						font-size: 24rpx;
						color: #333333;
					}
				}
			}
		}

		.title {
			display: flex;
			align-items: center;

			image {
				width: 38rpx;
				height: 34rpx;
			}

			text {
				margin-left: 12rpx;
				font-size: 24rpx;
				font-weight: bold;
				color: #3A3D71;
			}
		}

		// 拍摄要求
		.tips {
			padding: 0 40rpx 0 34rpx;

			&-item {
				margin-top: 20rpx;
				font-size: 24rpx;
				color: #3A3D71;
			}
		}

		// 示例图
		.examples {
			margin-top: 26rpx;
			padding: 0 40rpx 0 34rpx;

			.title {
				image {
					width: 34rpx;
					height: 34rpx;
				}
			}

			&-content {
				position: relative;
				margin-top: 28rpx;
				border-radius: 16rpx;
				border: 2rpx solid #EDEFF2;
				text-align: center;
				
				& > image{
					width: 100%;
				}
				.badge {
					position: absolute;
					right: 0;
					top: 0;
					width: 80rpx;
					height: 80rpx;
					border-bottom-left-radius: 56rpx;
					background: rgba($color: #000000, $alpha: .5);

					image {
						width: 34rpx;
						height: 34rpx;
					}
				}
			}
		}


		.submit {
			margin: 50rpx auto;
			width: 410rpx;
			height: 88rpx;
			background: $u-type-primary;
			box-shadow: 0px 8rpx 18rpx 2rpx rgba(39, 90, 75, 0.13);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: #FFFFFF;
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #fff;

			&-btn {
				flex: 1;
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
