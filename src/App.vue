<template>
  <div id="app">
    <transition name="fade"
		            mode="out-in">
			<router-view></router-view>
		</transition>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body,html{
	margin: 0px;
	padding: 0px;
	min-width:1400px;
	font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
	font-size: 14px;
	-webkit-font-smoothing: antialiased;
	height: 100%;
}

#app {
	min-width:1400px;
	height: 100%;
}
.canvas1 {
	background: #fff;
    	position: fixed;
    	z-index: -1;
	}
.el-submenu [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.el-menu-item [class^=fa] {
	vertical-align: baseline;
	margin-right: 10px;
}

.toolbar {
	padding: 5px;
	margin: 5px 0px;
	height: 44px;
	overflow: hidden;
	.el-form-item {
		margin-bottom: 5px;
	}
}

.fade-enter-active,
.fade-leave-active {
	transition: all .2s ease;
}

.fade-enter,
.fade-leave-active {
	opacity: 0;
}
a{
	text-decoration: none;
}
.full{
	height: 100%;
	overflow: hidden;
	min-height: 768px;
}
.el-table-owner{
	width: 100%;
	font-size: 16px;
	line-height: 12px;
	height: 85%;
}
.el-button--primary{
	border: 1px solid #3c5d89;
	background-color: #3c5d89;
}
.el-button--primary:hover{
	border: 1px solid #3c5d89;
	background-color: #3c5d89;
}
.el-button--primary:focus{
	border: 1px solid #3c5d89;
	background-color: #3c5d89;
}
input:-webkit-autofill, textarea:-webkit-autofill, select:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px white inset; 
} 
input[type=text]:focus, input[type=password]:focus, textarea:focus { 
-webkit-box-shadow: 0 0 0 1000px white inset;
    border:solid 1.5px #2c97de;
    box-shadow:0 0 5px rgba(44,151,22,0.2);
}
.el-checkbox__input.is-checked .el-checkbox__inner, .el-checkbox__input.is-indeterminate .el-checkbox__inner {
    background-color: #3c5d89;
    border-color: #3c5d89;
}
.el-checkbox__input.is-checked+.el-checkbox__label{
	color: #3c5d89;
}
.el-table th, .el-table tr{
	color: #eee;
	background-color: rgba(0,0,0,0);
	cursor: pointer;
}
.el-table--enable-row-hover .el-table__body tr:hover>td {
    /*background-color: rgba(0,0,0,0.1);*/
    background-color: #3c5d89;
}
.el-table--border, .el-table--group{
	border: 1px solid #EEEEEE; 
}
.el-pagination__jump{
	color: #eee;
}
.el-table--border, .el-table--group{
	border: 1px solid #878787;
}
.el-table td, .el-table th.is-leaf{
	border: 1px solid #878787;
}
.el-table--border::after, .el-table--group::after, .el-table::before{
	background-color:#878787;
}
.el-pagination__jump{
	margin-left: 13px;
}
.el-table__body tr.current-row>td{
	background-color: #3c5d89;
}
.el-tabs--border-card>.el-tabs__content{
	width: 100%;
	height: 86%;
	padding: 0;
}
</style>
