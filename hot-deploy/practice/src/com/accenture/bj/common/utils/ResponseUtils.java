package com.accenture.bj.common.utils;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilValidate;

/**
* @author 陈嘉镇
* @version 创建时间：2014-1-8 下午4:59:22
*/
@SuppressWarnings("rawtypes")
public class ResponseUtils {
	public static final String module = ResponseUtils.class.getName();

	public static void toJsonObjectList(List attrList, HttpServletResponse response) {
		String jsonStr = getJsonStr(attrList);
		doWrite(response, jsonStr);
	}

	public static String getJsonStr(List attrList) {
		StringBuilder jsonBuilder = new StringBuilder("[");
		int i = 0;
		for (Object attrMap : attrList) {
			JSONObject json = JSONObject.fromObject(attrMap);
			jsonBuilder.append(json.toString());
			if (i<attrList.size()-1) {
				jsonBuilder.append(',');
			}
			i++;
		}
		jsonBuilder.append(" ]");
		String jsonStr = jsonBuilder.toString();
		return jsonStr;
	}

	public static void toJsonObject(Object o, HttpServletResponse response) {
		String jsonStr = getJsonStr(o);
		doWrite(response, jsonStr);
	}

	public static String getJsonStr(Object o) {
		StringBuilder jsonBuilder = new StringBuilder();
		JSONObject json = JSONObject.fromObject(o);
		jsonBuilder.append(json.toString());
		String jsonStr = jsonBuilder.toString();
		return jsonStr;
	}

	public static void doWrite(HttpServletResponse response, String jsonStr) {
		if (UtilValidate.isEmpty(jsonStr)) {
			Debug.logError("JSON Object was empty; fatal error!", module);
		}
		// set the X-JSON content type
		response.setContentType("application/json");
		// jsonStr.length is not reliable for unicode characters
		try {
			response.setContentLength(jsonStr.getBytes("UTF8").length);
		} catch (UnsupportedEncodingException e) {
			Debug.logError("Problems with Json encoding", module);
		}
		// return the JSON String
		Writer out;
		try {
			out = response.getWriter();
			out.write(jsonStr);
			out.flush();
		} catch (IOException e) {
			Debug.logError("Unable to get response writer", module);
		}
	}

}
