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
					<u-swiper name="imgUrl" :list="bannerList" height="240" border-radius="16"></u-swiper>
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
				<view class="menus-item" @click="navTo('/pages/public/historyExQuestions/historyExQuestions')">
					<image src="/static/public/home_tab03.png"></image>
					<text>历年考题</text>
				</view>
				<view class="menus-item" @click="navTo('/pages/public/school/index')">
					<image src="/static/public/home_tab04.png"></image>
					<text>名牌高校</text>
				</view>
			</view>
			<!-- top 美考入口 -->

			<view class="top" @click="navTo('/pages/public/top/top')">
				<image :src="setSrc('home_top_banner.png')"></image>
			</view>


			<!-- 考试入口 -->
			<view class="examination">
				<u-row gutter="16" justify="space-between">
					<u-col span="6">
						<view class="left">
							<view class="left-item" @click="testTap(2)">
								<view class="left-item-label u-flex">
									<image src="/static/public/home_tested_style.png"></image>
									<text>我的已考</text>
								</view>

								<swiper class="left-item-sublabel u-line-1" :circular="true" :autoplay="true"
									:disable-touch="true">
									<swiper-item class="u-line-1" v-for="(item, index) in recentExam" :key="index">
										<text>{{item.name}}</text>
									</swiper-item>
								</swiper>
							</view>
							<view class="left-item" @click="testTap(1)">
								<view class="left-item-label u-flex">
									<image src="/static/public/home_nottested_style.png"></image>
									<text>我的未考</text>
								</view>

								<swiper class="left-item-sublabel u-line-1" :circular="true" :autoplay="true"
									:disable-touch="true">
									<swiper-item class="u-line-1" v-for="(item, index) in untestedExam" :key="index">
										<text>{{item.name}}</text>
									</swiper-item>
								</swiper>
							</view>
						</view>
					</u-col>
					<u-col span="6">
						<view class="right" @click="testTap(0)">
							<view class="right-item">
								<view class="right-item-label u-flex">
									<image :src="setSrc('home_ecent_exam_label.png')"></image>
									<text>近期考试</text>
								</view>
								<swiper class="right-item-sublabel" :circular="true" :autoplay="true"
									:disable-touch="true">
									<swiper-item class="right-item-sublabel-item" v-for="(item, index) in recentExam"
										:key="index">
										<view class="title u-line-2">{{item.name}}</view>
										<view class="line"></view>
										<view class="subtitle u-flex u-row-between">
											<text>{{item.enrollStartTime}}</text>
											<image src="/static/public/home_lately_style.png"></image>
										</view>
									</swiper-item>
								</swiper>
							</view>
						</view>
						<!-- <swiper class="right" :circular="true" :autoplay="true" :disable-touch="true">
							<swiper-item class="right-item">
								<view class="right-item-label u-flex">
									<image :src="setSrc('home_ecent_exam_label.png')"></image>
									<text>近期考试</text>
								</view>
							
								<view class="right-item-sublabel">
									<view class="title">{{item.name}}</view>
									<view class="line"></view>
									<view class="subtitle u-flex u-row-between">
										<text>{{item.enrollStartTime}}</text>
										<image src="/static/public/home_lately_style.png"></image>
									</view>
								</view>
							</swiper-item>
						</swiper> -->

					</u-col>
				</u-row>
			</view>

			<!-- 高分素材 -->
			<view class="page-wrapper" v-if="materialList.length">
				<view class="gap"></view>
				<view class="column u-flex">
					<image :src="setSrc('home_high_score.png')"></image>
					<view class="column-title">高分素材</view>
					<view class="line"></view>
					<view class="column-label">学习名师画作</view>
				</view>
				<drawing-column keys="0" :list="materialList" key-name="firstMenuName" @change="tabChange">
				</drawing-column>
				<scroll-view class="highScore" :scroll-x="true">
					<view class="highScore-item" v-for="(item, index) in materialList[materialIndex].list" :key="index">
						<textbook-item :item="item" imgHeight="440"></textbook-item>
					</view>
				</scroll-view>

				<view class="more" @click="moreTap(0)">
					<text>更多</text>
				</view>
			</view>

			<!-- 名师推荐 -->
			<view class="page-wrapper" v-if="teachersList.length">
				<view class="gap"></view>
				<view class="column u-flex">
					<image :src="setSrc('home_famous_teacher.png')"></image>
					<view class="column-title">名师推荐</view>
					<view class="line"></view>
					<view class="column-label">借鉴名师经验</view>
				</view>

				<drawing-column keys="1" :list="teachersList" key-name="skilledMajorName" @change="tabChange">
				</drawing-column>

				<view class="teacher">
					<u-row gutter="42">
						<u-col span="4" v-for="(item,index) in teachersList[teachersIndex].list" :key="index">
							<view class="teacher-item">
								<view class="teacher-head">
									<image :src="item.headUrl" mode="aspectFill"></image>
									<view class="teacher-name">{{item.fullName}}</view>
								</view>
								<view class="teacher-text u-line-2">{{item.introduce}}</view>
							</view>
						</u-col>
					</u-row>
				</view>
				<view class="more" @click="moreTap(1)">
					<text>更多</text>
				</view>
			</view>

			<!-- 热门评画 -->
			<view class="page-wrapper" v-if="hotList.length">
				<view class="gap"></view>
				<view class="column u-flex">
					<image :src="setSrc('home_evaluation.png')"></image>
					<view class="column-title">热门评画</view>
					<view class="line"></view>
					<view class="column-label">名师点评速提升</view>
				</view>

				<div style="margin-bottom: 30rpx;">
					<drawing-column keys="2" :list="hotList" key-name="skilledMajorName" @change="tabChange">
					</drawing-column>
				</div>

				<view class="evaluation">
					<u-waterfall v-model="hotList[hotIndex].list" ref="uWaterfall">
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

	import {
		banner,
		exam,
		moduleConfigure,
		paintEvaluateList,
		teachingMaterialList,
		teacherList
	} from '@/api/homepage.js'
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
				bannerList: [], // banner,
				recentExam: [], // 近期考试
				testedExam: [], // 我的已考
				untestedExam: [], // 我的未考
				moduleMap: {},
				materialList: [], // 高分教材
				materialIndex: 0,
				teachersList: [], // 名师推荐
				teachersIndex: 0,
				hotList: [], // 热门评画
				hotIndex: 0,
			}
		},
		onLoad() {
			this.initData();
			this.getMaterialList();
			this.getTeacherList();
			this.getHotList();
		},
		methods: {
			initData() {
				this.$http.get(banner, {
					crowed: 0
				}).then(res => {
					console.log(res)
					this.bannerList = res.data ?? []
				})

				this.$http.get(exam).then(res => {
					console.log(res.data)
					const data = res.data;

					this.recentExam = data.recentExam;
					this.testedExam = data.testedExam;
					this.untestedExam = data.untestedExam;
				})
				// this.$http.get(moduleConfigure).then(res => {
				// 	console.log(res.data)
				// 	this.moduleMap = res.data
				// 	console.log(this.moduleMap)
				// })
			},
			// 高分教材
			getMaterialList() {
				this.$http.get(teachingMaterialList).then(res => {
					console.log(res)
					this.materialList = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			// 名师推荐
			getTeacherList() {
				this.$http.get(teacherList).then(res => {
					console.log(res)
					this.teachersList = res.data
				}).catch(err => {
					console.log(err)
				})
			},

			// 热门评画
			getHotList() {
				this.$http.get(paintEvaluateList).then(res => {
					this.hotList = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			navTo(route) {

				console.log(route)
				this.$mRouter.push({
					route
				})
			},
			// 筛选
			tabChange(e) {
				console.log(e)

				let key = e.key

				switch (key) {
					case '0':
						this.materialIndex = e.index;
						break;
					case '1':
						this.teachersIndex = e.index;
						break;
					case '2':
						this.hotIndex = e.index;
						break;

				}
			},
			// 更多
			moreTap(index) {
				switch (index) {
					case 0:
						uni.navigateTo({
							url: '/pages/public/highScore/index'
						})
						break;

					case 1:
						uni.switchTab({
							url: '/pages/teacher/index'
						})
						break;
				}
			},
			// 近期考试
			testTap(index){
				console.log(index)
				uni.navigateTo({
					url: `/pages/public/top/top?type=${index}`
				})
			}
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
