package com.accenture.bj.common.tree;

import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.ofbiz.base.util.Debug;
import org.ofbiz.entity.Delegator;
import org.ofbiz.service.ModelService;

import com.accenture.bj.common.utils.JQueryJsTreeUtils;
import com.accenture.bj.common.utils.ResponseUtils;

/**
* @author 陈嘉镇
* @version 创建时间：2014-1-10 上午11:53:26
*/
public  class CommonTreeServices  {
	
	private static final String module = CommonTreeServices.class.toString();
	static Delegator delegator ;

	public static String getTreeRoot(HttpServletRequest request, HttpServletResponse response) {
		String nodeId = request.getParameter("nodeId");
		String treeKey = request.getParameter("treeKey");
		delegator = (Delegator) request.getAttribute("delegator");
		Debug.logInfo("nodeId:" + nodeId, module);
		TreeNode n = getTreeableInstance(treeKey).getTreeRoot(nodeId,delegator,request);
		String json = JQueryJsTreeUtils.getJsonStr(n);
		Debug.logInfo("json:" + json, module);
		request.setAttribute("rootJson", json);
        return ModelService.RESPOND_SUCCESS;
	}



	private static ITreeable getTreeableInstance(String treeKey) {
		ITreeable t = TreeableFactory.get(treeKey);
		return  t;
	}

	

	public static void getTreeChildren(HttpServletRequest request, HttpServletResponse response) {
		String nodeId = request.getParameter("nodeId");
		String treeKey = request.getParameter("treeKey");
		 delegator = (Delegator) request.getAttribute("delegator");
		List<TreeNode> n = getTreeableInstance(treeKey).getChildren(nodeId,delegator,request);
		Debug.logInfo("TreeNode list:" + n, module);
		String jsonStr = JQueryJsTreeUtils.getJsonStr(n);
		Debug.logInfo("json:" + jsonStr, module);
		ResponseUtils.doWrite(response, jsonStr);
	}


	

}
