package com.accenture.bj.common.tree;
/**
* @author 陈嘉镇
* @version 创建时间：2014-1-8 下午4:51:27
*/
public class TreeNode {
	
	private String title;
	
	private String id;
	
	private boolean isLeaf;

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public boolean isLeaf() {
		return isLeaf;
	}

	public void setLeaf(boolean isLeaf) {
		this.isLeaf = isLeaf;
	}

	@Override
	public String toString() {
		return "TreeNode [title=" + title + ", id=" + id + ", isLeaf=" + isLeaf + "]";
	}
	
	

}
