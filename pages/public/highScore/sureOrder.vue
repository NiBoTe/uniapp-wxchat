<template>
	<view class="sure-order">
		<scroll-view scroll-y class="content">
		
		<view class="top">
			<view class="top-t">
				<view v-if="detail && detail.isNeedExpress">
					<view class="operation" @click="selectTap">
						<view class="left">
							收货地址
						</view>
						<view class="right">
							<text v-if="addressDetail">修改</text>
							<text v-else>选择地址</text>
							<u-icon name="arrow-right" color="#8A8A8A" size="28"></u-icon>
						</view>
					</view>
					<view class="user" @click="selectTap" v-if="addressDetail">
						<view class="tag"
							:class="addressDetail.tag === '家' ? 'home' : addressDetail.tag === '公司' ? 'company' : 'school'">
							{{addressDetail.tag}}
						</view>
						<view class="user-name">
							{{addressDetail.realname}}
						</view>
						<view class="user-iphone">
							{{addressDetail.mobile}}
						</view>
					</view>
					<view class="address" @click="selectTap" v-if="addressDetail">
						{{addressDetail.areaNames.replace(/,/g, ' ')}}{{addressDetail.address}}
					</view>
					<view class="line">
					
					</view>
				</view>
				
		
				<view class="parameter-list">
					商品名称 ：{{detail.question.title}}
				</view>
				<view class="parameter-list">
					商品数量 ：1张
					<view class="price">
						¥<text>{{detail.price}}</text>
					</view>
				</view>
			</view>
		</view>
		
		<view class="t-b"></view>
		
		<view class="swiper">
			<view class="swiper-item" :class="{'active':activeIndex === index}" v-for="(item, index) in 10" @click="handleClick(index)">
				<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648733409&t=90c4ab51cbe0340472155652f1dc5b26" mode=""></image>
			</view>
		</view>
	
		<view class="works">
			<image src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2F4k%2Fs%2F02%2F2109242332225H9-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1648733409&t=90c4ab51cbe0340472155652f1dc5b26" mode=""></image>
		</view>
		
		<view class="checkbox">
			<u-checkbox-group>
				<u-checkbox v-model="checked" size="28" icon-size="20" shape="circle"><text>我已阅读并同意 </text><text
						class="agreement">《付费内容使用协议》</text>
				</u-checkbox>
			</u-checkbox-group>
		</view>
		
		</scroll-view >
		<view class="footer">
			<view class="footer-btn">立即购买</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				activeIndex: 0 
			};
		},
		methods:{
			handleClick(index){
				this.activeIndex = index
			}
		}
	}
</script>

