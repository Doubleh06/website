package cn.vtyc.website.controller.system;


import cn.vtyc.website.controller.BaseController;
import cn.vtyc.website.core.BusinessException;
import cn.vtyc.website.core.ErrorCode;
import cn.vtyc.website.core.JSONResult;
import cn.vtyc.website.core.Result;
import cn.vtyc.website.core.jqGrid.JqGridResult;
import cn.vtyc.website.dto.DtoTransfer;
import cn.vtyc.website.dto.UserDto;
import cn.vtyc.website.dto.UserJqGridParam;
import cn.vtyc.website.dto.UserRoleDto;
import cn.vtyc.website.entity.Role;
import cn.vtyc.website.entity.User;
import cn.vtyc.website.entity.security.Constants;
import cn.vtyc.website.service.RoleService;
import cn.vtyc.website.service.UserService;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.github.pagehelper.PageInfo;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * @author fonlin
 * @date 2018/4/23
 */
@Controller
@RequestMapping("/user")
public class UserController extends BaseController {

    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;



//    @PreAuthorize("hasRole('user')")
    @RequestMapping("/list")
    public String list(Model model) {
        model.addAttribute("menus", getMenus("user"));
        return "/system/user/list";
    }

    @RequestMapping("/grid")
    @ResponseBody
    public Result grid(UserJqGridParam param) {
        PageInfo<Map> pageInfo =  userService.selectUserByPage(param);

        JqGridResult<Map> result = new JqGridResult<>();
        //当前页
        result.setPage(pageInfo.getPageNum());
        //数据总数
        result.setRecords(pageInfo.getTotal());
        //总页数
        result.setTotal(pageInfo.getPages());
        //当前页数据
        result.setRows(pageInfo.getList());
        return new JSONResult(result);
    }

    @RequestMapping("/insert")
    @ResponseBody
    public Result insert(@Valid @RequestBody UserDto dto) {
        if (userService.select("username", dto.getUsername()) != null) {
            throw new BusinessException(ErrorCode.USER_ALREADY_REG);
        }
        User user = DtoTransfer.userDto2Entity(dto);
        user.setPassword(new BCryptPasswordEncoder().encode(Constants.DEFAULT_PASSWORD));
        user.setEnable(true);
        userService.insert(user);

        return OK;
    }

    @RequestMapping("/delete")
    @ResponseBody
    public Result delete(@RequestParam Integer id) {
        userService.deleteUser(id);
        return OK;
    }

    @RequestMapping("/get")
    @ResponseBody
    public Result get(@RequestParam Integer id) {
        return new JSONResult(userService.select(id));
    }

    @RequestMapping("/getJoinUserCompany")
    @ResponseBody
    public Result getJoinUserCompany(@RequestParam Integer id) {
        return new JSONResult(userService.getJoinUserCompany(id));
    }

    @RequestMapping("/update")
    @ResponseBody
    public Result update(@Valid @RequestBody UserDto dto) {
        User user = DtoTransfer.userDto2Entity(dto);
        userService.updateSelective(user);
        return OK;
    }


    @RequestMapping("/role")
    @ResponseBody
    public Result role(@RequestParam Integer userId) {
        List<Role> all = roleService.selectAll();
        List<Role> selected = roleService.selectAllByUser(userId);
        JSONArray jsonArray = new JSONArray();
        for (Role role : all) {
            JSONObject jsonObject = new JSONObject();
            jsonObject.put("id", role.getId());
            jsonObject.put("name", role.getName());
            jsonObject.put("selected", selected.contains(role));
            jsonArray.add(jsonObject);
        }
        return new JSONResult(jsonArray);
    }

    @RequestMapping("/role/save")
    @ResponseBody
    public Result saveRole(@Valid @RequestBody UserRoleDto userRoleDto) {
        userService.saveRoles(userRoleDto.getUserId(), userRoleDto.getRoleIds());
        return OK;
    }
}
