package cn.vtyc.website.controller.system;

import cn.vtyc.website.controller.BaseController;
import cn.vtyc.website.util.SpringSecurityUtil;
import com.alibaba.fastjson.JSONArray;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author fonlin
 * @date 2018/5/18
 */
@Controller
public class HomeController extends BaseController {

    @RequestMapping("/main")
    public String grid(Model model) {
        model.addAttribute("menus", getMenus("main"));
        JSONArray jsonArray = new JSONArray();
        jsonArray.addAll(SpringSecurityUtil.getUser().getResourcesList());
        model.addAttribute("permissions", jsonArray.toString());
        return "main";
    }

}
