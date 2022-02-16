<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="评画详情" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="content">
			<view class="content-img">
				<image src="/static/public/teacherDynamic/d_photo.png" mode=""></image>
			</view>
			<view class="content-describe content-item">
				色彩进阶-色彩静物基础练习
			</view>
			<view class="content-score content-item" v-for="(item,index) in 2">
				<view class="content-score-title">
					<!-- ！！！需要换成网络图 -->
					<image src="/static/login_wechat.png" mode=""></image>
					<text>纬度分析</text>
				</view>
				<view class="content-score-title dimensional-analysis">
					<view class="">构图</view>
					<view class=""><u-rate v-model="value"  :count="count" :disabled="true" size="36" active-color="#35CE96" inactive-color="#E3E3E3" gutter="16" inactive-icon="star-fill"></u-rate></view>
				</view>
				<view class="content-score-text">
					物体的刻画和塑形都表现得非常好，线条的走形粗细也很流畅，整体明暗关系表现得也非常清晰明了。
				</view>
			</view>
			<!-- 评语 -->
			<view class="content-comments content-score content-item" v-for="(item,index) in 1">
				<view class="content-score-title">
					<!-- ！！！需要换成网络图 -->
					<image src="/static/login_wechat.png" mode=""></image>
					<text>文字评语</text>
				</view>
				
				<view class="content-score-text">
					形体表现还是非常不错的，对于你高二才开设这么课程能画出这种程度的学生占比不多，好好表现。
				</view>
			</view>
			<!-- 总评语 语音 -->
			<view class="content-voice">
				<view class="content-voice-text">
					总评语
				</view>
				<view class="voice">
					<view class="">
						<image class="voice-l-icon" src="/static/public/voice_blue.png" mode=""></image>
						<text>02:30</text>
					</view>
					<view class="">
						<!-- ！！！需要换成网络图 -->
						<image class="voice-r-icon" src="/static/login_wechat.png" mode=""></image>
					</view>
				</view>
			</view>
		</view>
		<!-- 评论 -->
		<view class="comments">
			<view class="comments-total">{{total}}条评论</view>
			<!-- 评论内容 -->
			<view class="comments-main" v-for="(item,index) in 4">
				<view class="comments-main-item">
					<view class="item-l">
						<image class="headerimg" src="/static/login_wechat.png" mode=""></image>
					</view>
					<view class="item-r">
						<view class="item-r-top">
							<view class="item-r-name">王维嘉</view>
							<view class="item-r-lable">作品作者</view>
						</view>
						<view class="item-r-details">
							谢谢刘老师的细心评教，后期我要向刘老师多多学习努力奋斗啊
						</view>
						<view class="item-r-time"><text class="time">12-20</text><text>回复</text></view>
					</view>
				</view>
				<view class="additional-review">
					<view class="comments-main-item">
						<view class="item-l">
							<image class="headerimg" src="/static/login_wechat.png" mode=""></image>
						</view>
						<view class="item-r">
							<view class="item-r-top">
								<view class="item-r-name">莉娜同学</view>
								<view class="item-r-lable">作品作者</view>
								<!-- 预留判断 -->
								<!-- <view class="item-r-review">
									<view class="triangle"></view>
									<view class="">莉娜同学</view>
								</view> -->
							</view>
							<view class="item-r-details">
								谢谢刘老师的细心评教，后期我要向刘老师多多学习努力奋斗啊
							</view>
							<view class="item-r-time"><text class="time">12-20</text><text>回复</text></view>
						</view>
					</view>
					<view class="comments-main-item">
						<view class="item-l">
							<image class="headerimg" src="/static/login_wechat.png" mode=""></image>
						</view>
						<view class="item-r">
							<view class="item-r-top">
								<view class="item-r-name">王维嘉</view>
								<view class="item-r-lable">作品作者</view>
								<view class="item-r-review">
									<view class="triangle"></view>
									<view class="">莉娜同学</view>
									<view class="item-r-lable">优秀学生</view>
								</view>
							</view>
							<view class="item-r-details">
								王维嘉老师，下次带我一起找刘老师评画
							</view>
							<view class="item-r-time"><text class="time">12-20</text><text>回复</text></view>
						</view>
					</view>
					<view class="comments-main-item">
						<view class="item-l">
							<image class="headerimg" src="/static/login_wechat.png" mode=""></image>
						</view>
						<view class="item-r">
							<view class="item-r-top">
								<view class="item-r-name">莉娜同学</view>
								<view class="item-r-lable">优秀学生</view>
								<view class="item-r-review">
									<view class="triangle"></view>
									<view class="">王维嘉</view>
									<view class="item-r-lable">作品作者</view>
								</view>
							</view>
							<view class="item-r-details">
								后天吧，我还有一张头像没画完
							</view>
							<view class="item-r-time"><text class="time">12-20</text><text>回复</text></view>
						</view>
					</view>
				</view>
				
			</view>
		</view>
		<!-- 发布评论 -->
		<view class="footer">
			<input type="text" placeholder="说一下你的想法..." value="" />
			<view class="footer-img">
				<image src="/static/login_wechat.png" mode=""></image>
				<image src="/static/login_wechat.png" mode=""></image>
				<image src="/static/login_wechat.png" mode=""></image>
			</view>
		</view>
	</view>
</template>

