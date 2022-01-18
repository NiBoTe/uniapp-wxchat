<template>
	<block>
		<image
			v-if="preview"
			class="rf-image"
			:mode="mode"
			lazy-load="true"
			@tap.stop="previewImage(imgSrc)"
			@error="onImageError"
			:src="imgSrc || $mAssetsPath.errorImage"
		></image>
		<image
			v-else
			class="rf-image"
			:mode="mode"
			lazy-load="true"
			@error="onImageError"
			:src="imgSrc || $mAssetsPath.errorImage"
		></image>
	</block>
</template>

<script>

import $mAssetsPath from '@/config/assets.config';
export default {
	name: 'rfImage',
	data(){
		return {
			imgSrc: ''
		}
	},
	created() {
		
		this.imgSrc = this.src
	},
	props: {
		src: {
			type: String,
			default: $mAssetsPath.errorImage
		},
		// 显示模式
		mode: {
			type: String,
			default: 'aspectFill'
		},
		// 是否预览
		preview: {
			type: Boolean,
			default: true
		}
	},
	methods: {
		// 图片异常处理
		onImageError() {
			console.log('====================')
			console.log($mAssetsPath.errorImage)
			this.imgSrc = $mAssetsPath.errorImage;
		},
		// 图片预览
		previewImage(urls) {
			if (!this.preview) return;
			if (!urls) return;
			uni.previewImage({
				urls: urls.split('#$#')
			});
		}
	}
};
</script>

<style lang="scss">
.rf-image {
	width: 100%;
	height: 100%;
}
</style>
