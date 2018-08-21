<template>
	<section style='height: 100%;'>
		<p @click=getonline() style="font-size: 16px;font-weight: bold;padding: 0;margin: 10px 0 0 0;z-index: 999;padding-left: 30px;position: absolute;"> 总量: <span style="font-size: 28px;color: #367fa9;margin-right: 20px;">{{this.total}}</span> 当前在线: <span style="font-size: 28px;color: #367fa9;">{{this.online}}</span></p>
		<div class="amap-wrapper">
			<el-amap vid="amapDemo" :center="center" :zoom='zoom' :zooms=[5,13] :mapStyle='maps'>
				<el-amap-marker :offset=[0,0] v-for="marker in markers" :position="marker.position" :title='marker.sun' icon= './static/点8.png'></el-amap-marker>
			</el-amap>
		</div>
	</section>
</template>
<script>
	export default {
		data() {
			return {
				zoom: 4,
				markers: [],
				center: [103.969996, 35.407376],
				total: 0,
				online: 0,
				sunkey: '',
				positionvalue: '',
				markervalue: {},
				maps:'light'
			}
		},

		methods: {
			getonline() {		
				this.tokenencryption()
				this.$http.post(this.base+'/yw/car/monitorCar', JSON.stringify({
							encryptSign: String(this.$md5(this.nowtimestamp+this.appkey).toUpperCase()),//加密后的字符串
							timeStamp: this.nowtimestamp,//时间戳
							sourceForm:'2'//请求来源 1 app 2 web
					}), {emulateJSON: true}).then(res => {
					if(res.body.type == 0) {	
						this.total = res.body.data.count
						this.online = Object.keys(res.body.data.data).length
						this.sunkey = Object.keys(res.body.data.data)
						this.positionvalue = res.body.data.data
						for(var i = 0; i < this.online; i++) {
							this.markers.push({
								sun: this.sunkey[i],
								position: this.positionvalue[this.sunkey[i]]
							})
						}
					} else {
						alert('位置获取失败')
					}
				})
			}
		},
		mounted() {
						this.getonline()
		}
	}
</script>

<style scoped>
	.amap-wrapper {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		position: absolute;
		top: 0px;
		bottom: 0px;
	}
</style>