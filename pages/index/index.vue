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
									<image src="/static/public/home_nottested_style.png"></image>
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

			<!-- 高分素材 -->
			<view class="page-wrapper">
				<view class="gap"></view>
				<view class="column u-flex">
					<image :src="setSrc('home_high_score.png')"></image>
					<view class="column-title">高分素材</view>
					<view class="line"></view>
					<view class="column-label">学习名师画作</view>
				</view>

				<drawing-column></drawing-column>

				<scroll-view class="highScore" :scroll-x="true">
					<view class="highScore-item" v-for="(item, index) in highScoreList" :key="index">
						<textbook-item :item="item" imgHeight="440"></textbook-item>
					</view>
				</scroll-view>

				<view class="more">
					<text>更多</text>
				</view>
			</view>

			<!-- 名师推荐 -->
			<view class="page-wrapper">
				<view class="gap"></view>
				<view class="column u-flex">
					<image :src="setSrc('home_famous_teacher.png')"></image>
					<view class="column-title">名师推荐</view>
					<view class="line"></view>
					<view class="column-label">借鉴名师经验</view>
				</view>

				<drawing-column></drawing-column>

				<view class="teacher">
					<u-row gutter="42">
						<u-col span="4">
							<view class="teacher-item">
								<view class="teacher-head">
									<image
										src="https://img1.baidu.com/it/u=1597761366,2823600315&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
										mode="aspectFill"></image>
									<view class="teacher-name">刘泉海</view>
								</view>
								<view class="teacher-text u-line-2">
									中国美术学院雕塑系研究生全国第…中国美术学院雕塑系研究生全国第…
								</view>
							</view>
						</u-col>
						<u-col span="4">
							<view class="teacher-item">
								<view class="teacher-head">
									<image
										src="https://img1.baidu.com/it/u=1597761366,2823600315&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
										mode="aspectFill"></image>
									<view class="teacher-name">刘泉海</view>
								</view>
								<view class="teacher-text u-line-2">
									中国美术学院雕塑系研究生全国第…中国美术学院雕塑系研究生全国第…
								</view>
							</view>
						</u-col>
						<u-col span="4">
							<view class="teacher-item">
								<view class="teacher-head">
									<image
										src="https://img1.baidu.com/it/u=1597761366,2823600315&fm=253&fmt=auto&app=138&f=JPEG?w=889&h=500"
										mode="aspectFill"></image>
									<view class="teacher-name">刘泉海</view>
								</view>
								<view class="teacher-text u-line-2">
									中国美术学院雕塑系研究生全国第…中国美术学院雕塑系研究生全国第…
								</view>
							</view>
						</u-col>
					</u-row>

				</view>

				<view class="more">
					<text>更多</text>
				</view>
			</view>

			<!-- 热门评画 -->
			<view class="page-wrapper">
				<view class="gap"></view>
				<view class="column u-flex">
					<image :src="setSrc('home_evaluation.png')"></image>
					<view class="column-title">热门评画</view>
					<view class="line"></view>
					<view class="column-label">名师点评速提升</view>
				</view>
				
				<div style="margin-bottom: 30rpx;">
					<drawing-column></drawing-column>
				</div>

				<view class="evaluation">
					<u-waterfall v-model="flowList" ref="uWaterfall">
						<template v-slot:left="{leftList}">
							<view class="item" v-for="(item, index) in leftList" :key="index">
								<painting-evaluation-item :item="item"></painting-evaluation-item>
							</view>
						</template>
						<template v-slot:right="{rightList}">
							<view class="item" v-for="(item, index) in rightList" :key="index">
								<painting-evaluation-item :item="item"></painting-evaluation-item>
							</view>
						</template>
					</u-waterfall>
				</view>

			</view>

		</view>
		<tab-bar :selected="0"></tab-bar>
	</view>
</template>

