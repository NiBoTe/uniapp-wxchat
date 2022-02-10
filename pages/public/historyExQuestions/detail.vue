<template>
	<view class="detail">
		<view class="navbar">
			<u-navbar title="试卷详情" back-icon-color="#1B1B1B" :border-bottom="false"
				title-color="#1B1B1B">
				
				<view slot="right">
					<view class="start" @click.top="favoriteTap">
						<u-icon name="star" color="#3A3D71" v-show="!detail.isFavorite"></u-icon>
						<u-icon name="star-fill" color="#35CE96" v-show="detail.isFavorite"></u-icon>
					</view>
				</view>
			</u-navbar>
		</view>
		<view class="top">
			<view class="img">
				<image :src="detail.hdImg !== '' ? detail.hdImg : detail.mosaicImg"
					mode="widthFix"></image>
			</view>
			<view class="content">
				<view class="title">
					{{detail.question.title}}
				</view>
				<view class="level">
					<u-icon name="eye" color="#3A3D71" size="30"></u-icon>
					<view class="num">{{detail.viewCount}}次</view>
					<view class="price">
						¥<text>{{detail.price}}</text>
					</view>
				</view>
				<view class="des">
					{{detail.description}}
				</view>
				<view class="copyright">
					版权归{{detail.copyright}}所有
				</view>
				<view class="delivery-content">
					<view class="left">
						<image src="/static/public/delivery_content.png" mode="widthFix"></image>发货内容
					</view>
					<view class="right">试卷一份</view>
				</view>
			</view>
		</view>

		<view class="footer">
			<view class="footer-btn" @click="submitTap">立即购买</view>
		</view>
		
		<!--页面加载动画-->
		<rfLoading isFullScreen :active="loading"></rfLoading>
	</view>
</template>
<script>
	import {
		examPaperImgDetail,
		addFavorite
	} from '@/api/history_exam.js'
	export default {
		components: {

		},

		data() {
			return {
				loading: true,
				id: null,
				detail: null,
			}
		},
		onLoad(options) {
			if (options.id) this.id = options.id;
			this.initData();
		},
		methods: {
			initData() {
				this.$http.post(examPaperImgDetail, null, {
					params: {
						examPaperImgId: this.id
					}
				}).then(res => {
					this.detail = res.data
					this.loading = false;
				}).catch(err => {
					console.log(err)
				})
			},
			// 收藏
			favoriteTap() {
				this.$http.post(addFavorite, null, {
					params: {
						examPaperImgId: this.detail.id,
						addFavorite: !this.detail.isFavorite
					}
				}).then(res => {
					this.initData()
					this.$mHelper.toast(!this.detail.isFavorite ? '收藏成功' : '取消成功')
				}).catch(err => {
					console.log(err)
				})
			},
			// 立即购买
			submitTap(){
				this.$mRouter.push({
					route: `/pages/public/historyExQuestions/sureOrder?id=${this.id}`
				})
			}
		},
	}
</script>
<style lang="scss">
	view {
		line-height: 1;
	}

	.detail {
		height: 100vh;
		width: 100%;

		.top {
			width: 100%;
			padding-bottom: 160rpx;
			.img {
				width: 100%;

				image {
					width: 100%;
				}
			}

			.content {
				padding: 28rpx;

				.title {
					font-size: 30rpx;
					font-family: PingFangSC-Semibold, PingFang SC;
					font-weight: 600;
					color: #3A3D71;
				}

				.level {
					margin-top: 36rpx;
					position: relative;

					.price {
						position: absolute;
						right: 0rpx;
						top: -14rpx;
						text-align: right;
						font-size: 34rpx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						font-weight: bold;
						color: #EF2E3B;

						text {
							font-size: 52rpx;
							font-family: PingFang-SC-Heavy, PingFang-SC;
							font-weight: 800;
						}
					}

					.num {
						display: inline-block;
						font-size: 24rpx;
						font-family: PingFang-SC-Medium, PingFang-SC;
						font-weight: 500;
						color: #3A3D71;
						margin-left: 16rpx;
					}
				}

				.des {
					margin-top: 20rpx;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
				}

				.copyright {
					margin-top: 32rpx;
					text-align: right;
					font-size: 24rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
				}

				.delivery-content {
					margin-top: 32rpx;
					width: 100%;
					display: flex;

					.left {
						flex: 1;

						image {
							width: 48rpx;
							vertical-align: bottom;
							margin-right: 20rpx;
						}

						line-height: 48rpx;
						font-size: 32rpx;
						font-family: PingFangSC-Regular,
						PingFang SC;
						font-weight: 400;
						color: #3A3D71;
					}

					.right {
						flex: 1;
						text-align: right;
						font-size: 28rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #2C3AFF;
						line-height: 48rpx;
					}
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
			&-btn {
				height: 88rpx;
				line-height: 88rpx;
				text-align: center;
				background: $u-type-primary;
				box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;
				font-size: 32rpx;
				color: #fff;
				
				&.disabled{
					background: #EDEFF2;
					color: #8F9091;
				}
			}
		}
	}
</style>
