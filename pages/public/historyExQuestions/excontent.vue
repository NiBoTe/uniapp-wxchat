<template>
	<view class="exdetail">

		<view class="navbar">
			<u-navbar title="考试内容" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>
		<scroll-view class="top" scroll-y="true">
			<view class="name">
				{{exam.name || ''}}
			</view>
			<view class="subjects">
				{{subjectName || ''}}
			</view>
			<view class="list">
				<view class="left">
					考试题目：
				</view>
				<view class="right">
					{{question.title || ''}}
				</view>
			</view>
			<view class="list">
				<view class="left">
					考试要求：
				</view>
				<view class="right">{{question.content || ''}}</view>
			</view>

			<view class="list">
				<view class="left">
					考试图片：
				</view>
				<view class="right img-list" v-if="imgList.length > 1">
					<view class="img-item" v-for="(item, index) in imgList" :key="index" @click="imgPrevTap(item, index)">
						<image :src="item.thumbImg">
						</image>
					</view>
					<!-- <view class="placeholder"></view> -->
				</view>
				<view class="right img-list one" v-else>
					<view class="img-item">
						<image :src="imgList[0].thumbImg" mode="widthFix">
						</image>
					</view>
					<!-- <view class="placeholder"></view> -->
				</view>
			</view>

			<view class="list">
				<view class="left">
					备注：
				</view>
				<view class="right">
					{{question.remark || ''}}
				</view>
			</view>


		</scroll-view>
		<view class="footer">
			<view class="footer-btn" @click="detailTap">高分试卷</view>
		</view>
	</view>
</template>
<script>
	import {
		questionDetail
	} from '@/api/history_exam.js'
	export default {
		components: {

		},
		data() {
			return {
				questionId: null,
				subjectName: null,
				question: null,
				exam: null,
				imgList: []
			}
		},
		onLoad(options) {
			if (options.questionId) this.questionId = options.questionId;
			if (options.subjectName) this.subjectName = options.subjectName;
			this.initData();
		},
		methods: {
			initData() {
				this.$http.post(questionDetail, null, {
					params: {
						questionId: this.questionId
					}
				}).then(res => {
					console.log(res)
					this.exam = res.data.exam;
					this.question = res.data.question;
					this.imgList = res.data.imgs;
				}).catch(err => {
					console.log(err)
				})
			},
			// 预览图片
			imgPrevTap(item, index){
				console.log(item)
			},
			// 查看高分试卷
			detailTap(){
				this.$mRouter.push({
					route: `/pages/public/historyExQuestions/topScoreList?questionId=${this.questionId}`
				})
			}
		}
	}
</script>
<style lang="scss">
	.exdetail {
		height: 100vh;
		overflow: hidden;
		.navbar {
			height: 206rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png');
			background-size: cover;
		}

		.top {
			margin-top: -55rpx;
			height: 100%;
			padding-bottom: 160rpx;
			background-color: #fff;
		}
	}

	.name {
		padding-top: 30rpx;
		line-height: 30rpx;
		text-align: center;
		font-size: 30rpx;
		color: #3A3D71;
	}

	.subjects {
		text-align: center;
		font-size: 34rpx;
		font-family: PingFang-SC-Bold, PingFang-SC;
		font-weight: bold;
		color: #3A3D71;
		line-height: 34rpx;
		margin-top: 20rpx;
	}

	.list {
		margin-top: 30rpx;
		display: flex;

		.left {
			font-size: 26rpx;
			font-family: PingFang-SC-Bold, PingFang-SC;
			font-weight: bold;
			color: #3A3D71;
			line-height: 30rpx;
			flex: 0 0 160rpx;
			padding-left: 28rpx;
		}

		.right {
			flex: 1;
			font-size: 26rpx;
			font-family: PingFang-SC-Regular, PingFang-SC;
			font-weight: 400;
			color: #3A3D71;
			line-height: 36rpx;
			padding-right: 34rpx;
		}

		.img-list {
			display: flex;
			flex-wrap: wrap;
			flex-direction: row;
			justify-content: space-between;
			
			
			
			&:after {
				display: block;
				content: "";
				width: 31%;
				height: 0px;
			}



			&.one{
				.img-item{
					width: 100% !important;
					image{
						width: 100% !important;
					}
				}
			}
			.img-item {
				width: 31%;

				image {
					width: 176rpx;
					height: 176rpx;

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
		&-btn {
			height: 88rpx;
			line-height: 88rpx;
			text-align: center;
			background: $u-type-primary;
			box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: #fff;
			
			&.disabled{
				background: #EDEFF2;
				color: #8F9091;
			}
		}
	}
</style>
