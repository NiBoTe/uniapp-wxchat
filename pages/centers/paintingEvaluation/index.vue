<template>
	<view class="paintingEvaluation">
		<view class="navbar" :style="{paddingTop: StatusBar - 20 + 'px'}">
			<u-navbar title="专业评画" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<view class="tabs u-flex" :class="tabIndex === 0 ? 'one' :  'two' ">
			<view class="tab" @click="tabTap(0)" :class="tabIndex === 0 ? 'active' : ''">
				已评
			</view>
			<view class="tab" @click="tabTap(1)" :class="tabIndex === 1 ? 'active' : ''">
				未评
			</view>

		</view>

		<view class="content">

			<view class="content-tabs" v-if="tabIndex === 0 && evaluatedList.length > 0">
				<drawingColumn ref="DrawingColumn" :list="evaluatedList" key-name="name" @change="tabChange">
				</drawingColumn>
			</view>
			<view class="content-tabs" v-if="tabIndex === 1 && notEvaluatedList.length > 0">
				<drawingColumn ref="DrawingColumn" :list="notEvaluatedList" key-name="name" @change="tabChange">
				</drawingColumn>
			</view>
			<u-waterfall v-model="list" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index" @click="detailTap(item)">
						<painting-evaluation-item :item="item" type="teacherInfo"></painting-evaluation-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index" @click="detailTap(item)">
						<painting-evaluation-item :item="item" type="teacherInfo"></painting-evaluation-item>
					</view>
				</template>
			</u-waterfall>
		</view>
		<nodata v-if="!loading && !list.length"></nodata>
		<u-loadmore v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addData"></u-loadmore>
	
	
		<view class="footer">
			<view class="footer-btn" @click="submitTap">
				<text>去评画</text>
			</view>
		</view>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import PaintingEvaluationItem from '@/components/paintingEvaluation/paintingEvaluationItem.vue'
	import {
		orderItemPaintEvaluateSkilledMajorList,
		orderItemPaintEvaluateList
	} from '@/api/paint_evaluate_v2.js'
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

			};
		},
		onLoad() {
			
		},
		onShow() {
			this.initData()
		},
		methods: {
			initData() {
				this.loading = true;
				this.$http.get(orderItemPaintEvaluateSkilledMajorList).then(res => {
					console.log(res)
					this.evaluatedList = res.data.evaluatedList
					this.notEvaluatedList = res.data.notEvaluatedList
					if (this.evaluatedList.length) {
						this.skilledMajorId = this.evaluatedList[0].id
						this.getList()
					} else {
						this.loading = false;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(orderItemPaintEvaluateList, {
					skilledMajorId: this.skilledMajorId,
					state: this.tabIndex === 0 ? '已评' : '未评',
					size: this.size,
					current: this.current,
				}).then(res => {
					if (this.current === 1) {
						if (!res.data.records.length) {
							this.$refs.uWaterfall.clear();
						}
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
				this.$refs.uWaterfall.clear()
				this.current = 1;
				this.getList()
			},
			tabChange(e) {
				this.skilledMajorId = e.item.id
				this.$refs.uWaterfall.clear()
				this.current = 1;
				this.getList()
			},
			// 评画详情
			detailTap(item) {
				uni.navigateTo({
					url: `/pages/centers/paintingEvaluation/detail?id=${item.id}`
				})
			},
			// 去评画
			submitTap(){
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
		padding-bottom: 160rpx;
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

			&-tabs {
				padding: 26rpx 0 48rpx 0;
				background-color: #fff;
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
	}
</style>
