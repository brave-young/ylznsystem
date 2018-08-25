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
				<!--@row-click="handdle"-->
				<el-table ref="singleTable" size='small' :data="users" class='carlistinfo' height='90%' highlight-current-row @current-change="getcarlist" :border=true :row-style=tablestyle :show-header=false style='min-height: 600px;'>
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
				<div class="carlistsoverflow">
					<div class="carlists">
						<ul style="padding: 0;margin: 0;width: 220px;">
							<li class="carsindex" v-for='(cars,index) in usercarlist' :class="{bgred:changed==index}" @click='handlemain(index)'>
								<p style="padding-top: 5px;margin-top: 10px;">车架号 : {{cars.id}}</p>
								<img v-bind:src="cars.isonline == 0?'./static/a3.png':'./static/a4.png'" />
								<p>
									<el-button size="mini" @click="unbind(index)" :disabled='open'>解除绑定</el-button>
									<el-button size='mini' @click='handlemain(index)' :disabled='open'>实时数据</el-button>
								</p>

							</li>
						</ul>
					</div>
				</div>
				<div class="mapinfo">
					<p class="cargps">
						<span>车架号 : <span class="blue">{{this.carid}}</span></span>
						<span style="margin-left: 20px;">状态 : <span class="blue">{{this.carisonline}}</span></span>
						<span style="margin-left: 20px;" class="blue">{{this.isstart}}</span>
						<span style="margin-left: 20px;" v-show=runtimeshow>当前行驶时间 : <span class="blue">{{this.runtime}}</span></span>
						<el-button :disabled='seegps' round type="info" size="small" @click="loadgps()" style='float: right;margin-right: 20px;'>历史行驶轨迹 </el-button>
					</p>
					<p class="mapcargps" v-show=mapinfoshow>
						<span>定位时间 : <span>{{this.gpstime}}</span></span>
						<span style="margin-left: 20px;">地点 : <span>{{this.windows}}</span></span>
					</p>
					<div class="amap-wrapper">
						<el-amap vid="amapDemo" :center="center" :zoom='zoom' style='margin-top: 10px;' :mapStyle='maps'>
							<el-amap-marker :offset=[0,0] v-for="marker in markers" :position="marker.position" icon='./static/aa.png'></el-amap-marker>
						</el-amap>
					</div>
				</div>
			</div>
			<div class="carinfocard">
				<el-tabs type="border-card" class='infocard' @tab-click='aaa'>
					<el-tab-pane label="车身数据"style='height: 100%;width: 100%;'>
						<div style="width: 24%;height: 100%;display: inline-block;vertical-align: top;">
							<p class="detailwrap" style="margin-top:30px">
								<span class="detailname">ACC</span>
								<span class="detailinfo">{{this.acc}}</span>
							</p>
							<p class="detailwrap">
								<span class="detailname">里程</span>
								<span class="detailinfo">{{this.Total_Mileage}}</span>
							</p>
							<p class="detailwrap">
								<span class="detailname">档位</span>
								<span class="detailinfo">{{this.gears}}</span>
							</p>
							<p class="detailwrap">
								<span class="detailname">故障(等级) </span>
								<span class="detailinfo">{{this.mcu_Fault_Level}}</span>
							</p>
							<p class="detailwrap">
								<span class="detailname">加速踏板开度</span>
								<span class="detailinfo">{{this.Pedal_Speed}}</span>
							</p>
							<p class="detailwrap">
								<span class="detailname">制动踏板开度</span>
								<span class="detailinfo">{{this.Brake_Pedal_Opening}}</span>
							</p>
						</div>
						<div id="main" style="width: 50%;height: 98%;display: inline-block;border-radius: 30%;border: 2px solid #e4e4e4;"></div>
						<div style="width: 24%;height: 100%;display: inline-block;">
							
						</div>
					</el-tab-pane>
					<el-tab-pane label="里程信息" :lazy=true>

					</el-tab-pane>
					<el-tab-pane label="电量统计" style='height: 100%;width: 100%;' :lazy=true>
						<el-row class='carline-wrap'>
							<el-col :span="24" class='toolbar carline-wrapA'>
								<el-form :inline="true" size='small' style="margin: 0;">
									<el-form-item>
										<el-button :disabled='seegps' type="info" v-on:click="hour1()" style='margin-left: 3px;'>一小时</el-button>
									</el-form-item>
									<el-form-item>
										<el-button :disabled='seegps' type="info" v-on:click="hour3()" style='margin-left: 3px;'>三小时</el-button>
									</el-form-item>
									<el-form-item>
										<el-button :disabled='seegps' type="info" v-on:click="hour6()" style='margin-left: 3px;'>六小时</el-button>
									</el-form-item>
									<el-form-item>
										<el-button :disabled='seegps' type="info" v-on:click="hour24()" style='margin-left: 3px;'>一天</el-button>
									</el-form-item>
									<el-date-picker :disabled='seegps' :picker-options="pickerOptions1" size='small' v-model="value3" type="datetimerange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
									</el-date-picker>
									<el-form-item>
										<el-button :disabled='seegps' type="info" v-on:click="search()" icon="el-icon-search" style='margin-left: 20px;'>查询</el-button>
									</el-form-item>
								</el-form>
							</el-col>
						</el-row>
						<div id="vLine" style="width:100%; height:80%"></div>
					</el-tab-pane>
					<el-tab-pane label="里程统计" style='height: 100%;width: 100%;' :lazy=true>
						<el-row class='carline-wrap' style='height: 100%;width: 100%;'>
							<el-col :span="24" class='toolbar carline-wrapA'>
								<el-form :inline="true" size='small' style="margin: 0;">
									<el-date-picker :picker-options="pickerOptions1" size='small' v-model="value4" type="month" placeholder="选择月">
									</el-date-picker>
									<el-form-item>
										<el-button :disabled='seegps' type="info" v-on:click="searchbymouth()" icon="el-icon-search" style='margin-left: 20px;'>查询</el-button>
									</el-form-item>
								</el-form>
							</el-col>
							<div id="mileageBar" style="width:100%; height:80%;position: relative;margin-top: 44px;"></div>
						</el-row>
					</el-tab-pane>
				</el-tabs>

			</div>
			<div class="carinfotime">
				<span class="carinfotimewrap">8001数据接收时间 : {{this.time8001}}</span>
				<span class="carinfotimewrap">8002数据接收时间 : {{this.time8002}}</span>
				<span class="carinfotimewrap">8003数据接收时间 : {{this.time8003}}</span>
			</div>

		</div>
	</section>
</template>

