<template>
	<view class="container">
		
		<view class="subtabs">
			<drawingColumn ref="DrawingColumn" :list="allList" key-name="name" @change="tabChange">
			</drawingColumn>
		</view>
		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower">
			<u-waterfall v-model="list" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index">
						<textbook-item :item="item"></textbook-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index">
						<textbook-item :item="item"></textbook-item>
					</view>
				</template>
			</u-waterfall>
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
import TextbookItem from './textbookItem.vue'
	import {
		myList
	} from '@/api/teaching_material.js'
	export default {
		name: "Textbook",
		components: {
			TextbookItem
		},
		props: {
			type: {
				type: String,
				default: 'list'
			}
		},
		created() {
			console.log(this.teacherId)
			console.log('ceshi 111')
		},
		data() {
			return {
				isFixed: false,
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				allList: [
					{
						name: '已上架',
						value: 'on_sale'
					},{
						name: '审核中',
						value: 'auditing'
					},{
						name: '审核失败',
						value: 'rejected'
					},{
						name: '已下架',
						value: 'stop_sale'
					}
				],
				state: 'on_sale',
				list: []
			}
		},
		created() {
			this.getList();
			
			uni.$on('removeHighScore', () => {
				this.current = 1
				this.getList()
			})
			
			uni.$on('offHighScore', () => {
				this.current = 1
				this.getList()
			})
			
			uni.$on('updateHighScore', () => {
				this.current = 1
				this.getList()
			})
		},
		methods: {
			lower() {
				this.loadStatus = 'loading';
				// 模拟数据加载
				setTimeout(() => {
					this.addRandomData();
					this.loadStatus = 'loadmore';
				}, 1000)
			},

			getList() {
				this.loadStatus = 'loading';
				this.$http.post(myList, {
					current: this.current,
					size: this.size,
					state: this.state,
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
			},
			tabChange(e) {
				this.$refs.uWaterfall.clear();
				this.state = e.item.value
				this.current = 1;
				this.getList()
			},
		}
	}
</script>


<style lang="scss" scoped>
	
	.container{
		padding-bottom: 200rpx;
	}
	.scroll-warper {
		padding: 18rpx 24rpx;
		height: calc(100vh - 94rpx);
	}
	
	.subtabs {
		padding: 28rpx 0;
		background-color: #fff;
	}
	.item {}
</style>
