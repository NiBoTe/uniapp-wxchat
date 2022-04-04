<template>
	<view class="paintingEvaluation">
		<view class="navbar" :style="{paddingTop: StatusBar - 20 + 'px'}">
			<u-navbar title="专业评画" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<view class="tabs u-flex" :class="tabIndex === 0 ? 'one' :  'two' ">
			<view class="tab" @click="tabTap(0)" :class="tabIndex === 0 ? 'active' : ''">
				我的点评
			</view>
			<view class="tab" @click="tabTap(1)" :class="tabIndex === 1 ? 'active' : ''">
				我的作品
			</view>
		</view>

		<view class="content">
			<view class="content-tabs u-flex u-row-between">
				<view class="navbar-tabs">
					<view class="navbar-tab" :class="tabCurrent === 0 ? 'active' : ''" @click="tabChange(0)">
						<text>已评</text>
						<view class="line"></view>
					</view>
					<view class="navbar-tab" :class="tabCurrent === 1 ? 'active' : ''" @click="tabChange(1)">
						<text>未评</text>
						<view class="line"></view>
					</view>
				</view>

				<view class="right u-flex" @click="popShow = true">
					<text>{{selectName || '选择科目'}}</text>
					<image src="/static/public/arrow_down.png"></image>
				</view>
			</view>

			<u-waterfall v-model="list" ref="uWaterfall" v-if="tabIndex === 0">
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index">
						<painting-evaluation-item :item="item" type="teacherInfo"></painting-evaluation-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index">
						<painting-evaluation-item :item="item" type="teacherInfo"></painting-evaluation-item>
					</view>
				</template>
			</u-waterfall>
			<u-waterfall v-model="list" ref="uWaterfall" v-else>
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index">
						<painting-evaluation-item :item="item" type="default"></painting-evaluation-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index">
						<painting-evaluation-item :item="item" type="default"></painting-evaluation-item>
					</view>
				</template>
			</u-waterfall>
		</view>


		<view class="footer" v-if="tabIndex === 1">
			<view class="footer-btn" @click="submitTap">
				<text>去评画</text>
			</view>
		</view>
		<nodata v-if="!loading && !list.length"></nodata>
		<u-loadmore v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addData"></u-loadmore>

		<u-picker mode="selector" v-model="popShow" :range="selectList" range-key="name" @confirm="popTap">
		</u-picker>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import PaintingEvaluationItem from '@/components/paintingEvaluation/paintingEvaluationItem.vue'


	import {
		orderItemPaintEvaluateSkilledMajorList,
		orderItemPaintEvaluateList
	} from '@/api/paint_evaluate_v2.js'
	import {
		evaluateSkilledMajorList,
		paintEvaluateList
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		components: {
			drawingColumn,
			PaintingEvaluationItem
		},
		data() {
			return {
				loading: true,
				StatusBar: this.StatusBar,
				loadStatus: 'loadmore',
				tabIndex: 0,
				current: 1,
				size: 10,
				evaluatedList: [],
				notEvaluatedList: [],
				list: [], // 考试列表
				skilledMajorId: '', // 科目id
				tabCurrent: 0,
				popShow: false,
				selectList: [],
				selectName: null,
				itemType: 'teacherInfo'

			};
		},
		onLoad(options) {
			if(options.tabCurrent) this.tabCurrent = Number(options.tabCurrent)
			this.initData()
		},
		methods: {
			initData() {
				this.loading = true;
				this.$http.get(this.tabIndex === 0 ? evaluateSkilledMajorList : orderItemPaintEvaluateSkilledMajorList)
					.then(res => {
						this.evaluatedList = res.data.evaluatedList
						this.notEvaluatedList = res.data.notEvaluatedList
						if(this.tabCurrent === 0) {
							this.selectList = this.evaluatedList
							if (this.evaluatedList.length) {
								// this.skilledMajorId = this.evaluatedList[0].id
								this.getList()
							} else {
								this.loading = false;
							}
						} else {
							this.selectList = this.notEvaluatedList
							if (this.notEvaluatedList.length) {
								this.skilledMajorId = this.notEvaluatedList[0].id
								this.getList()
							} else {
								this.loading = false;
							}
						}
						
						
						
					}).catch(err => {
						console.log(err)
					})
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(this.tabIndex === 0 ? paintEvaluateList : orderItemPaintEvaluateList, {
					skilledMajorId: this.skilledMajorId,
					state: this.tabCurrent === 0 ? '已评' : '未评',
					size: this.size,
					current: this.current,
				}).then(res => {
					if (this.current === 1) {
						this.list = res.data.records;
					} else {
						this.list = this.list.concat(res.data.records);
					}
					if (res.data.records.length <= 0) {
						this.loadStatus = 'nomore';
					} else {
						this.loadStatus = 'loadmore';
					}

					this.loading = false;
				})
			},
			addData() {
				this.current++;
				this.getList();
			},
			tabTap(index) {
				this.tabIndex = index;
				this.itemType = this.tabIndex === 0 ? 'teacherInfo' : 'default';
				this.current = 1;
				this.skilledMajorId = '';
				this.selectName = null;
				this.$refs.uWaterfall.clear();
				this.initData()
			},
			tabChange(index) {
				this.tabCurrent = index
				if (this.tabCurrent === 0) {
					this.selectList = this.evaluatedList
				} else {
					this.selectList = this.notEvaluatedList
				}
				this.skilledMajorId = '';
				this.selectName = null;
				this.current = 1;
				this.$refs.uWaterfall.clear();
				this.getList()
			},
			// 评画详情
			detailTap(item) {
				uni.navigateTo({
					url: `/pages/centers/paintingEvaluation/detail?id=${item.id}`
				})
			},

			// 选择科目
			popTap(e) {
				e = e[0]
				if (this.tabCurrent === 0 && this.evaluatedList.length <= 0) return
				if (this.tabCurrent === 1 && this.notEvaluatedList.length <= 0) return
				if(this.tabCurrent === 0 && this.evaluatedList.length > 0) {
					this.selectName = this.evaluatedList[e].name;
				}
				if(this.tabCurrent === 1 && this.notEvaluatedList.length > 0) {
					this.selectName = this.notEvaluatedList[e].name;
				}
				
				this.skilledMajorId = this.tabCurrent === 0 ? this.evaluatedList[e].id : this.notEvaluatedList[e].id;
				this.$refs.uWaterfall.clear();
				this.current = 1;
				this.getList()
			},
			// 去评画
			submitTap() {
				uni.navigateTo({
					url: '/pages/centers/paintingEvaluation/teacherList'
				})
			}
		},
		onReachBottom() {
			this.loadStatus = 'loading';
			this.getList()
		},
	}
