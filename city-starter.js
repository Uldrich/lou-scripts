// @version: 1
qx.event.GlobalError.observeMethod(function() {
qx.Class.define("dsislou.cityStarter",{
	extend: dsislou.addon,
	type: "singleton",
	construct: function() {
	}
});
qx.Class.define("dsislou.cityStarter.checker",{
	extend: qx.core.Object,
	properties:{
		problem:{}
	}
});
qx.Class.define("dsislou.cityStarter.checkBuildMini",{
	extend: dsislou.cityStarter.checker,
	members:{
		check: function () {
			if (!webfrontend.data.City.getInstance().getAutoBuildOptionEconomy()) {
				this.setProblem(1);
				return false;
			}
			if (!webfrontend.data.City.getInstance().getAutoBuildOptionDefense()) {
				this.setProblem(2);
				return false;
			}
			return true;
		},fixit: function () {
			webfrontend.net.CommandManager.getInstance().sendCommand("CityAutoBuildParamsSet",{
				cityid:webfrontend.data.City.getInstance().getId(),
				autoBuildOptionDefense: true,
				autoBuildOptionEconomy: true,
				autoBuildTypeFlags: 255},this,function(){console.log('done');});
		}
	},statics:{
		title:'build mini',
		errors:[null,"auto build normal bad","auto build def bad"]
	}
});
qx.Class.define("dsislou.cityStarterWindow",{
	extend: qx.ui.window.Window,
	type: 'singleton',
	construct: function () {
		this.base(arguments,"City Starter");
		this.setShowMinimize(false);
		var layout = new qx.ui.layout.Grid(0,0);
		this.setLayout(layout);
		layout.setColumnFlex(0, 1);
		for (var x=0; x<10; x++) this.label(x);
		this.messages = [];
		for (var x=0; x<1; x++) this.messages[x] = this.makeMsg(x);
		this.checks = [ dsislou.cityStarter.checkBuildMini ];
		webfrontend.base.Timer.getInstance().addListener("uiTick", this.tick,this);
		this.checkers = [];
		this.button = new qx.ui.form.Button("Fix it!!");
		this.button.addListener("click",this.fixIt,this);
	},members:{
		fixIt: function () {
			this.lastChecker.fixit();
		},
		label:function (x) {
			var b = new qx.ui.basic.Label(x+":");
			this.add(b,{row:x,column:0});
		},makeMsg: function (x) {
			var b = new qx.ui.basic.Label("loading...");
			this.add(b,{row:x,column:1});
			return b;
		},tick: function() {
			for (var x=0; x<1; x++) {
				var checker = this.checkers[x];
				console.log(x,checker);
				if (!checker) checker = this.checkers[x] = new this.checks[x]();
				var good = checker.check();
				console.log(good);
				if (good) this.messages[x].setValue(this.checks[x].title+" good");
				else {
					this.messages[x].setValue(this.checks[x].errors[checker.getProblem()]);
					this.lastChecker = checker;
					this.add(this.button,{row:x,column:2});
					break;
				}
			}
		}
	}
});
var win = dsislou.cityStarterWindow.getInstance();
win.show();
})();
