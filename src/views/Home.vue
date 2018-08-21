<template>
	<section class="full">
		<el-row class="container">
			<el-col :span="24" class="header">
				<el-col :span="4" class="logo logo-width">
					<a id="logolink" href="#/main">
						<img style="margin-top: 13px;" src="../../static/切图-02.png"/>
					</a>
				</el-col>
				<el-col :span='16' class='tables'>
					<!--导航菜单-->
					<el-menu :default-active="$route.path" class="el-menu-vertical-demo" router mode="horizontal" >
						<template v-for="(item,index) in $router.options.routes">
							<el-menu-item v-if="item.leaf&&item.children.length>0" :index="item.children[0].path"><i style="font-size: 18px;" :class="item.iconCls"></i>{{item.children[0].name}}</el-menu-item>
						</template>
					</el-menu>
				</el-col>
				<el-col :span="2" class="userinfo">	
						<span class="el-dropdown-link userinfo-inner" @click="logout">退出</span>
				</el-col>
			</el-col>
			<el-col :span="24" class="main">
				<section class="content-container">
						<el-col :span="24" class="content-wrapper">
							<transition name="fade" mode="out-in">
								<router-view></router-view>
							</transition>
						</el-col>
				</section>
			</el-col>
		</el-row>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				}
			}
		},
		methods: {
			handleselect: function(a, b) {},
			itemchecked: function(e) {
				e.target.style.backgroundColor = 'red'
			},
			//退出登录
			logout: function() {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});
			},
			collapse: function() {
				this.collapsed = !this.collapsed;
			},
		},
		mounted() {
			//获取本地存储user
			var user = sessionStorage.getItem('user');
			if(user) {
				user = JSON.parse(user);
				//				console.log(user.corporationname)
				this.sysUserName = user.corporationname || '';
				//				this.sysUserAvatar = user.avatar || '';
			}
			console.log(this.$route)
		}
	}
</script>

<style lang='scss' scoped>
	#logolink {
		font-size: 25px;
		font-weight: bolder;
		color: #fff;
	}
	
	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
		height: 100%;
		min-width: 1350px;
		overflow-x: hidden;
		.header {
			height: 70px;
			line-height: 70px;
			background: #324357;
			.userinfo {
				text-align: right;
				padding-right: 35px;
				float: right;
				.userinfo-inner {
					cursor: pointer;
					color: #fff;
					font-weight: bold;
					font-size: 18px;
					border: 1px solid #eee;
					border-radius: 5px;
					padding: 5px;
				}
			}
			.tables{
				background: #324357;
			}
			.logo {
				text-align: center;
			}
			.logo-width {
				width: 240px;
				height: 70px;
			}
			.logo-collapse-width {
				display: none;
			}
			.tools {
				padding: 0px 23px;
				width: 14px;
				height: 70px;
				line-height: 60px;
				cursor: pointer;
			}
		}
		.main {
			display: flex;
			position: absolute;
			top: 70px;
			bottom: 0px;
			overflow: hidden;	
				.content-container {
				flex: 1;
				overflow-y: scroll;
				padding-left: 0px;
				padding-top: 0px;
				
				}
				.content-wrapper {
					box-sizing: border-box;
					height: 100%;
				}
			}
	}
	.el-menu-vertical-demo{
		background: none;
		border: none;
		height: 70px;
	}
	.el-menu-item {	
		color: #eee;
		font-weight: bold;
		font-size: 18px;
		text-align: center;
		height: 70px;
		line-height: 70px;
		padding: 0 20px;
	}
	.el-menu--horizontal>.el-menu-item:hover{
		background-color: #5a6aa0;
		color: #eee;
	}
	.el-menu--horizontal>.el-menu-item.is-active:hover{
		background-color: #5a6aa0;
	}
	.el-menu--horizontal>.el-menu-item.is-active{
		color: #eee;
		border-bottom: none;
	}
	.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus{
		background-color: #5a6aa0;
	}
</style>