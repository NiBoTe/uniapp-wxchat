<template>
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index">
					<examination-paper-item :item="item"></examination-paper-item>
				</view>
			</view>
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore margin-top="30" margin-bottom="30" v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	import { searchQuestionList } from '@/api/search.js'
	import ExaminationPaperItem from './examinationPaperItem.vue'
	export default {
		name: "ExaminationPaper",
		components: {
			ExaminationPaperItem
		},
		data() {
			return {
				loadStatus: 'loadmore',
				current: 1,
				size: 10,
				keyword: '',
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
				this.$http.post(searchQuestionList, {
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
			
			refresh(keyword){
				this.keyword = keyword;
				this.getList()
			}
		}
	}
</script>


<style lang="scss" scoped>
	.scroll-warper {
		height: calc(100vh - 94rpx);
	}
	.item {}
</style>
