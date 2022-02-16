<template>
	<view class="t-index-address">
		<scroll-view class="t-index-address__scroll-view" :scroll-into-view="scrollview" :scroll-y="true"
			:enable-flex="true">
			<view :id="group.letter" v-for="group in list" :key="group.letter">

				<view class="t-index-address__anchor">
					<text>{{ group.letter }}</text>
				</view>

				<view class="t-index-address__list">
					<view class="t-index-address__cell" v-for="(item, index) in group.data" :key="index"
						@click="selectTap(item, index)">
						<text>{{ item.examAddress }}</text>
					</view>
				</view>
			</view>
		</scroll-view>
		<view class="t-index-address__sidebar">
			<view class="t-index-address__index" v-for="group in list" :key="group.letter"
				@touchstart.stop.prevent="onTouchMove(group.letter)" @touchend.stop.prevent="onTouchStop"
				@touchcancel.stop.prevent="onTouchStop">
				<span>{{ group.letter }}</span>
			</view>
		</view>
		<view class="t-index-address__alert" v-if="touchmove">
			<text>{{ activeIndex }}</text>
		</view>
	</view>
</template>

<script>
	export default {
		props: {
			list: {
				type: Array,
				default: function() {
					return []
				}
			}
		},
		data() {
			return {
				scrollview: "A",
				activeIndex: "A",
				touchmove: false,
			};
		},
		watch: {
			activeIndex(value) {
				this.scrollview = value;
			},
		},
		methods: {
			onTouchMove(index) {
				this.activeIndex = index;
				this.touchmove = true;
			},
			onTouchStop() {
				this.touchmove = false;
			},
			selectTap(item, index) {
				this.$emit('select', item)
			}
		}
	};
</script>

<style lang="scss" scoped>
	.t-index-address {
		height: 100%;

		&__scroll-view {
			width: 100%;
			height: 100%;
			max-height: 100vh;
		}

		&__anchor {
			padding: 15rpx 30rpx;
			width: 100%;
			font-size: 28rpx;
			font-weight: 500;
			color: #3A3D71;
		}

		&__list {
			padding: 0 70rpx 0 28rpx;
		}

		&__cell {
			padding: 0 0 28rpx;
			font-size: 26rpx;
			color: #3A3D71;

			&:last-child {
				border-bottom: 1rpx solid #f2f2f2;
				padding-bottom: 30rpx;
			}
		}

		&__sidebar {
			position: fixed;
			top: 54%;
			right: 34rpx;
			padding: 10rpx 0;
			transform: translateY(-50%);
			z-index: 99;
			width: 36rpx;
			text-align: center;
			background: #EDEFF2;
			border-radius: 18rpx;
		}

		&__index {
			padding: 8rpx 0;
			font-size: 20rpx;
			color: #9E9E9E;
			line-height: 1;
		}

		&__alert {
			position: fixed;
			top: 50%;
			right: 90rpx;
			z-index: 99;
			margin-top: -60rpx;
			width: 120rpx;
			height: 120rpx;
			font-size: 50rpx;
			color: #fff;
			border-radius: 24rpx;
			background-color: rgba(0, 0, 0, 0.5);
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
