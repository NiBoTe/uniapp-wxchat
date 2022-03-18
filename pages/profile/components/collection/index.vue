<template>
	<view class="container">
		
		<view class="subtabs">
			<drawingColumn ref="DrawingColumn" :list="allList" key-name="name" @change="tabChange">
			</drawingColumn>
		</view>
		
		<!-- 高分试卷 -->
		<high-score v-show="activeIndex === 0" ref="HighScore"></high-score>
		
		<!-- 动态 -->
		<dynamic v-show="activeIndex === 1" ref="Dynamic"></dynamic>
		
		<!-- 高分教材 -->
		<text-book v-show="activeIndex === 2" ref="TextBook"></text-book>
		
		
	</view>
</template>

<script>
	
	import HighScore from './highScore.vue'
	import TextBook from './textbook.vue'
	import Dynamic from './dynamic.vue'
	export default {
		name: "Collection",
		components:{
			HighScore,
			TextBook,
			Dynamic
		},
		data() {
			return {
				popShow: false,
				isFixed: false,
				allList: [
					{
						name: '高分试卷',
						value: 0
					},{
						name: '动态',
						value: 1
					},{
						name: '高分教材',
						value: 2
					}
				],
				activeIndex: 0,
				state: 0,
				list: []
			}
		},
		created() {
			
		},
		methods: {
			noScroll(bool) {
				this.isFixed = bool
				this.$refs.HighScore.noScroll(this.isFixed)
				this.$refs.TextBook.noScroll(this.isFixed)
				this.$refs.Dynamic.noScroll(this.isFixed)
			},
			tabChange(e) {
				this.activeIndex = e.index;
			},
			// 刷新
			refresh(){
				this.$refs.HighScore.refresh()
				this.$refs.TextBook.refresh()
				this.$refs.Dynamic.refresh()
			}
		}
	}
</script>


<style lang="scss" scoped>
	
	.subtabs {
		padding: 28rpx 0;
		background-color: #fff;
	}
	// 弹窗
	.pop-content {
		.pop-list {
			.pop-item {
				padding: 40rpx 0;
				border-bottom: 1rpx solid #D8D8D8;
				text-align: center;
				font-size: 30rpx;
				color: #3A3D71;
	
				&:nth-last-of-type(-n+2) {
					border-bottom: 0;
				}
			}
		}
	}
</style>
