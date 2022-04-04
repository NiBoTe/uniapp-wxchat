/* eslint-disable */
import mRouter from '@/utils/router';
import mConstDataConfig from '@/config/constData.config';
import mStore from '@/store';
import moment from '@/common/moment.js'

import PY from './PY.js'
//常用方法集合
export default {
	/**
	 * toast提示
	 */
	toast(title, duration = 3000, mask = false, icon = 'none', image) {
		if (Boolean(title) === false) {
			return;
		}
		uni.showToast({
			title,
			duration,
			mask,
			icon,
			image
		});
	},
	/**
	 * 返回登录页面
	 */
	async backToLogin() {
		// 存当前页面的地址
		const currentPage = getCurrentPages()[getCurrentPages().length - 1];
		const params = {};
		// #ifdef MP
		params.route = `/${currentPage.$vm.__route__}`;
		params.query = currentPage.$vm.$mp && currentPage.$vm.$mp.query;
		// #endif
		uni.setStorageSync('backToPage', JSON.stringify(params));
		await mStore.commit('logout');
		mRouter.push({
			route: '/pages/public/logintype'
		});
	},
	/**
	 * 获取一个随机数
	 * @param {Object} min
	 * @param {Object} max
	 */
	random(min, max) {
		switch (arguments.length) {
			case 1:
				return parseInt(Math.random() * min + 1, 10);
				break;
			case 2:
				return parseInt(Math.random() * (max - min + 1) + min, 10);
				break;
			default:
				return 0;
				break;
		}
	},
	/*
	 * obj 转 params字符串参数
	 * 例子：{a:1,b:2} => a=1&b=2
	 */
	objParseParam(obj) {
		let paramsStr = '';
		if (obj instanceof Array) return paramsStr;
		if (!(obj instanceof Object)) return paramsStr;
		for (let key in obj) {
			paramsStr += `${key}=${obj[key]}&`;
		}
		return paramsStr.substring(0, paramsStr.length - 1);
	},
	/*
	 * obj 转 路由地址带参数
	 * 例子：{a:1,b:2} => /pages/index/index?a=1&b=2
	 */
	objParseUrlAndParam(path, obj) {
		let url = path || '/';
		let paramsStr = '';
		if (obj instanceof Array) return url;
		if (!(obj instanceof Object)) return url;
		paramsStr = this.objParseParam(obj);
		paramsStr && (url += '?');
		url += paramsStr;
		return url;
	},
	/**
	 * 比较版本号
	 */
	compareVersion(reqV, curV) {
		if (curV && reqV) {
			let arr1 = curV.split('.'),
				arr2 = reqV.split('.');
			let minLength = Math.min(arr1.length, arr2.length),
				position = 0,
				diff = 0;
			while (
				position < minLength &&
				(diff = parseInt(arr1[position]) - parseInt(arr2[position])) == 0
			) {
				position++;
			}
			diff = diff != 0 ? diff : arr1.length - arr2.length;
			if (diff > 0) {
				if (position == minLength - 1) {
					return 1;
				} else {
					return 2;
				}
			} else {
				return 0;
			}
		} else {
			return 0;
		}
	},
	// 去掉字符串中的空格
	trim(str) {
		if (!str) {
			return '';
		}
		return str.replace(/\s*/g, '');
	},

	// 判断两个对象是否相同
	isObjectValueEqual(x, y) {
		// 指向同一内存时
		if (x === y) {
			return true;
		} else if (
			typeof x == 'object' &&
			x != null &&
			typeof y == 'object' && y != null
		) {
			if (Object.keys(x).length != Object.keys(y).length) return false;

			for (var prop in x) {
				if (y.hasOwnProperty(prop)) {
					if (!this.isObjectValueEqual(x[prop], y[prop])) return false;
				} else return false;
			}

			return true;
		} else return false;
	},
	// 递归遍历省市区-树形结构
	setTreeData(arr) {
		arr.forEach(function(item) {
			delete item.children;
		});
		let map = {}; //构建map
		arr.forEach(i => {
			map[i.id] = i;
		});
		let treeData = [];
		arr.forEach(child => {
			const mapItem = map[child.parentId];
			if (mapItem) {
				(mapItem.children || (mapItem.children = [])).push(Object.assign(child, {
					value: child.id,
					label: child.name,
				}));
			} else {
				//不存在则是顶层数据
				treeData.push(Object.assign(child, {
					value: child.id,
					label: child.name,
				}));
			}
		});
		return treeData;
	},
	// 获取星期
	getWeek(week) { // 参数时间戳
		switch (week) {
			case 1:
				return '周一'
			case 2:
				return '周二'
			case 3:
				return '周三'
			case 4:
				return '周四'
			case 5:
				return '周五'
			case 6:
				return '周六'
			case 0:
				return '周日'
		}
	},
	// 数组分割
	groupArray(array, subGroupLength) {
		let index = 0;
		let newArray = [];
		while (index < array.length) {
			newArray.push(array.slice(index, index += subGroupLength));
		}
		return newArray;
	},
	// 判断对象是否有空值
	isNUll(obj, notArr = []) {
		for (var i in obj) {
			let arr = notArr.filter(a => a === i)
			if (!arr.length) {
				if (obj[i] === null) {
					return true
				}
			}
		}
		return false
	},
	// 搜索高亮
	highlightKeyword(str, key, customClass) {
		var reg = new RegExp((`(${key})`), "gm");
		var replace = '<span style="color:#2C3AFF;font-weight:bold;">$1</span>';
		return str.replace(reg, replace);
	},
	// 验证手机号
	checkMobile(mobile) {
		return RegExp(/^(0|86|17951)?(13[0-9]|15[012356789]|166|17[0-9]|18[0-9]|19[0-9]|14[0-9])[0-9]{8}$/).test(mobile);
	},
	// 验证身份证号码
	checkIdCard(idcard) {
		return RegExp(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/).test(idcard);
	},
	segSort(arr, keyName = 'examAddress') {
		let letters = "*ABCDEFGHJKLMNOPQRSTWXYZ".split('');
		let segs = {};
		let indexedList = []
		// 创建一个以26个为key的对象
		letters.forEach(item => {
			segs[item] = [];
		})
		arr.forEach(item => {
			// 取姓氏并返回姓氏的拼音首字母
			let a = PY.ConvertPinyin(item[keyName]).substr(0, 1);
			console.log(a)
			// 在A-z之中写入对应字母的对象数组中，否则传入*对象数组里
			let rep = new RegExp(/[A-z]/)
			rep.test(a) ? segs[a.toLocaleUpperCase()].push(item) : segs['*'].push(item)

		})
		// 循环segs对象，转换为indexList组件需要的格式
		for (const [key, value] of Object.entries(segs)) {
			value.length && indexedList.push({
				letter: key,
				data: value
			})
		}

		console.log(indexedList)
		indexedList.forEach(item => {
			if (item.data.length > 1) {
				// 这里是给相同拼音首字母进行排序
				item.data = item.data.sort((a, b) => {
					return a[keyName].localeCompare(b[keyName])
				})
			}
		})
		return indexedList;
	},
	// 身份证脱敏
	certificatecode(code, bagin = 4, end = 3) {
		return code.replace(/^(.{4})(?:\d+)(.{3})$/, "\$1****\$2")
	},
	// 格式化时间
	formatSeconds(value, type = 'hour') {
		let result = parseInt(value)
		let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
		let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result /
			60 % 60));
		let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));

		let res = '';
		if (h !== '00') res += `${h}h`;
		if (m !== '00') res += `${m}min`;
		res += `${s}s`;
		return type === 'hour' ? `${h}:${m}:${s}` : `${m}:${s}`;
	},
	// 格式化时长
	formatMinutes(value) {
		let result = parseInt(value)
		let m = Math.floor((result / 60 % 60));
		let s = Math.floor((result % 60));
		return `${m}'${s}"`;
	},
	// 时间段内
	timeInByDate(start, end) {
		if (moment().diff(moment(start)) > 0 && moment(end).diff(moment()) > 0) {
			return true
		}
		return false
	},
	// 类型筛选
	listFilters(id, list) {
		return list.filter(item => item.firstMenuId === id)
	},
	// 表情处理
	messageemoj(message) {
		const emojiList = [
			[{
					"url": "applause.png",
					alt: "[鼓掌]"
				},
				{
					"url": "laugh.png",
					alt: "[高兴]"
				},
				{
					"url": "cool.png",
					alt: "[得意]"
				},
			]
		]
		let msg = '';
		let bgn = message.indexOf("[")
		let end = message.indexOf("]")
		let iq = 0
		//死循环
		while (bgn != -1 && end != -1) {
			
			console.log('=====')
			iq += 1;
			//不存在跳出
			if (bgn == -1 || end == -1) {
				console.log(message)
				msg += message
			
				break;
			}
			//防止死循环
			if (iq > 99) {
				break;
			}
			//是否是表情格式
			if (bgn < end && end <= bgn + 3) {
				
				
				let ok = false
				for (let i = 0; i < emojiList.length; i++) {
					//匹配到表情退出
					if (ok) {
						break;
					}
					//未匹配到表情退出
					if (i == emojiList.length) {
						msg += message.substring(0, message.indexOf("]"));
						message = message.substring(message.indexOf("]") + 1);
						break;
					}
					for (let j = 0; j < emojiList[i].length; j++) {
						if (emojiList[i][j].alt == message.substring(message.indexOf("["), message.indexOf(
								"]") + 1)) {
							//匹配表情替换
							msg += message.substring(0, message.indexOf("["));
							//格式很重要，不要出现"",用''
							msg += "<img src='https://ykh-wxapp.oss-cn-hangzhou.aliyuncs.com/wx_applet_img/" + emojiList[i][j].url +
								"' style='width: 32rpx;height: 32rpx;display:inline-block;' class='emojoStyle' />"
							message = message.substring(message.indexOf("]") + 1);
							ok = true;
							break;
						}
					}
				}
			} else {
				msg += message.substring(0, message.indexOf("["));
				message = message.substring(message.indexOf("[") + 1);
			}
			//从新获取
			bgn = message.indexOf("[")
			end = message.indexOf("]")
			// break
		}
		if (bgn == -1 || end == -1) {
			//消息不存在表情格式，直接赋值
			if (msg.length == 0) {
				msg = message
			} else {
				msg += message
			}
		}
		return msg
	},
	getAuth(){
		uni.showModal({
		  title: '提示',
		  content: '需要您授权保存相册',
		  success: res => {
			  if(res.confirm) {
				  wx.openSetting({
				    success(settingdata) {
				      console.log("settingdata", settingdata)
				    },
				    fail(failData) {
				      console.log("failData", failData)
				    },
				    complete(finishData) {
				      console.log("finishData", finishData)
				    }
				  })
			  }
		  }
		})
	},
	// 图片比例计算
	imgFit(url = "", box_w, box_h, img_w, img_h) {
		var r = img_w / img_h,
			final_w = 0,
			final_h = 0;
		if (img_w > img_h) {
			r = img_h / img_w;
			final_w = box_w;
			final_h = box_w * r;
		} else {
			final_h = box_h;
			final_w = r * box_h;
		}
		return {
			width: final_w,
			height: final_h
		}
	}

};
