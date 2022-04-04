<template>
	<view class="container">
		<view class="navbar">
			<u-navbar title="订单详情" immersive back-icon-color="#ffffff" :background="background" :border-bottom="false"
				title-color="#ffffff">
			</u-navbar>
		</view>

		<view class="header u-flex">
			<view class="left">
				<image :src="orderDetail.productImgUrl"></image>
			</view>

			<view class="right">
				<view class="title u-line-2">{{orderDetail.productName}}</view>
				<view class="subtitle u-flex">
					<text>订单编号 ：</text>
					<text>{{orderDetail.id}}</text>
				</view>

				<view class="subtitle u-flex">
					<text>订单时间 ：</text>
					<text>{{orderDetail.createdTime}}</text>
				</view>
			</view>
		</view>

		<view class="subheader" style="padding-top: 24rpx;" v-if="orderDetail.isNeedExpress !== 0">
			<view class="subheader-title u-flex u-row-between" v-if="orderDetail.isNeedExpress === 2">
				<view class="left">配送方式 ：{{orderDetail.expressName}}</view>
				<view class="right u-flex" @click="logisticsTap">
					<text>查看物流信息</text>
					<image src="/static/public/arrow_right.png"></image>
				</view>
			</view>
			<view class="item u-flex u-row-between" style="padding-top: 16rpx;" v-if="orderDetail.isNeedExpress === 2">
				<view class="left">
					<text>物流单号 ：{{orderDetail.expressNumber}}</text>
				</view>
				<view class="right">
					<view class="right-btn" @click="copyTap">复制</view>
				</view>
			</view>
			<view class="item" style="padding-top: 16rpx;">
				<view class="left">
					<text>收货地址 ：</text>
					<text>{{orderDetail.address}}</text>
				</view>
			</view>
		</view>


		<!-- 高分教材 -->

		<view class="card">
			<view class="card-title u-flex u-row-between">
				<view class="left">
					<text>支付状态 ：</text>
					<text class="status success" v-if="orderDetail.status === 1">支付成功</text>
					<text class="status" v-else-if="orderDetail.status === 0">未支付</text>
					<text class="status" v-else-if="orderDetail.status === 2">已取消</text>
					<text class="status" v-else-if="orderDetail.status === 3">等待退款</text>
					<text class="status" v-else-if="orderDetail.status === 4">退款处理中</text>
					<text class="status" v-else-if="orderDetail.status === 5">退款完成</text>
					<text class="status" v-else-if="orderDetail.status === 6">已结算</text>
				</view>

				<view class="right">
					<text>费用：</text>
					<text class="unit">¥</text>
					<text class="price">{{orderDetail.price}}</text>
				</view>
			</view>
			<view class="swiper" v-if="productDetail.type === 'image'">
				<view class="swiper-item" :class="{'active':activeIndex === index}"
					v-for="(item, index) in productDetail.items" :key="index" @click="handleClick(index)">
					<image :src="item.hdImg" mode="aspectFit"></image>
				</view>
			</view>


			<view class="works" v-if="productDetail.type === 'image'">
				<view class="works-img" :class="orderDetail.status !== 1 ? 'filter' : ''">
					<image :src="productDetail.items[activeIndex].hdImg" mode="widthFix"></image>
				</view>
				<view class="mask u-flex u-row-center" v-if="orderDetail.status !== 1">
					<image :src="setSrc('highScore/highScore_mask.png')"></image>
				</view>
			</view>


			<view class="description" v-if="productDetail.type === 'image'">
				<view class="title">
					<image src="/static/public/examinationPaper_icon.png" mode=""></image>作品描述
				</view>
				<view class="d-c">{{detail.items[activeIndex].description}}</view>
			</view>


			<view class="video" v-if="productDetail.type === 'video'">
				<video id="myVideo" :direction="90" :src="videoUrl" @loadedmetadata="videoLoadedmetadata" @error="videoErrorCallback"
					@timeupdate='videoUpdate' @ended="videoEnded" @play="palyFlag = true" :controls="false" object-fit="contain"
					enable-play-gesture>
				</video>

				<view class="try u-flex u-row-center" v-if="orderDetail.status !== 1 && !isTrialEnd" @click="submitTap">
					<text>{{palyFlag ? '正在试看，购买后观看完整视频' : '内容可试看'}}</text>
					<view class="try-btn">购买</view>
				</view>

				<view class="trial u-flex u-row-center" v-if="orderDetail.status !== 1 && isTrialEnd">
					<view class="trial-btn u-flex u-row-center" @click="submitTap">购买</view>
					<text>本内容需要购买后才能观看</text>
				</view>


				<view class="panel u-flex">
					<view class="video-play" @click='videoOpreation'>
						<u-icon v-if="!palyFlag" name="play-right-fill" color="#fff" size="28"></u-icon>
						<u-icon v-else name="pause" color="#fff" size="28"></u-icon>
					</view>
					<view class="controls">
						<text>{{currtime}}</text>
						<view class="controls-slider">
							<u-slider v-model="sliderValue" :max="sliderMax" inactive-color="#A5A5A4"
								active-color="#35CE96" :use-slot="true" @moving="sliderChange">
								<view class="block u-flex u-row-center">
									<view class="block-box"></view>
								</view>
							</u-slider>
						</view>
						<text>{{druationTime}}</text>
					</view>

					<view class="video-screen u-flex" @click='videoAllscreen'>
						<image src="/static/public/screen.png"></image>
					</view>
				</view>
			</view>
		</view>
		<view class="footer" v-if="orderDetail.status === 0">
			<view class="footer-btn esc" @click="escTap">取消订单</view>
			<view class="footer-btn" @click="submitTap">立即支付</view>
		</view>

		<view class="footer" v-if="orderDetail.state === 'DELIVERED' && orderDetail.teacherId !== userInfo.id">
			<view class="footer-btn" @click="receivingTap">确认收货</view>
		</view>

		<view class="footer" v-if="orderDetail.state === 'NOT_DELIVERED' && userInfo.id === orderDetail.teacherId">
			<view class="footer-btn" @click="popDeliverShow = true">发货</view>
		</view>

		<!-- 选择地址 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-header">订单取消</view>
			<view class="pop-subheader">请选择取消订单原因</view>
			<view class="pop-content">
				<view class="list">
					<u-radio-group v-model="cancelReason" @change="radioGroupChange" size="40">

						<view class="item u-flex u-row-between" v-for="(item, index) in list" :key="index"
							@click="selectTap(item)">
							<view class="left">{{item.name}}</view>
							<view class="right">
								<u-radio shape="circle" :name="item.name"></u-radio>
							</view>
						</view>

					</u-radio-group>
				</view>
			</view>

			<view class="pop-footer u-flex">
				<view class="pop-btn esc u-flex u-row-center" @click="popShow = false">暂不取消</view>
				<view class="pop-btn u-flex u-row-center" @click="enterTap">确定取消</view>
			</view>
		</u-popup>

		<!-- 发货 -->
		<u-popup v-model="popDeliverShow" mode="bottom" closeable :safe-area-inset-bottom="true" border-radius="40">
			<view class="pop-title"></view>

			<view class="pop-content">
				<view class="pop-address">
					<view class="address u-flex u-row-between">
						<view class="left">
							<text>收货人：{{orderDetail.realname}}</text>
							<text>{{orderDetail.mobile}}</text>
						</view>
						<view class="copy u-flex u-row-center" @click="copyDeliverTap">复制</view>
					</view>

					<view class="text">收货地址 ：{{orderDetail.address}}</view>
				</view>


				<view class="pop-form">
					<view class="form-item u-flex" @click="selectShow = true">
						<view class="left">选择快递公司：</view>
						<view class="right u-flex">
							<input v-model="expressName" type="text" placeholder="请选择" disabled />
							<image src="/static/public/arrow_right.png"></image>
						</view>
					</view>

					<view class="form-item u-flex">
						<view class="left">输入快递单号：</view>
						<view class="right">
							<input v-model="expressNumber" type="text" placeholder="请输入快递单号" maxlength="30" />
						</view>
					</view>

				</view>
			</view>

			<view class="pop-footer u-flex">
				<view class="pop-btn u-flex u-row-center" @click="deliverTap">确定发货</view>
			</view>
		</u-popup>


		<u-select v-model="selectShow" :list="expressData" label-name="name" value-name="id" @confirm="expressConfirm">
		</u-select>
	</view>