<style lang="scss">
	.sure-order{
		display: flex;
		flex-direction: column;
		height: 100vh;
		
		
		
		.top {
			width: 100%;
			// padding-bottom: 160rpx;
		
			.img {
				width: 100%;
				box-sizing: border-box;
				padding: 28rpx 34rpx;
		
				image {
					width: 100%;
					border-radius: 16rpx;
				}
			}
		
			.top-t {
				padding: 28rpx 34rpx;
		
				.operation {
					display: flex;
		
					.left {
						flex: 1;
						font-size: 26rpx;
						font-family: Helvetica;
						color: #3A3D71;
					}
		
					.right {
						text-align: right;
						flex: 1;
						font-size: 26rpx;
						font-family: PingFangSC-Regular, PingFang SC;
						font-weight: 400;
						color: #9E9E9E;
					}
		
					margin-bottom: 28rpx;
				}
		
				.user {
					view {
						display: inline-block;
					}
		
					.tag {
						background: #EFF2FF;
						border-radius: 23rpx;
						padding: 10rpx 34rpx;
						font-weight: 500;
		
						&.home {
							background-color: #EFF2FF;
							color: $u-type-primary;
						}
		
						&.school {
							background-color: #FFF3EA;
							color: #FF8827;
						}
		
						&.company {
							background-color: rgba(53, 206, 150, 0.08);
							color: #35CE96;
						}
					}
		
					.user-name {
						margin-left: 24rpx;
						font-size: 28rpx;
						font-family: Helvetica;
						color: #3A3D71;
						line-height: 46rpx;
					}
		
					.user-iphone {
						margin-left: 26rpx;
						font-size: 26rpx;
						font-family: PingFang-SC-Regular, PingFang-SC;
						font-weight: 400;
						color: #8F9091;
					}
				}
		
				.address {
					font-size: 26rpx;
					font-family: PingFang-SC-Regular, PingFang-SC;
					font-weight: 400;
					color: #3A3D71;
					margin-top: 22rpx;
				}
		
				.line {
					width: 100%;
					height: 2rpx;
					background: #E9E9E9;
					margin-top: 26rpx;
				}
		
				.parameter-list {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
					margin-top: 28rpx;
					position: relative;
		
					.price {
						position: absolute;
						right: 0rpx;
						top: 0rpx;
						text-align: right;
						font-size: 28rpx;
						font-family: PingFang-SC-Bold, PingFang-SC;
						color: #3A3D71;
		
						text {
							font-size: 40rpx;
							font-family: PingFang-SC-Heavy, PingFang-SC;
							font-weight: 800;
						}
					}
				}
		
			}

		
		}
		
		
		
		
		.line {
			width: calc(100% - 68rpx);
			height: 2rpx;
			background: #E9E9E9;
			margin: 34rpx auto 22rpx;
		}
		.content{
			flex: 1;
			overflow: auto;
		}
		.footer{
			flex: 0 0 240rpx;
			border-top: 1rpx solid #EDEDED;
			.footer-btn{
				width: 682rpx;
				height: 88rpx;
				background: #2C3AFF;
				box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;
				text-align: center;
				margin: 24rpx auto 0;
				font-size: 32rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #FFFFFF;
				line-height: 88rpx;
			}
		}
		.tro{
			padding: 0 34rpx;
			.title{
				font-size: 28rpx;
				font-family: Helvetica;
				color: #3A3D71;
			}
			.pre{
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
				 text-overflow: -o-ellipsis-lastline;
				  overflow: hidden;
				  text-overflow: ellipsis;
				  display: -webkit-box;
				  -webkit-line-clamp: 2;
				  line-clamp: 2;
				  -webkit-box-orient: vertical;
			}
		}
		.t-b{
			width: 100%;
			height: 16rpx;
			background: #F7F7F7;
		}
		.checkbox{
			padding: 0 34rpx;
		}
		.swiper{
			margin-top: 10rpx;
			width: 100vw;
			padding: 40rpx 34rpx;
			overflow-x: scroll;
			white-space:nowrap;
	
			.swiper-item{
				margin-right: 26rpx;
				display: inline-block;
				image{
					width: 134rpx;
					height: 158rpx;
					border-radius: 5px;
				}
			}
			.active{
				image{
					transform:scale(1.2)
				}
			}
		}
		.works{
			padding: 0 34rpx;
			image{
				width: 100%;
			}
		}
		.tabs{
			padding: 0 34rpx;
			width: 100%;
			height: 76rpx;
			font-size: 28rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #9E9E9E;
			line-height: 76rpx;
			position: relative;
			margin: 28rpx 0;
			.tabs-in{
				width: 216rpx;
				height: 76rpx;
				background: #F3F3F3;
				border-radius: 46rpx;
				position: absolute;
				right: 34rpx;
				top: 0;
				display: flex;
				padding: 8rpx;
				.left{
				  flex: 1;
				}
				.right{
					flex: 1;
					
				}
				.coms{
					width: 100rpx;
					height: 60rpx;
					line-height: 60rpx;
					text-align: center;
				}
				.tabs-active{
					background: #FFFFFF;
					border-radius: 36rpx;
				}
			}
		}
		.description{
			padding: 0 34rpx;
			.title{
				image{
					width: 48rpx;
					height: 48rpx;
					vertical-align: bottom;
					margin-right: 20rpx;
				}
				font-size: 32rpx;
				font-family: Helvetica;
				color: #3A3D71;
				margin-bottom: 28rpx;
			}
			.d-c{
				font-size: 26rpx;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: #3A3D71;
				line-height: 36rpx;
			}
		}
		.delivery-content{
			padding: 0 34rpx;
			display: flex;
			.left{
				flex: 1;
				image{
					width: 48rpx;
					height: 48rpx;
					vertical-align: bottom;
					margin-right: 20rpx;
				}
				font-size: 32rpx;
				font-family: Helvetica;
				color: #3A3D71;
				margin-bottom: 28rpx;
			}
			.right{
					flex: 1;
					text-align: right;
			}
		}
	}
</style>
