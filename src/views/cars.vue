<template>
	<section class="full">
		<div class="userlistwrapa">
			<div class="toolbar">
				<el-form :inline="true" :model="filters" size='small'>
					<el-form-item>
						<el-input v-model="filters.car" placeholder="请输入车架号" style='width: 150px;'></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" v-on:click="search" style=''>查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="userlista">
				<div class='carlistinfoa'>
					<el-form :model="addForm" :rules="addFormRules" ref="addForm" style='margin-left: 10px;margin-top: 20px;'size='small'>
				<el-form-item  prop="tid">
					<el-input v-model="addForm.tid" auto-complete="off" style='width: 200px;'></el-input>
				</el-form-item>
				<el-form-item  prop="id">
					<el-input v-model="addForm.id" style='width: 200px;'></el-input>
				</el-form-item>
				<el-form-item>
						<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
					</el-form-item>
				
			</el-form>
				</div>
			</div>
		</div>
		<div class="carinfowrapa">
			<div class="carlistwrap">
				<el-table size='small' :data="cars" highlight-current-row class='el-table-owner ' height='90%' style='background-color: #34465a;' :header-row-style=aa>
				<el-table-column prop="id" label="车架号" width="300" align='center'>
				</el-table-column>
				<el-table-column prop="uid" label="用户ID" min-width="350" align='center'>
				</el-table-column>
				</el-table-column>
				<el-table-column prop="status" label="是否被绑定" width="300" :formatter='st' align='center'>
				</el-table-column>
				<el-table-column prop="createTime" label="添加时间" width="300" align='center'>
				</el-table-column>
			</el-table>
			<el-col :span="24" class="toolbar toolbara" style='margin-top: 30px;'>
				<el-pagination layout="prev, pager, next,jumper" @current-change="handleCurrentChange" :page-size="16" :total="total" style="float:right;">
				</el-pagination>
			</el-col>
			</div>
			
		</div>
	</section>
</template>

<script>
	export default {
		data() {
			return {
				filters: {
					car: ''
				},
				cars: [],
				total: 0,
				page: 1,
				aa:{
					height:'70px'
				},
				addFormRules: {
					tid: [{
						required: true,
						message: '请输入终端号',
						trigger: 'blur'
					}],
					id: [{
						required: true,
						message: '请输入车架号',
						trigger: 'blur'
					}]
				},
				//新增界面数据
				addForm: {
					tid: '',
					id: ''
				}
			}
		},
		methods: {
			//是否绑定
			st(row, column) {
				let sts = row.status;
				switch(sts) {
					case 1:
						return "是";
						break;
					case 0:
						return "否";
						break;
				}
			},
			//过滤器
			myfilter(value) {
				if(value.indexOf(this.filters.car) > -1) {
					return value
				}
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getCars();
			},
			//获取设备列表
			getCars() {
				var user = sessionStorage.getItem('user');
				if(user) {
					user = JSON.parse(user);
					this.tokenencryption()
					this.$http.post(this.base + "/yw/car/selectCarList", JSON.stringify({
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2',
						aid: user.id,
						page: this.page,
						rows: 16
					}), {
						emulateJSON: true
					}).then(res => {
						let {
							data,
							info,
							type
						} = res.body;
						if(type !== "0") {

						} else {
							this.cars = data.data
							this.total = data.total
						}
					})
				}
			},
			//搜索数据
			search() {
				if(this.filters.car) {
					this.tokenencryption()
					this.$http.post(this.base + "/yw/car/selectCar", JSON.stringify({
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2',
						id: this.filters.car
					}), {
						emulateJSON: true
					}).then(res => {
						if(res.body.info = '查询成功') {
							this.cars = []
							this.cars.push(res.body.data)
						} else {
							this.cars = []
						}
					})
				} else {
					this.getCars()
				}
			},
			//显示新增界面
			handleAdd: function() {
				this.addFormVisible = true;
				this.addForm = {
					id: '',
					tid: ''
				};
			},
			//新增
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if(valid) {
						this.tokenencryption()
						this.$http.post(this.base + '/yw/device/selectDevice', JSON.stringify({
							encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
							timeStamp: this.nowtimestamp,
							sourceForm: '2',
							tid: this.addForm.tid,
						}), {
							emulateJSON: true
						}).then(res => {
							if(res.body.type == 0 && res.body.data.status == 0) {
								//终端已录入 未绑定
								this.$confirm('确认提交吗？', '提示', {}).then(() => {
									var user1 = sessionStorage.getItem('user');
									this.tokenencryption()
									this.$http.post(this.base + '/yw/car/insertNewCar', JSON.stringify({
										encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
										timeStamp: this.nowtimestamp,
										sourceForm: '2',
										id: this.addForm.id,
										tid: this.addForm.tid,
										status: '0'
									}), {
										emulateJSON: true
									}).then(res => {
										let {
											data,
											info,
											type
										} = res.body;
										if(type == '0') {
											this.$message({
												type: 'success',
												message: "添加成功",
											});
											this.$refs['addForm'].resetFields();
											this.addFormVisible = false;
											this.getCars();
										} else {
											this.$message({
												type: 'warning',
												message: "添加失败",
											});
										}
									});
								});
							} else if(res.body.type == 0 && res.body.data.status == 1) {
								//终端已录入 已绑定
								this.$message({
									type: "warning",
									message: "终端已被车辆绑定"
								});
							} else if(res.body.type != 0) {
								this.$message({
									type: "warning",
									message: "终端未录入"
								});
							}
						})
					} else {
						return false
					}
				})
			},

		},
		mounted() {
			this.getCars()
		},

	}
</script>

<style scoped>
	li {
		list-style: none;
	}
	
	ul {
		padding: 0;
		margin: 0;
	}
	
	.userlistwrapa {
		height: 100%;
		width: 240px;
		float: left;
		background: #4b5a6b;
	}
	
	.carinfowrapa {
		margin-left: 240px;
		height: 100%;
		background-color: #7a828c;
		overflow: hidden;
	}
	
	.userlista {
		width: 220px;
		position: absolute;
		top: 60px;
		bottom: 40px;
		left: 7px;
		/*background: url(../../static/bg1.png) no-repeat;
		background-size: 100% 100%;*/
	}
	.carlistinfoa {
		background: url(../../static/bg1.png) no-repeat;
		background-size: 100% 100%;
		height: 95%;
		min-height: 680px;
		overflow: hidden;
	}
	.carlistwrap{
		width: 97%;
		height: 96%;
		margin: 2% auto;
	}
	.toolbara{
		background-color: #4b5a6b;
		border-radius: 2px;
		
	}
</style>