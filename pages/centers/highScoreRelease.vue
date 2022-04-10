<template>
	<view class="center">
		<view class="content">
			<view class="title u-flex u-row-center">
				<input v-model="title" type="text" placeholder="输入标题" maxlength="20" />
			</view>
			<view class="header">
				<textarea v-model="description" placeholder="输入详情内容…" maxlength="120" />
				<view class="header-length" :class="description.length ? 'active' : ''">{{description.length}}/120
				</view>
			</view>

			<view class="upload">
				<view class="inner" v-if="type === 'image'">
					<movable-area class="movable-area">
						<u-row gutter="12" style="width: 100%;">
							<u-col span="4" v-for="(item, index) in imgsList" :key="index">
								<view class="item" @click="prevTap(index)" @touchstart="longtap" @touchend="touchend"
									@touchmove.stop="touchm">
									<image :src="type === 'image' ? item.url : item.cover"></image>
									<view class="cover u-flex u-row-center" v-if="type === 'image' && index === 0">封面
									</view>
									<view class="close" @click.stop="deleteTap(index)">
										<u-icon name="minus-circle-fill" :color="themeColor" size="44"></u-icon>
									</view>
									<view class="video-play" v-if="type === 'video'" @click="prevVideoTap(index)">
										<u-icon name="play-circle-fill" color="#E8E9EB" size="108"></u-icon>
									</view>
									<view class="remark u-flex u-row-center" @click.stop="imgDecTap(index)">
										{{item.description === '' ? '添加描述' : '查看描述'  }}
									</view>
								</view>
							</u-col>

							<u-col span="4" v-if="cover === '' || !imgsList.length">
								<view class="add u-flex u-row-center" @click="addTap()">
									<u-icon name="plus" color="#9E9E9E" size="80"></u-icon>
									<view class="add-tips" v-if="!imgsList.length">仅支持.JPG、MP4格式</view>
									<view class="add-tips-copy" v-if="type === 'video' && cover === ''">请上传视频封面</view>
								</view>
							</u-col>
						</u-row>
						<movable-view class="movable-view" :x="x" :y="y" direction="all" damping="5000" friction="1"
							v-show="active">
							<view class="item-move" :class="{'item-move-active': active}">
								<image class="img" :src="imgsList[beginIndex].url"></image>
							</view>
						</movable-view>
					</movable-area>
				</view>

				<u-row gutter="12" v-else>
					<u-col span="4" v-for="(item, index) in imgsList" :key="index">
						<view class="item" @click="prevTap(index)">
							<image :src="type === 'image' ? item.url : item.cover"></image>
							<view class="cover u-flex u-row-center" v-if="type === 'image' && index === 0">封面</view>
							<view class="close" @click.stop="deleteTap(index)">
								<u-icon name="minus-circle-fill" :color="themeColor" size="44"></u-icon>
							</view>
							<view class="video-play" v-if="type === 'video'" @click="prevVideoTap(index)">
								<u-icon name="play-circle-fill" color="#E8E9EB" size="108"></u-icon>
							</view>
							<view class="remark u-flex u-row-center" @click.stop="imgDecTap(index)">
								{{item.description === '' ? '添加描述' : '查看描述'  }}
							</view>
						</view>
					</u-col>
					<u-col span="4" v-if="type === 'video' && cover !== ''">
						<view class="item" @click="prevTap(-1)">
							<image :src="cover"></image>
							<view class="close" @click.stop="deleteTap(-1)">
								<u-icon name="minus-circle-fill" :color="themeColor" size="44"></u-icon>
							</view>
						</view>
					</u-col>

					<u-col span="4" v-if="cover === '' || !imgsList.length">
						<view class="add u-flex u-row-center" @click="addTap()">
							<u-icon name="plus" color="#9E9E9E" size="80"></u-icon>
							<view class="add-tips" v-if="!imgsList.length">仅支持.JPG、MP4格式</view>
							<view class="add-tips-copy" v-if="type === 'video' && cover === ''">请上传视频封面</view>
						</view>
					</u-col>

				</u-row>
			</view>
			<u-gap height="16" bg-color="#F7F7F7" margin-top="40"></u-gap>
			<view class="list">
				<view class="item u-flex u-row-between">
					<view class="left">商品价格</view>
					<view class="right u-flex">
						<input class="price" v-model="price" type="digit" placeholder="输入商品价格" maxlength="10"
							placeholder-style="font-size:26rpx;font-weight: 400;" />
						<text class="unit">元</text>
					</view>
				</view>

				<view class="item u-flex u-row-between" @click="selectTap">
					<view class="left">选择科目</view>
					<view class="right u-flex u-row-center">
						<input type="text" v-model="subjectName" disabled placeholder="科目/内容" />
						<image src="/static/public/arrow_right.png"></image>
					</view>
				</view>

				<view class="item u-flex u-row-between" v-if="type === 'image'">
					<view class="left">允许查看高清图数量</view>
					<view class="right u-flex u-row-center">
						<input type="number" v-model="hdImgViewCount" placeholder="请输入张数" maxlength="2" />
					</view>
				</view>
				<view class="item u-flex u-row-between" v-else>
					<view class="left">视频试看时长</view>
					<view class="right u-flex u-row-center">
						<input type="number" v-model="videoTrialDuration" @input="onInput" placeholder="分钟，输入1-20的整数"
							maxlength="2" />
					</view>
				</view>
				<view class="item u-flex u-row-between">
					<view class="left">是否需要发货</view>
					<view class="right u-flex u-row-center">
						<u-switch @change="switchChange" v-model="isNeedExpress" :active-color="themeColor"
							inactive-color="#E8E9EB">
						</u-switch>
					</view>
				</view>

				<view class="item u-flex u-row-between" v-if="isNeedExpress">
					<view class="left">发货内容说明</view>
					<view class="right u-flex u-row-center">
						<input type="text" v-model="expressContent" placeholder="请输入发货内容说明" />
					</view>
				</view>
			</view>
		</view>
		<view class="footer">
			<view class="footer-btn" :class="title === '' ? 'disabled' : ''" @click="submitTap">发布</view>
		</view>

		<!-- 添加描述 -->
		<u-popup v-model="popShow" mode="bottom" :safe-area-inset-bottom="true" border-radius="24" closeable>
			<view class="pop-content">
				<view class="pop-header">
					<image :src="type === 'image' ? imgsList[selectIndex].url : imgsList[selectIndex].cover"></image>
				</view>

				<view class="pop-textarea">
					<textarea v-model="remark" placeholder="请输入作品描述…" maxlength="120"
						placeholder-style="font-size:24rpx;font-weight: 400;color: #B0B3BF;" />
					<view class="pop-textarea-length">{{remark.length}}/120</view>
				</view>
			</view>
			<view class="pop-footer">
				<view class="btn u-flex u-row-center" @click="addDecTap">确认提交</view>
			</view>
		</u-popup>


		<!-- 预览视频 -->
		<u-mask :show="maskShow" @click="maskShow = false">
			<view class="video u-flex u-row-center">
				<view class="video-box" @click.stop="">
					<video id="videoContext" :direction="90" :src="imgsList[selectIndex].url" controls
						:poster="imgsList[selectIndex].cover"></video>
				</view>
			</view>
		</u-mask>
	</view>