<script>
	// import TopTips from './components/top-tips.vue' 
	export default {
		// components: {
		// 	TopTips	
		// },
		data() {
			return {
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				
				count: 5,	//打分总颗数
				value: 2,	//打分颗数
				
				total:109,	//评论条数
								
			};
		},
		methods:{
			submitTap(){
				this.$refs.TopTips.open();
			},
			enterClick(){
				this.$mRouter.push({
					route: '/pages/public/top/signUp'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		height: 100%;
		// min-height: calc(100vh);
		background-color: #F3F3F3;
		font-family: PingFangSC-Medium, PingFang SC;
	}

	.navbar {
		height: 146rpx;
		// background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
		// background-size: cover;
	}

	.content {
		// height: calc(100vh - 146rpx);
		overflow: auto;
		padding-bottom: calc(134rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(134rpx + env(safe-area-inset-bottom));
		margin: 0 34rpx;
		background: #fff;
		border-radius: 24rpx;
		margin-bottom: 40rpx;
		&-img{
			image{
				width: 100%;
				height: 910rpx;
				border-radius: 24rpx 24rpx 0 0;
			}
		}
		&-describe{
			padding: 0 36rpx 0 34rpx;
			width: 100%;
			height: 84rpx;
			line-height: 84rpx;
			font-size: 30rpx;
			font-weight: 400;
			color: #3A3D71;
			border-bottom: 2rpx solid #E9E9E9;
		}
		&-score{
			padding: 28rpx 36rpx 0rpx 34rpx;
			&-title{
				image{
					width: 48rpx;
					height: 48rpx;
					margin-right: 16rpx;
					vertical-align: middle;
				}
				text{
					font-size: 28rpx;
					font-weight: 500;
					color: #3A3D71;
				}
			}
			.dimensional-analysis{
				display: flex;
				justify-content: space-between;
				margin: 30rpx 0 26rpx 0;
				font-size: 28rpx;
				font-weight: 500;
				color: #3A3D71;
			}
			.content-score-text{
				font-size: 26rpx;
				font-weight: 400;
				color: #3A3D71;
				padding-bottom: 22rpx;
				border-bottom: 2rpx solid #E9E9E9;
			}
		}
		
		&-comments{
			.content-score-text{
				margin-top: 28rpx;
			}
		}
		&-voice{
			padding: 28rpx 36rpx 40rpx 34rpx;
			display: flex;
			&-text{
				font-size: 36rpx;
				font-family: PingFang-SC-Bold, PingFang-SC;
				font-weight: bold;
				color: #3A3D71;
				margin-right: 36rpx;
				line-height: 80rpx;
			}
			.voice{
				display: flex;
				justify-content: space-between;
				flex: 1;
				background: #EFF2FF;
				height: 80rpx;
				border-radius: 50rpx;
				padding: 0rpx 10rpx 0 20rpx;
				view{
					line-height: 80rpx;
				}
				&-l-icon{
					width: 24rpx;
					height: 34rpx;
					vertical-align: middle;
					margin-right: 16rpx;
				}
				text{
					vertical-align: middle;
					font-size: 24rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;
				}
				&-r-icon{
					width: 60rpx;
					height: 60rpx;
					vertical-align: middle;
				}
			}
		}
		
	}

	// 评论
	.comments{
		padding: 40rpx 0;
		background: #fff;
		&-total{
			font-size: 32rpx;
			font-weight: 600;
			color: #3A3D71;
			text-align: center;
			margin-bottom: 38rpx;
		}
		&-main{
			margin-bottom: 34rpx;
			border-bottom: 2rpx solid #E9E9E9;
			padding: 0 34rpx;
			&-item{
				display: flex;
				margin-bottom: 40rpx;
			}
			.item-l{
				margin-bottom: 40rpx;
				width: 80rpx;
				height: 80rpx;
				margin-right: 18rpx;
				.headerimg{
					width: 80rpx;
					height: 80rpx;
				}
			}
			.item-r{
				&-top{
					// display: flex;
					margin-bottom: 14rpx;
				}
				&-top view{
					display: inline-block;
				}
				&-name{
					margin-right: 22rpx;
					font-size: 28rpx;
					font-family: PingFang-SC-Bold, PingFang-SC;
					font-weight: bold;
					color: #3A3D71;
				}
				&-lable{
					width: auto;
					height: 32rpx;
					line-height: 32rpx;
					background: #EFF2FF;
					border-radius: 16rpx;
					text-align: center;
					font-size: 22rpx;
					font-weight: 400;
					color: #8D90B8;
					margin-top: 4rpx;
					padding: 0 10rpx;
				}
				&-details{
					font-size: 28rpx;
					font-family: PingFangSC-Light, PingFang SC;
					font-weight: 300;
					color: #3A3D71;
					// line-height: 20px;
					margin-bottom: 14rpx;
				}
				&-time{
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #9E9E9E;
					.time{
						margin-right: 24rpx;
					}
				}
			}
			.additional-review{
				margin-left: 98rpx;
				.item-r-review{
					color: #9E9E9E;
					display: inline-block;
					.triangle{
						width: 0;
						height: 0;
						border-top: 18rpx solid transparent;
						border-left: 25rpx solid #9E9E9E;
						border-bottom: 18rpx solid transparent;
						margin-left: 12rpx;
						margin-right: 16rpx;
						border-radius: 10rpx;
					}
				}
				.item-r-review view{
					vertical-align: middle;
				}
			}
		}
	
	}
	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		padding: 14rpx 34rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;
		z-index:9999;
		border: 2rpx solid #EDEDED;
		&-img{
			position: absolute;
			top: 30rpx;
			right: 24rpx;
		}
		image{
			width: 42rpx;
			height: 44rpx;
			vertical-align: middle;
			margin-right: 30rpx;
		}
		input{
			width: 100%;
			height: 80rpx;
			background: #F7F7F7;
			border-radius: 16rpx;
			padding: 26rpx;
			line-height: 80rpx;
		}
		input::-webkit-input-placeholder { 
		    color:rgba(153,153,153,1);
			text-align: right; 
		}
	}
</style>
