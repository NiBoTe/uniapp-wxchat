<template>
	<view class="container" v-if="detail">
		
		<scroll-view class="scroll-view_H" scroll-y="true">
			<canvas canvas-id="canvas" class="canvas"
				:style="{width: upx2px(canvas.width)+ 'px', height: upx2px(canvas.height) +'px'}"
				@touchstart="touchstart" @touchmove="touchmove" @touchend="touchend"></canvas>
		</scroll-view>
		
		<!-- <drawing-board :url="detail.url" cid="drawingBoard" @sumbit="submitTap"></drawing-board> -->
		
		
		<view class="drawingBoard-fixed-bottom">
			<view class="drawingBoard-fixed-bottom-handle">
				<view class="drawingBoard-btn" v-if="selectActive === 0">
					<image :src="setSrc('painting/voice_start.png')"></image>
					<text>长按添加评语</text>
				</view>
				<view class="drawingBoard-text" v-if="selectActive === 2">
					<view class="drawingBoard-color">
						<color-picker ref="colorPicker" :color="colorRgb" @confirm="colorConfirm"></color-picker>
					</view>
					
					<view class="thickness u-flex">
						<text>细</text>
						<view class="slider">
							<u-slider height="10" block-width="40" inactive-color="#D8D8D8" active-color="#999090"
								v-model="thicknessValue"></u-slider>
						</view>
						<text>粗</text>
					</view>
				</view>
			</view>
			<view class="drawingBoard-fixed-bottom-item drawingBoard-tools">
				<view class="drawingBoard-tools-item" @click="selectHandle(0)">
					<image v-if="selectActive === 0" :src="setSrc('painting/voice_active.png')"></image>
					<image v-else :src="setSrc('painting/voice.png')"></image>
				</view>
				
				<view class="drawingBoard-tools-item" @click="selectHandle(1)">
					<image v-if="selectActive === 1" :src="setSrc('painting/words_active.png')"></image>
					<image v-else :src="setSrc('painting/words.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="selectHandle(2)">
					<image v-if="selectActive === 2" :src="setSrc('painting/pen_active.png')"></image>
					<image v-else :src="setSrc('painting/pen.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="lineWidth">
					<image :src="setSrc('painting/arrow.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="color">
					<image :src="setSrc('painting/circle.png')"></image>
				</view>
				<view class="drawingBoard-tools-item" @click="revoke">
					<image :src="setSrc('painting/esc.png')"></image>
				</view>
				<!-- <view class="drawingBoard-tools-item" @click="clear">
					<image src="../../static/drawingBoard/qingkong_1.png"></image>
				</view> -->
			</view>
			
			<view class="drawingBoard-next" @click="submitTap()">
				<view class="drawingBoard-btn">下一步</view>
			</view>
		</view>
	</view>
</template>

