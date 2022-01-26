import Vue from "vue"

Vue.mixin({
	data() {
		return {
			imgPath: this.$mConfig.imgPath,
			themeColor: this.$mConstDataConfig.themeColor,
			StatusBar: this.StatusBar
		}
	},
	methods: {
		setSrc(path) {
			return this.imgPath + path
		}
	}
})