<script>
	import tabBar from '@/components/tabbar/tabbar.vue'
	import DrawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import TextbookItem from '@/components/textbook/textbookItem.vue'
	import PaintingEvaluationItem from '@/components/paintingEvaluation/paintingEvaluationItem.vue'
	export default {
		components: {
			tabBar,
			TextbookItem,
			PaintingEvaluationItem,
			DrawingColumn
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
				],
				highScoreList: [{
						price: 35,
						title: '北国风光，千里冰封，万里雪飘',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic.sc.chinaz.com/Files/pic/pic9/202002/zzpic23327_s.jpg',
					},
					{
						price: 75,
						title: '望长城内外，惟余莽莽',
						shop: '李白杜甫白居易旗舰店',
						image: 'https://img1.baidu.com/it/u=2716398045,2043787292&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=800',
					},
					{
						price: 385,
						title: '大河上下，顿失滔滔',
						shop: '李白杜甫白居易旗舰店',
						image: 'https://img2.baidu.com/it/u=2013499784,686759970&fm=253&fmt=auto&app=120&f=JPEG?w=800&h=1333',
					},
					{
						price: 784,
						title: '欲与天公试比高',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/zzpic23369_s.jpg',
					},
					{
						price: 7891,
						title: '须晴日，看红装素裹，分外妖娆',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic2.sc.chinaz.com/Files/pic/pic9/202002/hpic2130_s.jpg',
					},
					{
						price: 2341,
						shop: '李白杜甫白居易旗舰店',
						title: '江山如此多娇，引无数英雄竞折腰',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23346_s.jpg',
					},
					{
						price: 661,
						shop: '李白杜甫白居易旗舰店',
						title: '惜秦皇汉武，略输文采',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23344_s.jpg',
					},
					{
						price: 1654,
						title: '唐宗宋祖，稍逊风骚',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
					},
					{
						price: 1678,
						title: '一代天骄，成吉思汗',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
					},
					{
						price: 924,
						title: '只识弯弓射大雕',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
					},
					{
						price: 8243,
						title: '俱往矣，数风流人物，还看今朝',
						shop: '李白杜甫白居易旗舰店',
						image: 'http://pic1.sc.chinaz.com/Files/pic/pic9/202002/zzpic23343_s.jpg',
					},
				],
				flowList: []
			}
		},
		onLoad() {
			this.flowList = this.highScoreList;
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;

		padding-bottom: 164rpx;

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
								border-bottom: 2rpx solid;
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

			// 栏目
			.column {
				margin: 40rpx 32rpx 34rpx;

				image {
					width: 48rpx;
					height: 48rpx;
				}

				&-title {
					margin-left: 18rpx;
					font-size: 32rpx;
					font-weight: 600;
					color: #1B1B1B;
				}

				.line {
					margin: 0 20rpx;
					width: 2rpx;
					height: 29rpx;
					border: 2rpx solid #BEBEBE;
				}

				&-label {
					font-size: 24rpx;
					color: #9C9C9C;
				}
			}

			// 间隔
			.gap {
				width: 100%;
				height: 16rpx;
				background-color: #F7F7F7;
			}




			// 高分教材
			.highScore {
				margin: 32rpx 0 0;
				white-space: nowrap;

				&-item {
					display: inline-block;
					width: 356rpx;

					&:first-of-type {
						margin-left: 28rpx;
					}
				}
			}

			// 名师推荐
			.teacher {
				margin: 30rpx 16rpx 0;

				.teacher-item {
					.teacher-head {
						position: relative;
						padding-bottom: 6rpx;

						image {
							display: block;
							border-radius: 16rpx;
							width: 100%;
							height: 234rpx;
						}

						.teacher-name {
							position: absolute;
							left: 0;
							bottom: 0;
							min-width: 120rpx;
							height: 54rpx;
							line-height: 54rpx;
							padding: 0 24rpx;
							background: #515ADC;
							border-radius: 27rpx;
							font-size: 24rpx;
							font-weight: 600;
							color: #FFFFFF;
						}
					}

					.teacher-text {
						margin: 10rpx 0 28rpx;
						font-size: 26rpx;
						color: #3A3D71;
					}
				}
			}

			// 热门评话
			.evaluation {
				background-color: #F3F3F3;
				padding: 28rpx 24rpx;
			}

			.more {
				margin: 0 32rpx 40rpx;
				margin-left: 42rpx;
				height: 72rpx;
				line-height: 72rpx;
				text-align: center;
				background: #F3F3F3;
				border-radius: 16rpx;

				text {
					font-size: 24rpx;
					color: #3A3D71;
				}
			}
		}
	}
</style>