<script>
	import DrawingBoard from '@/components/drawingBoard/drawingBoard.vue'
	const transverse_canvas_width = 1000;
	const lengthways_canvas_height = 1000;
	import ImageFilters from '@/utils/weImageFilters.js';
	import Helper from '@/utils/weImageFiltersHelper.js';
	let helper = '';
	let strokes = [];
	
	let initImageData = {}
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	import {
		orderItemPaintEvaluateDetail
	} from '@/api/paint_evaluate_v2_teacher.js'
	export default {
		components:{
			DrawingBoard
		},
		data() {
			return {
				top: -99999,
				left: -99999,
				StatusBar: this.StatusBar,
				canvas: { //upx
					width: 0,
					height: 0,
					origin_width: 0,
					origin_height: 0,
				},
				render_src: '',
				render_image: { //px
					width: 0,
					height: 0,
					rotate_width: 0,
					rotate_height: 0,
					max_width: 375,
					max_height: 0
				},
				width: 0,
				height: 0,
				selectActive: 0,
				colorRgb: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				colorValue: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				thicknessValue: 3, // 线条粗细
				// 画板
				
				id: null,
				url: '',
				detail: null
			};
		},
		onLoad(options) {
			if(options.id){
				 this.id = options.id;
				 
				 uni.getSystemInfo({
				 	success: (res) => {
				 		console.log(res)
				 		this.width = res.windowWidth;
				 		this.height = res.windowHeight;
				 		 this.initData()
				 		
				 	}
				 });
				
			}
		},
		methods:{
			initData() {
				this.$http.get(orderItemPaintEvaluateDetail, {
					id: this.id
				}).then(res => {
					console.log(res)
					this.detail = res.data;
					this.init_image()
				})
			},
			// 初始化画板
			init_image() {
				uni.getImageInfo({
					src: this.detail.url,
					success: (image) => {
						if (image.width >= image.height) {
							//初始化canvas尺寸
							this.canvas.width = image.width > transverse_canvas_width ?
								transverse_canvas_width : image.width
							this.canvas.height = parseInt(this.canvas.width * image.height / image.width);
							this.canvas.origin_height = this.canvas.height
							this.canvas.origin_width = this.canvas.width
			
							//初始化预览图尺寸
							this.render_image.width = this.render_image.max_width;
							this.render_image.height = parseInt(this.render_image.width * image.height / image
								.width);
			
						} else {
							//初始化canvas尺寸
							this.canvas.height = image.height > lengthways_canvas_height ?
								lengthways_canvas_height : image.height
							this.canvas.width = this.width/(uni.upx2px(100)/100) // parseInt(this.canvas.height * image.width / image.height);
							this.canvas.origin_width = this.canvas.width;
							this.canvas.origin_height = this.canvas.height
							
							
							//初始化预览图尺寸
							this.render_image.width = this.render_image.max_width
							this.render_image.height = parseInt(this.render_image.width * image.height / image
								.width);
							if (this.render_image.height > this.render_image.max_height) {
								this.render_image.height = this.render_image.max_height
								this.render_image.width = parseInt(this.render_image.height * image.width /
									image.height);
							}
							
							console.log(this.canvas)
						}
						helper = new Helper({
							canvasId: 'canvas',
							width: this.upx2px(this.canvas.width),
							height: this.upx2px(this.canvas.height)
						})
						// this.ctx = uni.createCanvasContext('canvas');
						helper.initCanvas(image.path, () => {
							console.log('initCanvas');
							initImageData = {
								data: helper.originalImageData,
								width: helper.canvasInfo.width,
								height: helper.canvasInfo.height,
							}
							// strokes.push({
							// 	imageData: image.path,
							// 	type: 'image',
							// })
							uni.hideLoading();
						})
			
						// this.ctx.drawImage(this.src, 0, 0, this.px_width, this.px_height);
						// this.ctx.draw();
					},
					fail: (e) => {
						console.log(e);
					}
				})
			},
			upx2px(value) {
				if (!value) {
					return 0;
				}
				return uni.upx2px(value);
			},
			touchstart(e) {
				if (this.selectActive !== 2) return
				strokes.push({
					imageData: null,
					type: 1,
					style: {
						color: this.colorValue,
						lineWidth: parseInt((18 / 100 * this.thicknessValue) < 3 ? 3 : (18 / 100 * this
							.thicknessValue)),
					},
					points: [{
						x: e.touches[0].x,
						y: e.touches[0].y,
						type: e.type,
					}]
				})
				this.drawLine(strokes[strokes.length - 1], e.type);
			},
			touchmove(e) {
				if (this.selectActive !== 2) return
				strokes[strokes.length - 1].points.push({
					x: e.touches[0].x,
					y: e.touches[0].y,
					type: e.type,
				})
				this.drawLine(strokes[strokes.length - 1], e.type);
			},
			touchend(e) {
				if (this.selectActive !== 2) return
				helper.saveImageData(() => {
					strokes[strokes.length - 1].imageData = {
						data: helper.originalImageData,
						width: helper.canvasInfo.width,
						height: helper.canvasInfo.height,
					}
					helper.putImageData(strokes[strokes.length - 1].imageData, (tempFilePath) => {
						this.render_src = tempFilePath;
					})
					// strokes.[strokes.length - 1].imageData = helper.originalImageData;
					if (strokes[strokes.length - 1].points.length < 2) { //当此路径只有一个点的时候
						strokes.pop();
						helper.putImageData(strokes[strokes.length - 1].imageData, (tempFilePath) => {
							this.render_src = tempFilePath;
						})
					}
				})
			},
			drawLine(StrokesItem, type) {
				if (StrokesItem.points.length > 1) {
					helper.ctx.beginPath();
					helper.ctx.setLineCap('round')
					helper.ctx.setStrokeStyle(StrokesItem.style.color);
					helper.ctx.setLineWidth(StrokesItem.style.lineWidth);
					helper.ctx.moveTo(StrokesItem.points[StrokesItem.points.length - 2].x, StrokesItem.points[StrokesItem
						.points.length -
						2].y);
					helper.ctx.lineTo(StrokesItem.points[StrokesItem.points.length - 1].x, StrokesItem.points[StrokesItem
						.points.length -
						1].y);
					helper.ctx.stroke();
					// helper.ctx.draw(true);
					helper.ctx.draw(true, () => {
						// helper.saveImageData()
						
					})
				}
			},
			//撤销上一步
			revoke() {
				if (!strokes.length) return
				strokes.pop();
				this.drawCanves();
			},
			drawCanves() {
				console.log(helper)
				console.log(initImageData)
				let imageData = strokes.length > 0 ? strokes[strokes.length - 1].imageData : initImageData;
				helper.putImageData(imageData, (tempFilePath) => {
					this.render_src = tempFilePath;
				})
			},
			// 选择项
			selectHandle(index){
				if(this.selectActive === index) {
					this.selectActive = -1;
				} else {
					this.selectActive = index;
				}
			},
			// 选择颜色
			colorConfirm(e){
				console.log(e)
				this.colorRgb = e.rgba
				this.colorValue = e.hex
			},
			// 下一步
			async submitTap(){
				
				helper.getImageTempFilePath((tempFilePath)=> {
					this.handleUploadFile(tempFilePath)
				})
			
			},
			// 上传图片
			async handleUploadFile(tempFilePath) {
				const _this = this;
				await _this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(async res => {
					console.log(res)
					let data = res.data;
					await _this.$http
						.upload(data.host, {
							filePath:tempFilePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(async r => {
							_this.url = r;
							uni.navigateTo({
								url: `/pages/centers/paintingEvaluation/teacherEvaluate?id=${_this.id}&evaluateUrl=${r}`
							})
						});
				}).catch(err => {
					console.log(err)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	
	.drawingBoard-fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		z-index: 11;
		padding: 14rpx 0;
		padding-bottom: calc(14rpx + constant(safe-area-inset-bottom));
		padding-bottom: calc(14rpx + env(safe-area-inset-bottom));
		background-color: #F3F3F3;
		
		.drawingBoard-fixed-bottom-item {
			padding: 12rpx;
		}
		
		view.sumbit {
			-webkit-box-flex: 1;
			-webkit-flex-grow: 1;
			flex-grow: 1;
			color: #fff;
		}
		
		
		.drawingBoard-tools {
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			background-color: #fff;
		}
		
		.drawingBoard-tools-item {
			text-align: center;
			-webkit-box-flex: 1;
			-webkit-flex-grow: 1;
			flex-grow: 1;
			line-height: 35rpx;
		
		}
		
		.drawingBoard-fixed-bottom-item view image {
			width: 76rpx;
			height: 76rpx;
		}
		
		.drawingBoard-tools-item view {
			font-size: 22rpx;
		}
		
		.drawingBoard-color-main {
			position: fixed;
			bottom: 120rpx;
			left: 0;
			width: 710rpx;
			/* height: 75rpx; */
			z-index: 11;
			padding: 25rpx 20rpx;
			display: -webkit-box;
			display: -webkit-flex;
			display: flex;
			flex-wrap: wrap;
			background-color: #fff;
			border-top: 1px dashed #d9d9d9;
			transition: display 2s;
			-moz-transition: display 2s;
			/* Firefox 4 */
			-webkit-transition: display 2s;
			/* Safari 和 Chrome */
			-o-transition: display 2s;
		}
		
		.drawingBoard-color-item {
			width: 80rpx;
			height: 80rpx;
			background-color: #000000;
			border-radius: 100px;
			margin: 5px;
			position: relative;
		}
		
		.drawingBoard-lineWidth-item {
			width: 80rpx;
			height: 80rpx;
			background-color: #fff;
			border-radius: 100px;
			margin: 5px;
			position: relative;
		}
		
		.drawingBoard-lineWidth-item.on {
			border: 1px solid #d4a39e;
		}
		
		.drawingBoard-color-item .drawingBoard-color-item-icon {
			display: none;
		}
		
		.drawingBoard-color-item.on .drawingBoard-color-item-icon {
			display: block;
			position: absolute;
			top: 50%;
			left: 50%;
			width: 50rpx;
			height: 50rpx;
			margin-top: -25rpx;
			margin-left: -25rpx;
		}
		
		// 操作面板
		
		.drawingBoard-fixed-bottom-handle{
			height: 128rpx;
			display: flex;
			justify-content: center;
			align-items: center;
			background-color: #F3F3F3;
			
			// 按钮
			.drawingBoard-btn{
				width: 324rpx;
				height: 80rpx;
				display: flex;
				justify-content: center;
				align-items: center;
				background: $u-type-primary;
				border-radius: 44rpx;
				image{
					width: 52rpx;
					height: 36rpx;
				}
				text{
					margin-left: 10rpx;
					font-size: 28rpx;
					font-weight: 500;
					color: #FFFFFF;
				}
			}
			
			// 颜色
			.drawingBoard-text {
				width: 100%;
				.drawingBoard-color {
					padding: 0 40rpx 0 50rpx;
				}
			
				.thickness {
					padding: 40rpx 40rpx 0 22rpx;
			
					text {
						font-size: 24rpx;
						font-weight: 500;
						color: #909399;
					}
			
					.slider {
						margin: 0 26rpx;
						flex: 1;
					}
				}
			}
		}
		
		
		// 下一步
		
		.drawingBoard-next{
			padding: 24rpx 48rpx;
			padding-bottom: constant(safe-area-inset-bottom);
			padding-bottom: env(safe-area-inset-bottom);
			background-color: #fff;
			.drawingBoard-btn{
				height: 80rpx;
				line-height: 80rpx;
				background: $u-type-primary;
				border-radius: 44rpx;
				font-size: 28rpx;
				font-weight: 500;
				color: #FFFFFF;
			}
		}
	}

</style>
