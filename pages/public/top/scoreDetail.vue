<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="成绩详情" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">

			<view class="table">
				<view class="tr t-head">
					<view class="td">浙江省第三次美术模拟考试成绩查询</view>
				</view>

				<view class="tr">
					<view class="td">准考证号</view>
					<view class="td">E0000066989</view>
				</view>
				<view class="tr">
					<view class="td">姓名</view>
					<view class="td">朱明一</view>
				</view>


				<view class="tr">
					<view class="td">科目</view>
					<view class="td">分数</view>
					<view class="td">机构内排名</view>
					<view class="td">总排名</view>
				</view>

				<view class="tr">
					<view class="td">素描</view>
					<view class="td">97</view>
					<view class="td">xx</view>
					<view class="td">xx</view>
				</view>


				<view class="detail">
					<view class="more" @click="isMore = !isMore">
						<text>试卷展示</text>
						<u-icon name="arrow-up" color="#3A3D71" size="28" v-if="isMore"></u-icon>
						<u-icon name="arrow-down" color="#3A3D71" size="28" v-else></u-icon>
					</view>

					<view class="detail-content" v-if="isMore">

						<u-row gutter="16">
							<u-col span="4">
								<view class="detail-item" @click="previewTap(0)">
									<image
										src="https://img0.baidu.com/it/u=1721391133,702358773&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=625">
									</image>
									<text>素描</text>
								</view>
							</u-col>
							<u-col span="4">
								<view class="detail-item">
									<image
										src="https://img0.baidu.com/it/u=1721391133,702358773&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=625">
									</image>
									<text>素描</text>
								</view>
							</u-col>
							<u-col span="4">
								<view class="detail-item">
									<image
										src="https://img0.baidu.com/it/u=1721391133,702358773&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=625">
									</image>
									<text>素描</text>
								</view>
							</u-col>

						</u-row>

					</view>
				</view>
			</view>


			<!-- 考试成绩分析 -->
			<view class="card">
				<view class="card-header">考试成绩分析</view>
				<view class="card-item">
					<view class="card-style"></view>
					<view class="card-text">浙江省第一次美术模拟考试</view>
				</view>
				<view class="card-item">
					<view class="card-style"></view>
					<view class="card-text">浙江省第二次美术模拟考试</view>
				</view>
			</view>

			<!-- 科目 -->


			<view class="card">
				<view class="card-title">科目：速写</view>
				<view class="card-content">
					<qiun-data-charts type="column" :opts="opts" :chartData="chartsDataColumn" />
				</view>
			</view>

		</view>
		<view class="footer u-flex u-row-center">
			<image src="/static/public/logo.png"></image>
			<text>易考绘成绩查询系统</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				opts: {
					fontSize: 14,
					color: '#3A3D71',
					"fontColor": '#3A3D71',
					xAxis: {
						disableGrid: true,
						"disabled": true,
						"axisLine": true,
						"axisLineColor": "#E9E9E9",

					},
					yAxis: {
						disableGrid: true,
						"axisLine": true,
						"axisLineColor": "#E9E9E9",
						textColor: "#3A3D71",
						textOffset: 30
					},
					legend: {
						show: false,
					},
					extra: {
						column: {
							linearType: 'custom',
							linearOpacity: 0.5,
							barBorderCircle: false,
							customColor: ['#FA7D8D', '#EB88E2']
						}
					}
				},
				chartsDataColumn: {
					"categories": [
						"2016",
						"2017",
						"2018",
						"2019",
						"2020",
						"2021"
					],
					"series": [{
						"name": "目标值",
						textOffset: -4,
						"data": [{
							value: 35,
							color: '#ffffff'
						}, {
							value: 35,
							color: '#ffffff'
						}]
					}]
				},
				isMore: false,
			};
		},
		methods: {
			// 预览
			previewTap(index) {
				uni.previewImage({
					current: index, //预览图片的下标
					urls: i //预览图片的地址，必须要数组形式，如果不是数组形式就转换成数组形式就可以
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		min-height: 100vh;
		background: #F3F3F3;

		.content {

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


			.card {
				margin: 0 34rpx 28rpx;

				background: #FFFFFF;
				box-shadow: 0px 6rpx 16rpx 6px rgba(230, 230, 230, 0.5);
				border: 2rpx solid #E9E9E9;

				&-header {
					padding: 20rpx 0 16rpx;
					border-bottom: 2rpx solid #E9E9E9;
					text-align: center;
					font-size: 30rpx;
					font-weight: 500;
					color: #3A3D71;
				}


				&-title {
					padding: 30rpx 0 16rpx 26rpx;
					font-size: 26rpx;
					font-weight: 500;
					color: #3A3D71;
				}

				&-content {
					padding: 0 14rpx;
				}

				&-item {
					display: flex;
					align-items: center;
					padding-left: 38rpx;

					.card-style {
						width: 22rpx;
						height: 22rpx;
						background: $u-type-primary;
						border-radius: 4rpx;
					}


					.card-text {
						flex: 1;
						margin-left: 14rpx;
						padding: 20rpx 0 16rpx;
						border-bottom: 2rpx solid #E9E9E9;
						font-size: 26rpx;
						font-weight: 300;
						color: #3A3D71;
					}

					&:last-of-type {
						.card-text {
							border-bottom: none;
						}
					}
				}
			}

		}

		.footer {
			width: 100%;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));


			image {
				width: 34rpx;
				height: 34rpx;
			}

			text {
				margin-left: 8rpx;
				font-size: 24rpx;
				color: #3A3D71;
			}

		}
	}
</style>
