
let routes = [
	//登录
	{
		path: '/login',
		component: resolve=>require(['./views/Login.vue'],resolve),
		name: 'Login',
	},
	//404
	{
		path: '*',
		component: resolve=>require(['./views/404.vue'],resolve),
		name: 'NotFound',
	},
	//首页
	{
		path: '/home',
		component: resolve=>require(['./views/Home.vue'],resolve),
		name: '主页',
		children: [{
			path: '/main',
			component: resolve=>require(['./views/Main.vue'],resolve),
			name: '应领智能'
		}]
	},
	//用户列表
	{
		path: '/',
		component: resolve=>require(['./views/Home.vue'],resolve),
		name: '主页',
		iconCls: 'el-icon-date',
		leaf: true, //只有一个节点
		children: [{
			path: '/users',
			component: resolve=>require(['./views/users.vue'],resolve),
			name: '用户管理'
		}]
	},
	//用户列表
	{
		path: '/',
		component: resolve=>require(['./views/Home.vue'],resolve),
		name: '',
		iconCls: 'el-icon-date',
		leaf: true, //只有一个节点
		children: [{
			path: '/cars',
			component: resolve=>require(['./views/cars.vue'],resolve),
			name: '车辆管理'
		}]
	},//用户列表
	{
		path: '/',
		component: resolve=>require(['./views/Home.vue'],resolve),
		name: '',
		iconCls: 'el-icon-date',
		leaf: true, //只有一个节点
		children: [{
			path: '/feedback',
			component: resolve=>require(['./views/feedback.vue'],resolve),
			name: '服务反馈',
			children: [{
				path: '/feedback/service',
				component: resolve=>require(['./views/service.vue'],resolve),
				name: '服务说明'
			}]
		}]
	},//用户列表
	{
		path: '/',
		component: resolve=>require(['./views/Home.vue'],resolve),
		name: '',
		iconCls: 'el-icon-date',
		leaf: true, //只有一个节点
		children: [{
			path: '/rootset',
			component: resolve=>require(['./views/rootset.vue'],resolve),
			name: '高级设置'
		}]
	},
	
	
	
	
	
	
];

export default routes;