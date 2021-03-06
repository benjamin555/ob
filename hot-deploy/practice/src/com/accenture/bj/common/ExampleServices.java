package com.accenture.bj.common;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.base.util.UtilValidate;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.entity.util.EntityUtil;
import org.ofbiz.product.category.CategoryContentWrapper;

import com.accenture.bj.common.tree.ITreeable;
import com.accenture.bj.common.tree.TreeNode;

/**
* @author 陈嘉镇
* @version 创建时间：2014-1-8 下午4:43:19
*/
public class ExampleServices  implements ITreeable {

	private String entityName = "ProductCategory";
	private String primaryKeyName = "productCategoryId";


//	public static String getCategoryTreeRoot(HttpServletRequest request, HttpServletResponse response) {
//		String nodeId = request.getParameter("nodeId");
//		delegator = ((Delegator) request.getAttribute("delegator"));
//		ExampleServices.request = request;
//		Debug.logInfo("nodeId:" + nodeId, module);
//		TreeNode n = instance.getTreeRoot(nodeId,delegator,request);
//		String json = JQueryJsTreeUtils.getJsonStr(n);
//		Debug.logInfo("json:" + json, module);
//		request.setAttribute("rootJson", json);
////		ResponseUtils.toJsonObject(n, response);
//        return ModelService.RESPOND_SUCCESS;
//	}
//
//	
//
//	public static void getCategoryTreeChildren(HttpServletRequest request, HttpServletResponse response) {
//		String nodeId = request.getParameter("nodeId");
//		delegator = ((Delegator) request.getAttribute("delegator"));
//		ExampleServices.request = request;
//		List<TreeNode> n = instance.getChildren(nodeId,delegator,request);
//		Debug.logInfo("TreeNode list:" + n, module);
//		String jsonStr = JQueryJsTreeUtils.getJsonStr(n);
//		Debug.logInfo("json:" + jsonStr, module);
//		ResponseUtils.doWrite(response, jsonStr);
//	}

	@Override
	public TreeNode getTreeRoot(String rootId,Delegator delegator,HttpServletRequest request) {
		TreeNode node = new TreeNode();

		try {
			GenericValue category = delegator.findByPrimaryKey(entityName, UtilMisc.toMap(primaryKeyName, rootId));
			String catId = (String) category.get("productCategoryId");
			node.setId(catId);
			CategoryContentWrapper categoryContentWrapper = new CategoryContentWrapper(category, request);
			String title = categoryContentWrapper.get("CATEGORY_NAME") + " " + "[" + catId + "]";
			;
			
			node.setTitle(title);
			
			// Get the child list of chosen category
			List<GenericValue> childList = EntityUtil.filterByDate(delegator.findByAnd("ProductCategoryRollup", UtilMisc.toMap(
                        "parentProductCategoryId", catId)));
            if (UtilValidate.isEmpty(childList)) {
            	node.setLeaf(true);
            }
			
		} catch (GenericEntityException e) {
			e.printStackTrace();
		}

		return node;
	}

	@Override
	public List<TreeNode> getChildren(String parentId,Delegator delegator,HttpServletRequest request) {
		List<TreeNode> l = new ArrayList<TreeNode>();
		try {
			List<GenericValue> childOfCats = 
			EntityUtil.filterByDate(delegator.findByAnd("ProductCategoryRollup", UtilMisc.toMap(
                    "parentProductCategoryId", parentId)));

			for (GenericValue childOfCat : childOfCats) {
				TreeNode e = new TreeNode();
				String catId = childOfCat.get("productCategoryId").toString();
				e.setId(catId);
				CategoryContentWrapper categoryContentWrapper = new CategoryContentWrapper(childOfCat, request);
				String title  = categoryContentWrapper.get("CATEGORY_NAME")+" "+"["+catId+"]";
				e.setTitle(title);
				
				// Get the child list of chosen category
				List<GenericValue> childList = EntityUtil.filterByDate(delegator.findByAnd("ProductCategoryRollup", UtilMisc.toMap(
	                        "parentProductCategoryId", catId)));
	            if (UtilValidate.isEmpty(childList)) {
	            	e.setLeaf(true);
	            }
				
				l.add(e );
			}
		} catch (GenericEntityException e) {
			e.printStackTrace();
		}

		return l;
	}

}
