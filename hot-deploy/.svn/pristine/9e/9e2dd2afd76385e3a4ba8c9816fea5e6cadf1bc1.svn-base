package thor;

import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.thor.webapi.WebEntry;
import org.thor.webapi.WebModule;

@WebModule(path = "/api")
public class Server {

	@WebEntry(method = "GET", name = "data")
	public ArrayList<Object> queryData(HttpServletRequest req) {
		String level = req.getParameter("level");
		if (level == null)
			level = "1";
		ArrayList<Object> result = new ArrayList<Object>(10);
		for (int i = 0; i < 10; i++) {
			ArrayList<Object> row = new ArrayList<Object>(6);
			row.add(Integer.parseInt(level));
			for (int j = 0; j < 5; j++) {
				row.add("Column " + j);
			}
			result.add(row);
		}
		return result;
	}

	@WebEntry(method = "GET", name = "listProdCategory")
	public void listProdCategory(HttpServletRequest req, HttpServletResponse rep) {
		String path = req.getContextPath();
		String basePath = req.getScheme() + "://" + req.getServerName() + ":" + req.getServerPort() + path;
		req.setAttribute("base", basePath);
		try {
//			RequestDispatcher requestDispatcher = req.getRequestDispatcher("../index.ftl");
			RequestDispatcher requestDispatcher = req.getRequestDispatcher("../design/product/prodCategory1.ftl");
			System.out.println(this + "," + requestDispatcher.toString());
			requestDispatcher.forward(req, rep);
		} catch (IOException e) {
			e.printStackTrace();
		} catch (ServletException e) {
			e.printStackTrace();
		}
	}
}
