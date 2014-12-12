<script src="/images/jquery/jquery-1.7.min.js" type="text/javascript"></script>
<script src="/images/jquery/plugins/jsTree/jquery.jstree.js" type="text/javascript"></script>
<script src="/images/jquery/ui/development-bundle/external/jquery.cookie.js" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" media="all" href="/images/jquery/plugins/jsTree/themes/default/style.css">
<script type="text/javascript">
jQuery(window).load(createTree());
 <#-- create Tree-->
  function createTree() {
    jQuery(function () {
		var rawdata = ${Request["rootJson"]};
        jQuery("#tree").jstree({
       		 "plugins" : [ "themes", "json_data","ui" ,"cookies", "types"],
       		  "json_data" : {
	                "data" : rawdata,
	                  "ajax" : { "url" : "<@ofbizUrl>treeChildren</@ofbizUrl>", "type" : "POST",
	                          "data" : function (n) {
	                            return { 
	                                "nodeId" : n.attr("id")
	                                ,"treeKey": "Category"
	                        	}; 
	           		 }
              }
            
            },
            "types" : {
             "valid_children" : [ "root" ],
             "types" : {
                 "CATEGORY" : {
                     "icon" : { 
                         "image" : "/images/jquery/plugins/jsTree/themes/apple/d.png",
                         "position" : "10px40px"
                     }
                 }
             }
         }
        });
    });
    
    
  }
</script>
<div id="tree"></div>