</template>

<script>
	let wrapW = 0, // 拖拽范围的总宽度
		wrapH = 0, // 拖拽范围的总高度
		wrapW2 = 0, // 可拖拽区域宽度
		wrapH2 = 0, // 可拖拽区域高度
		wrapTop = 0, // 拖拽范围的上边界坐标
		wrapLeft = 0, // 拖拽范围的左边界坐标
		wrapDragTop = 0, // 可拖拽范围的上边界坐标
		wrapDragLeft = 0, // 可拖拽范围的左边界坐标
		itemW = 0, // 拖拽元素的宽
		itemH = 0, // 拖拽元素的高
		itemXNun = 0; // 拖拽元素的列数

	import {
		generatePostPolicy,
		financeConfig
	} from '@/api/basic.js'
	import {
		myAddTeachingMaterial,
		myDetail,
		myMenuList2
	} from '@/api/teaching_material.js'
	export default {
		data() {
			return {
				id: null,
				title: '',
				description: '', // 详细内容
				expressContent: '', // 发货内容
				cover: '', // 封面
				price: '', // 价格
				type: 'image', // 内容类型 video-视频 image-图片
				hdImgViewCount: '', // 允许查看高清图数量
				videoTrialDuration: '', // 视频试看时长
				themeColor: this.$mConstDataConfig.themeColor,
				imgsList: [],
				isNeedExpress: true,
				subjectName: '',
				subject: {},
				popShow: false,
				selectIndex: 0,
				remark: '',
				mediaType: ['image', 'video'],
				videoCover: '',
				maskShow: false,
				videoContext: null,

				// 拖拽
				active: false, // 是否拖拽状态
				flag: false, // 是否可拖拽
				x: 0,
				y: 0,
				beginIndex: null, // 当前拖拽元素的索引
				deliverOvertime: 0, // 发货超时天数
			};
		},

		onLoad(options) {
			this.getConfig()
			if (options.id) {
				this.id = options.id;
				this.initData();
			}
		},
		watch: {
			maskShow(val) {
				if (!val) {
					this.videoContext.stop()
				}
			},
			imgsList() { // 监听数组变化
				let l = this.imgsList.length
				if (l) { // 有图片或图片数量改变时重新初始化
					this.init()
				}
			}
		},
		onReady() {
			this.init()
			this.videoContext = uni.createVideoContext('videoContext')
		},
		methods: {

			getConfig() {
				this.$http.get(financeConfig).then(res => {
					this.deliverOvertime = res.data.deliverOvertime
				})
			},
			init() { // 初始化数据
				// 设置拖拽区域信息
				let wrap = uni.createSelectorQuery().in(this).select('.inner')
				wrap.boundingClientRect(data => {
					// console.log(data)
					wrapW = data.width // 设置拖拽范围的总宽度
					wrapH = data.height // 设置拖拽范围的总高度
					wrapTop = data.top // 设置拖拽范围的上边界坐标
					wrapLeft = data.left // 设置拖拽范围的左边界坐标
					this.setNodeWH()
				}).exec()
			},
			setNodeWH() { // 设置拖拽元素的宽高
				// 获取拽拖元素的信息
				let item = uni.createSelectorQuery().in(this).select('.item')
				item.boundingClientRect(data => {
					// console.log(data)
					itemW = data.width // 拖拽元素的宽度
					itemH = data.height // 拖拽元素的高度
					this.setDragData()
				}).exec()
			},
			setDragData() { // 设置拖拽区域及元素配置
				wrapDragTop = wrapTop + itemH / 2 // 设置拖拽范围上边距
				wrapDragLeft = wrapLeft + itemW / 2 // 设置可拖拽范围左边距
				wrapW2 = wrapW - itemW // 设置可拖拽区域宽度
				wrapH2 = wrapH - itemH // 设置可拖拽区域高度
				itemXNun = Math.round(wrapW / itemW) - 1 // 设置拖拽元素的列数
			},
			longtap(e) { // 长按
				const left = e.currentTarget.offsetLeft,
					top = e.currentTarget.offsetTop
				this.beginIndex = this.computationIndex({
					left: left,
					top: top
				}) // 获取所在位置索引
				this.x = left
				this.y = top
				this.active = true
				this.flag = true
			},
			computationIndex(e) { // 计算元素索引
				const left = e.left,
					top = e.top
				let index = 0, // 计算拖拽元素所在的索引位置
					x = Math.round(left / itemW), // 计算拖拽元素所在的横向索引位置
					y = Math.round(top / itemH), // 计算拖拽元素所在的纵向索引位置
					num = itemXNun * y
				if (x && !y) { // 第一行
					index = x
				}
				if (y) { // 第一行以下
					index = x + y + num
				}
				return index
			},
			touchm(e) { // 拖拽过程
				if (this.flag) {
					let x = e.touches[0].pageX - wrapDragLeft,
						y = e.touches[0].pageY - wrapDragTop
					if (x < 0) {
						x = 0
					}
					if (x > wrapW2) {
						x = wrapW2
					}
					if (y < 0) {
						y = 0
					}
					if (y > wrapH2) {
						y = wrapH2
					}
					this.x = x
					this.y = y
				}
			},
			touchend(e) { // 拖拽结束
				this.active = false
				const left = e.currentTarget.offsetLeft,
					top = e.currentTarget.offsetTop
				if (!this.flag || this.x === left && this.y === top) {
					return
				}
				const x = this.x, // 计算拖拽横向距离
					y = this.y, // 计算拖拽纵向距离
					itemNum = this.imgsList.length - 1 // 拖拽元素的总数量
				let endIndex = this.computationIndex({
					left: x,
					top: y
				}) // 获取所在位置索引
				if (endIndex > itemNum) {
					endIndex = itemNum
				}
				// 交换位置
				const beginIndex = this.beginIndex // 当前拖拽元素索引
				let data = this.imgsList,
					tem = data[beginIndex]
				data[beginIndex] = data[endIndex]
				data[endIndex] = tem
				this.flag = false
			},
			initData(id) {
				this.$http.get(myDetail, {
					id: this.id
				}).then(res => {
					let params = res.data;
					this.type = params.type;
					this.title = params.title;
					this.description = params.description;
					this.isNeedExpress = params.isNeedExpress;
					this.expressContent = params.expressContent;
					this.hdImgViewCount = params.hdImgViewCount;
					this.videoTrialDuration = params.videoTrialDuration;
					this.price = params.price;
					this.getMenuList(params);

					// _this.imgsList.push({
					// 	url: r,
					// 	cover: list[i].thumbTempFilePath,
					// 	description: ''
					// });
					let list = []
					params.items.map(item => {
						list.push({
							id: item.id,
							url: item.url,
							cover: params.type === 'image' ? '' : params.cover,
							description: item.description
						})
					})
					this.imgsList = list;
					if (params.type === 'video') {
						this.cover = params.cover
					}
				}).catch(err => {
					console.log(err)
				})
			},
			getMenuList(params) {
				this.$http.post(myMenuList2).then(res => {
					let list = res.data;
					// this.subjectName = `${data.subject.name}-${data.subjectType.name}`
					// this.subject = data
					// subject: this.list[this.nameActive],
					// subjectType: this.list[this.nameActive].childMenus[this.typeActive]
					list.map(a => {
						if (a.id === params.firstMenuId) {
							this.subject['subject'] = a
							a.childMenus.map(b => {
								if (b.id === params.secondMenuId) {
									this.subject['subjectType'] = b
								}
							})
						}
					})

					if (this.subject.subject && this.subject.subjectType) {
						this.subjectName = `${this.subject.subject.name}-${this.subject.subjectType.name}`
					}

				})
			},
			addTap() {
				if (this.imgsList.length >= 9) {
					return this.$mHelper.toast('最多只能上传9张')
				}
				// 从相册选择图片
				const _this = this;
				uni.chooseMedia({
					count: _this.type === 'image' && _this.imgsList.length >= 1 ? 9 : 1,
					mediaType: _this.type === 'video' && _this.cover === '' ? ['image'] : _this.mediaType,
					sourceType: ['album', 'camera'],
					sizeType: ['original', 'compressed'],
					maxDuration: 60,
					success: function(res) {
						_this.handleUploadFile(res.tempFiles, 0, res.type);
					}
				});
			},
			// 上传
			handleUploadFile(list, i, type) {
				const _this = this;
				let filePath = list[i].tempFilePath;
				_this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(res => {
					let data = res.data;
					_this.$http
						.upload(data.host, {
							filePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							},
							getTask: this.getTask
						})
						.then(r => {
							if (!_this.imgsList.length) {
								_this.type = type
							}
							if (_this.imgsList.length && _this.type === 'video') {
								_this.$mHelper.toast('上传成功')
								_this.cover = r
							} else {
								_this.imgsList.push({
									url: r,
									cover: list[i].thumbTempFilePath,
									description: ''
								});
							}
							_this.mediaType = [_this.type]
							if (list.length - 1 > i) {
								if (_this.imgsList.length < 9) {
									_this.handleUploadFile(list, i + 1, type);
								} else {
									return _this.$mHelper.toast('最多只能上传9张图片')
								}
							}
						}).catch(err => {
							_this.$mHelper.toast(err);
						});
				}).catch(err => {
					_this.$mHelper.toast(err);
				})
			},
			getTask(requestTask, handleRe) {
				requestTask.onProgressUpdate((res) => {
					if (res.progress < 100) {
						uni.showLoading({
							title: `上传进度${res.progress}%`
						})
					} else {
						uni.hideLoading()
					}
				});
			},
			// 删除
			deleteTap(index) {

				console.log(index)
				if (index === -1) {
					this.cover = ''
				} else {
					this.imgsList.splice(index, 1);
					if (!this.imgsList.length) {
						this.type = 'image';
						this.mediaType = ['image', 'video']
					}
				}
			},
			// 预览
			prevTap(current) {
				let imgs = []
				if (this.type === 'image') {
					this.imgsList.map(item => {
						imgs.push(item.url)
					})
					uni.previewImage({
						current,
						urls: imgs
					})
				} else {
					if (current === -1) {
						uni.previewImage({
							current,
							urls: [this.cover]
						})
					}
				}
			},
			// 提交
			submitTap() {
				if (this.description === '') {
					return this.$mHelper.toast('请输入详细内容')
				}

				if (this.imgsList.length === 0) {
					return this.$mHelper.toast('请上传图片或视频')
				}

				if (this.type === 'video' && this.cover === '') {
					return this.$mHelper.toast('请上传视频封面')
				}


				const params = {
					id: this.id,
					title: this.title,
					type: this.type,
					cover: this.cover === '' ? this.imgsList[0].url : this.cover,
					description: this.description,
					isNeedExpress: this.isNeedExpress,
					items: this.imgsList,
					price: this.price,
					firstMenuId: this.subject.subject.id,
					secondMenuId: this.subject.subjectType.id,
					hdImgViewCount: this.hdImgViewCount,
					videoTrialDuration: this.videoTrialDuration,
					expressContent: this.expressContent
				}
				if (this.type === 'image') {
					uni.navigateTo({
						url: `/pages/centers/highScoreConfirm?params=${JSON.stringify(params)}`
					})
				} else {
					this.$http.post(myAddTeachingMaterial, params).then(res => {
						if (res.data.auditStatus === 1) {
							this.$mHelper.toast('发布成功')
						} else {
							this.$mHelper.toast('提交成功，请等待审核，审核通过后会显示')
						}
						uni.$emit('offHighScore', true)
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 1500)
					}).catch(err => {
						this.$mHelper.toast(err.msg);
					})
				}

			},
			selectTap() {
				uni.$on('selectAccount', (data) => {
					this.subjectName = `${data.subject.name}-${data.subjectType.name}`
					this.subject = data
				})
				uni.navigateTo({
					url: '/pages/centers/selectAccount'
				})
			},

			// 添加描述
			imgDecTap(index) {
				this.selectIndex = index
				this.remark = this.imgsList[this.selectIndex].description
				this.popShow = true
			},

			// 确认添加描述
			addDecTap() {
				if (this.remark === '') {
					return this.$mHelper.toast('请输入作品描述')
				}
				this.$set(this.imgsList[this.selectIndex], 'description', this.remark)
				this.popShow = false;
			},
			// 是否需要发货
			switchChange(e) {
				if (e) {
					uni.showModal({
						title: '提示',
						confirmText: '确认',
						content: `当前设置为需要发货，若有用户下单购买，需要在${this.deliverOvertime}天内发货，否则会超时取消订单，请务必真实发货`,
						success: (res) => {
							if (res.confirm) {
								this.isNeedExpress = true
							} else if (res.cancel) {
								this.isNeedExpress = false
							}
						}
					});
				}

			},
			// 视频预览
			prevVideoTap(index) {
				this.selectIndex = index
				this.maskShow = true
			},
			onInput(e) {
				if (e.detail.value > 20) {
					this.videoTrialDuration = 20
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.center {
		min-height: 100vh;
		background-color: #fff;
		padding-bottom: 200rpx;

		.content {
			padding-bottom: 160rpx;
		}

		.title {
			margin: 0 32rpx;
			padding: 24rpx 0;
			border-bottom: 2rpx solid #D8D8D8;

			input {
				flex: 1;
				font-size: 26rpx;
				color: #3A3D71;
			}
		}

		.header {
			height: 240rpx;
			margin: 48rpx 34rpx 0;
			position: relative;
			border-bottom: 2rpx solid #E9E9E9;

			textarea {
				height: 160rpx;
				font-size: 26rpx;
				color: #3A3D71;
			}

			&-length {
				position: absolute;
				bottom: 24rpx;
				right: 0;
				font-size: 28rpx;
				font-weight: 300;
				color: #8F9091;

				&.active {
					color: #1B1B1B;
				}
			}
		}

		.upload {
			margin: 38rpx 34rpx;
			padding-bottom: 40rpx;

			.item {
				margin-bottom: 24rpx;
				position: relative;
				text-align: center;
				width: 220rpx;
				height: 220rpx;

				image {
					width: 100%;
					height: 100%;
				}


				.cover {
					position: absolute;
					top: 6rpx;
					left: 6rpx;
					width: 70rpx;
					height: 36rpx;
					background: #FF334D;
					font-size: 26rpx;
					color: #FFF9F9;
				}

				.close {
					position: absolute;
					top: 10rpx;
					right: 10rpx;
				}

				.video-play {
					position: absolute;
					top: 50%;
					left: 50%;
					margin-left: -54rpx;
					margin-top: -54rpx;
				}

				.remark {
					position: absolute;
					width: 100%;
					bottom: 0;
					height: 44rpx;
					background: rgba(33, 33, 33, 0.7);
					font-size: 24rpx;
					color: #FFFFFF;
				}
			}

			.add {
				position: relative;
				background: #F3F3F3;
				width: 220rpx;
				height: 220rpx;

				&-tips-copy {
					position: absolute;
					bottom: 10rpx;
					font-size: 20rpx;
					color: #B0B3BF;
				}

				&-tips {
					position: absolute;
					bottom: -40rpx;
					font-size: 20rpx;
					color: #B0B3BF;
				}
			}
		}
	}



	.list {
		.item {
			margin: 0 32rpx;
			padding: 38rpx 0;
			border-bottom: 2rpx solid #D8D8D8;

			&:last-of-type {
				border-bottom: none;
			}

			.left {
				font-size: 24rpx;
				font-weight: bold;
				color: #3A3D71;
			}

			.right {
				flex: 1;
				text-align: right;
				justify-content: flex-end;

				input,
				textarea {
					flex: 1;
					font-size: 26rpx;
					color: #3A3D71;
				}



				.price {
					font-size: 32rpx;
					font-weight: bold;
				}

				text {
					margin-left: 20rpx;
					font-size: 24rpx;
					font-weight: bold;
					color: #3A3D71;
				}

				image {
					margin-left: 24rpx;
					width: 16rpx;
					height: 28rpx;
				}
			}
		}
	}

	// 拖拽
	.inner {

		.movable-area {
			width: 100%;
			height: auto;
			display: flex;
			flex-flow: wrap;
		}

		.movable-view {
			width: 31%;
			height: calc(31vw * .7);
		}

		.item-move {
			width: 100%;
			height: 100%;
			overflow: hidden;
			border-radius: 12upx;

			image {
				width: 220rpx;
				height: 220rpx;
			}
		}

		.item-move-active {
			box-shadow: 0 0 30px #000;
		}
	}

	.footer {
		position: fixed;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 999;
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

	.pop-content {
		padding: 0 32rpx 28rpx 36rpx;

		.pop-header {
			margin: 46rpx 0 28rpx 0;

			image {
				width: 116rpx;
				height: 116rpx;
			}
		}

		.pop-textarea {
			position: relative;
			height: 320rpx;
			background: #FFFFFF;
			border-radius: 24rpx;
			border: 2rpx solid #D8D8D8;
			padding: 16rpx 24rpx;

			textarea {
				font-size: 24rpx;
				color: #3A3D71;
			}


			&-length {
				position: absolute;
				right: 22rpx;
				bottom: 18rpx;
				font-size: 24rpx;
				font-weight: 300;
				color: #8F9091;
			}
		}

	}

	.pop-footer {
		padding: 14rpx 34rpx;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #fff;

		.btn {
			height: 88rpx;
			background: #EFF2FF;
			box-shadow: 0px 6rpx 14rpx 2px rgba(235, 235, 235, 0.14);
			border-radius: 44rpx;
			font-size: 32rpx;
			color: $u-type-primary;
		}
	}

	.video {
		width: 100%;
		height: 100%;
		background-color: rgba($color: #000000, $alpha: .4);

		&-box {
			width: 100%;
		}

		video {
			width: 100%;
		}
	}
</style>