</template>

<script>
	import {
		orderDetail,
		orderPay,
		orderCancel,
		confirmDelivered,
		teachingMaterialSetExpressInfo
	} from '@/api/order.js'
	import {
		expressList
	} from '@/api/basic.js'
	import moment from '@/common/moment.js'
	export default {
		data() {
			return {
				popShow: false,
				popDeliverShow: false,
				cancelReason: '',
				orderId: null,
				activeIndex: 0,
				list: [{
						name: '价格有点贵',
						checked: false,
					},
					{
						name: '信息有误',
						checked: false,
					},
					{
						name: '暂时不需要了',
						checked: false,
					},
					{
						name: '其他',
						checked: false,
					}
				],
				orderDetail: {},
				productDetail: {},

				// 视频
				videoUrl: '',
				videoContext: null,
				fullScreenFlag: false,
				duration: 0,
				sliderMax: 100,
				currtime: '00:00', //当前播放时间 字符串 计算后
				druationTime: '00:00', //总时间 字符串 计算后
				sliderValue: 0, //控制进度条slider的值，
				updateState: false, //防止视频播放过程中导致的拖拽失效
				palyFlag: false,
				isTrialEnd: false,
				expressData: [],
				selectShow: false,
				userInfo: {},
				extraData: {},
				expressName: '',
				expressNumber: ''
			};
		},
		onLoad(options) {
			if (options.orderId) {
				this.orderId = options.orderId

				this.initData()
				this.getExpressList();
			}
		},
		onShow() {
			this.userInfo = this.$mStore.state.userInfo;
		},
		onReady: function(res) {
			this.videoContext = uni.createVideoContext('myVideo')
		},
		methods: {

			initData() {
				this.$http.post(orderDetail, {
					orderId: this.orderId
				}).then(res => {
					this.orderDetail = res.data.order
					this.productDetail = res.data.product
					this.extraData = res.data.extraData
					if (this.productDetail.type === 'video') {
						this.videoUrl = this.productDetail.items[0].hdImg
					}
				}).catch(err => {
					console.log(err)
				})
			},

			getExpressList() {
				this.$http.get(expressList).then(res => {
					console.log(res)
					this.expressData = res.data
				}).catch(err => {
					console.log(err)
				})
			},
			radioGroupChange(e) {
				console.log(e)
			},
			selectTap(item) {
				this.value = item.name
			},
			// 取消订单
			escTap() {
				this.popShow = true;
			},
			// 立即支付
			submitTap() {
				this.goPay()
			},
			// 确认收货
			receivingTap() {
				uni.showModal({
					title: '提示',
					confirmText: '确认',
					content: '确认收货吗？',
					success: (res) => {
						if (res.confirm) {
							this.$http.post(confirmDelivered, {
								orderId: this.orderId
							}).then(res => {
								this.initData();
							}).catch(err => {
								this.$mHelper.toast(err.msg)
							})
						}
					}
				});

			},
			goPay() {
				uni.showLoading()
				this.$http.post(orderPay, {
					openid: this.$mStore.state.openid,
					orderId: this.orderId,
					payType: 1,
					tradeType: 'JSAPI'
				}).then(res => {
					let params = res.data
					uni.hideLoading()
					uni.requestPayment({
						provider: 'wxpay',
						timeStamp: params.timeStamp,
						nonceStr: params.nonceStr,
						package: params.packageValue,
						signType: params.signType,
						paySign: params.paySign,
						success: (res) => {
							this.$mHelper.toast('支付成功')
							this.initData()
						},
						fail: (err) => {
							this.$mHelper.toast('支付失败')
						}
					});
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					uni.hideLoading()
				})
			},
			// 取消订单
			enterTap() {
				this.$http.post(orderCancel, {
					orderId: this.orderId,
					cancelReason: this.cancelReason
				}).then(res => {
					this.initData()
					this.$mHelper.toast('取消成功');
					this.popShow = false
				}).catch(err => {
					this.$mHelper.toast(err.msg)
					this.popShow = false
				})
			},
			// 复制
			copyTap() {
				uni.setClipboardData({
					data: this.orderDetail.expressNumber, //要被复制的内容
					success: () => { //复制成功的回调函数
						this.$mHelper.toast('复制成功')
					}
				});
			},
			copyDeliverTap() {
				uni.setClipboardData({
					data: this.orderDetail.mobile, //要被复制的内容
					success: () => { //复制成功的回调函数
						this.$mHelper.toast('复制成功')
					}
				});
			},
			// 选择物流
			expressConfirm(e) {
				console.log(e)
				this.expressName = e[0].label
			},
			// 确定发货
			deliverTap() {
				this.$http.post(teachingMaterialSetExpressInfo, {
					expressName: this.expressName,
					expressNumber: this.expressNumber,
					orderId: this.orderId
				}).then(res => {
					uni.$emit('textbookRefresh', true)
					this.$mHelper.toast('发货成功')
					this.initData()
					this.selectShow = false;
				}).catch(err => {
					this.$mHelper.toast(err.msg)
				})
			},
			// 查看物流
			logisticsTap() {
				uni.navigateTo({
					url: `/pages/set/logistics?orderId=${this.orderId}`
				})
			},
			// 切换图片
			handleClick(index) {
				this.activeIndex = index
			},


			// 全屏+退出全屏
			videoAllscreen(e) {
				console.log(this.fullScreenFlag);
				!this.fullScreenFlag ? this.videoContext.exitFullScreen() : this
					.videoContext.requestFullScreen();
				this.fullScreenFlag = !this.fullScreenFlag;
			},
			// 根据秒获取时间
			formatSeconds(a) {
				var hh = parseInt(a / 3600);
				var mm = parseInt((a - hh * 3600) / 60);
				if (mm < 10) mm = "0" + mm;
				var ss = parseInt((a - hh * 3600) % 60);
				if (ss < 10) ss = "0" + ss;
				if (hh < 10) hh = hh == 0 ? '' : `0${hh}:`;
				var length = hh + mm + ":" + ss;
				if (a >= 0) {
					return length;
				} else {
					return "00:00";
				}
			},
			//开始+暂停
			videoOpreation() {
				!this.palyFlag ? this.videoContext.play() : this.videoContext.pause();
				this.palyFlag = !this.palyFlag;
			},
			// 播放进度变化时触发，event.detail = {currentTime, duration} 。触发频率 250ms 一次
			videoUpdate(e) {
				let duration = e.detail.duration
				let sliderValue = (e.detail.currentTime / duration) * 100;

				if (sliderValue >= this.sliderMax) {
					// this.videoContext.seek(0)
					this.videoContext.pause()

					this.isTrialEnd = true;
				}
				if (this.updateState) { //判断拖拽完成后才触发更新，避免拖拽失效
					this.sliderValue = sliderValue;
				} else {
					this.sliderValue = sliderValue
				}
				this.currtime = this.formatSeconds(e.detail.currentTime);
			},
			// 拖动slider完成后触发
			sliderChange(e) {
				var duration = this.duration;
				var second = this.sliderValue / 100 * duration;
				if (duration) { //完成拖动后，计算对应时间并跳转到指定位置
					this.videoContext.seek(second);
					this.updateState = true //完成拖动后允许更新滚动条
					this.druationTime = this.formatSeconds(duration);
					this.currtime = this.formatSeconds(second);
				} else {}
			},
			// 开始
			contrPlay() {
				this.videoContext.play();
				this.palyFlag = false;
			},
			// 暂停
			pause() {
				this.videoContext.pause(); //站厅播放
				this.palyFlag = true;
			},

			videoErrorCallback: function(e) {
				uni.showModal({
					content: e.target.errMsg,
					showCancel: false
				})
			},
			// 结束
			videoEnded(e) {
				console.log(e)
			},
			videoLoadedmetadata(e) {
				this.duration = e.detail.duration.toFixed(0)
				this.druationTime = this.formatSeconds(this.duration);

				if (this.orderDetail.status !== 1) {
					this.sliderMax = ((this.productDetail.videoTrialDuration * 60 / this.duration) * 100).toFixed(2);
				}
			}

		}
	}
