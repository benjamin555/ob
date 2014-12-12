package com.accenture.bj.common.tree;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Set;

import org.ofbiz.base.util.Debug;
import org.springframework.util.Assert;

/**
* @author 陈嘉镇
* @version 创建时间：2014-1-10 下午2:13:09
*/
public class TreeableFactory {
	
	private static String DEFALT_CONFIG_FILEPATH = "hot-deploy/practice/resources/tree.properties";
	
	private static Map<String, ITreeable> map ;
	
	static{
		Properties prop= new Properties();
		try {
			InputStream is = new FileInputStream(DEFALT_CONFIG_FILEPATH);  
			prop.load(is);
			if( is != null) 
				is.close();
			Set<Object> keys = prop.keySet();
			map = new HashMap<String, ITreeable>();
			for (Object key : keys) {
				String className = prop.getProperty(key.toString());
				ITreeable treeable = (ITreeable) Class.forName(className).newInstance();
				map.put(key.toString(), treeable);
			}
		}
		catch(Exception e) {
			Debug.logError(e, TreeableFactory.class.toString());
		}
//		map.put("Category", new ExampleServices());
		
	}

	public static ITreeable get(String treeKey) {
		ITreeable treeable = map.get(treeKey);
		Assert.notNull(treeable,"根据该key,无法获取服务对象。"+treeKey);
		return treeable;
	}

}
