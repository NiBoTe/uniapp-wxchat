<template>
	<view class="container">
		<view class="item" @click="detailTap">
			<view class="item-image">
				<u-lazy-load threshold="-450" :image="item.evaluateUrl || item.url">
				</u-lazy-load>
				<!-- <voice-playback></voice-playback> -->
			</view>

			<view class="footer">
				<view class="footer-title u-flex">
					<view class="image">
						<u-avatar size="65" :src="item.userInfo.headUrl"></u-avatar>
					</view>
					<view class="text">
						<text>{{item.userInfo.fullName || ''}}</text>
						<text>作品作者</text>
					</view>
					
				</view>
				
				<view class="footer-text">{{item.title}}</view>
				<view class="footer-subtitle u-flex u-row-between" v-if="item.state !== 'wait_evaluate'">
					<view class="left">
						<text>{{item.score || 0}}</text>
						<text class="unit">分</text>
					</view>
					<view class="right u-flex">
						<image src="/static/public/voice_blue.png"></image>
						<text>{{$mHelper.formatMinutes(item.voiceCommentDuration || 0)}}</text>
					</view>
				</view>
			</view>

			<view class="status u-flex u-row-center" v-if="item.state === 'wait_confirm'">待确认</view>
		</view>
	</view>
</template>

<script>
	import VoicePlayback from '@/components/voicePlayback/voicePlayback.vue'
	export default {
		name: "PaintingEvaluationItem",
		components: {
			VoicePlayback
		},
		props: {
			item: {
				type: Object,
				default: function() {
					return {}
				}
			},
			type: {
				type: String,
				default: 'default'
			},
			source: {
				type: String,
				default: 'list'
			}
		},
		data() {
			return {
				userInfo: null
			};
		},
		mounted() {
			this.getBox()
		},
		methods: {
			getBox() {
				uni.createSelectorQuery().in(this).select('.container').boundingClientRect(result => {
					if (result) {
					} else {
						this.getBox();
					}
				}).exec();
			},
			detailTap() {
				this.userInfo = this.$mStore.state.userInfo;
				if (this.type === 'teacherInfo') {
					if (this.userInfo.roleSelect === 'teacher' && this.item.state === 'wait_evaluate') {
						uni.navigateTo({
							url: `/pages/centers/paintingEvaluation/teacherDetail?id=${this.item.id}&source=${this.source}`
						})
						return
					}
				}
				
				if (this.type === 'teacherInfo') {
					uni.navigateTo({
						url: `/pages/centers/paintingEvaluation/tDetail?id=${this.item.id}&source=${this.source}&type=${this.type}`
					})
				} else {
					uni.navigateTo({
						url: `/pages/centers/paintingEvaluation/detail?id=${this.item.id}&source=${this.source}&type=${this.type}`
					})
				}
				
			}
		}
	}
</script>

<style lang="scss">
	.container {

		width: 100%;

		.item {
			position: relative;
			margin: 10rpx;
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
					-webkit-line-clamp: 1;
					line-clamp: 1;
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

						text.unit {
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


			.status {
				position: absolute;
				top: 0;
				right: 0;
				padding: 0 6rpx 0 10rpx;
				height: 34rpx;
				background: #35CE96;
				border-radius: 0px 12rpx 0px 12rpx;
				font-size: 20rpx;
				color: #FFFFFF;


			}

		}
	}
</style>
