package com.accenture.bj.common.utils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javolution.util.FastMap;
import net.sf.json.JSONArray;

import com.accenture.bj.common.tree.TreeNode;

/**
* @author 陈嘉镇
* @version 创建时间：2014-1-8 下午4:59:22
*/
@SuppressWarnings("rawtypes")
public class JQueryJsTreeUtils {
	public static final String module = JQueryJsTreeUtils.class.getName();

	@SuppressWarnings("unchecked")
	public static String getJsonStr(List<TreeNode> noteList) {
		List jList = new ArrayList();
		for (TreeNode treeNode : noteList) {
			Map jsonMap = FastMap.newInstance();
			Map dataMap = FastMap.newInstance();
			Map attrMap = FastMap.newInstance();
			dataMap.put("title", treeNode.getTitle());
			attrMap.put("id", treeNode.getId());
			jsonMap.put("data", dataMap);
			jsonMap.put("attr", attrMap);
			if (!treeNode.isLeaf()) {
				jsonMap.put("state", "closed");
			}
			jList.add(jsonMap);
		}
		return JSONArray.fromObject(jList).toString();
	}
	
	public static String getJsonStr(TreeNode n) {
		List<TreeNode> noteList = new ArrayList<TreeNode>();
		noteList.add(n);
		String json =JQueryJsTreeUtils.getJsonStr(noteList);
		return json;
	}

}
