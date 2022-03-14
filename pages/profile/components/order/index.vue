<template>
	<view class="container">
		
		<view class="subtabs">
			<drawingColumn ref="DrawingColumn" :list="allList" key-name="name" @change="tabChange">
			</drawingColumn>
			
			<view class="status u-flex" @click="statusTap()">
				<text>订单状态</text>
				<image src="/static/public/arrow_down.png"></image>
			</view>
		</view>
		
		
		<!-- 我的报名 -->
		<sign-up v-show="activeIndex === 0" ref="SignUp"></sign-up>
		
		<!-- 高分试卷 -->
		<high-score v-show="activeIndex === 1" ref="HighScore"></high-score>
		
		<!-- 高分教材 -->
		<text-book v-show="activeIndex === 2" ref="TextBook"></text-book>
		
		<!-- 评画 -->
		<paintingEvaluation v-show="activeIndex === 3" ref="PaintingEvaluation"></paintingEvaluation>
		
		<!-- 状态 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-content">
				<view class="pop-list">
					<view class="pop-item" @click="statusItemTap('')">全部</view>
					<view class="pop-item" @click="statusItemTap('COMPLETED')">付款成功</view>
					<view class="pop-item" @click="statusItemTap('NOT_PAY')">未支付</view>
					<view class="pop-item" @click="statusItemTap('CLOSED')">交易关闭</view>
					<u-gap height="14" bg-color="#F9F9F9"></u-gap>
					<view class="pop-item" @click="popShow = false">取消</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	
	import SignUp from './signUp.vue'
	import HighScore from './highScore.vue'
	import TextBook from './textbook.vue'
	import PaintingEvaluation from './paintingEvaluation.vue'
	export default {
		name: "Order",
		components:{
			SignUp,
			HighScore,
			TextBook,
			PaintingEvaluation
		},
		data() {
			return {
				popShow: false,
				isFixed: false,
				allList: [
					{
						name: '我的报名',
						value: 0
					},{
						name: '高分试卷',
						value: 1
					},{
						name: '高分教材',
						value: 2
					},{
						name: '评画',
						value: 3
					}
				],
				activeIndex: 0,
				state: 0,
				list: []
			}
		},
		created() {
			
		},
		methods: {
			noScroll(bool) {
				this.isFixed = bool
				this.$refs.SignUp.noScroll(this.isFixed)
				this.$refs.HighScore.noScroll(this.isFixed)
				this.$refs.TextBook.noScroll(this.isFixed)
				this.$refs.PaintingEvaluation.noScroll(this.isFixed)
			},
			tabChange(e) {
				this.activeIndex = e.index;
			},
			statusTap(){
				this.popShow = true;
			},
			// 选择状态
			statusItemTap(status) {
				this.$refs.SignUp.refresh(status)
				this.$refs.HighScore.refresh(status)
				this.$refs.TextBook.refresh(status)
				this.$refs.PaintingEvaluation.refresh(status)
				this.popShow = false;
			},
		}
	}
</script>


<style lang="scss" scoped>
	
	.subtabs {
		padding: 28rpx 0;
		background-color: #fff;
		
		.status{
			margin-top: 28rpx;
			margin-right: 34rpx;
			justify-content: flex-end;
			text{
				margin-right: 20rpx;
				font-size: 26rpx;
				color: #3A3D71;
			}
			
			image{
				width: 26rpx;
				height: 16rpx;
			}
		}
	}
	// 弹窗
	.pop-content {
		.pop-list {
			.pop-item {
				padding: 40rpx 0;
				border-bottom: 1rpx solid #D8D8D8;
				text-align: center;
				font-size: 30rpx;
				color: #3A3D71;
	
				&:nth-last-of-type(-n+2) {
					border-bottom: 0;
				}
			}
		}
	}
</style>
