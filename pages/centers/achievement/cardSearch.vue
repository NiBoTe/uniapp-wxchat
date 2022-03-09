<template>
	<view class="search">
		<view class="navbar">
			<u-navbar title="查询" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<view class="content-header u-flex u-row-between">
				<view class="label">
					<text class="required">*</text>
					<text>考试名称</text>
				</view>
				<view class="right">{{detail.name}}</view>
			</view>


			<view>
				<view class="label">
					<text>机构名称</text>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<input type="text" v-model="studioName" placeholder="请输入机构名称" />
					</view>
				</view>
			</view>

			<!-- <view>
				<view class="label">
					<text>考场</text>
				</view>
			
				<view class="item u-flex u-row-between">
					<view class="left">
						<input type="text" v-model="admissionTicketCode" placeholder="请输入考场" />
					</view>
				</view>
			</view> -->

			<view>
				<view class="label">
					<text>准考证号</text>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<input type="text" v-model="admissionTicketCode" placeholder="请输入准考证号" />
					</view>
				</view>
			</view>

			<view>
				<view class="label">
					<!-- <text class="required">*</text> -->
					<text>学生姓名</text>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<input type="text" v-model="name" placeholder="请输入学生姓名" />
					</view>
				</view>
			</view>


			<view>
				<view class="label">
					<text>身份证号</text>
				</view>

				<view class="item u-flex u-row-between">
					<view class="left">
						<input type="text" v-model="identification" placeholder="请输入身份证号" />
					</view>
				</view>
			</view>


			<view class="address u-flex u-row-between" v-if="url !== ''">
				<view class="left ">
					<text v-if="type === 1">准考证查询地址：</text>
					<text v-else-if="type === 2">二维码下载地址：</text>
					<text v-else-if="type === 3">考场下载地址：</text>
					<text class="url">{{url}}</text>
				</view>

				<view class="right u-flex u-row-center" @click="copyTap">复制</view>
			</view>
		</view>

		<view class="footer">
			<view class="tips u-flex u-row-center" v-if="url !== ''">
				<image :src="setSrc('myApplication/error.png')"></image>
				<text>请复制此链接到电脑端进行{{type === 1 ? '准考证' : type === 2 ? '二维码' : type === 3 ? '考场' : ''}}下载</text>
			</view>
			<view class="footer-btn" @click="submitTap">查询</view>
		</view>
	</view>
</template>

<script>
	import {
		examDetail,
		batchExportTicket,
		batchExportQrcode,
		batchExportExaminationRoomInfo
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				id: null,
				loading: true,
				detail: {},
				admissionTicketCode: '',
				identification: '',
				name: '',
				studioName: '',
				status: 'single',
				url: '',
				type: 1,

			};
		},

		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.type = Number(options.type)
				this.initData()
			}
		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					this.detail = res.data;
					this.loading = false;
				}).catch(err => {
					console.log(err)
				})
			},

			submitTap() {
				if (this.identification !== '') {
					if (!this.$mHelper.checkIdCard(this.identification)) {
						return this.$mHelper.toast('请输入正确的身份证号码')
					}
				}

				let params = {
					admissionTicketCode: this.admissionTicketCode,
					identification: this.identification,
					name: this.name,
					studioName: this.studioName,
					examId: this.id
				}



				switch (this.type) {
					case 1:
						this.$http.post(batchExportTicket, params).then(res => {
							this.status = res.data.type
							if (this.status === 'single') {
								this.url = '';
								uni.navigateTo({
									url: `/pages/centers/achievement/cardInfo?id=${this.id}&item=${JSON.stringify(params)}&type=${this.type}`
								})
							} else {
								this.url = res.data.result[0];
							}
						}).catch(err => {
							this.$mHelper.toast(err.msg)
						})
						break;
					case 2:
						this.$http.post(batchExportQrcode, params).then(res => {
							this.status = res.data.type
							if (this.status === 'single') {
								this.url = '';
								uni.navigateTo({
									url: `/pages/centers/achievement/cardInfo?id=${this.id}&item=${JSON.stringify(params)}&type=${this.type}`
								})
								// uni.navigateTo({
								// 	url: `/pages/centers/achievement/codeList?id=${this.id}&item=${JSON.stringify(params)}`
								// })
							} else {
								this.url = res.data.result[0];
							}
						}).catch(err => {
							this.$mHelper.toast(err.msg)
						})
						break;

					case 3:
						this.$http.post(batchExportExaminationRoomInfo, params).then(res => {
							this.status = res.data.type
							if (this.status === 'single') {
								this.url = '';
								uni.navigateTo({
									url: `/pages/centers/achievement/cardInfo?id=${this.id}&item=${JSON.stringify(params)}&type=${this.type}`
								})
							} else {
								this.url = res.data.result[0];
							}
						}).catch(err => {
							this.$mHelper.toast(err.msg)
						})
						break;

				}
			},
			copyTap() {
				uni.setClipboardData({
					data: this.url, //要被复制的内容
					success: () => { //复制成功的回调函数
						this.$mHelper.toast('复制成功')
					}
				});
			}
		}
	}
</script>

<style lang="scss" scoped>
	.search {
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

		.content {
			padding: 0 34rpx 200rpx;

			&-header {
				.right {
					font-size: 26rpx;
					color: #3A3D71;
				}

				border-bottom: 2rpx solid #E9E9E9;
			}

			.label {
				padding: 40rpx 0 26rpx;

				text {
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;

					&.required {
						color: #FF334D;
					}
				}
			}

			.item {
				padding: 0 28rpx;
				height: 88rpx;
				background: #F3F3F3;
				border-radius: 24rpx;

				.left {
					input {
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.right {
					image {
						width: 12rpx;
						height: 22rpx;
					}
				}
			}

			.address {

				align-items: baseline;
				margin-top: 40rpx;

				.left {
					flex: 1;
					width: 0;

					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.url {
							word-break: break-all;
							color: $u-type-primary;
						}
					}
				}

				.right {
					margin-left: 46rpx;
					width: 76rpx;
					height: 38rpx;
					background: #EFF2FF;
					box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
					border-radius: 26rpx;
					font-size: 22rpx;
					color: #2C3AFF;
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
			background-color: #fff;

			.tips {
				margin-bottom: 36rpx;

				image {
					width: 32rpx;
					height: 32rpx;
				}

				text {
					margin-left: 14rpx;
					font-size: 26rpx;
					color: #9E9E9E;
				}
			}

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