</script>

<style lang="scss" scoped>
	.paintingEvaluation {
		min-height: 100vh;
		background-color: #F3F3F3;

		.navbar {
			height: 206rpx;
			box-sizing: content-box;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

		.tabs {
			margin-top: -55rpx;
			width: 100%;
			height: 108rpx;

			&.one {
				background: url(/static/public/tabOne.png) no-repeat center;
				background-size: cover;
			}

			&.two {
				background: url(/static/public/tabTwo.png) no-repeat center;
				background-size: cover;
			}

			.tab {
				padding-top: 16rpx;
				flex: 1;
				text-align: center;
				font-size: 30rpx;
				color: #FFFFFF;

				&.active {
					font-size: 30rpx;
					font-weight: bold;
					color: $u-type-primary;
				}
			}

			.line {
				width: 2rpx;
				height: 26rpx;
				background-color: #FFFFFF;
			}
		}

		.content {
			padding-bottom: 160rpx;
			&-tabs {
				padding: 0 34rpx 0 36rpx;
				background-color: #fff;

				.navbar-tabs {
					margin-top: 24rpx;
					flex: 1;
					position: relative;
					z-index: 999;
					width: 100%;
					display: flex;
					align-items: center;

					.navbar-tab {
						display: flex;
						flex-direction: column;
						justify-content: center;
						align-items: center;

						&:first-of-type {
							margin-right: 98rpx;
						}

						text {
							font-size: 34rpx;
							color: #9E9E9E;
						}

						.line {
							margin-top: 16rpx;
							width: 66rpx;
							height: 6rpx;
							background-color: transparent;
							border-radius: 6rpx;
						}

						&.active {
							text {
								font-weight: bold;
								color: #1B1B1B;
							}

							.line {
								background-color: $u-type-primary;
								border-radius: 6rpx;
							}
						}
					}
				}

				.right {
					text {
						color: #3A3D71;
					}

					image {
						margin-left: 14rpx;
						width: 26rpx;
						height: 18rpx;
					}
				}
			}
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
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
</style>
