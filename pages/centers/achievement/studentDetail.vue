<template>
	<view class="studentDetail">
		<view class="navbar">
			<u-navbar title="个人信息" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		
		<view class="header u-flex">
			<view class="header-img">
				<view class="default u-flex u-row-center" v-if="userInfo.url === ''">
					<image :src="setSrc('myApplication/user.png')"></image>
				</view>
				<image v-else :src="userInfo.url"></image>
			</view>
			
			<view class="header-main">
				<view class="name u-flex u-row-between">
					<text>{{userInfo.name}}</text>
					<view class="update u-flex u-row-center" @click="updateTap">
						<image :src="setSrc('myApplication/update.png')"></image>
						<text>修改信息</text>
					</view>
				</view>
				
				<view class="text u-flex">
					<text>性别</text>
					<image :src="setSrc(`myApplication/${userInfo.gender === '女' ? 'woman' : 'man'}.png`)"></image>
					<text>{{userInfo.gender}}</text>
				</view>
				
				<view class="text u-flex">
					<text>手机号：{{userInfo.mobile}}</text>
				</view>
				
				<view class="text u-flex">
					<text>身份证号：{{userInfo.identification}}</text>
				</view>
			</view>
		</view>
		<u-gap height="16" bg-color="#F7F7F7"></u-gap>
		
		<view class="list">
			<view class="item u-flex u-row-between">
				<view class="left">报名状态</view>
				<view class="right">
					<text class="success" v-if="userInfo.state === 'tested'">已考</text>
					<text class="error" v-else-if="userInfo.state === 'untested'">未考</text>
					<text class="nopay" v-else-if="userInfo.state === 'not_pay'">未支付</text>
				</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="left">考生来源</view>
				<view class="right">
					<text>{{userInfo.province}}</text>
				</view>
			</view>
			<view class="item u-flex u-row-between">
				<view class="left">报名时间</view>
				<view class="right">
					<text>{{userInfo.createTime}}</text>
				</view>
			</view>
			
			
		</view>
	</view>
</template>

<script>
	
	import { examineeDetail } from '@/api/exam.js'
	export default {
		data() {
			return {
				id: null,
				userInfo: {}
			};
		},
		
		onLoad(options) {
			if (options.id) {
				this.id = options.id
				
			}
		},
		onShow() {
			this.initData()
		},
		methods:{
			initData(){
				this.$http.post(examineeDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.userInfo = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			updateTap(){
				uni.navigateTo({
					url: `/pages/centers/achievement/updateStudent?item=${JSON.stringify(this.userInfo)}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.studentDetail{
		.navbar {
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}
		
		.header{
			
			margin: 40rpx 32rpx 40rpx 28rpx;
			&-img{
				width: 150rpx;
				height: 210rpx;
				border-radius: 12rpx;
				overflow: hidden;
				& > image{
					width: 100%;
					height: 100%;
				}
				
				.default{
					width: 100%;
					height: 100%;
					background: #F3F3F3;
					
					image{
						width: 104rpx;
						height: 114rpx;
					}
				}
			}
			
			&-main{
				margin-left: 38rpx;
				flex: 1;
				
				.name{
					& > text{
						font-size: 36rpx;
						font-weight: bold;
						color: #3A3D71;
					}
					
					.update{
						width: 190rpx;
						height: 68rpx;
						background: #F3F3F3;
						border-radius: 34px;
						image{
							width: 24rpx;
							height: 24rpx;
						}
						text{
							margin-left: 10rpx;
							font-size: 24rpx;
							color: #1B1B1B;
						}
					}
				}
				
				.text{
					
					text{
						font-size: 26rpx;
						color: #3A3D71;
					}
					
					image{
						margin: 0 8rpx 0 2rpx;
						width: 40rpx;
						height: 40rpx;
					}
				}
			}
		}
	
	
	
		
		.list{
			.item{
				
				margin: 0 34rpx 0 28rpx;
				padding: 28rpx 0;
				border-bottom: 2rpx solid #E9E9E9;
				.left{
					font-size: 26rpx;
					color: #3A3D71;
				}
				
				.right{
					
					
					text{
						font-size: 26rpx;
						color: #3A3D71;
						
						&.nopay{
							color: $u-type-primary;
						}
						
						&.success{
							color: #35CE96;
						}
						
						&.error {
							color: #FF334D;
						}
					}
				}
				
				&:last-of-type{
					border-bottom: none;
				}
			}
		}
	
	}

</style>
