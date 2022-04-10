<template>
	<view class="container">

		<scroll-view :scroll-y="isFixed" class="scroll-warper" @scrolltolower="lower" @scroll="scrollTap">
			<u-waterfall v-model="list" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="item" v-for="(item, index) in leftList" :key="index">
						<textbook-item v-if="type === 'list'" :item="item"></textbook-item>
						<textbook-item-my v-else :item="item"></textbook-item-my>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item" v-for="(item, index) in rightList" :key="index">
						<textbook-item v-if="type === 'list'" :item="item"></textbook-item>
						<textbook-item-my v-else :item="item"></textbook-item-my>
					</view>
				</template>
			</u-waterfall>
			
			<nodata v-if="!loadStatus !== 'loading' && !list.length"></nodata>
			<u-loadmore v-else margin-top="30" margin-bottom="30" bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore>
		</scroll-view>
	</view>
</template>

<script>
import TextbookItem from '@/components/textbook/textbookItem.vue'
import TextbookItemMy from '@/components/textbook/textbookItemMy.vue'

	import {
		teacherTeachingMaterialList
	} from '@/api/teacher.js'
	export default {
		name: "Textbook",
		components: {
			TextbookItem,
			TextbookItemMy
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
		created() {
			console.log(this.teacherId)
			console.log('ceshi 111')
		},
		watch:{
			teacherId(val){
				console.log(val)
				
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
				this.loadStatus = 'loading';
				this.addRandomData();
			},

			getList() {
				this.loadStatus = 'loading';
				this.$http.post(teacherTeachingMaterialList, {
					teacherId: this.teacherId,
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
			}
		}
	}
</script>


<style lang="scss" scoped>
	
	.container{
		height: 100vh;
	}
	.scroll-warper {
		height: 100vh;
	}
</style>
