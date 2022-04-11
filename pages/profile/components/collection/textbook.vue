<template>
	<view class="container">
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
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore v-else :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
import TextbookItem from './textbookItem.vue'
	import {
		teachingMaterialList
	} from '@/api/favorite.js'
	export default {
		name: "Textbook",
		components: {
			TextbookItem
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
		created() {
			this.getList();
		},
		methods: {
			lower() {
				this.loadStatus = 'loading';
				this.addRandomData();
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(teachingMaterialList, {
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
			noScroll(bool) {
				this.isFixed = bool
			},
			// 刷新
			refresh() {
				this.current = 1;
				this.getList();
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
		height: 100vh;
	}
	.scroll-warper {
		padding: 18rpx 0;
		height: 100%;
		padding-bottom: 170rpx;
	}
	
	.subtabs {
		padding: 28rpx 0;
		background-color: #fff;
	}
	.item {}
</style>