</script>

<style lang="scss" scoped>
	.container {
		min-height: 100vh;
		box-sizing: border-box;
		padding-bottom: 160rpx;

		.navbar {
			height: 360rpx;
			background-image: url('https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/myApplication/navbar_bg.png');
			background-size: cover;
		}

		.header {
			margin: -140rpx 34rpx 0 28rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(161, 161, 161, 0.05);
			border-radius: 24rpx;

			padding: 22rpx;

			.left {
				image {
					width: 180rpx;
					height: 180rpx;
					border-radius: 24rpx;
				}
			}

			.right {
				margin-left: 20rpx;
				flex: 1;

				.title {
					font-size: 28rpx;
					font-weight: bold;
					color: #3A3D71;
					line-height: 40rpx;
				}

				.subtitle {
					margin-top: 10rpx;

					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #35CE96;
						}

						&.price {
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;
						}
					}


				}
			}
		}

		.subheader {
			margin: 28rpx 34rpx 0 28rpx;
			padding: 6rpx 30rpx 36rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			&-title {
				padding-bottom: 32rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.left {
					font-size: 26rpx;
					color: #3A3D71;
				}

				.right {
					text {
						font-size: 24rpx;
						color: #9E9E9E;
					}

					image {
						margin-left: 12rpx;
						width: 12rpx;
						height: 22rpx;
					}
				}
			}

			.item {
				padding-top: 32rpx;

				.left {
					text {
						font-size: 26rpx;
						color: #3A3D71;

						&.status {
							color: $u-type-primary;

							&.success {
								color: #35CE96;
							}
						}
					}
				}

				.right {
					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #35CE96;
						}

						&.price {
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;
						}
					}


					&-btn {
						padding: 0 16rpx;
						display: flex;
						justify-content: center;
						align-items: center;
						height: 38rpx;
						background: #EFF2FF;
						box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
						border-radius: 26rpx;
						font-size: 22rpx;
						color: #2C3AFF;
					}
				}
			}

			.line {
				margin-top: 36rpx;
				height: 2rpx;
				background-color: #E9E9E9;
			}
		}

		.card {
			margin: 28rpx 34rpx 0 28rpx;
			padding: 20rpx 20rpx 34rpx;
			background: #FFFFFF;
			box-shadow: 0px 6rpx 16rpx 6rpx rgba(230, 230, 230, 0.5);
			border-radius: 24rpx;

			&-title {
				padding-bottom: 30rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.left {
					text {
						font-size: 26rpx;
						color: #3A3D71;

						&.status {
							color: $u-type-primary;

							&.success {
								color: #35CE96;
							}
						}
					}
				}

				.right {
					text {
						font-size: 26rpx;
						color: #9E9E9E;

						&.unit {
							font-size: 28rpx;
							font-weight: bold;
							color: #35CE96;
						}

						&.price {
							font-size: 34rpx;
							font-weight: 800;
							color: #35CE96;
						}
					}
				}
			}

			.swiper {
				margin-top: 10rpx;
				width: 100%;
				padding: 40rpx 0;
				overflow-x: scroll;
				white-space: nowrap;

				.swiper-item {
					margin-right: 26rpx;
					display: inline-block;

					image {
						width: 134rpx;
						height: 158rpx;
						border-radius: 5px;
					}
				}

				.active {
					image {
						transform: scale(1.2)
					}
				}
			}

			.works {
				border-radius: 24rpx;
				position: relative;

				&-img {
					border-radius: 24rpx;

					&.filter {
						background: rgba($color: #D8D8D8, $alpha: .6);
						filter: blur(2rpx);
					}

					image {
						width: 100%;
						border-radius: 24rpx;
					}
				}

				.mask {
					position: absolute;
					top: 0;
					right: 0;
					left: 0;
					bottom: 0;
					overflow: hidden;
					border-radius: 24rpx;

					&.mask1 {
						background: rgba($color: #000000, $alpha: .5);
					}

					image {
						width: 478rpx;
						height: 268rpx;

					}
				}
			}

			.description {
				margin-top: 32rpx;

				.title {
					image {
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

				.d-c {
					font-size: 26rpx;
					font-family: PingFangSC-Regular, PingFang SC;
					font-weight: 400;
					color: #3A3D71;
					line-height: 36rpx;
				}
			}

			.video {
				margin-top: 30rpx;
				height: 548rpx;
				position: relative;

				#myVideo {
					width: 100%;
					height: 548rpx;
				}

				.try {
					padding: 0 20rpx;
					position: absolute;
					bottom: 100rpx;
					left: 34rpx;
					height: 68rpx;
					background: rgba(0, 0, 0, 0.7);
					border-radius: 16rpx;

					&>text {
						font-size: 24rpx;
						color: #FFFFFF;
					}

					&-btn {
						margin-left: 24rpx;
						font-size: 24rpx;
						font-weight: 800;
						color: #35CE96;
					}
				}

				.trial {
					flex-direction: column;
					position: absolute;
					z-index: 2;
					top: 0;
					right: 0;
					left: 0;
					bottom: 0;

					&-btn {
						margin-bottom: 24rpx;
						width: 178rpx;
						height: 74rpx;
						background: #35CE96;
						border-radius: 37rpx;
						font-size: 28rpx;
						font-weight: 500;
						color: #FFFFFF;
					}

					text {
						font-size: 24rpx;
						color: #FFFFFF;
					}
				}

				// 视频操作面板
				.panel {
					position: absolute;
					bottom: 46rpx;
					left: 54rpx;
					right: 54rpx;

					.controls {
						margin: 0 28rpx 0 34rpx;
						flex: 1;
						display: flex;
						align-items: center;

						&-slider {
							flex: 1;
							margin: 0 18rpx 0 36rpx;

							.block {
								width: 28rpx;
								height: 28rpx;
								border-radius: 50%;
								background: rgba($color: #35CE96, $alpha: .49);

								&-box {
									width: 16rpx;
									height: 16rpx;
									border-radius: 50%;
									background: #35CE96;
								}
							}
						}

						&>text {
							font-size: 24rpx;
							font-weight: 500;
							color: #FFFFFF;
						}
					}

					.video-screen {
						image {
							width: 34rpx;
							height: 34rpx;
						}
					}
				}
			}
		}

		.footer {
			position: fixed;
			bottom: 0;
			left: 0;
			right: 0;
			z-index: 999;
			display: flex;
			justify-content: center;
			padding: 14rpx 34rpx;
			padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
			padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
			background-color: #fff;

			&-btn {
				flex: 1;
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

				&.esc {
					margin-right: 34rpx;
					background: #EFF2FF;
					box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
					color: #3A3D71;
				}
			}
		}


		.pop-title {
			height: 112rpx;
			border-bottom: 2rpx solid #E9E9E9;
		}

		.pop-header {
			margin: 0 34rpx 0 28rpx;
			padding: 40rpx 0;
			text-align: center;
			font-size: 32rpx;
			font-weight: bold;
			color: #3A3D71;
			border-bottom: 2rpx solid #E9E9E9;
		}

		.pop-subheader {
			margin: 38rpx 0 0 28rpx;
			font-size: 24rpx;
			color: #9E9E9E;
		}

		.pop-content {
			.list {
				padding: 0 34rpx 0 28rpx;

				.item {
					margin-top: 60rpx;

					.left {
						font-size: 26rpx;
						font-weight: bold;
						color: #3A3D71;
					}
				}
			}


			.pop-address {
				padding: 32rpx 20rpx 24rpx 28rpx;
				border-bottom: 2rpx solid #E9E9E9;

				.address {
					.left {
						text {
							margin-right: 60rpx;
							font-size: 26rpx;
							color: #3A3D71;
						}
					}

					.copy {
						padding: 16rpx;
						height: 46rpx;
						background: #EFF2FF;
						box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
						border-radius: 26rpx;
						font-size: 22rpx;
						color: $u-type-primary;
					}
				}

				.text {
					margin-top: 12rpx;
					font-size: 26rpx;
					color: #3A3D71;
				}
			}

			.pop-form {
				.form-item {
					padding: 14rpx 10rpx 0 28rpx;

					.left {
						font-size: 26rpx;
						color: #3A3D71;
					}

					.right {
						display: flex;
						align-items: center;
						flex: 1;
						height: 58rpx;
						padding: 0 30rpx 0 10rpx;
						background: #FFFFFF;
						border: 2rpx solid rgba(158, 158, 158, 0.34);
						border-radius: 6rpx;

						input {
							flex: 1;
							font-size: 26rpx;
							color: #3A3D71;
						}

						image {
							width: 12rpx;
							height: 22rpx;
						}
					}
				}
			}
		}

		.pop-footer {
			padding: 60rpx 34rpx 34rpx 28rpx;

			.pop-btn {
				flex: 1;
				height: 88rpx;
				background: #EFF2FF;
				box-shadow: 0px 6rpx 14rpx 2rpx rgba(235, 235, 235, 0.14);
				border-radius: 44rpx;

				font-size: 32rpx;
				color: $u-type-primary;

				&.esc {
					margin-right: 34rpx;
				}
			}
		}
	}
</style>
