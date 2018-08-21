<template>
	<section class="full">
		<div class="userlistwrap">
			<div class="toolbar">
				<el-form :inline="true" :model="filters" size='small'>
					<el-form-item>
						<el-input v-model="filters.phone" placeholder="请输入用户名" style='width: 150px;'></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="search" style=''>查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="userlist">
				<div class="user-phone-button">
					<span :class='actuser==1?"activebut":"noactive"' v-on:click="changeactive">用户名</span>
					<span :class='actphone==1?"activebut":"noactive"' v-on:click="changeactive1">手机号</span>
				</div>
				<el-table size='small' :data="users" class='carlistinfo' height='90%' @row-click="handdle" :border=true :row-style=sss :show-header=false style='min-height: 600px;'>
					<el-table-column :prop=props align='center'>
					</el-table-column>
				</el-table>
				<div class="">
					<el-pagination layout="prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="11" :total="total" style="width: 200px;color: #eee;margin-top: 20px;">
					</el-pagination>
				</div>
			</div>
		</div>
		<div class="carinfowrap">
			<div class="carAndMap">
				
			</div>
			<div class="carinfocard">
				
			</div>
			<div class="carinfotime">
				
			</div>
			
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				actuser: 1,
				actphone: 0,
				props: 'name',
				filters: {
					phone: ''
				},
				users: [],
				total: 0,
				page: 1,
				sss: {
					height: '35px',
					fontSize: '16px',
				}
			}
		},
		methods: {
			changeactive() {
				this.props = 'name'
				this.actuser = 1
				this.actphone = 0
			},
			changeactive1() {
				this.props = 'phone'
				this.actuser = 0
				this.actphone = 1
			},
			handdle(row, event, column) {
				console.log(row, event, column)
			},
			//分页
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				var user = sessionStorage.getItem('user');
				//				this.listLoading = true;
				if(user) {
					user = JSON.parse(user);
					this.tokenencryption()
					this.$http.post(this.base + "/yw/user/selectUserList", JSON.stringify({
						aid: user.id,
						page: this.page,
						rows: 11,
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2'
					}), {
						emulateJSON: true
					}).then(res => {
						let {
							data,
							info,
							type
						} = res.body;
						if(type !== "0") {} else {
							this.users = data.data;
							for(var i = 0; i < this.users.length; i++) {
								if(this.users[i].name == null) {
									this.users[i].name = '未命名'
								}
								//								this.users[i].name = this.users[i].name+' ( '+this.users[i].phone +' ) '
							}
							this.total = data.total;
						}
					})
				}
			},
			//查询数据库
			search() {
				if(this.filters.phone) {
					this.tokenencryption()
					this.$http.post(this.base + "/yw/user/selectUser", JSON.stringify({
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2',
						phone: String(this.filters.phone)
					}), {
						emulateJSON: true
					}).then(res => {
						if(res.body.type == 0) {
							this.users = res.body.data
							//this.total = 1
						} else {
							this.users = []
							this.total = 0
						}

					})
				} else {
					this.getUsers()
				}
			},
		},
		mounted() {
			this.getUsers();
		},
	}
</script>

<style>
	.userlistwrap {
		height: 100%;
		width: 240px;
		float: left;
		background: #4b5a6b;
	}
	
	.carinfowrap {
		margin-left: 240px;
		height: 100%;
	}
	
	.userlist {
		width: 210px;
		position: absolute;
		top: 65px;
		bottom: 40px;
		left: 12px;
		/*background: url(../../static/bg1.png) no-repeat;*/
		/*background-size :100% 100%;*/
	}
	
	.carlistinfo {
		background: url(../../static/bg1.png) no-repeat;
		background-size: 100% 100%;
	}
	
	.user-phone-button {
		background: #3c5d89;
		height: 40px;
		line-height: 40px;
		font-size: 0;
		cursor: pointer;
		text-align: center;
		overflow: hidden;
		/*border: 1px solid #3c5d89;*/
		border-radius: 15px 15px 0 0;
	}
	
	.noactive,
	.activebut {
		background: #fff;
		font-size: 16px;
		width: 105px;
		display: inline-block;
	}
	
	.activebut {
		background: #3c5d89;
		color: #fff;
	}
	
	.carAndMap{
		height: 45%;
		background: #367FA9;
	}
	.carinfocard{
		height: 45%;
		background: #42B983;
	}
	.carinfotime{
		height: 10%;
		background: #FF0000;
	}
</style>