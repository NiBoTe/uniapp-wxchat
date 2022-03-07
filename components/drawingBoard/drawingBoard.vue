<template>
	<view class="drawingBoard-body">
		<canvas :canvas-id="cid" :id="cid" @touchstart="touchstart" @touchmove="touchmove"
			@touchend="touchend"></canvas>
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
			
			<view class="drawingBoard-next" @click="sumbit()">
				<view class="drawingBoard-btn">下一步</view>
			</view>
			<!-- <view class="drawingBoard-fixed-bottom-item sumbit" @click="sumbit">提交</view> -->
		</view>

		<!-- <cover-view class="drawingBoard-color-main" v-if="colorShow">
			<cover-view @click="selColor(index)"
				:class="index==colorIndex?'drawingBoard-color-item on ':'drawingBoard-color-item '"
				:style="'background-color:'+item.value" v-for="(item,index) in colorData" :key="index">
				<cover-image class="drawingBoard-color-item-icon" src="../../static/drawingBoard/on.png">
				</cover-image>
			</cover-view>
		</cover-view> -->
		<cover-view class="drawingBoard-color-main" v-if="lineWidthShow">
			<cover-view @click="selLineWidth(index)"
				:class="index==lineWidthIndex?'drawingBoard-lineWidth-item on':'drawingBoard-lineWidth-item'"
				v-for="(item,index) in lineWidthData" :key="index">
				<cover-view
					:style="'width:60%;height:'+item+'px;background-color:#000000;position: absolute;top: 50%;left: 20%;margin-top:-'+item/2+'px'">
				</cover-view>
			</cover-view>
		</cover-view>
	</view>
</template>

