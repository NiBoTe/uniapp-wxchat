<template>
	<view class="cardInfo">
		<view class="navbar">
			<u-navbar :title="title" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>


		<view class="content" v-if="!isNodata">
			<image v-for="(item,index) in urlList" :key="index" :src="item" v-if="item !== ''" mode="widthFix"></image>
			
			<view class="table" v-if="type === 3">
				<view class="tr t-head">
					<view class="td">{{addressDetail.examName || ''}}</view>
				</view>
			
				<view class="tr">
					<view class="td">准考证号</view>
					<view class="td">{{addressDetail.admissionTicketCode || ''}}</view>
				</view>
				<view class="tr">
					<view class="td">姓名</view>
					<view class="td">{{addressDetail.name || ''}}</view>
				</view>
				<view class="tr">
					<view class="td">考场编号</view>
					<view class="td">{{addressDetail.examinationRoomCode || ''}}</view>
				</view>
				<view class="tr">
					<view class="td">座位号</view>
					<view class="td">{{addressDetail.examinationRoomSeat || ''}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 228rpx;flex: none;">机构名称</view>
					<view class="td">{{addressDetail.studioName || ''}}</view>
				</view>
				<view class="tr">
					<view class="td" style="width: 228rpx;flex: none;">考试地址</view>
					<view class="td">{{addressDetail.address || ''}}</view>
				</view>
			</view>
			
		</view>

		<view class="nodata" v-else>
			<image :src="setSrc('myApplication/nodataCard.png')"></image>
			<text v-if="type === 1">暂无该考生准考证信息</text>
			<text v-else-if="type === 2">暂无该考生二维码信息</text>
		</view>


		<view class="footer" v-if="!isNodata && type !== 3">
			<view class="footer-btn" @click="submitTap">
				<text v-if="type === 1">保存准考证</text>
				<text v-else-if="type === 2">保存二维码</text>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		batchExportTicket,
		batchExportQrcode,
		batchExportExaminationRoomInfo
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				id: null,
				isNodata: false,
				urlList: [],
				status: 'single',
				item: null,
				type: 1,
				title: '准考证信息',
				addressDetail: {}
			};
		},

		onLoad(options) {
			if (options.id) {
				this.id = options.id
				this.type = Number(options.type);

				switch (this.type) {
					case 1:
						this.title = '准考证信息';
						break
					case 2:
						this.title = '二维码信息';
						break
					case 3:
						this.title = '考场信息';
						break
				}
				this.item = JSON.parse(options.item)
				this.initData()
			}
		},
		methods: {
			initData() {

				this.$http.post(this.type === 1 ? batchExportTicket : this.type === 2 ? batchExportQrcode : this.type ===
					3 ? batchExportExaminationRoomInfo : '', {
						examId: this.id,
						name: this.item.name,
						admissionTicketCode: this.item.admissionTicketCode,
						identification: this.item.identification,
					}).then(res => {
					console.log(res)

					if(this.type !== 3) {
						this.urlList = res.data.result;
						this.status = res.data.type;
						this.isNodata = false;
					} else {
						this.addressDetail = res.data.data
					}
				}).catch(err => {
					console.log(err)
					this.isNodata = true;
					this.$mHelper.toast(err.msg)
				})
			},
			submitTap() {
				this.saveImage(0)
			},
			saveImage(i){
				let _this = this;
				uni.downloadFile({
					url: this.urlList[i], //图片地址
					success: (res) => {
						if (res.statusCode === 200) {
							uni.saveImageToPhotosAlbum({
								filePath: res.tempFilePath,
								success: function() {
									if(_this.urlList.length - 1 === i) {
										_this.$mHelper.toast('保存成功')
									} else {
										_this.saveImage(i + 1)
									}
									
								},
								fail: function(err) {
									if(err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny" || err.errMsg === "saveImageToPhotosAlbum:fail authorize no response"){
										_this.$mHelper.getAuth()
									} else {
										_this.$mHelper.toast('保存失败')
									}
								}
							});
						}
					}
				})
			}
			
		}
	}
</script>

<style lang="scss" scoped>
	.cardInfo {
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}



		.content {
			padding-bottom: 160rpx;

			image {
				width: 100%;
			}
			
			
			.table {
				margin: 28rpx 34rpx;
				background: #FFFFFF;
				box-shadow: 0px 6rpx 16rpx 6px rgba(230, 230, 230, 0.5);
				border: 2rpx solid #E9E9E9;
			
				.tr {
					display: flex;
					align-items: center;
			
					border-bottom: 2rpx solid #E9E9E9;
			
					&:last-of-type {
						border-bottom: none;
					}
			
					&.t-head {
						display: flex;
						justify-content: center;
						padding: 24rpx 0 18rpx;
			
						.td {
							padding: 12rpx 0 16rpx;
							font-size: 30rpx;
							font-weight: 500;
							color: #3A3D71;
						}
					}
			
					.td {
						padding: 12rpx 0 16rpx;
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
				}
			
				// 试卷展示
				.detail {
					.more {
			
						padding: 24rpx 0 26rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						border-bottom: 2rpx solid #E9E9E9;
			
						text {
							margin-right: 8rpx;
							font-size: 24rpx;
							color: #3A3D71;
						}
			
						image {
							width: 22rpx;
							height: 12rpx;
						}
					}
			
			
					&-content {
						padding: 32rpx 22rpx 26rpx 26rpx;
			
						.detail-item {
							width: 100%;
							display: flex;
							flex-direction: column;
							justify-content: center;
							align-items: center;
			
							image {
								width: 100%;
								height: 274rpx;
								border: 2rpx solid #F2F2F2;
							}
			
							text {
								display: inline-block;
								margin-top: 16rpx;
								font-size: 26rpx;
								color: #9E9E9E;
							}
						}
					}
				}
			}
		}

		.nodata {
			margin-top: 300rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;

			image {
				width: 398rpx;
				height: 300rpx;
			}

			text {
				display: inline-block;
				margin-top: 40rpx;
				font-size: 24rpx;
				color: #B4B4B4;
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
