<template>
	<view class="container">
		<view class="item" @click="detailClick(item.id)">
			<view class="item-image">
				<u-lazy-load threshold="-450" :image="item.image"></u-lazy-load>
				<voice-playback></voice-playback>
			</view>

			<view class="footer">
				<view class="footer-text">色彩-色彩静物基础临色彩-色彩静物基础临,色彩-色彩静物基础临色彩-色彩静物基础临,色彩-色彩静物基础临色彩-色彩静物基础临</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import VoicePlayback from '@/components/voicePlayback/voicePlayback.vue'
	export default {
		name: "PaintingEvaluationItem",
		components:{
			VoicePlayback
		},
		props: {
			item: {
				type: Object,
				default: function() {
					return {}
				}
			}
		},
		data() {
			return {

			};
		},
		mounted() {
			this.getBox()
		},
		methods:{
			getBox() {
				uni.createSelectorQuery().in(this).select('.container').boundingClientRect(result => {
					if (result) {
						console.log('==========1111', result)
					} else {
						getBox();
					}
				}).exec();
			},
			
			// 进入详情
			detailClick(item){
				console.log('dianji',item)
				// this.$mRouter.push({
				// 	route: `/pages/teachers/commentDrawing/detail`
				// })
				uni.navigateTo({
					url: '/pages/teachers/commentDrawing/detail'
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {

		width: 100%;

		.item {
			// margin: 10rpx;
			margin-bottom: 24rpx;
			background: #FFFFFF;
			border-radius: 16rpx;

			&-image {
				position: relative;
				overflow: hidden;
				border-top-left-radius: 16rpx;
				border-top-right-radius: 16rpx;
			}


			.footer {
				padding-bottom: 10rpx;

				&-title {
					position: relative;
					z-index: 2;
					margin-top: 20rpx;
					padding: 0 20rpx;

					.image {
						padding: 4rpx;
						text-align: center;
						overflow: hidden;
						border-radius: 50rpx;
						background-color: #fff;

						image {
							width: 65rpx;
							height: 65rpx;
						}
					}

					.text {
						margin-left: 10rpx;
						font-size: 24rpx;
						color: #3A3D71;
						display: flex;
						flex-direction: column;
						text {
							&:last-of-type {
								font-size: 20rpx;
								color: #909399;
							}
						}
					}
				}


				&-text {
					padding: 22rpx 20rpx 0;
					text-overflow: -o-ellipsis-lastline;
					overflow: hidden;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					line-clamp: 2;
					-webkit-box-orient: vertical;
					font-size: 26rpx;
					color: #3A3D71;
					
				}

				&-subtitle {
					border-top: 4rpx solid #E9E9E9;
					margin-top: 22rpx;
					padding: 10rpx 20rpx 0;

					.left {
						
						font-size: 50rpx;
						font-weight: 600;
						color: $u-type-primary;
						text.unit{
							margin-left: 4rpx;
							font-size: 28rpx;
							font-weight: 400;
							color: #3A3D71;
						}
					}

					.right {
						align-items: flex-start;

						image {
							width: 18rpx;
							height: 28rpx;
						}

						text {
							margin-left: 10rpx;
							font-size: 20rpx;
							color: #3A3D71;
						}
					}
				}
			}


		}
	}
</style>
