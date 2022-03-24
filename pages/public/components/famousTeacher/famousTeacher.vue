<template>
	<view class="container">

		<scroll-view scroll-y="true" class="scroll-warper" @scrolltolower="lower">
			<view class="list">
				<view class="item" v-for="(item, index) in list" :key="index" @click="detailTap(item, index)">
					<famous-teacher-item :ref="'FamousTeacherItem' + index" :item="item" :index="index"></famous-teacher-item>
				</view>
			</view>
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore margin-top="30" margin-bottom="30" v-else bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
	
	import { searchTeacherList } from '@/api/search.js'
	import FamousTeacherItem from '@/components/famousTeacher/famousTeacherItem.vue'
	export default {
		name: "FamousTeacher",
		components: {
			FamousTeacherItem
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
				this.$http.post(searchTeacherList, {
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
					
					console.log(this.list)
			
				}).catch(err => {
					console.log(err)
				})
			},
			
			refresh(keyword) {
				this.keyword = keyword;
				this.current = 1;
				this.list = []
				this.getList()
			},
			detailTap(item, index){
				uni.$on('update', (data) => {
					this.$set(this.list[index], 'isFollow' , data)
					this.$refs['FamousTeacherItem' + index][0].refresh({
						index,
						isFollow: data
					})
				})
				this.$mRouter.push({
					route: `/pages/teachers/dynamicHomePage?id=${item.id}&index=${index}`
				})
			},
		}
	}
</script>


<style lang="scss" scoped>
	.scroll-warper {
		height: calc(100vh - 94rpx);
	}
	.item {}
</style>
