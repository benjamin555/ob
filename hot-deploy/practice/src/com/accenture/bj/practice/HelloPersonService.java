package com.accenture.bj.practice;

import java.util.List;
import java.util.Map;

import org.apache.commons.lang.StringUtils;
import org.ofbiz.base.util.Debug;
import org.ofbiz.base.util.UtilMisc;
import org.ofbiz.entity.Delegator;
import org.ofbiz.entity.GenericEntityException;
import org.ofbiz.entity.GenericValue;
import org.ofbiz.service.DispatchContext;
import org.ofbiz.service.ServiceUtil;

/**
* @author 陈嘉镇
* @version 创建时间：2014-2-26 下午4:09:53
*/
@SuppressWarnings({ "rawtypes", "unchecked" })
public class HelloPersonService {
	private static final String module = HelloPersonService.class.toString();

	public static Map create(DispatchContext dctx, Map context) {
		String firstName = (String) context.get("firstName");
		String lastName = (String) context.get("lastName");
		String middleName = (String) context.get("middleName");
		Map personMap = UtilMisc.toMap("firstName", firstName, "middleName", middleName, "lastName", lastName);
		Delegator delegator = dctx.getDelegator();
		String id = delegator.getNextSeqId("HelloPerson");
		personMap.put("id", id);
		GenericValue g = delegator.makeValue("HelloPerson", personMap);
		try {
			delegator.create(g);
		} catch (GenericEntityException e) {
			e.printStackTrace();
			Debug.logError(e, module);
		}

		Map resultMap = ServiceUtil
				.returnSuccess("You have called on service 'HelloPersonService.create' successfully!");
		return resultMap;
	}

	public static Map update(DispatchContext dctx, Map context) {
		String firstName = (String) context.get("firstName");
		String lastName = (String) context.get("lastName");
		String middleName = (String) context.get("middleName");
		String id = (String) context.get("id");

		Delegator delegator = dctx.getDelegator();

		Map personValues = UtilMisc.toMap("id", id);
		try {
			GenericValue g = delegator.findByPrimaryKey("HelloPerson", personValues);
			Map updateMap = UtilMisc.toMap("firstName", firstName, "middleName", middleName, "lastName", lastName);
			g.putAll(updateMap);
			delegator.store(g);
		} catch (GenericEntityException e) {
			e.printStackTrace();
		}

		Map resultMap = ServiceUtil
				.returnSuccess("You have called on service 'HelloPersonService.update' successfully!");
		return resultMap;
	}

	public static Map del(DispatchContext dctx, Map context) {
		String id = (String) context.get("id");

		Delegator delegator = dctx.getDelegator();

		Map personValues = UtilMisc.toMap("id", id);
		try {
			GenericValue g = delegator.findByPrimaryKey("HelloPerson", personValues);
			delegator.removeValue(g);
		} catch (GenericEntityException e) {
			e.printStackTrace();
		}

		Map resultMap = ServiceUtil.returnSuccess("You have called on service 'HelloPersonService.del' successfully!");
		return resultMap;
	}

	public static Map list(DispatchContext dctx, Map context) {
		String firstName = (String) context.get("firstName");
		String lastName = (String) context.get("lastName");
		String middleName = (String) context.get("middleName");

		Delegator delegator = dctx.getDelegator();

		Map personValues = UtilMisc.toMap();
		if (StringUtils.isNotBlank(firstName)) {
			personValues.put("firstName", firstName);
		}
		if (StringUtils.isNotBlank(lastName)) {
			personValues.put("lastName", lastName);
		}
		if (StringUtils.isNotBlank(middleName)) {
			personValues.put("middleName", middleName);
		}
		List<GenericValue> gs = null;
		try {
			 gs = delegator.findByAnd("HelloPerson", personValues);
			Debug.logInfo(gs.toString(), module);
		} catch (GenericEntityException e) {
			e.printStackTrace();
		}
		Map resultMap = ServiceUtil.returnSuccess("You have called on service 'HelloPersonService.list' successfully!");
		resultMap.put("persons", gs);
		return resultMap;
	}
	
	
	public static Map detail(DispatchContext dctx, Map context) {
		String id = (String) context.get("id");

		Delegator delegator = dctx.getDelegator();

		Map personValues = UtilMisc.toMap("id", id);
		GenericValue g = null;
		List<GenericValue>  ls = null;
		try {
			 g = delegator.findByPrimaryKey("HelloPerson", personValues);
			 ls = g.getRelated("HelloContact");
		} catch (GenericEntityException e) {
			e.printStackTrace();
		}
		Map resultMap = ServiceUtil.returnSuccess("You have called on service 'HelloPersonService.detail' successfully!");
		resultMap.put("helloPerson", g);
		resultMap.put("helloContacts", ls);
		return resultMap;
	}
}
