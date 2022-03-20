<template>
	<view class="container">
		<view class="subtabs" v-if="allList.length">
			<drawingColumn ref="DrawingColumn" :list="allList" key-name="name" @change="tabChange">
			</drawingColumn>
		</view>
		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower">
			<u-waterfall v-model="list" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index">
						<painting-evaluation-item :item="item" :type="type"></painting-evaluation-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index">
						<painting-evaluation-item :item="item" :type="type"></painting-evaluation-item>
					</view>
				</template>
			</u-waterfall>
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore v-else :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import drawingColumn from '@/components/drawingColumn/drawingColumn.vue'
	import PaintingEvaluationItem from './paintingEvaluationItem.vue'

	import {
		orderItemPaintEvaluateList,
		orderItemPaintEvaluateSkilledMajorList
	} from '@/api/paint_evaluate_v2.js'
	
	import { paintEvaluateList } from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		name: "PaintingEvaluationUser",
		components: {
			PaintingEvaluationItem,
			drawingColumn
		},
		created() {
			this.getList();
		},
		data() {
			return {
				isFixed: false,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: [],
				skilledMajorId: '',
				allList: [],
				type: 'default'
				
			}
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				this.loading = true;
				this.$http.get(orderItemPaintEvaluateSkilledMajorList).then(res => {
					console.log(res)
					this.allList = res.data.allList
					if (this.allList.length) {
						this.skilledMajorId = this.allList[0].id
						this.getList()
					} else {
						this.loading = false;
					}
				}).catch(err => {
					console.log(err)
				})
			},
			lower() {
				this.loadStatus = 'loading';
				this.addRandomData();
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(orderItemPaintEvaluateList, {
					state: '全部',
					skilledMajorId: this.skilledMajorId,
					current: this.current,
					size: this.size,
				}).then(res => {
					let data = res.data
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
			
			tabChange(e) {
				console.log(e)
				this.$refs.uWaterfall.clear();
				this.skilledMajorId = e.item.id
				this.current = 1;
				this.getList()
			},
			addRandomData() {
				this.current++;
				this.getList();
			},
			noScroll(bool) {
				this.isFixed = bool
			},
			refresh(){
				this.current = 1;
				this.getList()
			}
		}
	}
</script>


<style lang="scss" scoped>
	
	
	.container{
		min-height: 100vh;
	}
	.scroll-warper {
		height: calc(100vh - 94rpx);
		padding: 18rpx 24rpx;
		padding-bottom: 170rpx;
	}

	
	.subtabs {
		padding: 28rpx 0;
		background-color: #fff;
	}
</style>
