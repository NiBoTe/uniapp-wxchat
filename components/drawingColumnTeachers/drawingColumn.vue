<template>
	<view class="container">
		<view class="tabs">
			<view class="tab" :class="[type !== 'list' ? 'zero' : '']" v-for="(item, index) in list" :key="index" @click="tabClick(item, index)">
				<text>{{item}}</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	
	export default {
		name:"drawingColumn",
		props: {
			type: {
				type: String,
				default:'list'
			}
		},
		data() {
			return {
				list: ['专业认真99w','专业认真99w','专业认真99w','专业99w'],
				activeIndex: 0,
			};
		},
		created() {
				this.initData()
		},
		methods:{
			initData(){
				// if(this.type === 'time') {
				// 	let times = []
				// 	for(let i = 0; i< 10; i++){
				// 		times.push(new Date().getFullYear() - i);
				// 	}
				// 	this.list = times
				// }
				
			},
			timeShow(list){
				this.list = list
			},
			tabClick(item, index){
				this.activeIndex = index
				this.$emit('change', {item, index})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// tabs
	.tabs {
		// height: 54rpx;
		// white-space: nowrap;
		padding-left: 32rpx;
		.tab {
			height: 50rpx;
			background: #EFF2FF;
			border-radius: 30rpx;
			margin-right: 34rpx;
			display: inline-block;
			position: relative;
			padding: 0 28rpx;
			border: 4rpx solid transparent;
			margin-bottom: 24rpx;
			text{
				font-size: 22rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #2C3AFF;
			}
			
	// 		&:first-of-type {
	// 			margin-left: 32rpx;
	// 		}
	// 		&.zero{
	// 			margin-left: 0;
	// 		}
	// 		&.active {
	// 			background: #EFF2FF;
	
	// 			text {
	// 				color: $u-type-primary;
	// 			}
	// 		}
	
			// text {
			// 	font-size: 24rpx;
			// 	color: #3A3D71;
			// }
	
			&-border {
				position: absolute;
				right: -8rpx;
				bottom: -8rpx;
	
				image {
					display: block;
					width: 36rpx;
					height: 36rpx;
				}
			}
		}
	}
</style>
