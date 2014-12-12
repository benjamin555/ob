<#--通用库引用 -->
<#macro commonLib >  
<link rel="stylesheet" href="${base}/js/main.css" type="text/css" />
<link rel="stylesheet" href="${base}/js/tui-new.css" type="text/css" />
<style type="text/css">
.space {
	display:inline-block;
	width:20px;
	height:20px;
	vertical-align:middle;
}
.arrow {
	display:inline-block;
	width:20px;
	height:20px;
	background-image:url(${base}/design/product/image/tui-icon20.png);
	background-position:-480px center;
	vertical-align:middle;
}
.arrow-opened {
	display:inline-block;
	width:20px;
	height:20px;
	background-image:url(${base}/design/product/image/tui-icon20.png);
	background-position:-440px center;
	vertical-align:middle;
}
.txt {
	vertical-align:middle;
}
</style>
<script src="${base}/js/json2.js" type="text/javascript"></script>
<script src="${base}/js/jquery-1.10.2.js" type="text/javascript"></script>
<script src="${base}/js/helper.js" type="text/javascript"></script>
<script src="${base}/js/tui.js" type="text/javascript"></script>
</#macro>
<#-- treeGrid
	@para  url grid初始化数据的获取url
	@para  divStyle grid 上层div的样式
 -->
<#macro treeGrid url divStyle="" >  
<script type="text/javascript">
$(function(){
	function showError() {
		var dlg = tui.dialog();
		dlg.showMessage("网络或服务器错误。" );
	}
	
	var result = null;
	
	function translate(srcData, objData) {
		for (var i = 0; i < srcData.length; i++) {
			objData.push(srcData[i]);
			if (srcData[i][6] && srcData[i][6].expanded) {
				translate(srcData[i][6].child, objData);
			}
		}
	}
	
	function update() {
		var formatted = [];
		translate(result, formatted);
		tb.setData(formatted,true);
		tb.autoFitColumn(1,true);
		tb.autoHeight();
	}
	var a = [<#nested>{ }];
	a.pop();
	var tb = tui.grid("tb",a);
	
	get("${url}", function(data) {
		result = data;
		var formatted = [];
		translate(result, formatted);
		tb.setData(formatted);
		tb.autoHeight();
	}, function(o, msg, e) {
		showError();
	});
	tb.useWheele(false);
	
	function treeFormater (v, idx,treeUrl){
				var row = tb.getRow(idx);
				var l = row[0];
				var d = row[6];
				var ct = document.createElement("SPAN");
				for (var i = 0; i < l; i++) {
					var p = document.createElement("SPAN");
					ct.appendChild(p);
					if (i === l-1) {
						if (!d) {
							p.className = "arrow";
							$(p).bind("mousedown",function(){
								get(treeUrl+"?level=" + (l+1), function(data) {
									row[6] = {};
									row[6].child = data;
									row[6].expanded = true;
									update();
									tb.autoFitColumn(0, true);
								}, function(o, msg, e) {
									showError();
								});
							});
						} else if (d.expanded) {
							p.className = "arrow-opened";
							$(p).bind("mousedown",function(){
								d.expanded = false;
								update();
							});
						} else {
							p.className = "arrow";
							$(p).bind("mousedown",function(){
								d.expanded = true;
								update();
								tb.autoFitColumn(0, true);
							});
						}
					} else {
						p.className = "space";
					}
				}
				var txt = document.createElement("SPAN");
				txt.className = "txt";
				txt.innerHTML = v;
				ct.appendChild(txt);
				return ct;
			}
});
</script>
<div id="tb" style="${divStyle}">
</div>
</#macro>
<#-- gridColumn
	@para  name 列名
	@para  type 列类型
	@para  formater 列显示函数
	@para  width 列宽 
 -->
<#macro gridColumn name type="default" treeUrl="" formater="function (v){return v;}" width="100">
	<#assign x = "${formater}">
	<#if type="tree">
		<#assign x = "function(v, idx){return treeFormater(v, idx,'${treeUrl}');}">
	</#if>
	{ name:"${name}", formater:${x}, width:${width} },
</#macro>

