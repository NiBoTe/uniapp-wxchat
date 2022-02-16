<template>
	<!-- 动态 -->
	<view class="container">
		<scroll-view scroll-y="true" class="scroll-warper" @scrolltolower="lower">
			<!-- <u-waterfall v-model="flowList" ref="uWaterfall">
				<template v-slot:left="{leftList}">
					<view class="item item-left" v-for="(item, index) in leftList" :key="index">
						<painting-evaluation-item :item="item"></painting-evaluation-item>
					</view>
				</template>
				<template v-slot:right="{rightList}">
					<view class="item item-right" v-for="(item, index) in rightList" :key="index">
						<painting-evaluation-item :item="item"></painting-evaluation-item>
					</view>
				</template>
			</u-waterfall>
			<u-loadmore bg-color="rgb(240, 240, 240)" :status="loadStatus" @loadmore="addRandomData"></u-loadmore> -->
			<view class="content">
				<view class="" v-for="(item,index) in 4">
					<view class="content-subheader">
						<view class="subheader-text u-line-2">
							文艺复兴是指13世纪末在意大利各城市兴起，以后扩展到西欧各国，于16世纪在欧洲盛行的一场思想文化运动，带来一段科学与艺术革命以后扩绘画领域来艺术革命以后扩…
							<view class="fold" bindtap="fold" :data-text="foldText" :data-etc="textEtc"></view>
						</view>
					</view>
					<view class="content-main">
						<image src="/static/public/teacherDynamic/d_photo.png" mode=""></image>
					</view>
					<view class="content-rate u-flex">
						<view class="rate-item u-flex u-row-between">
							<view>
								<image class="icon" src="/static/public/dynamic_star.png" mode=""></image>
								<text>295</text>
							</view>
							<view>
								<image class="icon" src="/static/public/dynamic_praise.png" mode=""></image>
								<text>295</text>
							</view>
							<view></view>
							<view>
								<image class="icon" src="/static/public/dynamic_share.png" mode=""></image>
								<text>分享</text>
							</view>
						</view>
					</view>
				</view>
				
			</view>
		</scroll-view>
	</view>
</template>

<script>
	import PaintingEvaluationItem from '@/pages/teachers/commentDrawing/paintingEvaluationItem.vue'
	export default {
		name: "PaintingEvaluation",
		components: {
			PaintingEvaluationItem
		},
		data() {
			return {
				StatusBar: this.StatusBar,
				foldText: '全文',
				textEtc: '...',
				loadStatus: 'loadmore',
				}
		},
		created() {
			console.log('---------')
			// this.addRandomData();
		},

		methods: {
			lower() {
				console.log('=========')
				this.loadStatus = 'loading';
				// 模拟数据加载
				// setTimeout(() => {
				// 	this.addRandomData();
				// 	this.loadStatus = 'loadmore';
				// }, 1000)
			},
			// addRandomData() {
			// 	for (let i = 0; i < 10; i++) {
			// 		let index = this.$u.random(0, this.list.length - 1);
			// 		// 先转成字符串再转成对象，避免数组对象引用导致数据混乱
			// 		let item = JSON.parse(JSON.stringify(this.list[index]))
			// 		item.id = this.$u.guid();
			// 		this.flowList.push(item);
			// 	}
			// },
			
		}
	}
</script>


<style lang="scss" scoped>
	.scroll-warper {
		height: calc(100vh - 94rpx);
		background: #F3F3F3;
		padding: 0 34rpx;
	}
	.content {
		// margin-top: 50rpx;
		position: relative;
		// background-color: #fff;
		// border-radius: 40rpx 40rpx 0px 0px;
	
		&-header {
			padding: 0 34rpx;
	
			.head {
				margin-top: -72rpx;
				margin-right: 42rpx;
	
				&-img {
					position: relative;
					width: 202rpx;
					height: 202rpx;
					background-color: #fff;
					border-radius: 50%;
					overflow: hidden;
	
					image {
						width: 186rpx;
						height: 186rpx;
						border-radius: 50%;
					}
				}
	
				&-auth {
					position: relative;
					z-index: 9;
					margin-top: -28rpx;
					display: flex;
					justify-content: center;
	
					image {
						width: 136rpx;
						height: 46rpx;
	
					}
				}
			}
	
	
			.header-item {
				display: flex;
				flex-direction: column;
				align-items: center;
	
				text {
					font-size: 24rpx;
					color: #888C90;
	
					&.num {
						display: block;
						margin-top: 18rpx;
						font-size: 30rpx;
						font-weight: 800;
						color: #3A3D71;
					}
				}
			}
	
			.header-update {
				padding: 0 28rpx 0 28rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				height: 68rpx;
				background: #F3F3F3;
				border-radius: 34rpx;
	
				image {
					width: 24rpx;
					height: 24rpx;
				}
	
				text {
					margin-left: 10rpx;
					font-size: 24rpx;
					color: #3A3D71;
				}
			}
		}
	
	
		&-subheader {
			padding: 18rpx 28rpx 18rpx 34rpx;
	
			.name {
				font-size: 40rpx;
				font-weight: 600;
				color: #1B1B1B;
			}
	
			.subheader-list {
				margin-top: 18rpx;
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
			}
	
			.subheader-text {
				margin-top: 14rpx;
				position: relative;
				line-height: 46rpx;
				font-size: 26rpx;
				color: #3A3D71;
	
				.fold::before {
					//设置在文本下面的展开按钮那一部分，此部分的前面设置——...省略号，并通过绝对定位设置在超出部分的后面
					content: attr(data-etc);
					position: absolute;
					left: 0;
					transform: translateX(4rpx);
	
				}
	
				.fold::after {
					//设置文本下面的展开按钮的那一部分，此部分的后面设置——展开  展开按钮，并通过绝对定位设置在省略号的后面
					content: attr(data-text);
					position: absolute;
					right: 0;
					color: $u-type-primary;
				}
	
				.fold {
					//展开按钮的那一部分，同样设置绝对定位，并设置宽高，将通过样式实现的省略号遮住，同时将::before和::after展开的内容设置在里面
					width: 110rpx;
					height: 45rpx;
					position: absolute;
					right: 0;
					bottom: 0;
					background-color: #F3F3F3;
				}
	
				.foldIntroduct {
					//出现此样式名时，设置不出现省略号和展开按钮
					-webkit-line-clamp: inherit !important;
				}
			}
		}
	
	
	
		&-rate {
			padding: 0 32rpx 0 36rpx;
	
			.rate-item {
				flex: 1;
				height: 68rpx;
				// background: linear-gradient(270deg, rgba(248, 250, 255, 0) 0%, #EFF2FF 100%);
				border-radius: 12rpx;
	
				.icon{
					width: 36rpx;
					height: 35rpx;
					vertical-align: text-bottom;
					margin-right: 12rpx;
					font-size: 26rpx;
					font-family: PingFang-SC-Medium, PingFang-SC;
					font-weight: 500;
					color: #3A3D71;
				}
			}
		}
	
		.tabs {
			padding-top: 4rpx;
			background-color: #fff;
		}
	
		.borderBottom {
			margin-top: -10rpx;
			height: 2rpx;
			border: 2rpx solid #E9E9E9;
		}
	
		.subtabs {
			// padding: 28rpx 0;
			padding-top: 28rpx;
		}
		&-main{
			padding: 0 28rpx 0 28rpx;
			height: 330rpx;
			width: 100%;
			image{
				width: 100%;
				height: 100%;
			}
		}
	}	
	
</style>
