<template>
	<view class="container">
		<scroll-view class="tabs" :scroll-x="true">
			<view class="tab" :class="[type !== 'list' ? 'zero' : '', activeIndex === index ? 'active' : '']" :style="{backgroundColor: activeIndex === index  ? activeColor : ''}"
				v-for="(item, index) in list" :key="index" @click="tabClick(item, index)">
				<text v-if="type === 'time'">{{item.year}}</text>
				<text v-else>{{item[keyName]}}</text>
				<view class="tab-border" v-if="activeIndex === index">
					<image src="/static/public/home_scroll_style.png"></image>
				</view>
			</view>

		</scroll-view>
	</view>
</template>

<script>
	export default {
		name: "drawingColumn",
		props: {
			type: {
				type: String,
				default: 'list'
			},
			keys: {
				type: String,
				default:'0'
			},
			keyName: {
				type: String,
				default: 'name'
			},
			list: {
				type: Array,
				default: function() {
					return []
				}
			},
			activeColor:{
				type: String,
				default: '#EFF2FF'
			}
		},
		data() {
			return {
				activeIndex: 0,
			};
		},
		created() {
			this.initData()
		},
		methods: {
			initData() {
				// if(this.type === 'time') {
				// 	let times = []
				// 	for(let i = 0; i< 10; i++){
				// 		times.push(new Date().getFullYear() - i);
				// 	}
				// 	this.list = times
				// }

			},
			timeShow(list) {
				console.log(list)
				this.list = list
			},
			tabClick(item, index) {
				this.activeIndex = index
				this.$emit('change', {
					item,
					index,
					key: this.keys
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	// tabs
	.tabs {
		height: 54rpx;
		white-space: nowrap;

		.tab {
			height: 52rpx;
			margin-right: 34rpx;
			display: inline-block;
			position: relative;
			padding: 0 28rpx;
			background: #F3F3F3;
			border-radius: 36rpx;
			border: 4rpx solid transparent;



			&:first-of-type {
				margin-left: 32rpx;
			}

			&.zero {
				margin-left: 0;
			}

			&.active {
				background: #EFF2FF;

				text {
					color: $u-type-primary;
				}
			}

			text {
				font-size: 24rpx;
				color: #3A3D71;
			}

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