<script>
	import { AMapManager } from "vue-amap";
	import echarts from "echarts";
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
				tablestyle: {
					height: '35px',
					fontSize: '16px',
				},
				usercarlist: '',
				open: false,
				seegps: true,
				mapinfoshow: false,
				changed: -1,
				//当前车架号 当前车状态
				carid: "",
				carisonline: "",
				cartid: "",
				sunid: '',
				//车辆启停状态及行驶时间
				isstart: '',
				runtime: '',
				runtimeshow: false,
				//地图
				maps: 'light',
				PI: 3.14159265358979324,
				x_pi: 3.14159265358979324 * 3000.0 / 180.0,
				center: [117.464433, 34.4307],
				markers: [],
				zoom: 13,
				gpstime: "",
				windows: "",
				//模拟数据
				//				res: 'aa5514008001010000000000000000000000FFFF0000000010000000000000000000000000000000000000000001',
				arrdata: [],
				arrdata8002: [],
				//前一天8002
				arrdata8002y: [],
				arrdata8003: [],
				//MCU工作状态
				mcu_Working_Status: '',
				//MCU故障等级
				mcu_Fault_Level: '',
				//BMS高压输出请求信号
				bms_High_Voltage_Output_Request_Signal: '',
				//电机高压接触器状态
				Motor_High_Voltage_Contactor_Status: '',
				//高压互锁（HVIL）状态
				hvil_Status: "",
				//档位
				gears: '',
				//电机系统行车模式
				Motor_System_Driving_Mode: '',
				//电机当前控制模式
				Motor_Current_Control_Mode: '',
				//加速踏板开度
				Pedal_Speed: '',
				//加速有效信号
				Accelerated_Effective_Signal: '',
				//制动踏板开度
				Brake_Pedal_Opening: '',
				//制动有效信号
				Brake_Signal: '',
				//循环计数
				//bcm运行状态
				BCM_Running_State: '',
				//灯光状态 15
				carlights: [],
				//车门16
				cardoors: [],
				//17 安全
				SafeStates: [],
				//18 司机侧车窗
				driverleft: '',
				driverright: '',
				driverleftrear: '',
				driverrightrear: '',
				//19 乘员车窗  天窗
				skylight: '',
				passengersright: '',
				passengersleftrear: '',
				passengersrightrear: '',
				//20 雨刮
				wiperhi: '',
				wiperlow: '',
				wiperint: '',
				wiperwash: '',
				wiperrear: '',
				wiperrearwash: '',
				acc: '',
				Motor_Speed: '',
				nMotor_Speed:0,
				motor_Torque: '',
				Motor_Output: "",
				MCU_Voltage: "",
				nMCU_Voltage:0,
				MCU_Current: '',
				nMCU_Current:0,
				MCU_t: '',
				motor_t: '',
				speed_car: '',
				nspeed_car:0,
				Total_Mileage: '',
				amount_car: '',
				//折线图
				startbymouth: "",
				endbymouth: '',
				mileageX: '',
				mileageY: '',
				mileageBar: null,
				vLine: null,
				main: null,
				lineshow: false,
				barshow: false,
				pickerOptions1: {
					disabledDate(time) {
						return time.getTime() > Date.now();
					}
				},
				value3: '',
				value4: '',
				startTime: "",
				endTime: "",
				vxdata: [2, 3, 4],
				socydata: [1, 1, 1],
				vtotal: [2, 2, 2],
				atotal: [3, 3, 3],
				Ttotal: [4, 4, 4],
				errorshow: false,
				errora: false,
				errorb: false,
				errorc: false,
				errordataA: [],
				errordataB: [],
				errordataC: [],
				time8001: '',
				time8002: '',
				time8003: '',

			}
		},
		methods: {
			aaa(index) {
				if(index.index == 2) {
					this.hour1();
				}
				if(index.index == 3) {
					this.searchfirst()
				}
			},
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
								//this.users[i].name = this.users[i].name+' ( '+this.users[i].phone +' ) '
							}
							this.total = data.total;
							//初始化默认选中第一个
							this.getcarlist(this.users[0])
							this.$refs.singleTable.setCurrentRow(this.users[0]);

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
			getcarlist(val) {
				this.carid = ""
				this.carisonline = ""
				this.cartid = ""
				this.sunid = ''
				this.time8001 = ''
				this.time8002 = ''
				this.time8003 = ''
				this.gpstime = ''
				this.windows = ''
				this.isstart = ''
				this.runtime = ''
				this.currentRow = val;
				this.usercarlist = [];
				this.usercarlistVisible = true;
				this.tokenencryption()
				this.$http.post(this.base + "/yw/car/selectUserCars", JSON.stringify({
					encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
					timeStamp: this.nowtimestamp,
					sourceForm: '2',
					uid: String(val.id)
				}), {
					emulateJSON: true
				}).then(res => {
					if(res.body.type !== "0") {
						this.usercarlist = [];
						this.open = true
					} else {
						this.open = false
						this.usercarlist = res.body.data;
						this.handlemain(0)
					}
				});
			},
			//解除绑定
			unbind(index) {
				this.$confirm("确定解绑?", "提示", {
						type: "warning"
					})
					.then(() => {
						this.tokenencryption()
						this.$http
							.post(this.base + "/yw/car/unbindCid", JSON.stringify({
								encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
								timeStamp: this.nowtimestamp,
								sourceForm: '2',
								id: this.usercarlist[index].id
							}), {
								emulateJSON: true
							}).then(res => {
								if(res.body.type == 0) {
									this.usercarlist.splice(index, 1);
									this.$message({
										type: "success",
										message: "解绑成功"
									});
								}
							});
					})
					.catch(() => {});
			},
			//获取定位
			handleMap(index) {
				this.windows = "";
				this.markers = [];
				//下发指令请求最新位置
				this.tokenencryption()
				this.$http
					.post(this.base + "/yw/location/pushLocationInstruct", JSON.stringify({
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2',
						tid: this.usercarlist[index].tid
					}), {
						emulateJSON: true
					})
					.then(res => {
						this.tokenencryption()
						this.$http.post(this.base + "/yw/location/selectLocation", JSON.stringify({
								encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
								timeStamp: this.nowtimestamp,
								sourceForm: '2',
								tid: this.usercarlist[index].tid
							}), {
								emulateJSON: true
							})
							.then(res => {
								this.mapinfoshow = true
								if(res.body.type == 0) {
									this.gpstime = res.body.data.locatetime;
									this.markers = [{
										position: this.gcj_encrypt(
											res.body.data.latitude,
											res.body.data.longitude
										)
									}];
									this.locations = this.markers[0].position;
									this.locations = this.locations.join(",");
									this.center = this.gcj_encrypt(
										res.body.data.latitude,
										res.body.data.longitude
									);
									this.$http
										.jsonp("http://restapi.amap.com/v3/geocode/regeo", {
											params: {
												key: "d4256ffc634ab4b3e07927a02f00b0e1",
												location: this.locations
											}
										})
										.then(res => {
											if(res.body.status == 1) {
												this.windows = res.body.regeocode.formatted_address;
											}
										});
								} else {
									this.markers = "";
									this.windows = '暂无数据'
									this.gpstime = '暂无数据'
								}
							});
					});
			},
			//实时请求数据
			request() {
				this.tokenencryption()
				this.$http.post(this.base + "/yw/upload/selectCarStateInstruct", JSON.stringify({
					encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
					timeStamp: this.nowtimestamp,
					sourceForm: '2',
					tid: this.cartid
				}), {
					emulateJSON: true
				}).then(res => {
					if(res.body.data) {
						this.carinstructs = res.body.data;
						this.time8001 = this.carinstructs['8001Time']
						this.time8002 = this.carinstructs['8002Time']
						this.time8003 = this.carinstructs['8003Time']
						if(parseInt(this.carinstructs.isStart) && this.carisonline == '在线') {
							this.isstart = '启动'
							this.runtimeshow = true
							let starttime = parseInt(this.carinstructs.startTime / 1000)
							let nowtime = Date.parse(new Date()) / 1000
							if(nowtime - starttime < 60) {
								this.runtime = nowtime - starttime + '秒'
							} else if(60 < nowtime - starttime && nowtime - starttime < 3600) {
								this.runtime = parseInt((nowtime - starttime) / 60) + '分钟' + (nowtime - starttime) % 60 + '秒'
							} else {
								this.runtime = parseInt((nowtime - starttime) / 3600) + '小时 ' + parseInt(((nowtime - starttime) % 3600) / 60) + '分钟' + ((nowtime - starttime) % 3600) % 60 + '秒'
							}
						} else {
							this.isstart = '未启动'
							this.runtimeshow = false
						}
						if(this.carinstructs[8001]) {
							this.start(this.carinstructs[8001])
							this.nspeed_car = this.speed_car
							this.nMotor_Speed = this.Motor_Speed*0.001
							this.nMCU_Voltage = this.MCU_Voltage
							this.nMCU_Current = this.MCU_Current
							this.drawInstrument()
						}
						//
						if(this.carinstructs[8003] && this.mcu_Fault_Level != '无故障') {
							this.errorshow = true
							this.arrdata8003 = this.ByteGrouping(this.carinstructs[8003])
							if(this.mcu_Fault_Level == '一级故障') {
								this.errora = true
								this.errorb = false
								this.errorc = false

								let errordatasA = this.hextobinary(this.arrdata8003[7]).concat(this.hextobinary(this.arrdata8003[8]))
								for(let i = 0; i < errordatasA.length; i++) {
									this.errordataA.push(this.booLean(errordatasA[i]))
								}
							}
							if(this.mcu_Fault_Level == '二级故障') {
								this.errora = false
								this.errorb = true
								this.errorc = false
								let errordatasB = this.hextobinary(this.arrdata8003[10]).concat(this.hextobinary(this.arrdata8003[11]))
								for(let i = 0; i < errordatasB.length; i++) {
									this.errordataB.push(this.booLean(errordatasB[i]))
								}

							}
							if(this.mcu_Fault_Level == '无故障') {
								this.errora = false
								this.errorb = false
								this.errorc = true
								let errordatasC = this.hextobinary(this.arrdata8003[13])
								for(let i = 0; i < errordatasC.length; i++) {
									this.errordataC.push(this.booLean(errordatasC[i]))
								}
							}
						}
					} else {
						this.runtimeshow = false
					}
				});
			},
			//数据解析方法
			//十六转二进制补满八位
			hextobinary(x) {
				let x1 = parseInt(x, 16).toString(2);
				let x1str = x1.split("");
				if(x1str.length < 8) {
					let sunnum = 8 - x1str.length;
					for(let j = 0; j < sunnum; j++) {
						x1str.unshift("0");
					}
				}
				return x1str;
			},
			//十六进制转十进制
			hextodecimal(x) {
				let x1 = parseInt(x, 16)
				return x1
			},
			//二进制转十六进制
			bintohex(x) {
				let x1 = parseInt(x, 2).toString(16)
				return x1
			},
			//8001解析
			//字节编号
			//6  0-1:MCU当前工作状态   2-3:RESERVED  4-6:MCU故障等级  7:RESERVED
			//mcu工作状态
			mcuWorkingStatus() {
				let byte6 = this.hextobinary(this.arrdata[6])
				let a = this.bintohex(byte6[6] + byte6[7])
				let mcuStates = (a == 0 && 'MCU上电') || (a == 1 && '无高压输出') || (a == 2 && '高压输出')
				return mcuStates
			},
			//mcu故障等级
			mcuFaultLevel() {
				let byte6 = this.hextobinary(this.arrdata[6])
				let a = this.bintohex(byte6[1] + byte6[2] + byte6[3])
				let mcuFault = (a == 0 && '无故障') || (a == 1 && '一级故障') || (a == 2 && '二级故障') || (a == 3 && '三级故障')
				return mcuFault
			},

			//7 2-3:BMS高压输出请求信号   4:电机高压接触器状态  5:高压互锁（HVIL）状态
			//BMS高压输出请求信号
			bmsHighVoltageOutputRequestSignal() {
				let byte7 = this.hextobinary(this.arrdata[7])
				let a = this.bintohex(byte7[4] + byte7[5])
				let bmssignal = (a == 0 && '无请求') || (a == 1 && '请求断开') || (a == 2 && '请求闭合')
				return bmssignal
			},
			//电机高压接触器状态
			MotorHighVoltageContactorStatus() {
				let byte7 = this.hextobinary(this.arrdata[7])
				let a = this.bintohex(byte7[3])
				let MotorStatus = (a == 0 && '断开') || (a == 1 && '闭合')
				return MotorStatus
			},
			//高压互锁（HVIL）状态
			hvilStatus() {
				let byte7 = this.hextobinary(this.arrdata[7])
				let a = this.bintohex(byte7[2])
				let hvils = (a == 0 && 'disconnection') || (a == 1 && 'OK')
				return hvils
			},
			//8 0-1:档位状态  3-4:电机系统行车模式  5-6:电机当前控制模式
			//档位状态
			gear() {
				let byte8 = this.hextobinary(this.arrdata[8])
				let a = this.bintohex(byte8[6] + byte8[7])
				let gears = (a == 0 && 'P') || (a == 1 && 'N') || (a == 2 && 'D') || (a == 3 && 'R')
				return gears
			},
			//电机系统行车模式
			MotorSystemDrivingMode() {
				let byte8 = this.hextobinary(this.arrdata[8])
				let a = this.bintohex(byte8[3] + byte8[4])
				let Motormode = (a == 0 && '正常模式') || (a == 1 && '运动模式') || (a == 2 && '经济模式') || (a == 3 && '跛行模式')
				return Motormode
			},
			//电机当前控制模式
			MotorCurrentControlMode() {
				let byte8 = this.hextobinary(this.arrdata[8])
				let a = this.bintohex(byte8[1] + byte8[2])
				let motorcontrol = (a == 0 && 'Inactive') || (a == 1 && '转矩模式') || (a == 2 && '转速模式')
				return motorcontrol
			},
			//9 0-6:加速踏板开度        7:加速有效信号
			//加速踏板开度
			PedalSpeed() {
				let byte9 = this.hextobinary(this.arrdata[9])
				let peadl = parseInt(byte9[1] + byte9[2] + byte9[3] + byte9[4] + byte9[5] + byte9[6], 2)
				return peadl + '%'
			},
			//加速有效信号
			AcceleratedEffectiveSignal() {
				let byte9 = this.hextobinary(this.arrdata[9])
				let a = byte9[0]
				let Accelerated = (a == 0 && '无效') || (a == 1 && '有效')
				return Accelerated
			},
			//10 0-6:制动踏板开度  7:制动有效信号	
			BrakePedalOpening() {
				let byte10 = this.hextobinary(this.arrdata[10])
				let PedalOpening = parseInt(byte10[1] + byte10[2] + byte10[3] + byte10[4] + byte10[5] + byte10[6], 2)
				return PedalOpening + '%'
			},
			//制动有效信号
			BrakeSignal() {
				let byte10 = this.hextobinary(this.arrdata[10])
				let a = byte10[0]
				let brake = (a == 0 && '无效') || (a == 1 && '有效')
				return brake
			},
			//11
			//12 循环计数
			//13
			//14 0-1:BCM运行状态
			BCMRunningState() {
				let byte14 = this.hextobinary(this.arrdata[14])
				let a = this.bintohex(byte14[6] + byte14[7])
				let bcmstate = (a == 0 && 'Normal') || (a == 1 && 'Fault')
				return bcmstate
			},
			//15 灯光状态
			StateOfTheLight() {
				let byte15 = this.hextobinary(this.arrdata[15])
				return byte15
			},
			//16 车门状态
			StateOfTheDoor() {
				let byte16 = this.hextobinary(this.arrdata[16])
				return byte16
			},
			//17 安全状态
			SafeState() {
				let byte17 = this.hextobinary(this.arrdata[17])
				return byte17
			},
			//18 司机侧车窗开关
			DriverWindowSwitch(x, y) {
				let byte18 = this.hextobinary(this.arrdata[18])
				let a = byte18[x] + byte18[y]
				let windowstates = (a == '00' && '无动作') || (a == '01' && '上升') || (a == '10' && '下降')
				return windowstates
			},

			//19乘员侧车窗开关
			PassengersWindowSwitch(x, y) {
				let byte19 = this.hextobinary(this.arrdata[19])
				let a = byte19[x] + byte19[y]
				if(x == 6) {
					let Passengerswindowstates = (a == '00' && '无动作') || (a == '01' && '上升') || (a == '10' && '下降') || (a == '11' && '全开')
					return Passengerswindowstates
				} else {
					let Passengerswindowstates = (a == '00' && '无动作') || (a == '01' && '上升') || (a == '10' && '下降')
					return Passengerswindowstates
				}
			},
			//20 雨刮 acc
			//雨刮   acc
			WiperSwitch(x) {
				let byte20 = this.hextobinary(this.arrdata[20])
				let a = byte20[x]
				let wipers = (a == 0 && 'OFF') || (a == 1 && 'ON')
				return wipers
			},
			//21
			//22-23 电机转速
			MotorSpeed(x, y) {
				let byte2223 = this.hextodecimal(x + y)
				return(byte2223 - 10000)
			},
			//电机扭矩 24 25
			motorTorque(x, y) {
				let byte2425 = this.hextodecimal(x + y)
				return(byte2425 * 0.5 - 1500)
			},
			//电机输出功率 26.27
			MotorOutput(x, y) {
				let byte2627 = this.hextodecimal(x + y)
				return(byte2627 * 0.5 - 1000)
			},
			//28.29 预留
			//30 31  MCU母线电压
			MCUBusVoltage(x, y) {
				let byte3031 = this.hextodecimal(x + y)
				return((byte3031 / 100).toFixed(2))
			},
			//32 33 MCU母线电流
			MCUBusCurrent(x, y) {
				let byte3233 = this.hextodecimal(x + y)
				return((byte3233 / 10 - 400).toFixed(1))
			},
			//MCU温度 34
			MCUTemperature(x) {
				let byte34 = this.hextodecimal(x)
				return(byte34 - 40)
			},
			//电机温度 35
			motorTemperature(x) {
				let byte35 = this.hextodecimal(x)
				return(byte35 - 40)
			},
			//36 37 空
			//38 39 当前车速
			speedcar(x, y) {
				let byte3839 = this.hextodecimal(x + y)
				return(byte3839)
			},
			//40 41 Total mileage
			TotalMileage(x, y, z) {
				let byte4041 = this.hextodecimal(x + y + z)
				return(byte4041)
			}, // 42 43 当前电量
			amountcar(x) {
				let byte4243 = this.hextodecimal(x)
				return(byte4243)
			},
			//正常or故障
			booLean(x) {
				return(x == 0 && '正常') || (x == 1 && '故障')
			},
			//协议解析
			ByteGrouping(x) {
				var arrdatas = []
				for(let i = 0; i < x.length; i += 2) {
					arrdatas.push(x.substr(i, 2))
				}
				return arrdatas
			},
			//开始解析
			start(x) {
				this.arrdata = this.ByteGrouping(x)
				this.mcu_Working_Status = this.mcuWorkingStatus()
				this.mcu_Fault_Level = this.mcuFaultLevel()
				this.bms_High_Voltage_Output_Request_Signal = this.bmsHighVoltageOutputRequestSignal()
				this.Motor_High_Voltage_Contactor_Status = this.MotorHighVoltageContactorStatus()
				this.hvil_Status = this.hvilStatus()
				this.gears = this.gear()
				this.Motor_System_Driving_Mode = this.MotorSystemDrivingMode()
				this.Motor_System_Driving_Mode = this.MotorCurrentControlMode()
				this.Pedal_Speed = this.PedalSpeed()
				this.Accelerated_Effective_Signal = this.AcceleratedEffectiveSignal()
				this.Brake_Pedal_Opening = this.BrakePedalOpening()
				this.Brake_Signal = this.BrakeSignal()
				//循环计数
				this.BCM_Running_State = this.BCMRunningState()
				//灯光
				this.carlights = this.StateOfTheLight()
				this.cardoors = this.StateOfTheDoor()
				this.SafeStates = this.SafeState()
				//司机
				this.driverleft = this.DriverWindowSwitch(6, 7)
				this.driverright = this.DriverWindowSwitch(4, 5)
				this.driverleftrear = this.DriverWindowSwitch(2, 3)
				this.driverrightrear = this.DriverWindowSwitch(0, 1)
				//乘员
				this.skylight = this.PassengersWindowSwitch(6, 7)
				this.passengersright = this.PassengersWindowSwitch(4, 5)
				this.passengersleftrear = this.PassengersWindowSwitch(2, 3)
				this.passengersrightrear = this.PassengersWindowSwitch(0, 1)

				this.wiperhi = this.WiperSwitch(7)
				this.wiperlow = this.WiperSwitch(6)
				this.wiperint = this.WiperSwitch(5)
				this.wiperwash = this.WiperSwitch(4)
				this.wiperrear = this.WiperSwitch(3)
				this.wiperrearwash = this.WiperSwitch(2)
				//acc
				this.acc = this.WiperSwitch(1)
				this.Motor_Speed = this.MotorSpeed(this.arrdata[23], this.arrdata[22])
				this.motor_Torque = this.motorTorque(this.arrdata[25], this.arrdata[24]) + 'Nm'
				this.Motor_Output = this.MotorOutput(this.arrdata[27], this.arrdata[26]) + 'kw'
				this.MCU_Voltage = this.MCUBusVoltage(this.arrdata[31], this.arrdata[30])
				this.MCU_Current = this.MCUBusCurrent(this.arrdata[33], this.arrdata[32])
				this.MCU_t = this.MCUTemperature(this.arrdata[34]) + '℃'
				this.motor_t = this.motorTemperature(this.arrdata[35]) + '℃'

				this.speed_car = this.speedcar(this.arrdata[39], this.arrdata[38])
				this.Total_Mileage = this.TotalMileage(this.arrdata[42], this.arrdata[41], this.arrdata[40]) + 'Km'
				this.amount_car = this.amountcar(this.arrdata[43]) + '%'
			},
			//查看车辆详情
			handlemain(index) {
				this.nspeed_car=0
				this.changed = index
				this.carid = ""
				this.carisonline = ""
				this.cartid = ""
				this.sunid = ''
				this.time8001 = ''
				this.time8002 = ''
				this.time8003 = ''
				this.gpstime = ''
				this.windows = ''
				this.isstart = ''
				this.runtime = ''
				this.mcu_Working_Status = ''
				this.mcu_Fault_Level = ''
				this.bms_High_Voltage_Output_Request_Signal = ''
				this.Motor_High_Voltage_Contactor_Status = ''
				this.hvil_Status = ''
				this.gears = ''
				this.Motor_System_Driving_Mode = ''
				this.Motor_System_Driving_Mode = ''
				this.Pedal_Speed = ''
				this.Accelerated_Effective_Signal = ''
				this.Brake_Pedal_Opening = ''
				this.Brake_Signal = ''
				//循环计数
				this.BCM_Running_State = ''
				//灯光
				this.carlights = []
				this.cardoors = []
				this.SafeStates = []
				//司机
				this.driverleft = ''
				this.driverright = ''
				this.driverleftrear = ''
				this.driverrightrear = ''
				//乘员
				this.skylight = ''
				this.passengersright = ''
				this.passengersleftrear = ''
				this.passengersrightrear = ''
				this.wiperhi = ''
				this.wiperlow = ''
				this.wiperint = ''
				this.wiperwash = ''
				this.wiperrear = ''
				this.wiperrearwash = ''
				//acc
				this.acc = ''
				this.Motor_Speed = ''
				this.nMotor_Speed = 0
				this.motor_Torque = ''
				this.Motor_Output = ''
				this.MCU_Voltage = ''
				this.nMCU_Voltage = 0
				this.MCU_Current = ''
				this.nMCU_Current = 0
				this.MCU_t = ''
				this.motor_t = ''
				this.speed_car = ''
				this.Total_Mileage = ''
				this.amount_car = ''
				this.value3 = ''
				this.value4 = ''
				this.startTime = ''
				this.endTime = ''
				this.vxdata = []
				this.socydata = []
				this.vtotal = []
				this.atotal = []
				this.Ttotal = []
				this.seegps = false
				this.carid = this.usercarlist[index].id;
				this.sunid = this.usercarlist[index].tid;
				if(this.usercarlist[index].isonline == 1) {
					this.carisonline = "在线";
				} else {
					this.carisonline = "离线";
				}
				this.cartid = this.usercarlist[index].tid;
				//清除计时器;
				clearInterval(this.interval);
				clearTimeout(this.timeout);
				this.timeout = setTimeout(() => {
					this.request();
					this.handleMap(index);
					this.drawInstrument()
				}, 100);
				//				this.interval = setInterval(() => {
				//					this.request();
				//				}, 10000);
				//获取定位

				//绘制折线图

				//绘制里程
				//绘制仪表
				
			},
			//根据时间绘制折线
			hour1() {
				this.onehour(1);
				this.getvlinedata(this.startTime, this.endTime, "02");
			},
			hour3() {
				this.onehour(3);
				this.getvlinedata(this.startTime, this.endTime, "02");
			},
			hour6() {
				this.onehour(6);
				this.getvlinedata(this.startTime, this.endTime, "02");
			},
			hour24() {
				this.onehour(24);
				this.getvlinedata(this.startTime, this.endTime, "02");
			},
			//折线图search方法
			search() {
				if(this.value3) {
					var date = new Date(this.value3[1]);
					this.endTime = Date.parse(date)
					var oneweekdate = new Date(this.value3[0]);
					this.startTime = Date.parse(oneweekdate)
					this.getvlinedata(this.startTime, this.endTime, "02");
				} else {
					this.$message({
						type: "warning",
						message: "请选择时间范围"
					});
				}
			},
			//获取电压折线图数据
			getvlinedata(st, et, a) {
				this.tokenencryption()
				this.lineshow = true
				this.$http
					.post(this.base + "/yw/upload/queryInstructByTime", JSON.stringify({
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2',
						tid: this.sunid,
						startTime: st,
						endTime: et,
						deviceCode: a,
						functionCode: '80'
					}), {
						emulateJSON: true
					})
					.then(res => {
						if(res.body.type == 0) {

							//电量
							var instructsdata = [];
							var instructsV = [];
							var instructsA = [];
							var instructsT = [];
							var instructsTime = [];
							for(var i = 0; i < res.body.data.length; i++) {
								var date = new Date(parseInt(res.body.data[i].createTime));
								var year = date.getFullYear(); //获取当前年份
								var mon = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; //获取当前月份
								var da = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //获取当前日
								var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //获取小时
								var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //获取分钟
								var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //获取秒
								var instime = year + "-" + mon + "-" + da + " " + h + ":" + m + ":" + s;
								instructsTime.push(instime)
								let datas = this.ByteGrouping(res.body.data[i].instruct)
								instructsdata.push(
									this.amountcar(datas[27])
								)

								instructsV.push(
									this.MCUBusVoltage(datas[15], datas[14])
								)
								instructsA.push(
									this.MCUBusCurrent(datas[17], datas[16])
								)
								instructsT.push(
									this.MCUTemperature(datas[18])
								)
							}
							this.vxdata = instructsTime,
								this.socydata = instructsdata,
								this.vtotal = instructsV,
								this.atotal = instructsA,
								this.Ttotal = instructsT,

								this.drawvLineChart()
						} else {
							this.$message({
								type: "warning",
								message: "折线图无数据"
							});
							this.lineshow = false
							this.startTime = '',
								this.endTime = '',
								this.vxdata = [],
								this.socydata = [],
								this.vtotal = [],
								this.atotal = [],
								this.Ttotal = [],

								this.drawvLineChart()
						}

					});
			},
			//绘制电压电流电量折线图
			drawvLineChart() {
				this.vLine = echarts.init(document.getElementById("vLine"));
				this.vLine.setOption({
					title: {
						text: "电量详情"
					},
					tooltip: {
						trigger: "axis"
					},
					legend: {
						data: [
							"电量",
							"MCU母线电压",
							"MCU母线电流",
							"MCU温度"
						]
					},
					grid: {
						show: true,
						left: "3%",
						right: "3%",
						bottom: "3%",
						containLabel: true
					},
					xAxis: {
						splitArea: {
							show: true
						}, //保留网格区域
						boundaryGap: false,
						interval: 10,
						data: this.vxdata
					},
					yAxis: {
						name: "电压:V 电流:A",
						splitArea: {
							show: true
						}, //保留网格区域
						//						type: 'value',
						splitLine: {
							show: true
						},
						//						interval: 10
					},
					series: [{
							name: "电量",
							type: "line",
							showSymbol: false,
							smooth: true,
							smoothMonotone: "x",
							data: this.socydata
						}, {
							name: "MCU母线电压",
							type: "line",
							showSymbol: false,
							smooth: true,
							smoothMonotone: "x",
							data: this.vtotal
						},
						{
							name: "MCU母线电流",
							type: "line",
							showSymbol: false,
							smooth: true,
							data: this.atotal
						},
						{
							name: "MCU温度",
							type: "line",
							showSymbol: false,
							smooth: true,
							data: this.Ttotal
						}
					]
				});
			},

			//绘制里程统计
			//默认本月里程
			searchfirst() {
				var datea = new Date()
				var yeara = datea.getFullYear(); //获取当前年份
				var mona = datea.getMonth() + 1 < 10 ? "0" + (datea.getMonth() + 1) : datea.getMonth() + 1; //获取当前月份
				var nowtime = yeara + "-" + mona + "-" + '01' + " " + '00' + ":" + '00' + ":" + '00';
				this.value4 = new Date(nowtime)
				this.searchbymouth()
			},
			//里程
			searchbymouth() {
				if(this.value4) {
					var date = new Date(this.value4);
					var year = date.getFullYear(); //获取当前年份
					var mon = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1; //获取当前月份
					var da = date.getDate() < 10 ? "0" + date.getDate() : date.getDate(); //获取当前日
					var h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours(); //获取小时
					var m = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes(); //获取分钟
					var s = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds(); //获取秒					
					this.endbymouth = year + "-" + mon + "-" + 31
					var oneweekdate = new Date(date - 1);
					var year1 = oneweekdate.getFullYear(); //获取当前年份
					var mon1 = oneweekdate.getMonth() + 1 < 10 ? "0" + (oneweekdate.getMonth() + 1) : oneweekdate.getMonth() + 1; //获取当前月份
					var da1 = oneweekdate.getDate() < 10 ? "0" + oneweekdate.getDate() : oneweekdate.getDate(); //获取当前日
					this.startbymouth = year1 + "-" + mon1 + "-" + da1
					//绘制柱状图
					//获取里程数据
					this.barshow = true
					this.tokenencryption()
					this.$http.post(this.base + "/yw/calculate/selectByTime", JSON.stringify({
						encryptSign: String(this.$md5(this.nowtimestamp + this.appkey).toUpperCase()),
						timeStamp: this.nowtimestamp,
						sourceForm: '2',
						tid: String(this.sunid),
						start: String(this.startbymouth),
						end: String(this.endbymouth),
						deviceCode: '02',
						functionCode: '80'
					}), {
						emulateJSON: true
					}).then(res => {
						if(res.body.type == 0) {
							var mileagexdata = []
							var mileageydata = []
							if(res.body.data.length == 1) {
								mileagexdata.unshift(res.body.data[0].time.substring(8))
								this.arrdata8002 = this.ByteGrouping(res.body.data[0].instruct)
								mileageydata.unshift(this.TotalMileage(this.arrdata8002[24], this.arrdata8002[25], this.arrdata8002[26]) - 0)
							} else {
								for(var i = 0; i < res.body.data.length - 1; i++) {
									mileagexdata.unshift(res.body.data[i].time.substring(8))
									this.arrdata8002 = this.ByteGrouping(res.body.data[i].instruct)
									this.arrdata8002y = this.ByteGrouping(res.body.data[i + 1].instruct)
									mileageydata.unshift(this.TotalMileage(this.arrdata8002[24], this.arrdata8002[25], this.arrdata8002[26]) - this.TotalMileage(this.arrdata8002y[10], this.arrdata8002y[11], this.arrdata8002y[12]))
								}
							}

							this.mileageX = mileagexdata
							this.mileageY = mileageydata
							this.drawbarmileage(this.mileageX, this.mileageY)

						} else {
							this.barshow = false
							this.mileageX = []
							this.mileageY = []
							this.drawbarmileage(this.mileageX, this.mileageY)
							this.$message({
								type: "warning",
								message: "里程暂无数据"
							});
						}
					});

				} else {
					this.$message({
						type: "warning",
						message: "请选择时间范围"
					});
				}
			},
			drawbarmileage(x, y) {
				this.mileageBar = echarts.init(document.getElementById('mileageBar'));
				this.mileageBar.setOption({
					title: {
						text: '里程'
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
						},
						formatter: '日期 : {b0} 号</br>{a0}: {c0} km'
					},
					grid: {
						show: true,
						left: "1%",
						right: "1%",
						bottom: "1%",
						containLabel: true
					},
					xAxis: {
						splitArea: {
							show: true
						}, //保留网格区域
						boundaryGap: true,
						data: x
					},
					yAxis: {
						name: '里程:Km',
						interval: 5,
						splitArea: {
							show: true
						}, //保留网格区域
						type: "value",
						splitLine: {
							show: true
						}
					},
					series: [{
						name: '里程',
						type: "bar",
						barMaxWidth: 15, //最大宽度
						showSymbol: false,
						itemStyle: {
							normal: {
								color: '#008B00'
							}
						},
						data: y
					}]
				});
			},
			//绘制仪表
			drawInstrument() {
				this.main = echarts.init(document.getElementById('main'));
				this.main.setOption({
					backgroundColor: '#f5f7fa',
					tooltip: {
						formatter: "{a} <br/>{c} {b}"
					},
					series: [{
							name: '速度',
							type: 'gauge',
							z: 3,
							min: 0,
							max: 220,
							splitNumber: 11,
							radius: '70%',
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									width: 10
								}
							},
							axisTick: { // 坐标轴小标记
								length: 15, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: 'auto'
								}
							},
							splitLine: { // 分隔线
								length: 20, // 属性length控制线长
								lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
									color: 'auto'
								}
							},
							axisLabel: {
								backgroundColor: 'auto',
								borderRadius: 2,
								color: '#eee',
								padding: 3,
								textShadowBlur: 2,
								textShadowOffsetX: 1,
								textShadowOffsetY: 1,
								textShadowColor: '#222'
							},
							title: {
								// 其余属性默认使用全局文本样式，详见TEXTSTYLE
								fontWeight: 'bolder',
								fontSize: 18,
								fontStyle: 'italic'
							},
							detail: {
								// 其余属性默认使用全局文本样式，详见TEXTSTYLE
//								formatter: function(value) {
//									value = (value + '').split('.');
//									value.length < 2 && (value.push('00'));
//									return('00' + value[0]).slice(-2) +
//										'.' + (value[1] + '00').slice(0, 2);
//								},
								fontWeight: 'bolder',
								borderRadius: 3,
								backgroundColor: '#444',
								borderColor: '#aaa',
								shadowBlur: 5,
								shadowColor: '#333',
								shadowOffsetX: 0,
								shadowOffsetY: 3,
								borderWidth: 2,
								textBorderColor: '#000',
								textBorderWidth: 2,
								textShadowBlur: 2,
								textShadowColor: '#fff',
								textShadowOffsetX: 0,
								textShadowOffsetY: 0,
								fontFamily: 'Arial',
								fontSize:'18',
								width: 45,
								color: '#eee',
								rich: {}
							},
							data: [{
								value: this.nspeed_car,
								name: 'km/h'
							}]
						},
						{
							name: '转速',
							type: 'gauge',
							center: ['21%', '55%'], // 默认全局居中
							radius: '50%',
							min: 0,
							max: 10,
							endAngle: 45,
							splitNumber: 10,
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									width: 8
								}
							},
							axisTick: { // 坐标轴小标记
								length: 12, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: 'auto'
								}
							},
							splitLine: { // 分隔线
								length: 20, // 属性length控制线长
								lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
									color: 'auto'
								}
							},
							pointer: {
								width: 5
							},
							title: {
								offsetCenter: [0, '-27%'], // x, y，单位px
							},
							detail: {
								// 其余属性默认使用全局文本样式，详见TEXTSTYLE
//								fontWeight: 'bolder'
							},
							data: [{
								value: this.nMotor_Speed,
								name: 'x1000 r/min'
							}]
						},
						{
							name: 'mcu电压',
							type: 'gauge',
							center: ['77%', '50%'], // 默认全局居中
							radius: '50%',
							min: 0,
							max: 120,
							startAngle: 135,
							endAngle: 45,
							splitNumber: 2,
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									width: 8
								}
							},
							axisTick: { // 坐标轴小标记
								splitNumber: 5,
								length: 10, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: 'auto'
								}
							},
							axisLabel: {
//								formatter: function(v) {
//									switch(v + '') {
//										case '0':
//											return 'E';
//										case '1':
//											return 'Gas';
//										case '2':
//											return 'F';
//									}
//								}
							},
							splitLine: { // 分隔线
								length: 15, // 属性length控制线长
								lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
									color: 'auto'
								}
							},
							pointer: {
								width: 5
							},
							title: {
								fontWeight: 'bolder',
								fontSize: 18,
							},
							detail: {
								show: false
							},
							data: [{
								value: this.nMCU_Voltage,
								name: 'V'
							}]
						},
						{
							name: 'mcu电流',
							type: 'gauge',
							center: ['77%', '50%'], // 默认全局居中
							radius: '50%',
							min: 0,
							max: 120,
							startAngle: 315,
							endAngle: 225,
							splitNumber: 2,
							axisLine: { // 坐标轴线
								lineStyle: { // 属性lineStyle控制线条样式
									width: 8
								}
							},
							axisTick: { // 坐标轴小标记
								splitNumber: 5,
								length: 10, // 属性length控制线长
								lineStyle: { // 属性lineStyle控制线条样式
									color: 'auto'
								}
							},
							axisLabel: {
//								formatter: function(v) {
//									switch(v + '') {
//										case '0':
//											return 'H';
//										case '1':
//											return 'Water';
//										case '2':
//											return 'C';
//									}
//								}
							},
							splitLine: { // 分隔线
								length: 15, // 属性length控制线长
								lineStyle: { // 属性lineStyle（详见lineStyle）控制线条样式
									color: 'auto'
								}
							},
							pointer: {
								width: 5
							},
							title: {
								fontWeight: 'bolder',
								fontSize: 18,
								offsetCenter: [0, '50%']
							},
							detail: {
								show: false
							},
							data: [{
								value: this.nMCU_Current,
								name: 'A'
							}]
						}
					]
				});
			},
			//跳转历史轨迹
			loadgps() {
				clearInterval(this.interval);
				clearTimeout(this.timeout);
				sessionStorage.setItem("sunid", this.sunid);
				sessionStorage.setItem("carid", this.carid);
				this.$router.push("/gpsService");
			},

			//获取时间选择器时间
			//获取当前时间
			//hour 小时之前
			onehour(hour) {

				var date = new Date();
				this.endTime = Date.parse(date);
				var oneweekdate = new Date(date - hour * 60 * 60 * 1000);
				this.startTime = Date.parse(oneweekdate);
				this.value3 = [oneweekdate, date];
			},
			//坐标系转换
			delta(lat, lon) {
				// Krasovsky 1940
				//
				// a = 6378245.0, 1/f = 298.3
				// b = a * (1 - f)
				// ee = (a^2 - b^2) / a^2;
				var a = 6378245.0; //  a: 卫星椭球坐标投影到平面地图坐标系的投影因子。
				var ee = 0.00669342162296594323; //  ee: 椭球的偏心率。
				var dLat = this.transformLat(lon - 105.0, lat - 35.0);
				var dLon = this.transformLon(lon - 105.0, lat - 35.0);
				var radLat = lat / 180.0 * this.PI;
				var magic = Math.sin(radLat);
				magic = 1 - ee * magic * magic;
				var sqrtMagic = Math.sqrt(magic);
				dLat = dLat * 180.0 / (a * (1 - ee) / (magic * sqrtMagic) * this.PI);
				dLon = dLon * 180.0 / (a / sqrtMagic * Math.cos(radLat) * this.PI);
				return {
					lat: dLat,
					lon: dLon
				};
			},
			transformLat(x, y) {
				var ret = -100.0 +
					2.0 * x +
					3.0 * y +
					0.2 * y * y +
					0.1 * x * y +
					0.2 * Math.sqrt(Math.abs(x));
				ret +=
					(20.0 * Math.sin(6.0 * x * this.PI) +
						20.0 * Math.sin(2.0 * x * this.PI)) *
					2.0 /
					3.0;
				ret +=
					(20.0 * Math.sin(y * this.PI) + 40.0 * Math.sin(y / 3.0 * this.PI)) *
					2.0 /
					3.0;
				ret +=
					(160.0 * Math.sin(y / 12.0 * this.PI) +
						320 * Math.sin(y * this.PI / 30.0)) *
					2.0 /
					3.0;
				return ret;
			},
			transformLon(x, y) {
				var ret =
					300.0 +
					x +
					2.0 * y +
					0.1 * x * x +
					0.1 * x * y +
					0.1 * Math.sqrt(Math.abs(x));
				ret +=
					(20.0 * Math.sin(6.0 * x * this.PI) +
						20.0 * Math.sin(2.0 * x * this.PI)) *
					2.0 /
					3.0;
				ret +=
					(20.0 * Math.sin(x * this.PI) + 40.0 * Math.sin(x / 3.0 * this.PI)) *
					2.0 /
					3.0;
				ret +=
					(150.0 * Math.sin(x / 12.0 * this.PI) +
						300.0 * Math.sin(x / 30.0 * this.PI)) *
					2.0 /
					3.0;
				return ret;
			},
			//GPS---高德
			gcj_encrypt(wgsLat, wgsLon) {
				var d = this.delta(wgsLat, wgsLon);
				var la = parseFloat(wgsLat) + parseFloat(d.lat);
				return [
					parseFloat(wgsLon) + parseFloat(d.lon),
					parseFloat(wgsLat) + parseFloat(d.lat)
				];
			},

		},
		mounted() {
			this.getUsers();
		},
		beforeRouteLeave(to, from, next) {
			next()
			clearInterval(this.interval);
			clearTimeout(this.timeout);

		}
	}
