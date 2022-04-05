<template>
	<view class="container-canvas">
		<canvas canvas-id="canvas-drag" disable-scroll="true" @touchstart="start" @touchmove="move" @touchend="end"
			:style="{width: upx2px(canvas.width)+ 'px', height: upx2px(canvas.height) +'px'}"></canvas>
	</view>
</template>

<script>
	// components/canvas-drag/index.js
	let DELETE_ICON = 'https://oss.123tool.cn/client/canvas/close.png'; // 删除按钮
	// 删除按钮
	let DRAG_ICON = 'https://oss.123tool.cn/client/canvas/scale.png'; // 缩放按钮
	// 缩放按钮
	const STROKE_COLOR = 'green';
	const ROTATE_ENABLED = true;
	let isMove = false; // 标识触摸后是否有移动，用来判断是否需要增加操作历史
	// 标识触摸后是否有移动，用来判断是否需要增加操作历史
	const DEBUG_MODE = false; // 打开调试后会渲染操作区域边框（无背景时有效）
	// 打开调试后会渲染操作区域边框（无背景时有效）

	const transverse_canvas_width = 1000;
	const lengthways_canvas_height = 1000;
	const dragGraph = function({
		x = 30,
		y = 30,
		w,
		h,
		type,
		text,
		fontSize = 16,
		color = '#ffffff',
		url = null,
		rotate = 0,
		sourceId = null,
		selected = true,
		points,
		lineWidth,
		tempFilePath,
		subtype,
	}, canvas, factor) {
		if (type === 'text') {
			canvas.setFontSize(fontSize);
			const textWidth = canvas.measureText(text).width;
			const textHeight = fontSize + 10;
			this.centerX = x + textWidth / 2;
			this.centerY = y + textHeight / 2;
			this.w = textWidth;
			this.h = textHeight;
		} else if (type === 'audio') {
			canvas.setFontSize(fontSize);
			const textWidth = canvas.measureText(text).width + 40;
			const textHeight = fontSize + 10;
			this.centerX = x + textWidth / 2;
			this.centerY = y + textHeight / 2;
			this.w = textWidth;
			this.h = textHeight;
		} else {
			this.centerX = x + w / 2;
			this.centerY = y + h / 2;
			this.w = w;
			this.h = h;
		}

		this.x = x;
		this.y = y; // 4个顶点坐标
		this.square = [
			[this.x, this.y],
			[this.x + this.w, this.y],
			[this.x + this.w, this.y + this.h],
			[this.x, this.y + this.h],
			[this.x - 30, this.y + this.h + 10],
		]
		if (this.type === 'circle') {
			this.square.push([this.x - this.w, this.y - this.h, this.w * 2, this.h * 2])
		}
		this.points = points || [];
		this.lineWidth = lineWidth || 3;
		this.fileUrl = url;
		this.tempFilePath = tempFilePath;
		this.subtype = subtype;
		this.text = text;
		this.fontSize = fontSize;
		this.color = color;
		this.ctx = canvas;
		this.rotate = rotate;
		this.type = type;
		this.selected = selected;
		this.factor = factor;
		this.sourceId = sourceId;
		this.MIN_WIDTH = 20;
		this.MIN_FONTSIZE = 10;

	};
	dragGraph.prototype = {
		/**
		 * 绘制元素
		 */
		paint(status) {
			this.ctx.save(); // 由于measureText获取文字宽度依赖于样式，所以如果是文字元素需要先设置样式
			let textWidth = 0;
			let textHeight = 0;
			if (this.type === 'line') {
				if (this.points.length > 1) {
					this.ctx.beginPath();
					this.ctx.setLineCap('round')
					this.ctx.setStrokeStyle(this.color);
					this.ctx.setLineWidth(this.lineWidth);
					this.points.map((item, index) => {

						if (index >= 1) {
							this.ctx.moveTo(this.points[index - 1].x, this.points[index - 1].y);
							this.ctx.lineTo(this.points[index].x, this.points[index].y);
						}
					})
					this.ctx.stroke();
					// // helper.ctx.draw(true);
					// this.ctx.draw(true, () => {
					// 	// helper.saveImageData()
					// })
				}

			} // 旋转元素
			if (this.type === 'text') {
				if (!status) {
					this.ctx.setFontSize(this.fontSize);
					this.ctx.setTextBaseline('middle');
					this.ctx.setTextAlign('center');
					this.ctx.setFillStyle(this.color);
					textWidth = this.ctx.measureText(this.text).width;
					textHeight = this.fontSize + 10; // 字体区域中心点不变，左上角位移

					this.x = this.centerX - textWidth / 2;
					this.y = this.centerY - textHeight / 2;
				}
			} // 旋转元素

			if (this.type === 'audio') {
				if (!status) {
					this.ctx.setFontSize(this.fontSize);
					this.ctx.setTextBaseline('middle');
					this.ctx.setTextAlign('center');
					this.ctx.setFillStyle(this.color);
					textWidth = this.ctx.measureText(this.text).width + 40;
					textHeight = this.fontSize + 10; // 字体区域中心点不变，左上角位移

					this.x = this.centerX - textWidth / 2;
					this.y = this.centerY - textHeight / 2;
				}
			} // 旋转元素

			this.ctx.translate(this.centerX, this.centerY);
			this.ctx.rotate(this.rotate * Math.PI / 180);
			this.ctx.translate(-this.centerX, -this.centerY); // 渲染元素

			if (this.type === 'text') {
				if (!status) {
					this.ctx.beginPath()
					this.ctx.setLineWidth(5)
					this.ctx.setStrokeStyle('#fff')

					this.ctx.arc(this.x - 15, this.y + 19, 10, 0, Math.PI * 2)
					this.ctx.setFillStyle('red')
					this.ctx.fill()
					this.ctx.stroke()
				}
			} else if (this.type === 'image') {
				this.ctx.drawImage(this.fileUrl, this.x, this.y, this.w, this.h);
			} else if (this.type === 'audio') {
				if (!status) {
					this.ctx.beginPath()
					this.ctx.setLineWidth(5)
					this.ctx.setStrokeStyle('#fff')
					this.ctx.arc(this.x - 15, this.y + 19, 10, 0, Math.PI * 2)
					this.ctx.setFillStyle('red')
					this.ctx.fill()
					this.ctx.stroke()
				}
				// this.ctx.drawImage(this.fileUrl, this.x, this.y, this.w, this.h);
			} else if (this.type === 'circle') {
				if (this.points.length > 1) {
					// this.ctx.strokeRect(this.x, this.y, this.w, this.h);
					this.ctx.beginPath()
					this.ctx.arc(this.x, this.y, this.w, 0, 2 * Math.PI);
					this.ctx.setStrokeStyle(this.color);
					this.ctx.setLineWidth(this.lineWidth);
					this.ctx.stroke();
				}
			} // 如果是选中状态，绘制选择虚线框，和缩放图标、删除图标

			if (this.selected) {
				// this.ctx.setLineDash([2, 5]);
				// this.ctx.setLineWidth(2);
				// this.ctx.setStrokeStyle(STROKE_COLOR);
				// this.ctx.lineDashOffset = 6;
				if (this.type === 'text') {
					this.ctx.setStrokeStyle('rgba(7, 7, 7, 0.5)')
					this.ctx.setLineJoin('round'); //交点设置成圆角
					this.ctx.setLineWidth(10);
					this.ctx.strokeRect(this.x + 10 / 2, this.y + 10 / 2, this.w - 10 + 30, this.h - 10 + 14);
					this.ctx.setFillStyle('rgba(7, 7, 7, 0.5)')
					this.ctx.fillRect(this.x + 10, this.y + 10, this.w - 10 * 2 + 30, this.h - 10 * 2 + 14);
					this.ctx.setFillStyle(typeof this.color === 'object' ? 'white' : this.color)
					this.ctx.fillText(this.text, this.centerX + 15, this.centerY + 7);
					// this.ctx.strokeRect(this.x, this.y, textWidth, textHeight);
					// this.ctx.drawImage(DELETE_ICON, this.x, this.y - 15, 30, 30);
					// this.ctx.drawImage(DRAG_ICON, this.x + textWidth + 15, this.y + textHeight - 15, 30, 30);
				} else if (this.type === 'audio') {

					this.ctx.setStrokeStyle('rgba(7, 7, 7, 0.5)')
					this.ctx.setLineJoin('round'); //交点设置成圆角
					this.ctx.setLineWidth(10);
					this.ctx.strokeRect(this.x + 10 / 2, this.y + 10 / 2, this.w + 30, this.h - 10 + 14);
					this.ctx.setFillStyle('rgba(7, 7, 7, 0.5)')
					this.ctx.fillRect(this.x + 10, this.y + 10, this.w + 30, this.h - 10 * 2 + 14);
					this.ctx.setFillStyle(typeof this.color === 'String' ? this.color : 'white')
					this.ctx.fillText(this.text, this.centerX + 25, this.centerY + 7);

					this.ctx.drawImage('/static/public/voice_white.png', this.x + 20, this.y + 9, 12, 22);
					// this.ctx.drawImage(DRAG_ICON, this.x + textWidth + 15, this.y + textHeight - 15, 30, 30);
				} else if (this.type === 'line') {

				} else if (this.type === 'circle') {
					// this.ctx.strokeRect(this.x - this.w, this.y - this.h, this.w * 2, this.h * 2);
					// this.ctx.drawImage(DRAG_ICON, this.x + this.w - 20, this.y + this.h - 20, 30, 30);
				} else {

					this.ctx.setStrokeStyle('rgba(255,255,255,.5)')
					this.ctx.strokeRect(this.x, this.y, this.w, this.h);
					// this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
					// this.ctx.drawImage(DRAG_ICON, this.x + this.w - 20, this.y + this.h - 20, 30, 30);
				}
			}

			this.ctx.restore();
		},

		/**
		 * 给矩形描边
		 * @private
		 */
		_drawBorder() {
			let p = this.square;
			let ctx = this.ctx;
			this.ctx.save();
			this.ctx.beginPath();
			ctx.setStrokeStyle('orange');

			this._draw_line(this.ctx, p[0], p[1]);

			this._draw_line(this.ctx, p[1], p[2]);

			this._draw_line(this.ctx, p[2], p[3]);

			this._draw_line(this.ctx, p[3], p[0]);

			ctx.restore();
		},

		/**
		 * 画一条线
		 * @param ctx
		 * @param a
		 * @param b
		 * @private
		 */
		_draw_line(ctx, a, b) {
			ctx.moveTo(a[0], a[1]);
			ctx.lineTo(b[0], b[1]);
			ctx.stroke();
		},

		/**
		 * 判断点击的坐标落在哪个区域
		 * @param {*} x 点击的坐标
		 * @param {*} y 点击的坐标
		 */
		isInGraph(x, y) {
			// 删除区域左上角的坐标和区域的高度宽度
			const delW = 30;
			const delH = 30; // 旋转后的删除区域坐标

			const transformedDelCenter = this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate);

			const transformDelX = transformedDelCenter[0] - delW / 2;
			const transformDelY = transformedDelCenter[1] - delH / 2; // 变换区域左上角的坐标和区域的高度宽度

			const scaleW = 30;
			const scaleH = 30;

			const transformedScaleCenter = this._rotatePoint(this.x + this.w + 10, this.y + this.h, this.centerX, this
				.centerY, this.rotate); // 旋转后的变换区域坐标

			const transformScaleX = transformedScaleCenter[0] - scaleW / 2;
			const transformScaleY = transformedScaleCenter[1] - scaleH / 2; // 调试使用，标识可操作区域

			if (DEBUG_MODE) {
				// // 标识删除按钮区域
				// this.ctx.setLineWidth(1);
				// this.ctx.setStrokeStyle('red');
				// this.ctx.strokeRect(transformDelX, transformDelY, delW, delH); // 标识旋转/缩放按钮区域

				// this.ctx.setLineWidth(1);
				// this.ctx.setStrokeStyle('black');
				// this.ctx.strokeRect(transformScaleX, transformScaleY, scaleW, scaleH); // 标识移动区域

				// this._drawBorder();
			}

			if (x - transformScaleX >= 0 && y - transformScaleY >= 0 && transformScaleX + scaleW - x >= 0 &&
				transformScaleY + scaleH - y >= 0) {
				// 缩放区域
				return 'transform';
			} else if (x - transformDelX >= 0 && y - transformDelY >= 0 && transformDelX + delW - x >= 0 &&
				transformDelY + delH - y >= 0) {
				// 删除区域
				return 'del';
			} else if (this.insidePolygon(this.square, [x, y])) {
				return 'move';
			} // 不在选择区域里面

			return false;
		},

		/**
		 *  判断一个点是否在多边形内部
		 *  @param points 多边形坐标集合
		 *  @param testPoint 测试点坐标
		 *  返回true为真，false为假
		 *  */
		insidePolygon(points, testPoint) {
			let x = testPoint[0],
				y = testPoint[1];
			let inside = false;

			for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
				let xi = points[i][0],
					yi = points[i][1];
				let xj = points[j][0],
					yj = points[j][1];
				let intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
				if (intersect) inside = !inside;
			}

			return inside;
		},

		/**
		 * 计算旋转后矩形四个顶点的坐标（相对于画布）
		 * @private
		 */
		_rotateSquare() {
			this.square = [this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate), this
				._rotatePoint(this.x + this.w, this.y, this.centerX, this.centerY, this.rotate), this._rotatePoint(
					this.x + this.w, this.y + this.h, this.centerX, this.centerY, this.rotate), this._rotatePoint(
					this.x, this.y + this.h, this.centerX, this.centerY, this.rotate),
				this._rotatePoint(this.x - 40, this.y + 10, this.centerX, this.centerY, this.rotate)
			];
		},

		/**
		 * 计算旋转后的新坐标（相对于画布）
		 * @param x
		 * @param y
		 * @param centerX
		 * @param centerY
		 * @param degrees
		 * @returns {*[]}
		 * @private
		 */
		_rotatePoint(x, y, centerX, centerY, degrees) {
			let newX = (x - centerX) * Math.cos(degrees * Math.PI / 180) - (y - centerY) * Math.sin(degrees * Math.PI /
				180) + centerX;
			let newY = (x - centerX) * Math.sin(degrees * Math.PI / 180) + (y - centerY) * Math.cos(degrees * Math.PI /
				180) + centerY;
			return [newX, newY];
		},

		/**
		 *
		 * @param {*} px 手指按下去的坐标
		 * @param {*} py 手指按下去的坐标
		 * @param {*} x 手指移动到的坐标
		 * @param {*} y 手指移动到的坐标
		 * @param {*} currentGraph 当前图层的信息
		 */
		transform(px, py, x, y, currentGraph) {
			// 获取选择区域的宽度高度
			if (this.type === 'text') {
				this.ctx.setFontSize(this.fontSize);
				const textWidth = this.ctx.measureText(this.text).width;
				const textHeight = this.fontSize + 10;
				this.w = textWidth;
				this.h = textHeight; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			} else if (this.type === 'audio') {
				this.ctx.setFontSize(this.fontSize);
				const textWidth = this.ctx.measureText(this.text).width + 40;
				const textHeight = this.fontSize + 10;
				this.w = textWidth;
				this.h = textHeight; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			} else {
				this.centerX = this.x + this.w / 2;
				this.centerY = this.y + this.h / 2;
			}

			const diffXBefore = px - this.centerX;
			const diffYBefore = py - this.centerY;
			const diffXAfter = x - this.centerX;
			const diffYAfter = y - this.centerY;
			const angleBefore = Math.atan2(diffYBefore, diffXBefore) / Math.PI * 180;
			const angleAfter = Math.atan2(diffYAfter, diffXAfter) / Math.PI * 180; // 旋转的角度

			if (ROTATE_ENABLED) {
				this.rotate = currentGraph.rotate + angleAfter - angleBefore;
			}

			const lineA = Math.sqrt(Math.pow(this.centerX - px, 2) + Math.pow(this.centerY - py, 2));
			const lineB = Math.sqrt(Math.pow(this.centerX - x, 2) + Math.pow(this.centerY - y, 2));

			if (this.type === 'image') {
				let resize_rito = lineB / lineA;
				let new_w = currentGraph.w * resize_rito;
				let new_h = currentGraph.h * resize_rito;

				if (currentGraph.w < currentGraph.h && new_w < this.MIN_WIDTH) {
					new_w = this.MIN_WIDTH;
					new_h = this.MIN_WIDTH * currentGraph.h / currentGraph.w;
				} else if (currentGraph.h < currentGraph.w && new_h < this.MIN_WIDTH) {
					new_h = this.MIN_WIDTH;
					new_w = this.MIN_WIDTH * currentGraph.w / currentGraph.h;
				}

				this.w = new_w;
				this.h = new_h;
				this.x = currentGraph.x - (new_w - currentGraph.w) / 2;
				this.y = currentGraph.y - (new_h - currentGraph.h) / 2;
			} else if (this.type === 'text') {
				const fontSize = currentGraph.fontSize * ((lineB - lineA) / lineA + 1);
				this.fontSize = fontSize <= this.MIN_FONTSIZE ? this.MIN_FONTSIZE : fontSize; // 旋转位移后重新计算坐标

				this.ctx.setFontSize(this.fontSize);
				const textWidth = this.ctx.measureText(this.text).width;
				const textHeight = this.fontSize + 10;
				this.w = textWidth;
				this.h = textHeight; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			} else if (this.type === 'audio') {
				const fontSize = currentGraph.fontSize * ((lineB - lineA) / lineA + 1);
				this.fontSize = fontSize <= this.MIN_FONTSIZE ? this.MIN_FONTSIZE : fontSize; // 旋转位移后重新计算坐标

				this.ctx.setFontSize(this.fontSize);
				const textWidth = this.ctx.measureText(this.text).width + 40;
				const textHeight = this.fontSize + 10;
				this.w = textWidth;
				this.h = textHeight; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			}
		},

		toPx(rpx) {
			return rpx * this.factor;
		}

	};

	export default {
		data() {
			return {
				bgImage: '',
				history: [],
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
				selectActive: 0,
				thicknessValue: 3, // 线条粗细
				colorValue: "#ff0000",
				colorCircleValue: {
					r: 255,
					g: 0,
					b: 0,
					a: 0.6
				},
				strokeItem: {},
				circleItem: {}
			};
		},
		components: {},
		props: {
			graph: {
				type: Object,
				default: () => ({})
			},
			bgColor: {
				type: String,
				default: ''
			},
			bgSourceId: {
				type: String,
				default: ''
			},
			width: {
				type: Number,
				default: 750
			},
			height: {
				type: Number,
				default: 750
			},
			active: {
				type: Number,
				default: 0
			},
			enableUndo: {
				type: Boolean,
				default: false
			}
		},
		watch: {
			graph: {
				handler: 'onGraphChange',
				deep: true
			},
			active(val) {
				this.selectActive = val
			}
		},

		/**
		 * 绘制元素
		 */
		paint() {
			this.ctx.save(); // 由于measureText获取文字宽度依赖于样式，所以如果是文字元素需要先设置样式

			let textWidth = 0;
			let textHeight = 0;

			if (this.type === 'text') {
				this.ctx.setFontSize(this.fontSize);
				this.ctx.setTextBaseline('middle');
				this.ctx.setTextAlign('center');
				this.ctx.setFillStyle(this.color);
				textWidth = this.ctx.measureText(this.text).width;
				textHeight = this.fontSize + 10; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			} // 旋转元素

			if (this.type === 'audio') {
				this.ctx.setFontSize(this.fontSize);
				this.ctx.setTextBaseline('middle');
				this.ctx.setTextAlign('center');
				this.ctx.setFillStyle(this.color);
				textWidth = this.ctx.measureText(this.text).width;
				textHeight = this.fontSize + 10; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			} // 旋转元素

			this.ctx.translate(this.centerX, this.centerY);
			this.ctx.rotate(this.rotate * Math.PI / 180);
			this.ctx.translate(-this.centerX, -this.centerY); // 渲染元素

			if (this.type === 'text') {
				this.ctx.fillText(this.text, this.centerX, this.centerY);
			} else if (this.type === 'image') {
				this.ctx.drawImage(this.fileUrl, this.x, this.y, this.w, this.h);
			} else if (this.type === 'audio') {
				this.ctx.fillText(this.text, this.centerX, this.centerY);
			} else if (this.type === 'circle') {
				// this.ctx.fillText(this.text, this.centerX, this.centerY);
			} else // 如果是选中状态，绘制选择虚线框，和缩放图标、删除图标
				if (this.selected) {
					this.ctx.setLineDash([2, 5]);
					this.ctx.setLineWidth(2);
					this.ctx.setStrokeStyle(STROKE_COLOR);
					this.ctx.lineDashOffset = 6;

					if (this.type === 'text') {
						this.ctx.strokeRect(this.x, this.y, textWidth, textHeight);
						this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
						// this.ctx.drawImage(DRAG_ICON, this.x + textWidth - 15, this.y + textHeight - 15, 30, 30);
					} else {
						this.ctx.strokeRect(this.x, this.y, this.w, this.h);
						this.ctx.drawImage(DELETE_ICON, this.x - 15, this.y - 15, 30, 30);
						// this.ctx.drawImage(DRAG_ICON, this.x + this.w - 15, this.y + this.h - 15, 30, 30);
					}
				}

			this.ctx.restore();
		},

		/**
		 * 给矩形描边
		 * @private
		 */
		_drawBorder() {
			let p = this.square;
			let ctx = this.ctx;
			this.ctx.save();
			this.ctx.beginPath();
			ctx.setStrokeStyle('orange');

			this._draw_line(this.ctx, p[0], p[1]);

			this._draw_line(this.ctx, p[1], p[2]);

			this._draw_line(this.ctx, p[2], p[3]);

			this._draw_line(this.ctx, p[3], p[0]);

			ctx.restore();
		},

		/**
		 * 画一条线
		 * @param ctx
		 * @param a
		 * @param b
		 * @private
		 */
		_draw_line(ctx, a, b) {
			ctx.moveTo(a[0], a[1]);
			ctx.lineTo(b[0], b[1]);
			ctx.stroke();
		},

		/**
		 *  判断一个点是否在多边形内部
		 *  @param points 多边形坐标集合
		 *  @param testPoint 测试点坐标
		 *  返回true为真，false为假
		 *  */
		insidePolygon(points, testPoint) {
			console.log(points)
			let x = testPoint[0],
				y = testPoint[1];
			let inside = false;

			for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
				let xi = points[i][0],
					yi = points[i][1];
				let xj = points[j][0],
					yj = points[j][1];
				let intersect = yi > y != yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
				if (intersect) inside = !inside;
			}

			return inside;
		},

		/**
		 * 计算旋转后矩形四个顶点的坐标（相对于画布）
		 * @private
		 */
		_rotateSquare() {
			this.square = [this._rotatePoint(this.x, this.y, this.centerX, this.centerY, this.rotate), this._rotatePoint(
				this.x + this.w, this.y, this.centerX, this.centerY, this.rotate), this._rotatePoint(this.x + this
				.w, this.y + this.h, this.centerX, this.centerY, this.rotate), this._rotatePoint(this.x, this.y +
				this.h, this.centerX, this.centerY, this.rotate), this._rotatePoint(this.x - 40, this.y +
				this.h + 10, this.centerX, this.centerY, this.rotate)];
		},

		/**
		 * 计算旋转后的新坐标（相对于画布）
		 * @param x
		 * @param y
		 * @param centerX
		 * @param centerY
		 * @param degrees
		 * @returns {*[]}
		 * @private
		 */
		_rotatePoint(x, y, centerX, centerY, degrees) {
			let newX = (x - centerX) * Math.cos(degrees * Math.PI / 180) - (y - centerY) * Math.sin(degrees * Math.PI /
				180) + centerX;
			let newY = (x - centerX) * Math.sin(degrees * Math.PI / 180) + (y - centerY) * Math.cos(degrees * Math.PI /
				180) + centerY;
			return [newX, newY];
		},

		/**
		 *
		 * @param {*} px 手指按下去的坐标
		 * @param {*} py 手指按下去的坐标
		 * @param {*} x 手指移动到的坐标
		 * @param {*} y 手指移动到的坐标
		 * @param {*} currentGraph 当前图层的信息
		 */
		transform(px, py, x, y, currentGraph) {
			// 获取选择区域的宽度高度
			if (this.type === 'text') {
				this.ctx.setFontSize(this.fontSize);
				const textWidth = this.ctx.measureText(this.text).width;
				const textHeight = this.fontSize + 10;
				this.w = textWidth;
				this.h = textHeight; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			} else {
				this.centerX = this.x + this.w / 2;
				this.centerY = this.y + this.h / 2;
			}

			const diffXBefore = px - this.centerX;
			const diffYBefore = py - this.centerY;
			const diffXAfter = x - this.centerX;
			const diffYAfter = y - this.centerY;
			const angleBefore = Math.atan2(diffYBefore, diffXBefore) / Math.PI * 180;
			const angleAfter = Math.atan2(diffYAfter, diffXAfter) / Math.PI * 180; // 旋转的角度

			if (ROTATE_ENABLED) {
				this.rotate = currentGraph.rotate + angleAfter - angleBefore;
			}

			const lineA = Math.sqrt(Math.pow(this.centerX - px, 2) + Math.pow(this.centerY - py, 2));
			const lineB = Math.sqrt(Math.pow(this.centerX - x, 2) + Math.pow(this.centerY - y, 2));

			if (this.type === 'image') {
				let resize_rito = lineB / lineA;
				let new_w = currentGraph.w * resize_rito;
				let new_h = currentGraph.h * resize_rito;

				if (currentGraph.w < currentGraph.h && new_w < this.MIN_WIDTH) {
					new_w = this.MIN_WIDTH;
					new_h = this.MIN_WIDTH * currentGraph.h / currentGraph.w;
				} else if (currentGraph.h < currentGraph.w && new_h < this.MIN_WIDTH) {
					new_h = this.MIN_WIDTH;
					new_w = this.MIN_WIDTH * currentGraph.w / currentGraph.h;
				}

				this.w = new_w;
				this.h = new_h;
				this.x = currentGraph.x - (new_w - currentGraph.w) / 2;
				this.y = currentGraph.y - (new_h - currentGraph.h) / 2;
			} else if (this.type === 'text') {
				const fontSize = currentGraph.fontSize * ((lineB - lineA) / lineA + 1);
				this.fontSize = fontSize <= this.MIN_FONTSIZE ? this.MIN_FONTSIZE : fontSize; // 旋转位移后重新计算坐标

				this.ctx.setFontSize(this.fontSize);
				const textWidth = this.ctx.measureText(this.text).width;
				const textHeight = this.fontSize + 10;
				this.w = textWidth;
				this.h = textHeight; // 字体区域中心点不变，左上角位移

				this.x = this.centerX - textWidth / 2;
				this.y = this.centerY - textHeight / 2;
			}
		},

		toPx(rpx) {
			return rpx * this.factor;
		},

		beforeMount() {
			const sysInfo = wx.getSystemInfoSync();
			const screenWidth = sysInfo.screenWidth;
			this.factor = screenWidth / 750;

			if (typeof this.drawArr === 'undefined') {
				this.drawArr = [];
			}

			this.ctx = wx.createCanvasContext('canvas-drag', this);
			this.draw();
		},

		created() {


			uni.downloadFile({
				url: DELETE_ICON, //仅为示例，并非真实的资源
				success: (res) => {
					if (res.statusCode === 200) {
						DELETE_ICON = res.tempFilePath;
					}
				}
			})
			uni.downloadFile({
				url: DRAG_ICON, //仅为示例，并非真实的资源
				success: (res) => {
					if (res.statusCode === 200) {
						DRAG_ICON = res.tempFilePath;
					}
				}
			})
		},

		methods: {
			// 初始化画板
			async init_image(url) {

				uni.getImageInfo({
					src: url,
					success: (image) => {
						const query = uni.createSelectorQuery().in(this);
						query.select('.container-canvas').boundingClientRect(data => {
							let img_res = this.$mHelper.imgFit(data.width, data.height, image.width, image.height);
							if (image.width >= image.height) {
								//初始化canvas尺寸
								this.canvas.width = img_res.width / (uni.upx2px(100) /
									100)
								this.canvas.height = img_res.height / (uni.upx2px(100) /
									100)
								this.canvas.origin_height = this.canvas.height
								this.canvas.origin_width = this.canvas.width

								//初始化预览图尺寸
								this.render_image.width = this.canvas.width;
								this.render_image.height = this.canvas.height;

							} else {
								//初始化canvas尺寸
								// this.canvas.height = this.height / (uni.upx2px(100) /
								// 	100)
								// this.canvas.width = this.width / (uni.upx2px(100) /
								// 	100)
								this.canvas.width = img_res.width / (uni.upx2px(100) /
									100)
								this.canvas.height = img_res.height / (uni.upx2px(100) /
									100)
								// parseInt(this.canvas.height * image.width / image.height);
								this.canvas.origin_width = this.canvas.width;
								this.canvas.origin_height = this.canvas.height
								//初始化预览图尺寸
								this.render_image.width = this.canvas.width
								this.render_image.height = this.canvas.height;
							}
							this.bgImage = image.path;
							this.draw(); // 改变背景图片时记录历史
							this.recordHistory();
						}).exec();

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
			toPx(rpx) {
				return rpx * this.factor;
			},

			initBg() {
				this.bgColor = '';
				this.bgSourceId = '';
				this.bgImage = '';
			},

			initHistory() {
				this.history = [];
			},

			recordHistory() {
				if (!this.enableUndo) {
					return;
				}

				this.exportJson().then(imgArr => {
					this.history.push(JSON.stringify(imgArr));
				}).catch(e => {
					console.error(e);
				});
			},

			undo() {
				if (!this.enableUndo) {
					console.log(`后退功能未启用，请设置enableUndo="{{true}}"`);
					return;
				}

				if (this.history.length > 1) {
					this.history.pop();
					let newConfigObj = this.history[this.history.length - 1];
					this.initByArr(JSON.parse(newConfigObj));
				} else {
					console.log('已是第一步，不能回退');
				}
			},

			onGraphChange(n, o) {
				if (JSON.stringify(n) === '{}') return;
				this.drawArr.push(new dragGraph(Object.assign({
					x: 30,
					y: 30
				}, n), this.ctx, this.factor));
				this.draw(); // 参数有变化时记录历史
				this.recordHistory();
			},
			onCircleChange(item) {
				if (JSON.stringify(item) === '{}') return;
				let points = [item.points[0], item.points[item.points.length - 1]];
				console.log(points)

				let cw = (points[1].x - points[0].x) / 2;
				let ch = (points[1].y - points[0].y) / 2;
				let cx = points[0].x + cw;
				let cy = points[0].y + ch;
				item['w'] = cw
				item['h'] = ch
				item['x'] = cx
				item['y'] = cy
				item['type'] = 'circle'
				item['color'] = this.colorCircleValue
				this.drawArr.push(new dragGraph(Object.assign(item, {
					points
				}), this.ctx, this.factor));
				this.draw(); // 参数有变化时记录历史
				this.recordHistory();
				this.circleItem = {}
			},
			initByArr(newArr) {

				console.log(newArr)
				this.drawArr = []; // 重置绘画元素

				this.initBg(); // 重置绘画背景
				// 循环插入 drawArr

				newArr.forEach((item, index) => {
					switch (item.type) {
						case 'bgColor':
							this.bgImage = '';
							this.bgSourceId = '';
							this.bgColor = item.color;
							break;

						case 'bgImage':
							this.bgColor = '';
							this.bgImage = item.url;

							if (item.sourceId) {
								this.bgSourceId = item.sourceId;
							}

							break;

						case 'image':
						case 'text':
							if (index === newArr.length - 1) {
								item.selected = true;
							} else {
								item.selected = false;
							}
							this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
							break;
						case 'audio':
							if (index === newArr.length - 1) {
								item.selected = true;
							} else {
								item.selected = false;
							}
							this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
							break;
						case 'line':
							this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
							break;
						case 'circle':
							if (index === newArr.length - 1) {
								item.selected = true;
							} else {
								item.selected = false;
							}
							this.drawArr.push(new dragGraph(item, this.ctx, this.factor));
							break;
					}
				});
				this.draw();
			},

			draw(status) {
				if (this.bgImage !== '') {
					console.log(this.bgImage)
					this.ctx.drawImage(this.bgImage, 0, 0, this.upx2px(this.canvas.width), this.upx2px(this
						.canvas.height));
				}

				if (this.bgColor !== '') {
					this.ctx.save();
					this.ctx.setFillStyle(this.bgColor);
					this.ctx.fillRect(0, 0, this.upx2px(this.canvas.width), this.upx2px(this.canvas.height));
					this.ctx.restore();
				}

				this.drawArr.forEach(item => {
					item.paint(status);
				});
				return new Promise(resolve => {
					this.ctx.draw(false, () => {
						resolve();
					});
				});
			},

			start(e) {
				this.circleItem = {}
				if (this.selectActive === 2) {
					this.strokeItem = {
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
					}
					this.drawLine(this.strokeItem, e.type)
					return
				}

				isMove = false; // 重置移动标识
				const {
					x,
					y
				} = e.touches[0];
				this.tempGraphArr = [];
				let lastDelIndex = null; // 记录最后一个需要删除的索引

				if (!this.drawArr.length) {
					if (this.selectActive === 4) {
						this.circleItem = {
							lineWidth: 3,
							color: this.colorCircleValue,
							type: 'circle',
							points: [{
								x,
								y,
								type: e.type,
							}]
						}
					}
				}
				this.drawArr && this.drawArr.forEach((item, index) => {
					const action = item.isInGraph(x, y);
					console.log(action)
					if (action) {
						this.$emit('actionChange', {
							itemIndex: index,
							selectActive: this.selectActive,
							item
						})
						item.action = action;
						this.tempGraphArr.push(item); // 保存点击时的坐标

						this.currentTouch = {
							x,
							y
						};

						if (action === 'del') {
							// lastDelIndex = index; // 标记需要删除的元素
							// item.selected = true;
						}
					} else {
						if (this.selectActive === 4) {
							this.circleItem = {
								lineWidth: 3,
								color: this.colorCircleColor,
								points: [{
									x: e.touches[0].x,
									y: e.touches[0].y,
									type: e.type,
								}]
							}
						}

						item.action = false;
						item.selected = false;


					}
				}); // 保存点击时元素的信息

				if (this.tempGraphArr.length > 0) {
					for (let i = 0; i < this.tempGraphArr.length; i++) {
						let lastIndex = this.tempGraphArr.length - 1; // 对最后一个元素做操作

						if (i === lastIndex) {
							// 未选中的元素，不执行删除和缩放操作
							if (lastDelIndex !== null && this.tempGraphArr[i].selected) {
								if (this.drawArr[lastDelIndex].action == 'del') {
									this.drawArr.splice(lastDelIndex, 1);
									this.ctx.clearRect(0, 0, this.toPx(this.width), this.toPx(this.height));
								}
							} else {
								this.tempGraphArr[lastIndex].selected = true;
								this.currentGraph = Object.assign({}, this.tempGraphArr[lastIndex]);
							}
						} else {
							// 不是最后一个元素，不需要选中，也不记录状态
							this.tempGraphArr[i].action = false;
							this.tempGraphArr[i].selected = false;
						}
					}
				}

				this.draw();
			},

			move(e) {
				const {
					x,
					y
				} = e.touches[0];
				if (this.selectActive === 2) {
					this.strokeItem.points.push({
						x,
						y,
						type: e.type,
					})
					this.drawLine(this.strokeItem, e.type);
					return
				}


				if (this.tempGraphArr && this.tempGraphArr.length > 0) {
					isMove = true; // 有选中元素，并且有移动时，设置移动标识

					const currentGraph = this.tempGraphArr[this.tempGraphArr.length - 1];

					if (currentGraph.action === 'move') {
						currentGraph.centerX = this.currentGraph.centerX + (x - this.currentTouch.x);
						currentGraph.centerY = this.currentGraph.centerY + (y - this.currentTouch
							.y); // 使用中心点坐标计算位移，不使用 x,y 坐标，因为会受旋转影响。

						if (currentGraph.type !== 'text') {
							currentGraph.x = currentGraph.centerX - this.currentGraph.w / 2;
							currentGraph.y = currentGraph.centerY - this.currentGraph.h / 2;
						}
					} else if (currentGraph.action === 'transform') {
						currentGraph.transform(this.currentTouch.x, this.currentTouch.y, x, y, this.currentGraph);
					} else {
						console.log('测试一下字')
					} // 更新4个坐标点（相对于画布的坐标系）


					currentGraph._rotateSquare();

					this.draw();
				} else {
					if (this.selectActive === 4) {

						if (this.circleItem.points) {
							this.circleItem.points.push({
								x,
								y,
								type: e.type,
							})
						}

					}
				}
			},

			end(e) {
				if (this.selectActive === 2) {
					if (this.strokeItem.points.length < 2) { //当此路径只有一个点的时候
						this.undo();
					} else {
						this.drawArr.push(new dragGraph({
							x: 30,
							y: 30,
							color: this.strokeItem.style.color,
							lineWidth: this.strokeItem.style.lineWidth,
							points: this.strokeItem.points,
							type: 'line'
						}, this.ctx, this.factor));
						this.recordHistory();
					}

					this.strokeItem = {}
					return
				}
				this.tempGraphArr = [];
				if (isMove) {
					isMove = false; // 重置移动标识
					// 用户操作结束时记录历史
					this.recordHistory();
				} else {
					if (this.selectActive === 4) {
						console.log(this.circleItem.points)
						if (this.circleItem.points) {
							if (this.circleItem.points.length > 4) {
								this.onCircleChange(this.circleItem)
							}
						}
					}
				}
			},
			drawLine(StrokesItem, type) {
				if (StrokesItem.points.length > 1) {
					this.ctx.beginPath();
					this.ctx.setLineCap('round')
					this.ctx.setStrokeStyle(StrokesItem.style.color);
					this.ctx.setLineWidth(StrokesItem.style.lineWidth);
					this.ctx.moveTo(StrokesItem.points[StrokesItem.points.length - 2].x, StrokesItem.points[StrokesItem
						.points.length -
						2].y);
					this.ctx.lineTo(StrokesItem.points[StrokesItem.points.length - 1].x, StrokesItem.points[StrokesItem
						.points.length -
						1].y);
					this.ctx.stroke();
					// helper.ctx.draw(true);
					this.ctx.draw(true, () => {
						// helper.saveImageData()

					})
				}
			},
			exportFun() {
				return new Promise((resolve, reject) => {
					this.drawArr = this.drawArr.map(item => {
						item.selected = false;
						return item;
					});
					this.draw(true).then(() => {
						uni.canvasToTempFilePath({
							canvasId: 'canvas-drag',
							x: 0,
							y: 0,
							success: res => {
								resolve(res.tempFilePath);
							},
							fail: e => {
								reject(e);
							}
						}, this);
					});
				});
			},
			// 刷新
			refresh() {
				this.draw().then(() => {});
			},
			exportJson() {
				return new Promise((resolve, reject) => {
					let exportArr = this.drawArr.map(item => {
						item.selected = false;

						switch (item.type) {
							case 'image':
								return {
									type: 'image',
										url: item.fileUrl,
										y: item.y,
										x: item.x,
										w: item.w,
										h: item.h,
										rotate: item.rotate,
										sourceId: item.sourceId
								};
								break;

							case 'text':
								return {
									type: 'text',
										text: item.text,
										color: item.color,
										fontSize: item.fontSize,
										y: item.y,
										x: item.x,
										w: item.w,
										h: item.h,
										rotate: item.rotate
								};
								break;
							case 'line':
								return {
									type: 'line',
										color: item.color,
										fontSize: item.fontSize,
										points: item.points,
										lineWidth: item.lineWidth,
										y: item.y,
										x: item.x,
										w: item.w,
										h: item.h,
										rotate: item.rotate
								};
								break;
							case 'audio':
								return {
									type: 'audio',
										color: item.color,
										fontSize: item.fontSize,
										points: item.points,
										tempFilePath: item.tempFilePath,
										text: item.text,
										y: item.y,
										x: item.x,
										w: item.w,
										h: item.h,
										rotate: item.rotate
								};
								break;
							case 'circle':
								return {
									type: 'circle',
										color: item.color,
										fontSize: item.fontSize,
										points: item.points,
										lineWidth: item.lineWidth,
										y: item.y,
										x: item.x,
										w: item.w,
										h: item.h,
										rotate: item.rotate
								};
								break;
						}
					});

					if (this.bgImage) {
						let tmp_img_config = {
							type: 'bgImage',
							url: this.bgImage
						};

						if (this.bgSourceId) {
							tmp_img_config['sourceId'] = this.bgSourceId;
						}

						exportArr.unshift(tmp_img_config);
					} else if (this.bgColor) {
						exportArr.unshift({
							type: 'bgColor',
							color: this.bgColor
						});
					}

					resolve(exportArr);
				});
			},

			changColor(color) {
				const selected = this.drawArr.filter(item => item.selected);

				if (selected.length > 0) {
					selected[0].color = color;
				}

				this.draw(); // 改变文字颜色时记录历史

				this.recordHistory();
			},

			changeBgColor(color) {
				this.bgImage = '';
				this.bgColor = color;
				this.draw(); // 改变背景颜色时记录历史

				this.recordHistory();
			},

			changeBgImage(newBgImg) {
				this.bgColor = '';

				uni.downloadFile({
					url: typeof newBgImg == 'string' ? newBgImg : newBgImg.url, //仅为示例，并非真实的资源
					success: (res) => {
						if (res.statusCode === 200) {
							if (typeof newBgImg == 'string') {
								this.bgSourceId = '';
								this.bgImage = res.tempFilePath;
							} else {
								this.bgSourceId = newBgImg.sourceId;
								this.bgImage = res.tempFilePath;
							}
							this.draw(); // 改变背景图片时记录历史

							this.recordHistory();
						}
					}
				})

			},

			// 改变线条颜色
			changeLineColor(color) {
				this.colorValue = color
			},
			// 改变线条颜色
			changeLineWidth(width) {
				this.thicknessValue = width
			},
			// 改变圆环的颜色
			changCircleColor(color) {
				console.log(color)
				this.colorCircleValue = color
			},
			clearCanvas() {
				this.ctx.clearRect(0, 0, this.toPx(this.width), this.toPx(this.height));
				this.ctx.draw();
				this.drawArr = [];
				this.initBg(); // 重置绘画背景

				this.initHistory(); // 清空历史记录
			},
			
		}
	};
</script>
<style scoped lang="scss">
	@import "./index.css";

	.container-canvas {
		width: 100vw;
		height: 100%;
		// padding-bottom: 365rpx;
		display: flex;
		justify-content: center;
		align-items: center;


		image {
			object-fit: cover;
			width: 100%;
			height: 100%;
		}

		canvas {
			z-index: 2 !important;
		}
	}
</style>
