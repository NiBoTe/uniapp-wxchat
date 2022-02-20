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
					<view class="td">{{newestScoreQuery.examName || ''}}</view>
				</view>

				<view class="tr">
					<view class="td">准考证号</view>
					<view class="td">{{newestScoreQuery.admissionTicketCode || ''}}</view>
				</view>
				<view class="tr">
					<view class="td">姓名</view>
					<view class="td">{{newestScoreQuery.name || ''}}</view>
				</view>


				<view class="tr">
					<view class="td">科目</view>
					<view class="td">分数</view>
					<view class="td">机构内排名</view>
					<view class="td">总排名</view>
				</view>

				<view class="tr" v-for="(item, index) in newestScoreQuery.subjects" :key="index">
					<view class="td">{{item.course}}</view>
					<view class="td">{{item.score}}</view>
					<view class="td">{{item.rankInStudio}}</view>
					<view class="td">{{item.rankInProvince}}</view>
				</view>


				<view class="detail">
					<view class="more" @click="isMore = !isMore">
						<text>试卷展示</text>
						<u-icon name="arrow-up" color="#3A3D71" size="28" v-if="isMore"></u-icon>
						<u-icon name="arrow-down" color="#3A3D71" size="28" v-else></u-icon>
					</view>

					<view class="detail-content" v-if="isMore">
						<u-row gutter="16">
							<u-col span="4" v-for="(item,index) in newestScoreQuery.subjects">
								<view class="detail-item" @click="previewTap(item)">
									<image :src="item.thumb">
									</image>
									<text>{{item.course}}</text>
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
				<view class="card-item" v-for="(item, index) in examNameList" :key="index">
					<view class="card-style" :style="{backgroundColor: colorsList[index%4]}"></view>
					<view class="card-text">{{item}}</view>
				</view>
			</view>

			<!-- 科目 -->
			<view class="card" v-for="(item, index) in courseList" :key="index">
				<view class="card-title">科目：{{item.course}}</view>
				<view class="card-content">
					<qiun-data-charts type="column" :opts="opts" :chartData="chartsDataColumns[index]" />
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
	import {
		scoreQuery
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				colorsList: ['#2C3AFF', '#35CE96', '#FD8626', '#FF334D'],
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
							customColor: ['#2C3AFF', '#35CE96', '#FD8626', '#FF334D', '#2C3AFF', '#35CE96', '#FD8626',
								'#FF334D', '#2C3AFF', '#35CE96', '#FD8626', '#FF334D'
							]
						}
					}
				},
				chartsDataColumns: [],

				isMore: false,
				scoreItem: null,
				newestScoreQuery: {},
				courseList: [],
				examNameList: [],

			};
		},
		onLoad(options) {
			if (options.scoreItem) {
				this.scoreItem = JSON.parse(options.scoreItem)
				this.initData();
			}
		},
		methods: {
			initData() {

				this.chartsDataColumns = []
				this.$http.post(scoreQuery, this.scoreItem).then(res => {
					this.newestScoreQuery = res.data.newestScoreQuery;
					this.courseList = res.data.courseList;
					this.examNameList = res.data.examNameList;
					subjects.map((item, index) => {
						let scoreList = item.scoreList;
						let arr = []
						scoreList.map((a, b) => {
							arr.push({
								value: a,
								color: '#ffffff'
							})
						})
						this.chartsDataColumns.push({
							"categories": item.scoreList,
							"series": [{
								"name": imte.course,
								textOffset: -4,
								"data": arr
							}]
						})
					})
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 预览
			previewTap(item) {
				uni.previewImage({
					current: 0,
					urls: [item.img]
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
