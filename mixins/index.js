import Vue from "vue"

Vue.mixin({
	data() {
		return {
			imgPath: this.$mConfig.imgPath,
		}
	},
	methods:{
		setSrc(path){
			return this.imgPath + path
		}
	}
})