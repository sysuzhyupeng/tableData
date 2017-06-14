/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	var CrimeTable = __webpack_require__(1);
	var crimeTable = new CrimeTable();
	crimeTable.init({
		api: '',
		tmplUlClass: 'fit-table-row'
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	var defaultData = __webpack_require__(2);
	var CrimeTable = function() {
		//筛选点击节点
		this.filterDom = document.getElementById('fit-crime-type');
		//筛选点击节点显示
		this.filterInput = document.getElementById('fit-crime-input');
		//筛选选项dom
		this.filterUl = null;
		//筛选数据模板
		this.tmplDom = document.getElementById('fit-tmpl');
		//数据请求api
		this.defaultApi = '';
		//筛选选择类型，以id来区分
		this.selectedId = 'all';
		//筛选选择索引
		this.selectedIndex = 0;
		//筛选数据模板class类名
		this.tmplUlClass = 'fit-table-row';
		//筛选点击选中class类名
		this.choosedClass = 'selected';
		//筛选点击无法选中class类名
		this.disableClass = 'disabled';
	}
	CrimeTable.prototype = {
		init: function(options) {
			if (!this.filterDom) return false;
			if (options instanceof Object && options) {
				this.api = options.api ? options.api : this.defaultApi;
				this.tmplUlClass = options.tmplUlClass ? options.tmplUlClass : this.tmplUlClass;
			}
			this.filterUl = this.filterDom.getElementsByTagName('ul') ? this.filterDom.getElementsByTagName('ul')[0] : {};
			this.bindEvent();
			this.getData();
			//初始化渲染全部数据
			this.render('all');
		},
		getData: function(param, callback) {
			//根据传入api参数请求数据
			//这里直接import假数据
			this.data = defaultData;
			if (typeof callback === 'function') {
				callback();
			}
		},
		//筛选视图组件绑定事件回调
		bindEvent: function() {
			//使用定时器实现鼠标移出之后隐藏
			var self = this,
				mouseTimeOut = null;
			//忽略IE事件兼容
			self.filterInput.addEventListener('click', function(e) {
				self.filterUl.style.display = 'block';
			}, false);
			self.filterDom.addEventListener('mouseout', function(e) {
				self.removeSeleted();
			}, false);
			self.filterUl.addEventListener('mouseover', function(e) {
				var li = this.getElementsByTagName('li');
				for (var i = 0, len = li.length; i < len; i++) {
					if (e.target == li[i]) {
						self.addSelected(i);
						break;
					}
				}
			})
			self.filterUl.addEventListener('click', function(e) {
				var li = this.getElementsByTagName('li');
				if (!li instanceof Array) return false;
				for (var i = 0, len = li.length; i < len; i++) {
					if (e.target == li[i]) {
						var dataId = li[i].getAttribute('data-id'),
							inputText = li[i].innerHTML;
						//如果当前id相同则不进行重新渲染
						if (dataId === self.selectedId) {
							return false;
						}
						self.fillInput(inputText, dataId);
						self.removeSeleted();
						self.chooseSelected(dataId);
						self.render(dataId);
						//渲染之再更新状态(便于更新视图中拿到上一个状态lastState)
						self.selectedId = dataId;
						self.selectedIndex = i;
						break;
					}
				}
			}, false);
		},
		addSelected: function(index) {
			//regexSel = 'selected'
			var regexSel = this.choosedClass,
				li = this.filterUl.getElementsByTagName('li');
			for (var i = 0, len = li.length; i < len; i++) {
				if (i === index && i !== this.selectedIndex) {
					li[i].className = (li[i].className + ' ' + regexSel).trim();
				} else {
					if (li[i].className.match(regexSel)) {
						li[i].className = li[i].className.replace(regexSel, '').trim();
					}
				}
			}
		},
		//根据选中id更新筛选组件的视图
		chooseSelected: function(id) {
			//regexSel = 'disabled'
			var regexDis = this.disableClass,
				li = this.filterUl.getElementsByTagName('li');
			for (var i = 0, len = li.length; i < len; i++) {
				var dataId = li[i].getAttribute('data-id');
				if (dataId === id) {
					if (!li[i].className.match(regexDis)) {
						li[i].className = (li[i].className + ' ' + regexDis).trim();
					}
				} else if (i === this.selectedIndex) {
					li[i].className = li[i].className.replace(regexDis, '').trim();
				}
			}
			this.filterUl.style.display = 'none';
		},
		removeSeleted: function() {
			var regexSel = this.choosedClass,
				li = this.filterUl.getElementsByTagName('li');
			for (var i = 0, len = li.length; i < len; i++) {
				if (li[i].className.match(regexSel)) {
					li[i].className = li[i].className.replace(regexSel, '').trim();
				}
			}
		},
		//填充选项
		fillInput: function(text, id) {
			var regexSel = this.choosedClass,
				inputDom = this.filterInput.getElementsByTagName('span')[0];
			if (!inputDom) return false;
			//如果不是全部则添加选中状态
			if (id === 'all') {
				inputDom.className = inputDom.className.replace(regexSel, '').trim();
				inputDom.innerHTML = '涉罪类型';
			} else {
				if (!inputDom.className.match(regexSel)) {
					inputDom.className = (inputDom.className + ' ' + regexSel).trim();
				}
				inputDom.innerHTML = text;
			}
		},
		//根据选择的Id进行渲染(根据数据变更渲染视图)
		render: function(id) {
			console.log('Id', id);
			var tmplData = [],
				tmplHtml = '';
			//如果传递id为all,表示请求所有数据
			if (id === 'all') {
				if (typeof this.data !== 'object') return false;
				for (var key in this.data) {
					var dataItem = this.data[key];
					if (dataItem instanceof Array && dataItem.length) {
						tmplData = tmplData.concat(dataItem);
					}
				}
			} else {
				tmplData = this.data[id];
			}
			tmplHtml = this.changeTmpl(tmplData);
			this.tmplDom.innerHTML = tmplHtml;
		},
		//根据数据变更填充模板
		changeTmpl: function(data) {
			var _html = '';
			if (!data instanceof Array || !data.length) alert('api数据错误');
			for (var i = 0, len = data.length; i < len; i++) {
				var item = data[i];
				if (item === null) continue;
				_html += '<ul class="' + this.tmplUlClass + ' clearfix">';
				for (key in item) {
					if (key === 'code' || key === 'name') {
						_html += '<li class="fit-tmpl-' + key + '"><span>' + item[key] + '<i></i></span></li>';
					} else {
						_html += '<li class="fit-tmpl-' + key + '">' + item[key] + '</li>';
					}
				}
				_html += '</ul>';
			}
			return _html;
		}
	}
	module.exports = CrimeTable;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

	var defaultData = {
		'0': [{
			'num': '2017432432432230',
			'date': '2017-04-24',
			'type': '个人',
			'name': '阿*******我',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432231',
			'date': '2017-04-25',
			'type': '个人',
			'name': '阿*******是',
			'code': '6**********************2',
			'tag': '324324324'
		}],
		'1': [{
			'num': '2017432432432234',
			'date': '2017-04-26',
			'type': '个人',
			'name': '阿*******不',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432235',
			'date': '2017-04-27',
			'type': '个人',
			'name': '阿*******同',
			'code': '6**********************2',
			'tag': '324324324'
		}],
		'2': [{
			'num': '2017432432432236',
			'date': '2017-09-26',
			'type': '个人',
			'name': '阿*******的',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432238',
			'date': '2017-09-27',
			'type': '个人',
			'name': '阿*******假',
			'code': '6**********************2',
			'tag': '324324324'
		}],
		'3': [{
			'num': '2017432432432239',
			'date': '2017-04-28',
			'type': '个人',
			'name': '阿*******数',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432236',
			'date': '2017-04-29',
			'type': '个人',
			'name': '阿*******据',
			'code': '6**********************2',
			'tag': '324324324'
		}],
		'4': [{
			'num': '2017432432432232',
			'date': '2017-05-28',
			'type': '个人',
			'name': '阿*******不',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432233',
			'date': '2017-05-29',
			'type': '个人',
			'name': '阿*******同',
			'code': '6**********************2',
			'tag': '324324324'
		}],
		'5': [{
			'num': '2017432432432232',
			'date': '2014-04-28',
			'type': '个人',
			'name': '阿*******的',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432234',
			'date': '2013-04-29',
			'type': '个人',
			'name': '阿*******假',
			'code': '6**********************2',
			'tag': '324324324'
		}],
		'6': [{
			'num': '2017432432432234',
			'date': '2012-04-28',
			'type': '个人',
			'name': '阿*******数',
			'code': '6**********************2',
			'tag': '324324324'
		}, {
			'num': '2017432432432234',
			'date': '2012-04-29',
			'type': '个人',
			'name': '阿*******据',
			'code': '6**********************2',
			'tag': '324324324'
		}]
	}
	module.exports = defaultData;


/***/ })
/******/ ]);