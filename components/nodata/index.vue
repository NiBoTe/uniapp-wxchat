<template>
	<view class="nodata">
		<view class="image">
			<image :src="setSrc(status + '.png')"></image>
		</view>
		<view class="title">{{title}}</view>
		<view class="subtitle">{{text}}</view>
	</view>
</template>

<script>
	import {
		mapGetters
	} from 'vuex';

	export default {
		props: {
			isShow: {
				type: Boolean,
				default: false
			},
			status: {
				type: String,
				default: 'nonetwork'
			},
			title: {
				type: String,
				default: '网络已断开'
			},
			text: {
				type: String,
				default: '暂时没有XXXX内容'
			}
		},
		mixins: [],
		computed: {
			...mapGetters(['networkStatus'])
		},
		data() {
			return {
				type: '',
			};
		},
		methods: {
			setting(status) {
				/* 检查到网络已打开,请点击按钮手动刷新数据 */
				if (status) {
					this.$emit('handle', status);
					/* 如果没有网络,打开系统设置检查网络连接 */
				}
				// else {
				// 	settings.open(settings.SETTINGS);
				// }
			},
			navTo(route) {
				this.$mRouter.reLaunch({
					route
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.nodata {
		width: 100%;
		margin-top: 210rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;

		.image {
			width: 580rpx;
			height: 460rpx;

			image {
				width: 100%;
				height: 100%;
			}
		}

		.title {
			margin-top: 24rpx;
			font-size: 36rpx;
			font-weight: 600;
			color: #1B1B1B;
		}

		.subtitle {
			margin-top: 10rpx;
			font-size: 28rpx;
			font-weight: 500;
			color: #A8A8A8;
		}
	}
</style>
