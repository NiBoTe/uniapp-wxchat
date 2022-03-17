<template>
	<view class="container">
		<view class="navbar">
			<u-navbar title="报名详情" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>


		<view class="header u-flex">
			<view class="left">
				<image src="/static/logo.png"></image>
			</view>

			<view class="right">
				<view class="title u-line-2">2021浙江省第一次美术水平测试模拟真考</view>
				<view class="subtitle u-flex">
					<image src="/static/public/time.png"></image>
					<text>距离考试还有</text>
					<view class="subtitle-badge">22天</view>
				</view>
			</view>
		</view>



		<view class="subheader">
			<view class="item">
				<view class="left">
					<text>支付状态 ：</text>
					<text class="status">交易关闭</text>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text>订单时间 ：2021-12-02 09:06:29</text>
				</view>
			</view>
			<view class="item">
				<view class="left">
					<text>订单编号 ：2021098845799086</text>
				</view>
			</view>

			<view class="line"></view>

			<view class="item">
				<view class="left">
					<text>报名费用 ：299元/人</text>
				</view>
			</view>

			<view class="item u-flex u-row-between">
				<view class="left">
					<text>报名人数 ：100人</text>
				</view>

				<view class="right">
					<text>总费用：</text>
					<text class="unit">¥</text>
					<text class="price">29900</text>
				</view>
			</view>
		</view>


		<view class="subheader" style="padding-top: 24rpx;">
			<view class="item" style="padding-top: 16rpx;">
				<view class="left">
					<text>收货地址 ：</text>
					<text>浙江省杭州市西湖区转塘街道象山路7号孪生画室1106室</text>
				</view>
			</view>
		</view>


		<!-- 考试科目 -->

		<view class="card">
			<view class="card-label u-flex">
				<text>考试科目</text>
			</view>

			<view class="card-list">
				<view class="card-item u-flex u-row-between" v-for="(item, index) in 2"
					:key="index">
					<view class="left">
						<text>sumiao </text>
						<text class="time"
							v-if="type === 2">考试时间：{{item.subjectStarttime}}-{{item.subjectEndtime}}</text>
					</view>
					<view class="right" v-if="type !== 2">
						<text>{{item.subjectDate}}</text>
						<text>{{item.subjectStarttime}}-{{item.subjectEndtime}}</text>
					</view>

					<view class="right u-flex" v-else @click="seeTestTap(item)">
						<text class="see">查看考题</text>
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		.navbar {
			height: 360rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/myApplication/navbar_bg.png');
			background-size: cover;
		}

		.header {
			margin: -140rpx 34rpx 0 28rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(161, 161, 161, 0.05);
			border-radius: 24rpx;

			padding: 22rpx;

			.left {
				image {
					width: 218rpx;
					height: 172rpx;
					border-radius: 24rpx;
				}
			}

			.right {
				margin-left: 20rpx;
				flex: 1;

				.title {
					font-size: 28rpx;
					font-weight: bold;
					color: #3A3D71;
					line-height: 40rpx;
				}

				.subtitle {
					margin-top: 36rpx;

					image {
						width: 30rpx;
						height: 30rpx;
					}

					text {
						margin-left: 8rpx;
						font-size: 24rpx;
						color: #9E9E9E;
					}

					&-badge {
						margin-left: 10rpx;
						padding: 0 16rpx;
						height: 40rpx;
						background: #FFF3EA;
						border-radius: 20rpx;
						font-size: 24rpx;
						font-weight: 500;
						color: #FF8827;
					}
				}
			}
		}



		.subheader {
			margin: 28rpx 34rpx 0 28rpx;
			padding: 6rpx 30rpx 36rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			.item {
				padding-top: 32rpx;

				.left {
					text {
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.right {
					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #35CE96;
						}

						&.price {
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;
						}
					}
				}
			}

			.line {
				margin-top: 36rpx;
				height: 2rpx;
				background-color: #E9E9E9;
			}
		}


		.card {
			margin: 28rpx 34rpx 0 28rpx;
			padding: 20rpx 20rpx 34rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			&-header {
				border-bottom: 2rpx solid #E9E9E9;
				padding-bottom: 38rpx;

				.left {
					position: relative;
					border-radius: 16rpx;
					overflow: hidden;
					width: 248rpx;
					height: 248rpx;

					&>image {
						width: 100%;
						height: 100%;
					}

					&-badge {
						position: absolute;
						right: 0;
						bottom: 0;
						width: 64rpx;
						height: 64rpx;
						border-top-left-radius: 40rpx;
						background: rgba($color: #000000, $alpha: .5);

						image {
							width: 34rpx;
							height: 34rpx;
						}
					}
				}

				.right {
					height: 248rpx;
					flex: 1;
					margin-left: 20rpx;
					padding-top: 20rpx;

					&-title {
						font-size: 28rpx;
						font-weight: bold;
						color: #3A3D71;
						line-height: 36rpx;
					}

					&-subtitle {
						margin-top: 16rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}

					&-bottom {
						margin-top: 30rpx;

						&-left {
							font-size: 26rpx;
							color: #3A3D71;
						}

						&-right {
							align-items: flex-end;
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;

							text {
								font-size: 28rpx;
								font-weight: bold;
								color: #35CE96;
							}
						}
					}
				}
			}



			&-times {
				.card-time {
					margin-top: 34rpx;

					.left {
						image {
							width: 28rpx;
							height: 28rpx;
						}

						text {
							margin-left: 18rpx;
							font-size: 26rpx;
							font-weight: bold;
							color: #3A3D71;
						}
					}

					.right {
						text {
							font-size: 26rpx;
							color: #3A3D71;
						}
					}
				}
			}

			// 审核状态
			&.card-examine {
				padding-bottom: 20rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}

				text {
					margin-left: 14rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #FF334D;
				}
			}


			&-label {


				image {
					width: 48rpx;
					height: 48rpx;
				}

				.right {
					image {
						width: 12rpx;
						height: 22rpx;
					}
				}

				text {
					margin-left: 14rpx;
					font-size: 26rpx;
					font-weight: bold;
					color: #3A3D71;
				}
			}

			&-text {
				margin-top: 18rpx;

				text {
					font-size: 26rpx;
					color: #3A3D71;
					line-height: 36rpx;
				}
			}

			// 考试科目
			&-list {

				.card-item {
					padding: 22rpx 0;
					border-bottom: 2rpx solid #E9E9E9;

					.left {



						text {
							font-size: 26rpx;
							font-weight: 500;
							color: #3A3D71;

							&.time {
								margin-left: 16rpx;
								font-size: 19rpx;
								color: #9E9E9E;
							}
						}
					}

					.right {
						text {
							font-size: 26rpx;
							color: #9E9E9E;

							&:last-of-type {
								margin-left: 20rpx;
								color: #3A3D71;
							}

							&.see {
								font-size: 24rpx;
								color: #9E9E9E;
							}
						}


						image {

							margin-left: 8rpx;
							width: 12rpx;
							height: 22rpx;
						}
					}
				}
			}


			// 考试地址

			&-address {
				&-item {
					border-bottom: 2rpx solid #E9E9E9;

					.card-address-code {
						margin: 28rpx 0 24rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #3A3D71;
					}

					.card-address-text {
						margin-bottom: 26rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}

				}
			}
		}
	}
</style>
