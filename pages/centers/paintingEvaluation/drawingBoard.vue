<template>
	<view class="container">
		<drawing-board cid="drawingBoard" @sumbit="submitTap"></drawing-board>
	</view>
</template>

<script>
	import DrawingBoard from '@/components/drawingBoard/drawingBoard.vue'
	import {
		generatePostPolicy
	} from '@/api/basic.js'
	export default {
		components:{
			DrawingBoard
		},
		data() {
			return {
				id: null,
				url: ''
			};
		},
		onLoad(options) {
			if(options.id) this.id = options.id;
		},
		methods:{
			async submitTap(res){
				await this.handleUploadFile(res)
			},
			// 上传图片
			async handleUploadFile(res) {
				const _this = this;
				const filePath = res.tempFilePath;
				await _this.$http.get(generatePostPolicy, {
					app_token: uni.getStorageSync('accessToken')
				}).then(async res => {
					console.log(res)
					let data = res.data;
					await _this.$http
						.upload(data.host, {
							filePath,
							formData: {
								key: data.dir,
								policy: data.policy,
								OSSAccessKeyId: data.accessid,
								signature: data.signature,
							}
						})
						.then(async r => {
							console.log(r)
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

<style lang="scss">

</style>
