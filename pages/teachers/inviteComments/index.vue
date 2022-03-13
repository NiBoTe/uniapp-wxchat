<template>
	<view class="inviteComments">
		<view class="header u-flex u-row-between">
			<u-avatar size="186" :src="detail.headUrl" mode="circle"></u-avatar>
			<view class="header-right">
				<view class="title">{{detail.fullName || ''}}</view>
				<view class="subtitle">已评：{{detail.paintEvaluateCount || 0}}副画</view>
			</view>
		</view>
		
		<view class="list">
			<view class="item u-flex" v-for="(item, index) in list" :key="index" @click="itemTap(item, index)">
				
				<view class="left">
					<view class="title">
						<text>{{item.skilledMajorName}}</text>
						<text class="price">{{item.paintEvaluate.price}}元/张</text>
					</view>
					<view class="subtitle">{{item.paintEvaluate.description}}</view>
				</view>
				
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	
	import { teacherPaintEvaluateInfo } from '@/api/teacher.js'
	export default {
		data() {
			return {
				teacherId: null,
				detail: {},
				list: []
			};
		},
		onLoad(options) {
			if(options.teacherId) {
				this.teacherId = options.teacherId
				this.initData()
			}
		},
		methods:{
			initData(){
				this.$http.get(teacherPaintEvaluateInfo, {
					teacherId: this.teacherId
				}).then(res => {
					console.log(res)
					this.detail = res.data;
					this.list = res.data.paintEvaluateList || []
				}).catch(err => {
					console.log(err)
				})
			},
			// 详情
			itemTap(item, index){
				console.log(item)
				
				uni.navigateTo({
					url: `/pages/teachers/inviteComments/detail?teacherId=${this.teacherId}&index=${index}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	
	.inviteComments{
		.header{
			border-top: 2rpx solid #EDEDED;
			border-bottom: 2rpx solid #EDEDED;
			
			padding: 12rpx 42rpx;
			&-right{
				flex: 1;
				margin-left: 28rpx;
				.title{
					font-size: 40rpx;
					font-weight: 600;
					color: #1B1B1B;
				}
				
				.subtitle{
					margin-top: 22rpx;
					font-size: 26rpx;
					color: #3A3D71;
				}
			}
		}
		
		.list{
			
			.item{
				padding: 32rpx 30rpx 28rpx 34rpx;
				border-bottom: 2rpx solid #E9E9E9;
				
				&:last-of-type{
					border-bottom: none;
				}
				.left{
					flex: 1;
					margin-right: 38rpx;
					.title{
						text{
							font-size: 30rpx;
							font-weight: bold;
							color: #3A3D71;
							
							&.price{
								margin-left: 22rpx;
								font-size: 28rpx;
								font-weight: 300;
								color: #2C3AFF;
							}
						}
					}
					
					.subtitle{
						margin-top: 14rpx;
						font-size: 26rpx;
						color: #3A3D71;
						line-height: 36rpx;
					}
				}
				
				.right{
					image{
						width: 28rpx;
						height: 52rpx;
					}
				}
			}
		}
	}

</style>
