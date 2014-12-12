<#import  "../../widget/widgets.ftl" as t /> 
<!DOCTYPE html>
<head>
<meta charset="utf-8">
<link rel="stylesheet" href="${base}/design/stylesheets/jquery.treetable.css">
<link rel="stylesheet" type="text/css"	href="${base}/design/stylesheets/jquery.treetable.theme.default.css">
<link rel="stylesheet" href="${base}/design/bootstrap/css/bootstrap.min.css" media="screen">

<link rel="stylesheet" href="${base}/design/bootstrap/css/bootstrap-responsive.min.css">
<link rel="stylesheet" href="${base}/design/bootstrap/css/custom.css">
<@t.commonLib />

<script type="text/javascript" src="${base}/design/js/require.js"></script>
<title>中国海油物料超市</title>
</head>
<body>
	<div class="navbar navbar-inverse navbar-fixed-top" role="navigation">
		<div class="container-fluid">
			<a data-target=".navbar-responsive-collapse" data-toggle="collapse"
				class="btn btn-navbar"> <span class="icon-bar"></span> <span
				class="icon-bar"></span> <span class="icon-bar"></span>
			</a>
			<!-- <a href="#" class="brand">中国海油物料超市</a> -->
			<div class="nav-collapse collapse navbar-responsive-collapse">
				 <ul class="nav">
	                <li id="nav-sales"><a href="${base}/design/sales/salescustomer.html">销售</a></li>
	                <li id="nav-product"><a href="${base}/design/product/prodCategory.html">产品</a></li>
	                <li id="nav-logistics"><a href="${base}/design/logistics/logisticsreceive.html">库存</a></li>
	                <li id="nav-procurement"><a href="${base}/design/procurement/supplier.html">采购</a></li>
	                <li id="nav-report"><a href="#">报表</a></li>
	                <li id="nav-setting"><a href="${base}/design/setting/settingcompany.html">设置</a></li>
	            </ul>
				<ul class="nav pull-right" id="nav-user">
					<li><a href="#">用户: Administrator</a></li>
					<li class="divider-vertical"></li>
					<li class="dropdown"><a data-toggle="dropdown"
						class="dropdown-toggle" href="#">选项<strong class="caret"></strong></a>
						<ul class="dropdown-menu">
							<li><a href="#">Item 1</a></li>
							<li><a href="#">Item 2</a></li>
							<li><a href="#">Others</a></li>
							<li class="divider"></li>
							<li><a href="#">Link 3</a></li>
						</ul></li>
				</ul>
			</div>
		</div>
	</div>
	<div class="container-fluid">
		<div class="span2">
			<img src="${base}/design/img/company-logo-1.png">
			<div class="well sidebar-nav" id="menus">
				<ul class="nav nav-list" id="menu-sales" style="display: none;">
					<li class="nav-header">销售</li>
					<li id="menu-sales-client"><a href="#">客户<span
							class="badge pull-right">1</span></a></li>
					<li id="menu-sales-longtermcontracts"><a href="#">长期协议</a></li>
					<li id="menu-sales-saleorder"><a href="#">销售订单<span
							class="badge pull-right">1</span></a></li>
					<li class="nav-header">对账</li>
					<li id="menu-sales-goodsissue"><a href="#">销售对账</a></li>
				</ul>
				<ul class="nav nav-list" id="menu-product" style="display: none;">
					<li class="nav-header">产品</li>
					<li id="menu-product-prodcategory"><a href="${base}/design/product//prodCategory.html">类别</a></li>
					<li id="menu-product-product"><a href="${base}/design/product//prodProduct.html">产品</a></li>
					<li id="menu-product-prodfeature"><a href="${base}/design/product//prodFeature.html">属性</a></li>
					<li class="nav-header">图库</li>
					<li id="menu-product-prodpics"><a href="${base}/design/product//prodPic.html">管理图库</a></li>
					<li id="menu-product-prodfolder"><a href="${base}/design/product//prodFolder.html">管理文件夹</a></li>
				</ul>
				<ul class="nav nav-list" id="menu-setting" style="display: none;">
					<li class="nav-header"> 公司 </li>
			        <li id="menu-setting-company"><a href="${base}/design/setting/settingcompany.html">公司</a></li>
			        <li class="nav-header"> 用户 </li>
			        <li id="menu-setting-user"><a href="${base}/design/setting/settinguser.html">用户</a></li>
			        <li id="menu-setting-usergroup"><a href="${base}/design/setting/settingusergroup.html">权限组</a></li>
				</ul>
				<ul class="nav nav-list" id="menu-logistics" style="display: none;">
					<li class="nav-header">收货</li>
					<li id="menu-logistics-receive"><a href="#">入库单</a></li>
					<li class="nav-header">发货</li>
					<li id="menu-logistics-deliveryorder"><a href="#">出库单</a></li>
					<li class="nav-header">移库</li>
					<li id="menu-logistics-move"><a href="#">移库单</a></li>
					<li class="nav-header">盘点</li>
					<li id="menu-logistics-makeinventory"><a href="#">实物盘点</a></li>
					<!-- 			        <li class="nav-header"> 产品 </li>
			        <li id="menu-logistics-product"><a href="#">产品类别</a></li>
			        <li id="menu-logistics-producttype"><a href="#">产品</a></li>
			        <li class="nav-header"> 设置 </li>
			        <li id="menu-logistics-warehouse"><a href="#">仓库</a></li>
			        <li id="menu-logistics-position"><a href="#">仓位</a></li>
			        <li id="menu-logistics-rules"><a href="#">再订购规则</a></li>
 -->
				</ul>
				<ul class="nav nav-list" id="menu-procurement"
					style="display: none;">
					<li class="nav-header">采购</li>
					<li id="menu-procurement-supplier"><a href="#">供应商</a></li>
					<li id="menu-procurement-contract"><a href="#">供货协议</a></li>
					<li id="menu-procurement-supplier"><a href="#">采购订单</a></li>
					<li class="nav-header">MRP</li>
					<li id="menu-procurement-mrp"><a href="#">计划运行</a></li>
					<li class="nav-header">产品</li>
					<li id="menu-procurement-producttype"><a href="#">产品类别</a></li>
					<li id="menu-procurement-product"><a href="#">产品</a></li>
				</ul>
				<ul class="nav nav-list" id="menu-procurement"
					style="display: none;">
					<li class="nav-header">销售</li>
					<li id="menu-report-salesanalysis"><a href="#">销售分析</a></li>
					<li class="nav-header">库存</li>
					<li id="menu-report-inventoryanalysis"><a href="#">库存分析</a></li>
					<li class="nav-header">采购</li>
					<li id="menu-report-procurementanalysis"><a href="#">采购分析</a></li>
				</ul>
			</div>
		</div>
		<div class="span10">
			<div class="page-header container-fluid">
				<div class="row-fluid">
					<div class="span8">
						<span id="content-title" style="font-size: 24px;"></span>
					</div>
					<div class="span4 list-content">
						<input type="text" class="search-query" placeholder="Search">
					</div>
				</div>
				<div class="row-fluid">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
				<div class="row-fluid">
					<div class="span6">
						<div class="row-fluid">
							<div class="list-content">
								<button class="btn btn-small btn-danger" id="createbutton">
									<i class="icon-pencil"></i> 创建
								</button>
								<button class="btn btn-small" id="importbutton">
									<i class="icon-book"></i> 导入
								</button>
								<div class="btn-group">
								<a class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
									<i class="icon-print"></i>打印 
									<span class="caret"></span>
								</a>
								<ul class="dropdown-menu">
									<li><a href="#">打印所选</a></li>
									<li><a href="#">打印全部</a></li>
								</ul>
							</div>
							<div class="btn-group">
								<a class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
									<i class="icon-cog"></i>更多 <span class="caret"></span>
								</a>
								<ul class="dropdown-menu">
									<li><a href="#">导出</a></li>
									<li><a href="#">删除</a></li>
									<li><a href="#">Others</a></li>
								</ul>
							</div>
							</div>
							<div class="new-content">
								<button class="btn btn-small btn-danger" id="savebutton">
									<i class="icon-ok"></i> 保存
								</button>
								<button class="btn btn-small" id="discardbutton">
									<i class="icon-remove"></i> 放弃
								</button>
							</div>
							<div class="detail-content">
								<button class="btn btn-small" id="editbutton">
									<i class="icon-edit"></i> 编辑
								</button>
								<button class="btn btn-small" id="createbutton1">
									<i class="icon-flag"></i> 创建
								</button>
							<button class="btn btn-small" id="createbutton1">
								<i class="icon-print"></i> 打印
							</button>
							<div class="btn-group">
								<a class="btn dropdown-toggle btn-small" data-toggle="dropdown" href="#">
									<i class="icon-cog"></i>更多 <span class="caret"></span>
								</a>
								<ul class="dropdown-menu">
									<li><a href="#">导出</a></li>
									<li><a href="#">删除</a></li>
									<li><a href="#">Others</a></li>
								</ul>
							</div>
							</div>
							<div class="edit-content">
								<button class="btn btn-small btn-danger" id="savebutton1">
									<i class="icon-ok"></i> 保存
								</button>
								<button class="btn btn-small" id="discardbutton1">
									<i class="icon-remove"></i> 放弃
								</button>
							</div>
						</div>
					</div>
					<div class="span4">
						<div class="detail-content edit-content" style="float:right;">
							<span>1/2&nbsp;&nbsp;</span>
							<button class="btn btn-small"><i class="icon-arrow-left"></i></button>
							<button class="btn btn-small"><i class="icon-arrow-right"></i></button>
						</div>
					</div>
					<div class="span2">
						<div style="float:right;">
							<div class="span5 btn-group" data-toggle="buttons-radio">
								<abbr title="显示列表"><button class="btn active btn-small" id="showlist" data-toggle="tooltip"><i class="icon-list"></i></button></abbr>
								<abbr title="查看详情"><button class="btn btn-small" id="showdetail" data-toggle="tooltip"><i class="icon-resize-full"></i></button></abbr>
							</div>
						</div>
					</div>
				</div>
			</div>
			<input type="hidden" value="prodcategory" id="currentpage"> 
			<input type="hidden" value="product" id="currentmenu"> 
			<input type="hidden" value="类别" id="thistitle">


			
			<@t.treeGrid url="${base}/api/data"  divStyle="display:block;width:1000px;height:600px;margin:0 auto">
				<@t.gridColumn name="<input type='checkbox'>" formater='function (){var ck = document.createElement("INPUT");ck.setAttribute("type", "checkbox");return ck;}'  width="25"/>
				<@t.gridColumn name="类别编码" type="tree"  treeUrl="${base}/api/data" />
				<@t.gridColumn name="类别名称"  />
				<@t.gridColumn name="生效时间"  />
				<@t.gridColumn name="失效时间"  />
				<@t.gridColumn name="操作"  />
			</@t.treeGrid>
			
			<div class="detail-content">
				<div class="row-fluid">
					<span class="span11 offset1"><h3>通用工具类别1</h3></span>
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">类别编码</div></div>
					<span class="span4">TY01</span>
					<div class="span2"><div style="float:right;">显示顺序</div></div>
					<span class="span4">1</span>
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">主上级分类</div></div>
					<span class="span4"></span>
					
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">描述</div></div>
					<div class="span10">这是通用工具产品类别1，包括基本安全防护工具等。</div>
				</div>
				<ul class="nav nav-tabs">
					<li class="active"><a href="#features" data-toggle="tab">属性</a></li>
					<li><a href="#products" data-toggle="tab">产品</a></li>
					<!-- <li><a href="#pics" data-toggle="tab">图片</a></li> -->
					<li><a href="#rollups" data-toggle="tab">上级分类</a></li>
				</ul>

				<div class="tab-content">
					<div class="tab-pane active" id="features">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th>属性名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>颜色</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
								<tr>
									<td>尺码</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div class="tab-pane" id="products">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th>产品名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>产品1</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
								<tr>
									<td>产品2</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
							</tbody>
						</table>
					</div>
				<!-- <div class="tab-pane" id="pics">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th>图片</th>
									<th>文件大小</th>
									<th>状态</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><a href="#"><img data-src="holder.js/64x64" alt="" src="${base}/design/img/company-logo-1.png"></a></td>
									<td>40kb</td>
									<td>启用</td>
								</tr>
								<tr>
									<td><a href="#"><img data-src="holder.js/64x64" alt="" src="${base}/design/img/company-logo-1.png"></a></td>
									<td>40kb</td>
									<td>启用</td>
								</tr>
								<tr>
									<td><a href="#"><img data-src="holder.js/64x64" alt="" src="${base}/design/img/company-logo-1.png"></a></td>
									<td>40kb</td>
									<td>启用</td>
								</tr>
							</tbody>
						</table>
					</div> -->
					<div class="tab-pane" id="rollups">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th>分类名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>上级分类1</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
								<tr>
									<td>上级分类2</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
								<tr>
									<td>上级分类3</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
			<div class="new-content">
				<div class="row-fluid">
					<div class="span2"><div style="float: right;">类别名称</div></div>
					<div class="span4">
						<input class="span12" type="text" placeholder="名称" />
					</div>
				</div>
				<div class="row-fluid">	
					<div class="span2"><div style="float: right;">类别编码</div></div>
					<div class="span4">
						<input class="span12" type="text" placeholder="编码" />
					</div>
					<div class="span2"><div style="float: right;">显示顺序</div></div>
					<div class="span4">
						<input class="span4" type="text" placeholder="eg:1"/>
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float: right;">主上级分类</div></div>
					<div class="span4">
						<input class="span11" type="text" data-provide="typeahead"
							data-source="[&quot;Alabama&quot;,&quot;Alaska&quot;,&quot;Arizona&quot;,&quot;Arkansas&quot;,&quot;California&quot;,&quot;Colorado&quot;,&quot;Connecticut&quot;,&quot;Delaware&quot;,&quot;Florida&quot;,&quot;Georgia&quot;,&quot;Hawaii&quot;,&quot;Idaho&quot;,&quot;Illinois&quot;,&quot;Indiana&quot;,&quot;Iowa&quot;,&quot;Kansas&quot;,&quot;Kentucky&quot;,&quot;Louisiana&quot;,&quot;Maine&quot;,&quot;Maryland&quot;,&quot;Massachusetts&quot;,&quot;Michigan&quot;,&quot;Minnesota&quot;,&quot;Mississippi&quot;,&quot;Missouri&quot;,&quot;Montana&quot;,&quot;Nebraska&quot;,&quot;Nevada&quot;,&quot;New Hampshire&quot;,&quot;New Jersey&quot;,&quot;New Mexico&quot;,&quot;New York&quot;,&quot;North Dakota&quot;,&quot;North Carolina&quot;,&quot;Ohio&quot;,&quot;Oklahoma&quot;,&quot;Oregon&quot;,&quot;Pennsylvania&quot;,&quot;Rhode Island&quot;,&quot;South Carolina&quot;,&quot;South Dakota&quot;,&quot;Tennessee&quot;,&quot;Texas&quot;,&quot;Utah&quot;,&quot;Vermont&quot;,&quot;Virginia&quot;,&quot;Washington&quot;,&quot;West Virginia&quot;,&quot;Wisconsin&quot;,&quot;Wyoming&quot;]"
							placeholder="上级分类" /> 
							<a href="#" data-toggle="modal"	data-target="#myModal"><i class="icon-search"></i></a>
						<div id="myModal" class="modal hide fade" tabindex="-1"
							role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"
									aria-hidden="true">×</button>
								<h3 id="myModalLabel">查找上级分类</h3>
							</div>
							<div class="modal-body">
								<p>上级分类列表,这是一个测试。</p>
							</div>
							<div class="modal-footer">
								<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
								<button class="btn btn-primary">保存</button>
							</div>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float: right;">类别描述</div></div>
				</div>
				<div class="row-fluid">
					<div class="span2"></div>
					<textarea class="span8" rows="4"></textarea>
				</div>
				<ul class="nav nav-tabs">
					<li class="active"><a href="#features1" data-toggle="tab">属性</a></li>
					<li><a href="#products1" data-toggle="tab">产品</a></li>
					<!-- <li><a href="#pics1" data-toggle="tab">图片</a></li> -->
					<li><a href="#rollups1" data-toggle="tab">上级分类</a></li>
				</ul>

				<div class="tab-content">
					<div class="tab-pane active" id="features1">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"><input type="checkbox" class="ckbAll" onclick="checkAll()"/></th>
									<th>属性名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody id="featureBody">
								<!-- <tr>
									<td><input type="checkbox" /></td>
									<td><input type="text" placeholder="名称"></td>
									<td>
										<div class="control-group">
											<div class="controls input-append date form_date"
												data-date="" data-date-format="yyyy-mm-dd"
												data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
												<input class="input1" size="16" type="text" value="" readonly> 
												<span class="add-on"><i class="icon-remove"></i></span>
												<span class="add-on"><i class="icon-th"></i></span>
											</div>
											<input type="hidden" id="dtp_input2" value="" /><br />
										</div>
									</td>
									<td>
										<div class="control-group">
											<div class="controls input-append date form_date"
												data-date="" data-date-format="yyyy-mm-dd"
												data-link-field="dtp_input1" data-link-format="yyyy-mm-dd">
												<input class="input1" size="16" type="text" value="" readonly> 
												<span class="add-on"><i class="icon-remove"></i></span> 
												<span class="add-on"><i class="icon-th"></i></span>
											</div>
											<input type="hidden" id="dtp_input1" value="" />
										</div>
									</td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr> -->
							</tbody>
						</table>
						<div class="row-fluid">
							<button class="btn btn-mini" onclick="addrow('feature')">添加新属性</button>
							<button class="btn btn-mini" onclick="del()">删除所选项</button>
						</div>
					</div>
					<div class="tab-pane" id="products1">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"><input type="checkbox" class="ckbAll" onclick="checkAll()"/></th>
									<th>产品名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody id="prodBody">
								<!-- <tr>
									<td><input type="checkbox" /></td>
									<td><input type="text" placeholder="名称"></td>
									<td>
										<div class="control-group">
											<div class="controls input-append date form_date"
												data-date="" data-date-format="yyyy-mm-dd"
												data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
												<input class="input1" size="16" type="text" value="" readonly> 
												<span class="add-on"><i class="icon-remove"></i></span> 
												<span class="add-on"><i class="icon-th"></i></span>
											</div>
											<input type="hidden" id="dtp_input2" value="" /><br />
										</div>
									</td>
									<td>
										<div class="control-group">
											<div class="controls input-append date form_date"
												data-date="" data-date-format="yyyy-mm-dd"
												data-link-field="dtp_input1" data-link-format="yyyy-mm-dd">
												<input class="input1" size="16" type="text" value="" readonly> 
												<span class="add-on"><i class="icon-remove"></i></span>
												<span class="add-on"><i class="icon-th"></i></span>
											</div>
											<input type="hidden" id="dtp_input1" value="" />
										</div>
									</td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr> -->
							</tbody>
						</table>
						<div class="row-fluid">
							<button class="btn btn-mini" onclick="addrow('prod')">添加产品</button>
							<button class="btn btn-mini" onclick="del()">删除所选项</button>
						</div>
					</div>
					<!-- <div class="tab-pane" id="pics1">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"></th>
									<th>图片</th>
									<th>文件大小</th>
									<th>状态</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><input type="checkbox" /></td>
									<td><a href="#"><img data-src="holder.js/64x64" alt=""
											src="${base}/design/img/base64-pic.png"></a></td>
									<td></td>
									<td></td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr>
								<tr>
									<td colspan="5"><a class="btn btn-small" href="#"><i
											class="icon-plus"></i>添加新图片</a> <a
										class="btn btn-primary btn-small" href="#"><i
											class="icon-upload"></i>开始上传</a> <a
										class="btn btn-warning btn-small" href="#"><i
											class="icon-remove"></i>取消上传</a></td>
								</tr>
							</tbody>
						</table>
					</div> -->
					<div class="tab-pane" id="rollups1">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"><input type="checkbox" class="ckbAll" onclick="checkAll()"/></th>
									<th>分类名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody id="rollupBody">
								<!-- <tr>
									<td><input type="checkbox" /></td>
									<td><input type="text" placeholder="名称"></td>
									<td>
										<div class="control-group">
											<div class="controls input-append date form_date"
												data-date="" data-date-format="yyyy-mm-dd"
												data-link-field="dtp_input2" data-link-format="yyyy-mm-dd">
												<input class="input1" size="16" type="text" value="" readonly> 
												<span class="add-on"><i class="icon-remove"></i></span> 
												<span class="add-on"><i class="icon-th"></i></span>
											</div>
											<input type="hidden" id="dtp_input2" value="" /><br />
										</div>
									</td>
									<td>
										<div class="control-group">
											<div class="controls input-append date form_date"
												data-date="" data-date-format="yyyy-mm-dd"
												data-link-field="dtp_input1" data-link-format="yyyy-mm-dd">
												<input class="input1" size="16" type="text" value="" readonly> 
												<span class="add-on"><i class="icon-remove"></i></span> 
												<span class="add-on"><i class="icon-th"></i></span>
											</div>
											<input type="hidden" id="dtp_input1" value="" />
										</div>
									</td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr> -->
							</tbody>
						</table>
						<div class="row-fluid">
							<button class="btn btn-mini" onclick="addrow('rollup')">添加新上级分类</button>
							<button class="btn btn-mini" onclick="del()">删除所选项</button>
						</div>
					</div>
				</div>
			</div></div>
			<div class="edit-content">
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">类别名称</div></div>
					<div class="span4">
						<input class="span12" type="text" value="通用工具类别1" placeholder="名称"/>
					</div>
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">类别编码</div></div>
					<div class="span4">
						<input class="span12" type="text" value="TY01"/>
					</div>
					<div class="span2"><div style="float:right;">显示顺序</div></div>
					<div class="span4">
						<input class="span4" type="text" value="1">
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">主上级分类</div></div>
					<div class="span4">
						<input class="span11" type="text" data-provide="typeahead"
							data-source="[&quot;Alabama&quot;,&quot;Alaska&quot;,&quot;Arizona&quot;,&quot;Arkansas&quot;,&quot;California&quot;,&quot;Colorado&quot;,&quot;Connecticut&quot;,&quot;Delaware&quot;,&quot;Florida&quot;,&quot;Georgia&quot;,&quot;Hawaii&quot;,&quot;Idaho&quot;,&quot;Illinois&quot;,&quot;Indiana&quot;,&quot;Iowa&quot;,&quot;Kansas&quot;,&quot;Kentucky&quot;,&quot;Louisiana&quot;,&quot;Maine&quot;,&quot;Maryland&quot;,&quot;Massachusetts&quot;,&quot;Michigan&quot;,&quot;Minnesota&quot;,&quot;Mississippi&quot;,&quot;Missouri&quot;,&quot;Montana&quot;,&quot;Nebraska&quot;,&quot;Nevada&quot;,&quot;New Hampshire&quot;,&quot;New Jersey&quot;,&quot;New Mexico&quot;,&quot;New York&quot;,&quot;North Dakota&quot;,&quot;North Carolina&quot;,&quot;Ohio&quot;,&quot;Oklahoma&quot;,&quot;Oregon&quot;,&quot;Pennsylvania&quot;,&quot;Rhode Island&quot;,&quot;South Carolina&quot;,&quot;South Dakota&quot;,&quot;Tennessee&quot;,&quot;Texas&quot;,&quot;Utah&quot;,&quot;Vermont&quot;,&quot;Virginia&quot;,&quot;Washington&quot;,&quot;West Virginia&quot;,&quot;Wisconsin&quot;,&quot;Wyoming&quot;]"
							placeholder="上级分类" /> 
						<a href="#" data-toggle="modal" data-target="#myModal1"><i class="icon-search"></i></a>
						<div id="myModal1" class="modal hide fade" tabindex="-1"
							role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
							<div class="modal-header">
								<button type="button" class="close" data-dismiss="modal"
									aria-hidden="true">×</button>
								<h3 id="myModalLabel">这是一个测试</h3>
							</div>
							<div class="modal-body">
								<p>主上级分类测试</p>
							</div>
							<div class="modal-footer">
								<button class="btn" data-dismiss="modal" aria-hidden="true">关闭</button>
								<button class="btn btn-primary">保存</button>
							</div>
						</div>
					</div>
				</div>
				<div class="row-fluid">
					<div class="span2"><div style="float:right;">类别描述</div></div>
				</div>
				<div class="row-fluid">
					<div class="span2"></div>
					<textarea class="span8" rows="4">这是通用工具产品类别1，包括基本安全防护工具等。</textarea>
				</div>
				<ul class="nav nav-tabs">
					<li class="active"><a href="#features2" data-toggle="tab">属性</a></li>
					<li><a href="#products2" data-toggle="tab">产品</a></li>
					<!-- <li><a href="#pics2" data-toggle="tab">图片</a></li> -->
					<li><a href="#rollups2" data-toggle="tab">上级分类</a></li>
				</ul>

				<div class="tab-content">
					<div class="tab-pane active" id="features2">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"><input type="checkbox" class="ckbAll" onclick="checkAll()"/></th>
									<th>属性名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody id="featureBody1">
								<tr>
									<td><input type="checkbox" /></td>
									<td>颜色</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
								<tr>
									<td><input type="checkbox" /></td>
									<td>尺码</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
							</tbody>
						</table>
						<div class="row-fluid">
							<button class="btn btn-mini" onclick="addrow('feature1')">添加新属性</button>
							<button class="btn btn-mini" onclick="del()">删除所选项</button>
						</div>
					</div>
					<div class="tab-pane" id="products2">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"><input type="checkbox" class="ckbAll" onclick="checkAll()"/></th>
									<th>产品名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody class="prodBody1">
								<tr>
									<td><input type="checkbox" /><input type="checkbox"/></td>
									<td>产品1</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
								<tr>
									<td><input type="checkbox" /></td>
									<td>产品2</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
							</tbody>
						</table>
						<div class="row-fluid">
							<button class="btn btn-mini" onclick="addrow('prod1')">添加新产品</button>
							<button class="btn btn-mini" onclick="del()">删除所选项</button>
						</div>
					</div>
					<!-- <div class="tab-pane" id="pics2">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"></th>
									<th>图片</th>
									<th>文件大小</th>
									<th>状态</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td><input type="checkbox" /></td>
									<td><a href="#"><img data-src="holder.js/64x64" alt="" src="${base}/design/img/company-logo-1.png"></a></td>
									<td>40kb</td>
									<td>启用</td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr>
								<tr>
									<td><input type="checkbox" /></td>
									<td><a href="#"><img data-src="holder.js/64x64" alt="" src="${base}/design/img/company-logo-1.png"></a></td>
									<td>40kb</td>
									<td>启用</td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr>
								<tr>
									<td><input type="checkbox" /></td>
									<td><a href="#"><img data-src="holder.js/64x64" alt="" src="${base}/design/img/company-logo-1.png"></a></td>
									<td>40kb</td>
									<td>启用</td>
									<td><a href="#"><i class="icon-trash"></i></a></td>
								</tr>
								<tr>
									<td colspan="5">
									<a class="btn btn-small" href="#><i class="icon-plus"></i>添加新图片</a> 
									<a class="btn btn-primary btn-small" href="#"><i class="icon-upload"></i>开始上传</a>
									<a class="btn btn-warning btn-small" href="#"><i class="icon-remove"></i>取消上传</a>
									</td>
								</tr>
							</tbody>
						</table>
					</div> -->
					<div class="tab-pane" id="rollups2">
						<table class="table table-condensed table-hover">
							<thead>
								<tr>
									<th style="width: 4px"><input type="checkbox" class="ckbAll" onclick="checkAll()"/></th>
									<th>分类名称</th>
									<th>生效日期</th>
									<th>失效日期</th>
									<th>操作</th>
								</tr>
							</thead>
							<tbody id="rollupBody1">
								<tr>
									<td><input type="checkbox" /></td>
									<td>上级分类1</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
								<tr>
									<td><input type="checkbox" /></td>
									<td>上级分类2</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
								<tr>
									<td><input type="checkbox" /></td>
									<td>上级分类3</td>
									<td>2013-11-26</td>
									<td>2013-12-20</td>
									<td><a href="#">编辑</a>|<a href="#">删除</a></td>
								</tr>
							</tbody>
						</table>
						<div class="row-fluid">
							<button class="btn btn-mini" onclick="addrow('rollup1')">添加新上级分类</button>
							<button class="btn btn-mini" onclick="del()">删除所选项</button>
						</div>
					</div>
					</div>
				</div>
		</div></div></div>
		<script>
		function checkAll(){
			if ($(".ckbAll").attr("checked")) {
		        $("input:checkbox").attr("checked", true);
		    }
		    else {
		        $("input:checkbox").attr("checked", false);
		    }
		}
		
		function addrow(name){
			var rowhtml;
			if(name=="feature"){
				rowhtml = $("#featureBody").find("tr").html();
				$("#featureBody").append("<tr>" + rowhtml + "</tr>");
			}else if(name=="feature1"){
				rowhtml = $("#featureBody").find("tr").html();
				$("#featureBody1").append("<tr>" + rowhtml + "</tr>");
			}else if(name=="prod"){
				rowhtml = $("#prodBody").find("tr").html();
				$("#prodBody").append("<tr>" + rowhtml + "</tr>");
			}else if(name=="prod1"){
				rowhtml = $("#prodBody").find("tr").html();
				$("#prodBody1").append("<tr>" + rowhtml + "</tr>");
			}else if(name=="rollup"){
				rowhtml = $("#rollupBody").find("tr").html();
				$("#rollupBody").append("<tr>" + rowhtml + "</tr>");
			}else{
				rowhtml = $("#rollupBody").find("tr").html();
				$("#rollupBody1").append("<tr>" + rowhtml + "</tr>");
			}
		}
		 function del(){
			   $("input:checked").parent().parent().remove(); 	
		   };
		
	    require(["jquery", "domReady!"], function($){
	    	// Initialize common buttons and views
	    	var currentview = "";
	    	var showview = function(view){
	        	$(".detail-content").css("display", "none");
	        	$(".new-content").css("display", "none");
	            $(".list-content").css("display", "none");
	            $(".edit-content").css("display", "none");	 
	            $("." + view + "-content").css("display", "block");
	            currentview = view;
	    	};
	        var showlist = function(){
	        	showview("list");
	        	document.getElementById("showlist").className="btn active btn-small";	    		
	    		document.getElementById("showdetail").className="btn btn-small";
	        	$("#content-title").html($("#thistitle").val());
	        };
	        var showdetail = function(){
	        	showview("detail");
	        	document.getElementById("showlist").className="btn btn-small";	    		
	    		document.getElementById("showdetail").className="btn active btn-small";
	        	$("#content-title").html($("#thistitle").val()+"&nbsp;&nbsp;/&nbsp;&nbsp;TY01");
	        };
	        var shownew = function(){
	        	showview("new");
	        	$("#content-title").html($("#thistitle").val());
	        };
	        var showedit = function(){
				showview("edit");
				$("#content-title").html($("#thistitle").val()+"&nbsp;&nbsp;/&nbsp;&nbsp;TY01");
		    };
	        $("#content-title").html($("#thistitle").val());
	        $("#showlist").on("click", showlist);
	        $("#showdetail").on("click", showdetail);
	        $("#createbutton").on("click", shownew);
	        $("#createbutton1").on("click", shownew);
	        $("#discardbutton").on("click", showlist);
	        $("#discardbutton1").on("click", showlist);
	        $("#savebutton").on("click", showdetail);
	        $("#savebutton1").on("click", showdetail);
	        $("#editbutton").on("click", showedit);
	        showlist();
	        
	        //点击进入detail页面
	        $(".mytd").on("click", showdetail);
	    });
		require(["jquery", "treetable", "domReady!"], function($){
	    	$("#catetable").treetable({ expandable: true ,column:1, 
			
			 onNodeExpand: function() {  
					var jsonstr="{'typeCode':'TY0901','typeID':'91','parentID':'1','typeName':'测试类别01','validStart':'20140101','validEnd':'20141231'}";

					loadRowFromJSON(this, jsonstr);
            }  

			});
	    });
		require(["jquery", "bootstrap", "datetimepicker","domReady!"], function($){
			$('.form_date').datetimepicker({
		        language:  'en',
		        weekStart: 1,
		        todayBtn:  1,
				autoclose: 1,
				todayHighlight: 1,
				startView: 2,
				minView: 2,
				forceParse: 0
		    });
	    });
		
		function loadRowFromJSON(node, jsonstr)
		{
			alert(jsonstr);
		}



	</script>
		<div id="foot">
			<script type="text/javascript" src="${base}/design/js/commonactions.js"></script>
		</div>
</body>