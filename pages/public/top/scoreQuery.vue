<template>
	<view class="top">
		<view class="navbar">
			<u-navbar title="成绩查询" back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>


		<view class="content">
			<view class="label">
				<text class="required">*</text>
				<text>考试名称</text>
			</view>

			<view class="item u-flex u-row-between" @click="selectTestTap">
				<view class="left">
					<input type="text" v-model="testName" placeholder="请选择考试名称" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>

			<view class="label">
				<text>准考证号</text>
			</view>

			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="admissionTicketCode" placeholder="请输入准考证号" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>


			<view class="label">
				<text class="required">*</text>
				<text>学生姓名</text>
			</view>

			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="name" placeholder="请输入学生姓名" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>

			<view class="label">
				<text>身份证号</text>
			</view>

			<view class="item u-flex u-row-between">
				<view class="left">
					<input type="text" v-model="identification" placeholder="请输入身份证号" />
				</view>
				<view class="right">
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" :class="testName === '' ? 'disabled' : ''" @click="submitTap">查询</view>
		</view>

		<u-picker mode="selector" v-model="testShow" :range="testList" range-key="name" @confirm="testTap"></u-picker>
	</view>
</template>

<script>
	import {
		examDetail,
		scoreExamList,
		scoreQuery
	} from '@/api/exam.js'
	export default {
		data() {
			return {
				background: {
					backgroundImage: "url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/top_navbar_bg.png')",
					backgroundSize: 'cover',
				},
				testShow: false,
				testList: [],
				id: null,
				loading: true,
				detail: {},
				testItem: null,
				testName: "",
				admissionTicketCode: '',
				identification: '',
				name: '',
			};
		},
		onLoad(options) {
			if (options.id) {
				this.id = options.id;
				this.type = Number(options.type);

				this.getList();
				this.initData();
			}

		},
		methods: {
			initData() {
				this.$http.post(examDetail, {
					id: this.id
				}).then(res => {
					this.detail = res.data;
					this.loading = false;
				}).catch(err => {
					console.log(err)
				})
			},
			getList() {
				this.$http.post(scoreExamList).then(res => {
					this.testList = res.data.records;
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			submitTap() {
				if (this.testName === '') {
					return this.$mHelper.toast('请选择考试名称')
				}
				
				if (this.name === '') {
					return this.$mHelper.toast('请输入学生姓名')
				}

				if (this.identification !== '') {
					if (!this.$mHelper.checkIdCard(this.identification)) {
						return this.$mHelper.toast('请输入正确的身份证号码')
					}
				}

				let params = {
					admissionTicketCode: this.admissionTicketCode,
					identification: this.identification,
					name: this.name,
					queryKey: this.testItem.queryKey,
				}
				
				this.$http.post(scoreQuery, params).then(res => {
					uni.navigateTo({
						url: `/pages/public/top/scoreDetail?scoreItem=${JSON.stringify(params)}`
					})
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
				
			},
			// 选择考试
			selectTestTap() {
				this.testShow = true;
			},
			// 确认选择
			testTap(e) {
				this.testItem = this.testList[e]
				this.testName = this.testList[e].name
			}
		}
	}
</script>

<style lang="scss" scoped>
	.top {
		.content {
			padding: 0 34rpx;

			.label {
				padding: 40rpx 0 26rpx;

				text {
					font-size: 26rpx;
					font-family: PingFangSC-Medium, PingFang SC;
					font-weight: 500;
					color: #3A3D71;

					&.required {
						color: #FF334D;
					}
				}
			}

			.item {
				padding: 0 28rpx;
				height: 88rpx;
				background: #F3F3F3;
				border-radius: 24rpx;

				.left {
					input {
						font-size: 26rpx;
						color: #3A3D71;
					}
				}

				.right {
					image {
						width: 12rpx;
						height: 22rpx;
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

				&.disabled {
					background: #EDEFF2;
					color: #8F9091;
				}
			}
		}
	}
</style>