</script>

<style stoped>
	li {
		list-style: none;
	}
	
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
	
	.carAndMap {
		height: 50%;
		overflow: hidden;
	}
	
	.carinfocard {
		width: 100%;
		height: 47%;
		background: #f5f7fa;
	}
	
	.carinfotime {
		height: 3%;
		background: #f5f7fa;
	}
	
	.carlistsoverflow {
		width: 220px;
		height: 95%;
		margin-left: 5px;
		margin-top: 10px;
		overflow: hidden;
		float: left;
		border: 2px solid #878787;
		border-radius: 10px;
	}
	
	.carlists {
		width: 240px;
		height: 100%;
		background-color: ;
		overflow-y: auto;
	}
	
	.mapinfo {
		margin-left: 250px;
		margin-top: 10px;
		height: 100%;
	}
	
	.amap-wrapper {
		width: 100%;
		height: 85%;
		margin: 0 auto;
	}
	
	.cargps {
		font-size: 18px;
		font-weight: bold;
		width: 100%;
		margin: 0 auto;
		padding: 0;
		background: #f5f7fa;
		height: 35px;
		line-height: 35px;
		color: #34465a;
		border-radius: 20px;
	}
	
	.blue {
		color: #246dce;
	}
	
	.mapcargps {
		text-align: center;
		padding: 5px 20px 5px;
		position: absolute;
		z-index: 999;
		font-size: 16px;
		background: #909399;
		border-radius: 20px;
		color: #f5f7fa;
	}
	
	.carsindex {
		list-style: none;
		margin: 0 auto;
		width: 205px;
		height: 125px;
		padding: 0;
		color: #34465a;
		background: #f5f7fa;
		font-weight: bold;
		text-align: center;
		border-radius: 5px;
		cursor: pointer;
	}
	
	.isonlineinfo {
		display: inline-block;
		width: 80px;
		height: 30px;
		text-align: center;
		background: #E4E7ED;
		vertical-align: middle;
		border-radius: 8px;
	}
	
	.bgred {
		background-color: #cde2f7;
		/*box-shadow: 2px 5px 5px #999;*/
		width: 210px;
	}
	
	.carinfotimewrap {
		display: inline-block;
		font-size: 16px;
		width: 33%;
		height: 100%;
		border-right: 1px solid #000;
		text-align: center;
	}
	
	.infocard {
		height: 95%;
		width: 100%;
	}
	
	.conlight {
		display: flex;
		flex-wrap: wrap;
		padding: 5px;
		padding-top: 0;
	}
	.detailwrap{
		width: 80%;
		height: 10%;
		padding-left: 5%;
		overflow: hidden;
	}
	.detailname,.detailinfo{
		display: inline-block;
		width: 40%;
		height: 100%;
		/*line-height: 40px;*/
		text-align: center;
		background-color: #f5f7fa;
		color: #34465a;
		border-radius: 10px;
		font-weight: bold;
		display: -webkit-flex;
		display: flex;
		-webkit-align-items: center;
		align-items: center;
		-webkit-justify-content: center;
		justify-content: center;
		float: left;
	}
	.detailinfo{
		vertical-align:top;
		width: 55%;
		color: #246dce;
		margin-left: 10px;
	}
</style>