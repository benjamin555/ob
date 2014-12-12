package com.accenture.bj.common.tree;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.ofbiz.entity.Delegator;


/**
* @author 陈嘉镇
* @version 创建时间：2014-1-8 下午4:44:24
*/
public interface ITreeable {
	
	TreeNode getTreeRoot(String rootId,Delegator delegator,HttpServletRequest request);
	
	List<TreeNode> getChildren(String parentId,Delegator delegator,HttpServletRequest request);

}
