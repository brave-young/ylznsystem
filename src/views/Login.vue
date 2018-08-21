<template >
	<section style="background-image: url(../../static/bg2.png);background-size: 100% 100%;" class="full">
		<el-form :model="ruleForm2" :rules="rules2" ref="ruleForm2" label-position="left" label-width="0px" class="login-container">
		<h3 class="title">系统登录</h3>
		<el-form-item prop="account">
			<el-input type="text" v-model="ruleForm2.account" placeholder="账号"></el-input>
		</el-form-item>
		<el-form-item prop="checkPass">
			<el-input type="password" v-model="ruleForm2.checkPass" placeholder="密码"></el-input>
		</el-form-item>
		<el-checkbox v-model="checked" class="remember">记住密码</el-checkbox>
		<el-form-item style="width:100%;">
			<el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit2" :loading="logining">登录</el-button>
		</el-form-item>
	</el-form>
	</section>
	
	
</template>

<script>
	export default {
		data() {
			return {
				logining: false,
				ruleForm2: {
					account: '',
					checkPass: ''
				},
				rules2: {
					account: [{
							required: true,
							message: '请输入账号',
							trigger: 'blur'
						},
						//{ validator: validaePass }
					],
					checkPass: [{
						required: true,
						message: '请输入密码',
						trigger: 'blur'
					}, ]
				},
				checked: true
			};
		},
		methods: {
			//cookie保存账号密码
			setCookie(name, value, expdays) {
				var expdate = new Date();
				//设置Cookie过期日期
				expdate.setDate(expdate.getDate() + expdays);
				//添加Cookie
				document.cookie = name + "=" + escape(value) + ";expires=" + expdate.toUTCString();
			},
			getCookie(name) {
				//获取name在Cookie中起止位置
				var start = document.cookie.indexOf(name + "=");

				if(start != -1) {
					start = start + name.length + 1;
					//获取value的终止位置
					var end = document.cookie.indexOf(";", start);
					if(end == -1)
						end = document.cookie.length;
					//截获cookie的value值,并返回
					return unescape(document.cookie.substring(start, end));
				}
				return "";
			},
			delCookie(name) {
				this.setCookie(name, "", -1);
			},
			handleReset2() {
				this.$refs.ruleForm2.resetFields();
			},
			handleSubmit2() {
				if(this.ruleForm2.account == "" || this.ruleForm2.checkPass == "") {
					alert('请补全账号密码')
				} else {
					this.logining = true;
					
					this.tokenencryption()
					this.$http.post(this.base + '/yw/admin/login', JSON.stringify({
							loginName: this.ruleForm2.account,
							passWord: this.ruleForm2.checkPass,
							encryptSign: String(this.$md5(this.nowtimestamp+this.appkey).toUpperCase()),//加密后的字符串
							timeStamp: this.nowtimestamp,//时间戳
							sourceForm:'2'//请求来源 1 app 2 web
					}), {emulateJSON: true}).then(res => {
						this.logining = false;
						if(res.body.type !== '0') {
							this.$message({
								message: res.body.infoCode,
								type: 'error'
							});
						} else {
							if(this.checked == true) {
								this.setCookie('users', this.ruleForm2.account, 7);
								this.setCookie('username', this.ruleForm2.checkPass, 7);
							} else {
								this.delCookie('users');
								this.delCookie('username');
							}
							sessionStorage.setItem('user', JSON.stringify(res.body.data));
							this.$router.push({
								path: '/main'
							});
						}
					});
				}

			}
		},
		mounted() {
			this.ruleForm2.account = this.getCookie('users')
			this.ruleForm2.checkPass = this.getCookie('username')
		},
		created: function() {
			var that = this
			document.onkeydown = function(e) {
				var key = window.event.keyCode;
				if(key == 13) {
					that.handleSubmit2()
				}
			}
		}
	}
</script>
<style scoped>
	.login-container {
		-webkit-border-radius: 5px;
		border-radius: 5px;
		-moz-border-radius: 5px;
		background-clip: padding-box;
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		margin: auto;
		width: 350px;
		height: 300px;
		padding: 35px 35px 15px 35px;
		background: #324357;
		border: 1px solid #eaeaea;
		box-shadow: 0 0 25px #cac6c6;
		opacity: 0.9;
	}
	
	.remember {
		margin: 0px 0px 35px 0px;
		color: #fff;
	}
	
	.title {
		margin: 0px auto 40px auto;
		text-align: center;
		color: #fff;
	}
	
</style>