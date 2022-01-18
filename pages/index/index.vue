<template>
	<view class="container">
		<view class="page">
			<view class="header" :style="{paddingTop: StatusBar + 'px'}">
				<view class="search u-flex u-row-between">
					<view class="left u-flex">
						<image src="/static/public/home_search.png"></image>
						<text>梵高名画</text>
					</view>
					<view class="search-btn">搜索</view>
				</view>
				<view class="swipers">
					<u-swiper :list="swiperList" height="240" border-radius="16"></u-swiper>
				</view>
			</view>

			<!-- menus -->
			<view class="menus u-flex">
				<view class="menus-item">
					<image src="/static/public/home_tab01.png"></image>
					<text>专业评画</text>
				</view>
				<view class="menus-item">
					<image src="/static/public/home_tab02.png"></image>
					<text>高分教材</text>
				</view>
				<view class="menus-item">
					<image src="/static/public/home_tab03.png"></image>
					<text>历年考题</text>
				</view>
				<view class="menus-item">
					<image src="/static/public/home_tab04.png"></image>
					<text>名牌高校</text>
				</view>
			</view>
			<!-- top 美考入口 -->

			<view class="top">
				<image :src="setSrc('home_top_banner.png')"></image>
			</view>


			<!-- 考试入口 -->
			<view class="examination">
				<u-row gutter="16" justify="space-between">
					<u-col span="6">
						<view class="left">
							<view class="left-item">
								<view class="left-item-label u-flex">
									<image src="/static/public/home_tested_style.png"></image>
									<text>我的已考</text>
								</view>

								<view class="left-item-sublabel u-line-1">
									<text>浙江省2021年第一次模</text>
								</view>
							</view>
							<view class="left-item">
								<view class="left-item-label u-flex">
									<image src="/static/public/home_tested_style.png"></image>
									<text>我的未考</text>
								</view>

								<view class="left-item-sublabel u-line-1">
									<text>浙江省2021年第一次模</text>
								</view>
							</view>
						</view>
					</u-col>
					<u-col span="6">
						<view class="right">
							<view class="right-item">
								<view class="right-item-label u-flex">
									<image :src="setSrc('home_ecent_exam_label.png')"></image>
									<text>近期考试</text>
								</view>

								<view class="right-item-sublabel">
									<view class="title">浙江省2021年第一次模拟考试</view>
									<view class="line"></view>
									<view class="subtitle u-flex u-row-between">
										<text>2021.8.30</text>
										<image src="/static/public/home_lately_style.png"></image>
									</view>
								</view>
							</view>
						</view>
					</u-col>
				</u-row>
			</view>
		</view>
		<tab-bar :selected="0"></tab-bar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	export default {
		components: {
			tabBar
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				swiperList: [{
						image: 'https://cdn.uviewui.com/uview/swiper/1.jpg',
						title: '昨夜星辰昨夜风，画楼西畔桂堂东'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/2.jpg',
						title: '身无彩凤双飞翼，心有灵犀一点通'
					},
					{
						image: 'https://cdn.uviewui.com/uview/swiper/3.jpg',
						title: '谁念西风独自凉，萧萧黄叶闭疏窗，沉思往事立残阳'
					}
				]
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;
		position: relative;
		height: 100vh;
		overflow: hidden;

		.page {
			.header {
				margin: 0;
				height: 562rpx;
				background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #FEDCB6 100%);

				.search {
					margin: 40rpx 32rpx 30rpx;
					height: 64rpx;
					background: #FFFFFF;
					border-radius: 34rpx;

					.left {
						margin-left: 22rpx;

						image {
							width: 32rpx;
							height: 32rpx;
						}

						text {
							margin-left: 14rpx;
							font-size: 28rpx;
							font-weight: 500;
							color: #5D6086;
						}
					}

					&-btn {
						margin-right: 4rpx;
						width: 108rpx;
						height: 56rpx;
						line-height: 56rpx;
						text-align: center;
						background: #FA9E28;
						border-radius: 30rpx;
						font-size: 28rpx;
						font-weight: 600;
						color: #FFFFFF;
					}
				}


				.swipers {
					margin: 0 32rpx;
				}
			}

			//  menus
			.menus {
				margin-top: -80rpx;

				&-item {
					flex: 1;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;

					image {
						width: 80rpx;
						height: 53rpx;
					}

					text {
						font-size: 26rpx;
						color: #3A3D71;
					}
				}
			}

			// top美考

			.top {
				margin: 36rpx 32rpx 0;

				image {
					width: 100%;
					height: 166rpx;
				}
			}


			// 考试入口

			.examination {
				margin: 20rpx 24rpx;

				.left {
					&-item {
						height: 138rpx;
						padding: 34rpx 26rpx 0 24rpx;

						&-label {
							image {
								width: 6rpx;
								height: 26rpx;
							}

							text {
								margin-left: 12rpx;
								font-size: 28rpx;
								font-weight: 800;

							}
						}

						&-sublabel {
							margin-top: 6rpx;
							font-size: 24rpx;
						}

						&:nth-of-type(1) {
							background: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/home_tested_bg.png') no-repeat center;
							background-size: cover;

							.left-item-label {
								color: #5E3EC5;
							}

							.left-item-sublabel {
								color: #8172B1;
							}
						}

						&:nth-of-type(2) {
							margin-top: 24rpx;
							background: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/home_nottested_bg.png') no-repeat center;
							background-size: cover;

							.left-item-label {
								color: #4ABC88;
							}

							.left-item-sublabel {
								color: #799A8B;
							}
						}
					}
				}

				.right {
					&-item {
						padding: 18rpx 22rpx;
						height: 300rpx;
						background: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/home_ecent_exam.png') no-repeat center;
						background-size: cover;

						&-label {
							image {
								width: 54rpx;
								height: 62rpx;
							}

							text {
								margin-left: 10rpx;
								font-size: 28rpx;
								font-weight: 800;
								color: #F18D3B;
							}
						}

						&-sublabel {
							margin-top: 4rpx;
							height: 186rpx;
							padding: 22rpx 20rpx;
							background: linear-gradient(180deg, #FFFFFF 0%, #FFF9F5 100%);
							box-shadow: 0px 20rpx 22rpx 0px rgba(184, 84, 2, 0.11);
							border-radius: 16rpx;

							.title {
								line-height: 34rpx;
								font-size: 24rpx;
								color: #F6A868;
							}

							.line {
								margin-top: 18rpx;
								margin-bottom: 26rpx;
								width: 248rpx;
								border-bottom: 4rpx solid;
								border-image: linear-gradient(90deg, #fff 0%, #F9DCC3 50%, #fff 100%, ) 2 2 2 2;
							}

							.subtitle {
								text {
									font-size: 24rpx;
									color: #F6A868;
								}

								image {
									width: 34rpx;
									height: 14rpx;
								}
							}
						}
					}
				}
			}

		}
	}
</style>
