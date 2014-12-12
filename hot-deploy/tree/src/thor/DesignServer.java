package thor;

import java.io.IOException;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.thor.webapi.WebEntry;
import org.thor.webapi.WebModule;

@WebModule(path="/design/api")
public class DesignServer {	

	
	@WebEntry(method="GET", name="listProdCategory")
	public void listProdCategory(HttpServletRequest req,HttpServletResponse rep){
		try {
			RequestDispatcher requestDispatcher = req.getRequestDispatcher("../product/prodCategory1.ftl");
			System.out.println(this+","+requestDispatcher.toString());
			String path = req.getContextPath();
			String basePath = req.getScheme()+"://"+req.getServerName()+":"+req.getServerPort()+path;
			req.setAttribute("base", basePath );
			requestDispatcher.forward(req,rep);
		} catch (ServletException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
}
