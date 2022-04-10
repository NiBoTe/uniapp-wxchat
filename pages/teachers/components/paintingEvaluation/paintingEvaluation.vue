<template>
	<view class="container">

		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower" @scroll="scrollTap">
			<u-waterfall v-model="list" ref="uWaterfall" v-if="source === 'home'">
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index">
						<painting-evaluation-item :item="item" source="home"></painting-evaluation-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index">
						<painting-evaluation-item :item="item" source="home"></painting-evaluation-item>
					</view>
				</template>
			</u-waterfall>
			<u-waterfall v-model="list" ref="uWaterfall" v-else>
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
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore margin-top="30" margin-bottom="30" v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import PaintingEvaluationItem from './paintingEvaluationItem.vue'

	import {
		paintEvaluateList
	} from '@/api/teacher.js'
	export default {
		name: "PaintingEvaluation",
		components: {
			PaintingEvaluationItem
		},
		props: {
			teacherId: {
				type: String,
				default: ''
			},
			source: {
				type: String,
				default: 'list'
			}
		},
		watch:{
			teacherId(val){
				if(this.teacherId) {
					this.getList();
				}
			}
		},
		data() {
			return {
				isFixed: false,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				list: []
			}
		},
		methods: {
			scrollTap(e){
				if(e.detail.scrollTop <= 0) {
					this.isFixed = false
					this.$emit('unfixedTap', true)
				}
			},
			lower() {
				console.log('=====')
				this.loadStatus = 'loading';
				this.addRandomData();
			},
			
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(paintEvaluateList, {
					teacherId: this.teacherId,
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
			addRandomData() {
				this.current++;
				this.getList();
			},
			remove(id) {
				this.$refs.uWaterfall.remove(id);
			},
			clear() {
				this.$refs.uWaterfall.clear();
			},
			noScroll(bool) {
				this.isFixed = bool
			}
		}
	}
</script>


<style lang="scss" scoped>
	.container{
		height: 100vh;
	}
	.scroll-warper {
		padding-bottom: 120rpx;
		height: 100vh;
		background-color: #F3F3F3;
	}

	// .item {}
</style>
