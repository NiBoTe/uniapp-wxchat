<template>
	<view class="detail">
		<view class="navbar">
			<u-navbar title="成绩查询" back-icon-color="#ffffff" :background="background" :border-bottom="false"
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
						</u-row>
					</view>
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
				isMore: false,
				scoreItem: null,
				newestScoreQuery:{}
			};
		},
		
		onLoad(options) {
			if (options.scoreItem) {
				this.scoreItem = JSON.parse(options.scoreItem)
				this.initData();
			}
		},
		methods:{
			initData() {
				this.$http.post(scoreQuery, this.scoreItem).then(res => {
					this.newestScoreQuery = res.data.newestScoreQuery;
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
	.detail {
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

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
