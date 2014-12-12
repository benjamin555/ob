require.config({
    baseUrl: "../js/",
    paths:{
        "jquery": "jquery-1.8.3.min",
        "bootstrap": "bootstrap.min",
        "domReady": "domReady",
        "globalvariables": "globalvariables",
		"treetable": "jquery.treetable",
		"datetimepicker":"bootstrap-datetimepicker.min",
		"kindeditor":"kindeditor-min",
		"kindeditor-zh_CN":"kindeditor-zh_CN",
		"jqueryui":"jquery-ui-1.10.3.custom.min"
    },
    shim: {
        "bootstrap": {
            deps: ["jquery"],
            exports: "Bootstrap"
        },
		"treetable": {
			deps: ["jquery"],
			exports: "TreeTable"
		},
		"datetimepicker": {
			deps: ["bootstrap","jquery"],
			exports: "Datetimepicker"
		},
		"kindeditor":{
			exports: "Kindeditor"
		},
		"kindeditor-zh_CN":{
			deps: ["kindeditor"],
			exports: "Kindeditor"
		},
		"jqueryui":{
			deps:["jquery"],
			exports:"JQueryui"
		}
    }
});

require(["bootstrap", "jquery", "domReady!"], function(Bootstrap, $){
    // TODO Control the navigation bar & menus here
    var currentpage = $("#currentpage").val();
    var currentmenu = $("#currentmenu").val();
    $("#nav-"  + currentmenu).addClass("active");
    $("#menu-" + currentmenu).css("display", "block");
    $("#menu-" + currentmenu + "-" + currentpage).addClass("active");
});

