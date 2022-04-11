<template>
	<view class="historyExQuestions">
		<view class="navbar" :style="{paddingTop: StatusBar - 20 + 'px'}">
			<u-navbar title="历年考题" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<view class="tab-bar" :class="tabNumber === 'one' ? 'background-one': 'background-two'">
			<view class="left" :class="tabNumber === 'one'? 'active': ''" @click="handleTab('one')">
				高考
			</view>
			<view class="right" :class="tabNumber === 'two'? 'active': ''" @click="handleTab('two')">
				模考
			</view>
		</view>
		<view class="content">
			<view class="c-left">
				<view class="item" v-for="(item, index) in leftData" :key="item.id">
					<view class="item-title" :class="leftNum === index?'item-title-active':''"
						@click="handleLeftClick(index)">
						{{ item.name }}
						<u-icon v-if="leftNum === index" name="arrow-down" size="24" class="arrow"></u-icon>
						<u-icon v-else name="arrow-right" size="24" class="arrow"></u-icon>

					</view>

					<view class="item-list" @click="handleItemListClick(items, indexs)"
						:class="leftItemNum === indexs ? 'item-list-active':''" v-show="leftNum === index"
						v-for="(items, indexs) in item.childMenus" :key="items.id">
						{{ items.name }}
					</view>

				</view>
			</view>
			<view class="c-right">
				<view class="title">
					{{leftItemName || ''}}
				</view>
				<view class="date">
					<drawingColumn ref="DrawingColumn" :list="yearSpecialtyList" type="time" @change="tabChange">
					</drawingColumn>
				</view>

				<scroll-view class="r-tab" :scroll-x="true">
					<view class="tab-list">
						<view class="tab-item" @click="handleRTab(item,index)"
							:class="rightTabNum === index ? 'tab-item-active':''" v-for="(item, index) in rightTabList"
							:key="index">
							{{ item }}
						</view>
					</view>
				</scroll-view>

				<scroll-view scroll-y class="r-content" @scrolltolower="lower">
					<view class="test-list" v-for="(item, index) in list" :key="index">
						<view class="test-name">{{item.name}}</view>
						<view class="subjects-item" v-for="(itemc, indexc) in item.subjects" :key="indexc">
							<view class="subjects-name">
								{{itemc.subjectName}}
							</view>
							<view class="item" v-for="(itemb, indexb) in itemc.questions" :key="indexb"
								@click="detailTap(itemb, itemc)">
								<view class="name u-line-1">
									{{itemb.title}}
								</view>
								<view class="item-b">
									<view class="text">
										{{itemb.content}}
									</view>
									<view class="time" :style="{paddingBottom: !itemb.havePaper ? '30rpx' : 0}">
										<view class="t-l">
											<view class="l">考试时间</view>
											<view class="r">{{moment(itemb.examDate).format('YYYY.MM.DD')}}</view>
										</view>
										<view class="t-r">
											查看详情<u-icon name="arrow-right" size="24" class="arrow"></u-icon>
										</view>
									</view>
									<view class="line" v-if="itemb.havePaper"></view>
									<view class="bottom" v-if="itemb.havePaper">
										<view class="left">
											<image class="img" src="../../../static/public/examinationPaper_icon.png"
												mode=""></image>
											高分试卷
										</view>
										<view class="right">
											<image class="route" src="../../../static/public/route.png" mode=""></image>
										</view>
									</view>
								</view>
							</view>
						</view>
						<u-gap height="16" margin-top="28" bg-color="#F7F7F7"></u-gap>
					</view>

					<u-loadmore :status="loadStatus" @loadmore="addData"></u-loadmore>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import {
		historyExamMenu,
		getYearSpecialty,
		questionPageList
	} from '@/api/history_exam.js'
	import moment from '@/common/moment.js'
	export default {
		components: {
			drawingColumn
		},
		data() {
			return {
				moment,
				StatusBar: this.StatusBar,
				loadStatus: 'loadmore',
				tabNumber: 'one',
				leftData: [],
				leftNum: 0,
				leftItemNum: 0,
				leftItemName: null,
				yearSpecialtyList: [],
				rightTabList: [],
				rightTimeNum: 0,
				rightTabNum: 0,
				current: 1,
				size: 10,
				list: []
			}
		},
		onLoad() {
			this.initData();
		},
		methods: {
			initData() {
				this.$http.post(historyExamMenu, null, {
					params: {
						type: this.tabNumber === 'one' ? 1 : 0
					}
				}).then(res => {
					this.leftData = res.data
					this.leftNum = 0;
					this.leftItemNum = 0;
					this.leftItemName = this.leftData[0].childMenus[0].name;

					this.getTabList();
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},

			getTabList() {
				this.$http.post(getYearSpecialty, null, {
					params: {
						menuId: this.leftData[this.leftNum].childMenus[this.leftItemNum].id
					}
				}).then(res => {
					this.yearSpecialtyList = res.data
					// this.$refs.DrawingColumn.timeShow(this.yearSpecialtyList)
					this.rightTabList = this.yearSpecialtyList.length ? this.yearSpecialtyList[this.rightTimeNum].specialtys : []
					this.current = 1;
					this.getList()
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})

			},
			// 获取考试列表
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(questionPageList, {
					menuId: this.leftData[this.leftNum].childMenus[this.leftItemNum].id,
					current: this.current,
					size: this.size,
					specialty: this.rightTabList[this.rightTabNum],
					year: this.yearSpecialtyList[this.rightTimeNum].year
				}).then(res => {
					if (this.current === 1) {
						this.list = res.data.records;
					} else {
						this.list = this.list.concat(res.data.records);
					}
					if (res.data.total <= this.list.length) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

				}).catch(err => {
					console.log(err)
				})
			},
			handleTab(val) {
				this.tabNumber = val
				this.initData();
			},
			handleLeftClick(index) {
				
				
				this.leftNum = index
				this.leftItemNum = 0
				this.leftItemName = this.leftData[this.leftNum].childMenus[0].name;
				this.rightTabNum = 0;
				this.getTabList();
			},
			handleItemListClick(item, index) {
				console.log(item)
				this.leftItemNum = index
				this.leftItemName = item.name
				this.rightTabNum = 0;
				this.getTabList();
			},
			handleRTab(item, index) {
				this.rightTabNum = index
				this.current = 1;
				this.getList();
			},
			tabChange(e) {
				this.rightTimeNum = e.index
				this.rightTabNum = 0
				this.rightTabList = this.yearSpecialtyList[e.index].specialtys
				this.getList();
			},
			detailTap(item, itemc) {
				console.log(itemc)
				this.$mRouter.push({
					route: `/pages/public/historyExQuestions/excontent?questionId=${item.id}&subjectName=${itemc.subjectName}`
				})
			},
			lower() {
				this.loadStatus = 'loading';
				this.addData();
			},
			addData() {
				this.current++;
				this.getList();
			}
		}
	}
</script>

<style lang="scss">
	.historyExQuestions {
		height: calc(100vh);

		.navbar {
			height: 206rpx;
			box-sizing: content-box;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

		.tab-bar {
			margin-top: -55rpx;
			width: 100%;
			display: flex;
			text-align: center;
			height: 108rpx;
			font-size: 36rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #FFFFFF;

			.left {
				flex: 1;
				line-height: 126rpx;
			}

			.right {
				flex: 1;
				line-height: 126rpx;
			}

			.active {
				color: #2C3AFF;
			}
		}

		.background-one {
			background: url(/static/public/tabOne.png) no-repeat center;
			background-size: 100%;
		}

		.background-two {
			background: url(/static/public/tabTwo.png) no-repeat center;
			background-size: 100%;
		}


		.content {
			height: calc(100% - 260rpx);
			overflow: hidden;
			display: flex;

			.c-left {
				flex: 0 0 174rpx;
				border-right: 1rpx solid #E9E9E9;
				overflow: auto;
				.item {
					.item-title {
						width: 174rpx;
						height: 80rpx;
						line-height: 80rpx;
						text-align: center;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
						background: #F2F2F2;

						.arrow {
							margin-left: 10rpx;
							font-size: 18rpx;
						}
					}

					.item-title-active {
						color: #2C3AFF;

						.arrow {
							color: #2C3AFF;
						}
					}

					// border-top: 1px solid #D2D5DE;
					border-bottom: 1px solid #D2D5DE;

					.item-list {
						// padding: 0 20rpx;
						height: 74rpx;
						font-size: 22rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #5E677A;
						line-height: 74rpx;
						text-align: center;
						position: relative;

						&:before {
							position: absolute;
							bottom: 0;
							left: 20rpx;
							content: '';
							width: 134rpx;
							height: 1rpx;
							background: #D2D5DE;
						}
					}

					.item-list-active {
						background: #8EA7F7;
						color: #FFFFFF;
					}
				}
			}

			.c-right {
				flex: 1;
				width: 0;

				.title {
					width: 100%;
					height: 80rpx;
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;
					line-height: 80rpx;
					text-align: center;
					border-top: 1rpx solid #E9E9E9;
					border-bottom: 1rpx solid #E9E9E9;
				}

				.date {
					width: 100%;
					overflow: auto;
					margin: 24rpx 0 0 0;
					padding-bottom: 20rpx;
					padding-left: 12rpx;

					.date-list {
						// position: absolute;
						display: flex;

						.date-item {
							padding: 0 24rpx;
							width: 100rpx;
							height: 52rpx;
							background: #F3F3F3;
							border-radius: 28rpx;
							font-size: 24rpx;
							font-family: PingFang-SC-Regular, PingFang-SC;
							font-weight: 400;
							color: #1B1B1B;
							line-height: 52rpx;
							margin-right: 62rpx;
						}
					}
				}

				.r-tab {
					// display: flex;
					// overflow-x: scroll;
					width: 100%;
					padding-left: 16rpx;
					padding-bottom: 16rpx;

					.tab-list {
						white-space: nowrap;

						.tab-item {
							display: inline-block;
							margin-right: 50rpx;
						}

						.tab-item-active {
							color: #2C3AFF;
						}
					}

					border-bottom: 2rpx solid #E9E9E9;
				}

				.r-content {
					height: 100%;
					box-sizing: border-box;
					padding-top: 16rpx;
					padding-bottom: 260rpx;

					.test-list {
						margin-bottom: 28rpx;

						.test-name {
							padding: 0 34rpx 0 16rpx;
							text-align: center;
							font-size: 30rpx;
							font-family: PingFangSC-Regular, PingFang SC;
							font-weight: 400;
							color: #3A3D71;
							line-height: 30rpx
						}

						.subjects-item {
							margin: 0 34rpx 0 16rpx;

							.subjects-name {
								text-align: center;
								font-size: 34rpx;
								font-family: PingFang-SC-Bold, PingFang-SC;
								font-weight: bold;
								color: #3A3D71;
								line-height: 34rpx;
								margin: 16rpx 0;
							}

							.item {
								// width: 526px;
								// height: 314rpx;
								margin-bottom: 28rpx;
								background: #FFFFFF;
								box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
								border-radius: 16rpx;

								.name {
									width: 100%;
									height: 56rpx;
									background: linear-gradient(90deg, #FFFFFF 0%, #EFF2FF 100%);
									border-radius: 16rpx 16rpx 0rpx 0rpx;
									font-size: 28rpx;
									font-family: PingFangSC-Regular, PingFang SC;
									font-weight: 400;
									color: #3A3D71;
									line-height: 56rpx;
									padding-left: 24rpx
								}

								.item-b {
									padding: 0 24rpx 0 24rpx;
								}

								.text {
									margin-top: 14rpx;
									font-size: 26rpx;
									font-family: PingFang-SC-Regular, PingFang-SC;
									font-weight: 400;
									color: #3A3D71;
									line-height: 36rpx;
									text-overflow: -o-ellipsis-lastline;
									overflow: hidden;
									text-overflow: ellipsis;
									display: -webkit-box;
									-webkit-line-clamp: 2;
									line-clamp: 2;
									-webkit-box-orient: vertical;
								}

								.time {
									margin-top: 14rpx;
									display: flex;

									.t-l {
										flex: 1;

										.l {
											display: inline;
											font-size: 24rpx;
											font-family: PingFang-SC-Regular, PingFang-SC;
											font-weight: 400;
											color: #888C90;
										}

										.r {
											margin-left: 20rpx;
											display: inline;
											font-size: 24rpx;
											font-family: PingFangSC-Regular, PingFang SC;
											font-weight: 400;
											color: #3A3D71;
											line-height: 24rpx;
										}
									}

									.t-r {
										flex: 1;
										text-align: right;
										font-size: 24rpx;
										font-family: PingFang-SC-Regular, PingFang-SC;
										font-weight: 400;
										color: #9E9E9E;
									}
								}

								.line {
									width: 100%;
									height: 2rpx;
									background: #E9E9E9;
									margin-top: 26rpx;
									margin-bottom: 24rpx;
								}

								.bottom {
									width: 100%;
									display: flex;
									padding-bottom: 28rpx;

									// background: #DCDFE6;
									.left {
										flex: 1;

										.img {
											width: 44rpx;
											height: 44rpx;
											vertical-align: bottom;
											margin-right: 24rpx;
										}
									}

									.right {
										text-align: right;
										flex: 1;

										.route {
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
		}
	}
</style>