<script>
	import ColorPicker from '@/components/color-picker/color-picker.vue'
	export default {
		name: 'DrawingBoard',
		components:{
			ColorPicker
		},
		props: {
			cid: {
				type: String,
				default: '',
			},
		},
		data() {
			return {
				selectActive: 0,
				id: '',
				Strokes: [],
				dom: null,
				width: 0,
				height: 0,
				colorShow: false,
				colorIndex: 0,
				colorRgb: {r: 255,g: 0,b: 0,a: 0.6},
				colorValue: {r: 255,g: 0,b: 0,a: 0.6},
				lineColor: '#000000',
				colorData: [{
					name: 'black',
					value: '#000000'
				}, {
					name: 'red',
					value: '#f34336',
				}, {
					name: 'blue',
					value: '#0238d0',
				}, {
					name: 'green',
					value: '#8bc24b',
				}, {
					name: 'yellow',
					value: '#ffeb3c',
				}, {
					name: 'purple',
					value: '#a603d0',
				}, {
					name: 'grey',
					value: '#a5a5a5',
				}],
				lineWidthShow: false,
				lineWidthIndex: 0,
				lineWidthData: ['3', '6', '9', '12', '15', '18']
			}
		},
		mounted: function() {
			this.$nextTick(function() {
				uni.getSystemInfo({
					success: (res) => {
						this.width = res.windowWidth;
						this.height = res.windowHeight;
					}
				});

				this.dom = uni.createCanvasContext(this.cid, this);

			});
		},
		methods: {
			
			touchmoveEnd(e) {
				e.preventDefault();
				e.stopPropagation();
			},
			sumbit() {
				uni.canvasToTempFilePath({
					canvasId: this.cid,
					success: (res) => {
						this.$emit('sumbit', res)
					},
					fail: (err) => {
						//console.log('fail', err)
						this.$emit('fail', err)
					}
				}, this)
			},
			clear() { //清空
				this.Strokes = [];
				this.dom.clearRect(0, 0, this.width, this.height)
				this.dom.draw();
			},
			lineWidth() {
				this.lineWidthShow = !this.lineWidthShow;
				this.colorShow = false;
			},
			selLineWidth(index) {
				this.lineWidthIndex = index;
				this.lineWidthShow = false;
			},
			color() {
				this.colorShow = !this.colorShow;
				this.lineWidthShow = false;
			},
			selColor(index) {
				this.colorIndex = index;
				this.colorShow = false;
			},
			revoke() { //撤销上一步
				var delItem = this.Strokes.pop();
				// if (delItem) {
				// 	delItem.points.forEach((item, index) => {
				// 		if (index < (delItem.points.length - 1)) {
				// 			this.dom.setStrokeStyle('#FFFFFF')
				// 			this.dom.moveTo(delItem.points[index].x, delItem.points[index].y);
				// 			this.dom.lineTo(delItem.points[index + 1].x, delItem.points[index + 1].y);
				// 			this.dom.stroke();
				// 			this.dom.draw(true);
				// 			// this.dom.clearRect(delItem.points[index].x, delItem.points[index].y, 10, 10);
				// 			// this.dom.draw(true)
				// 		}
				// 	})

				// }



				// this.dom.draw();
				// if(this.Strokes.length>0){
				// 	var lastItem = this.Strokes[this.Strokes.length - 1];
				// 	uni.canvasPutImageData({
				// 		canvasId: this.cid,
				// 		data: lastItem.imageData.data,
				// 		x: 0,
				// 		y: 0,
				// 		width: lastItem.imageData.width,
				// 		height: lastItem.imageData.height,
				// 		success:(res)=> {
				// 			console.log('success',res)
				// 		}
				// 	},this)
				// }

				//console.log('delItem', delItem)
				//this.dom.drawImage(delItem.x, delItem.y, 0, 0)
				this.drawCanves();
			},
			drawCanves() {
				//this.dom.draw();
				this.Strokes.forEach((item, index) => {
					let StrokesItem = item;
					//console.log(index, this.Strokes.length)
					if (StrokesItem.points.length > 1) {
						this.dom.beginPath();
						this.dom.setLineCap('round');
						this.dom.setStrokeStyle(item.style.color);
						this.dom.setLineWidth(item.style.lineWidth);
						StrokesItem.points.forEach((sitem, sindex) => {
							if (sitem.type == "touchstart") {
								this.dom.moveTo(sitem.x, sitem.y)
							} else {
								this.dom.lineTo(sitem.x, sitem.y)
							}
							//console.log('dom', sitem)
						})
						this.dom.stroke();

					}
				})
				this.dom.draw();
			},
			createId() {
				var d = new Date();
				return 'can' + d.getTime();
			},
			touchstart(e) {

				this.Strokes.push({
					imageData: null,
					style: {
						color: this.colorValue,
						lineWidth: this.lineWidthData[this.lineWidthIndex],
					},
					points: [{
						x: e.touches[0].x,
						y: e.touches[0].y,
						type: e.type,
					}]
				})
				this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
			},
			touchmove(e) {
				this.Strokes[this.Strokes.length - 1].points.push({
					x: e.touches[0].x,
					y: e.touches[0].y,
					type: e.type,
				})
				this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
			},
			touchend(e) {
				if (this.Strokes[this.Strokes.length - 1].points.length < 2) { //当此路径只有一个点的时候
					this.Strokes.pop();
				}
				//this.drawLine(this.Strokes[this.Strokes.length - 1], e.type);
				// uni.canvasGetImageData({
				// 	canvasId: this.cid,
				// 	x: 0,
				// 	y: 0,
				// 	width: this.width,
				// 	height: this.height,
				// 	success: (res) => {
				// 		 console.log(res.width) // 100
				// 		// console.log(res.height) // 100
				// 		// console.log(res.data instanceof Uint8ClampedArray) // true
				// 		// console.log(res.data.length) // 100 * 100 * 4
				// 		this.Strokes[this.Strokes.length - 1].imageData = res;
				// 	}
				// },this)
				//this.drawCanves();
			},
			drawLine(StrokesItem, type) {
				if (StrokesItem.points.length > 1) {
					this.dom.beginPath();
					this.dom.setLineCap('round')
					this.dom.setStrokeStyle(StrokesItem.style.color);
					this.dom.setLineWidth(StrokesItem.style.lineWidth);
					this.dom.moveTo(StrokesItem.points[StrokesItem.points.length - 2].x, StrokesItem.points[StrokesItem
						.points.length -
						2].y);
					this.dom.lineTo(StrokesItem.points[StrokesItem.points.length - 1].x, StrokesItem.points[StrokesItem
						.points.length -
						1].y);
					this.dom.stroke();
					this.dom.draw(true);
				}
			},
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
			}
		}
	}
</script>

<style scoped lang="scss">
	
	.drawingBoard-body {
		position: fixed;
		top: 0;
		bottom: calc(210rpx + env(safe-area-inset-bottom));
		bottom: calc(210rpx + constant(safe-area-inset-bottom));
		left: 0;
		width: 100%;
	}

	.drawingBoard-body canvas {
		width: 100%;
		height: 100%;
	}

	.drawingBoard-fixed-bottom {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		text-align: center;
		color: #000;
		z-index: 11;
		display: flex;
		flex-direction: column;
		background-color: #fff;
	}

	.drawingBoard-fixed-bottom .drawingBoard-fixed-bottom-item {
		padding: 12rpx;
	}

	.drawingBoard-fixed-bottom view.sumbit {
		-webkit-box-flex: 1;
		-webkit-flex-grow: 1;
		flex-grow: 1;
		color: #fff;
	}

	.drawingBoard-tools {
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
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

	.black {
		background-color: #000000 !important;
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
	
		.drawingBoard-text{
			width: 100%;
			padding: 0 40rpx;
			.drawingBoard-color{
				
			}
		}
	}
	
	
	// 下一步
	
	.drawingBoard-next{
		padding: 24rpx 48rpx;
		padding-bottom: constant(safe-area-inset-bottom);
		padding-bottom: env(safe-area-inset-bottom);
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
</style>
