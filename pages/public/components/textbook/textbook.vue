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
			<u-loadmore v-else margin-top="30" margin-bottom="30" bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData">
			</u-loadmore>

		</scroll-view>
	</view>
</template>

<script>
	import TextbookItem from '@/components/textbook/textbookItem.vue'
	import {
		searchTeachingMaterialList
	} from '@/api/search.js'
	export default {
		name: "Textbook",
		components: {
			TextbookItem
		},
		props: {
			teacherId: {
				type: String,
				default: ''
			},
			type: {
				type: String,
				default: 'list'
			}
		},
		data() {
			return {
				isFixed: false,
				loading: true,
				keyword: '',
				loadStatus: 'loadmore',
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
			getList() {
				this.loadStatus = 'loading';
				this.$http.post(searchTeachingMaterialList, {
					keyword: this.keyword,
					current: this.current,
					size: this.size,
				}).then(res => {
					let data = res.data
					console.log(data)
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
			refresh(keyword) {
				this.keyword = keyword;
				this.current = 1;
				this.list = []
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
