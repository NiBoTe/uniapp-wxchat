<template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index">
					<examination-item :item="item"></examination-item>
				</view>
			</view>
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore margin-top="30" margin-bottom="30" v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import {
		searchExamList
	} from '@/api/search.js'
	import ExaminationItem from './examinationItem.vue'
	export default {
		name: "ExaminationItem",
		components: {
			ExaminationItem
		},
		data() {
			return {
				loadStatus: 'loadmore',
				keyword: '',
				current: 1,
				size: 10,
				list: []
			}
		},
		methods: {
			lower() {
				this.loadStatus = 'loading';
				this.addRandomData();
			},
			addRandomData() {
				this.current++;
				this.getList();
			},
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(searchExamList, {
					keyword: this.keyword,
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

			refresh(keyword) {
				this.keyword = keyword;
				if(this.keyword && this.keyword !== null && this.keyword !== '') {
					this.current = 1;
					this.list = []
					this.getList()
				}
				
			}
		}
	}
</script>


<style lang="scss" scoped>
	.container {
		height: calc(100vh - 120rpx);
		padding-bottom: 200rpx;
	}
	
	.scroll-warper{
		height: 100%;
	}
</style>
