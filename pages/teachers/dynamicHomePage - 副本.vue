<template>
	<view class="dynamic-container">
		<view class="dynamic-header">
			<view class="">
				<image class="dynamic-header-back" src="../../static/public/teacherDynamic/d_icon_back.png" mode=""></image>
			</view>
			<view class="">
				<image class="dynamic-header-fx" src="../../static/public/teacherDynamic/d_icon_fx.png" mode=""></image>
			</view>
		</view>
		<view class="dynamic-main">
			<view class="main-top main-item">
				<view class="main-top-item header-img">
					<image class="headerimg" src="../../static/login_wechat.png" mode=""></image>
					<image class="header-auth" src="../../static/public/auth.png" mode="" v-show="status == '1'"></image>
				</view>
				<view class="main-top-item">
					<view class="text">关注</view>
					<view class="num">652</view>
				</view>
				<view class="main-top-item ">
					<view class="text">粉丝</view>
					<view class="num">865w</view>
				</view>
				<view class="gz">已关注</view>
			</view>
			<view class="person-name main-item">刘泉海·LQH</view>
			<view class="lable main-item">
				<view v-for="(item,index) in lableList">{{item}}</view>
			</view>
			<view class="describe">
				<text>毕业于中国美术学院雕塑系第一工作室，中国美术学院雕塑系硕士考试专业居全国第一名2008年中国美;毕业于中国美术学院雕塑系第一工作室，中国美术学院雕塑系硕士考试专业居全国第一名2008年中国美;毕业于中国美术学院雕塑系第一工作室，中国美术学院雕塑系硕士考试专业居全国第一名2008年中国美…</text>
				<text class="more">展开</text>
				
			</view>
			<u-collapse :item-style="itemStyle" event-type="close" arrow="1111" :accordion="accordion" >
				<u-collapse-item :index="index" @change="itemChange" :title="item.head" v-for="(item, index) in itemList" :key="index">
					<view class="collapse-item">
						{{item.body}}
					</view>
				</u-collapse-item>
			</u-collapse>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				status:1,
				// 标签
				lableList:['色彩','素描','速写'],
				itemList: [{
					head: "周围一些不起眼的人、事、物，或许都隐藏着不同凡响的智慧",
					body: "但是据说雕刻大卫像所用的这块大理石，曾被多位雕刻家批评得一无是处，有些人认为这块大理石采凿得不好，有些人嫌它的纹路不够美",
					open: false,
				}],
			}
		},
		methods: {
			
		}
	}
</script>

<style lang="scss" scoped>
.dynamic-header{
	background: #ECF5FF;
	display: flex;
	justify-content: space-between;
	padding: 110rpx 34rpx;
	height: 490rpx;
	background: rgba(0,0,0,0.4);
	&-back{
		width: 20rpx;
		height: 36rpx;
	}
	&-fx{
		width: 72rpx;
		height: 72rpx;
	}
}
.dynamic-main{
	height: 620rpx;
	background: #FFFFFF;
	border-radius: 40rpx 40rpx 0rpx 0rpx;
	margin-top: -306rpx;	
	padding: 0 34rpx;
}
.main-top{
	display: flex;
	position: relative;
	height: 50px;
	.header-img{
		position: relative;
		top: -74rpx;
		width: 194rpx;
		margin-right: 44rpx;
		.headerimg{
			width: 194rpx;
			height: 194rpx;
			background: #FFFFFF;
			padding: 8rpx;
			border-radius: 50%;
		}
		.header-auth{
			width:56rpx;
			height: 56rpx;
			position: absolute;
			bottom: -30px;
			right: 5rpx;
		}
	}
	.main-top-item{
		margin-right: 46rpx;
		.text{
			font-size: 24rpx;
			font-family: PingFangSC-Regular, PingFang SC;
			font-weight: 400;
			color: #888C90;
			margin: 20rpx 0 9rpx 0;
		}
		.num{
			font-size: 30rpx;
			font-family: PingFang-SC-Heavy, PingFang-SC;
			font-weight: 800;
			color: #333333;
		}
	}
	.gz{
		position: absolute;
		top: 30rpx;
		right: 34rpx;
		width: 190rpx;
		height: 68rpx;
		line-height: 68rpx;
		background: #F3F3F3;
		text-align: center;
		border-radius: 34rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Medium, PingFang SC;
		font-weight: 500;
		color: #888C90;
	}
}
.person-name{
	font-size: 40rpx;
	font-family: PingFangSC-Semibold, PingFang SC;
	font-weight: 600;
	color: #1B1B1B;
	line-height: 40rpx;
	margin-top: 40rpx;
	margin-bottom: 26rpx;
}
.lable{
	display: flex;
	view{
		width: 84rpx;
		height: 42rpx;
		background: #EFF2FF;
		border-radius: 21px;
		margin-right: 30rpx;
		font-size: 24rpx;
		font-family: PingFangSC-Regular, PingFang SC;
		font-weight: 400;
		color: #676A8B;
		line-height: 42rpx;
		margin-bottom: 20rpx;
		text-align: center;
	}
}
.describe{
	font-size: 28rpx;
	font-family: PingFangSC-Regular, PingFang SC;
	font-weight: 400;
	color: #1B1B1B;
	line-height: 40rpx;
	
	text-overflow: -o-ellipsis-lastline;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	line-clamp: 2;
	-webkit-box-orient: vertical;
	position: relative;
	.more{
		color: #2C3AFF;
		position: absolute;
		bottom: 0;
		right: 0;
	}
}
</style>
