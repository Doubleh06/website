package cn.vtyc.website.controller.frontApi;


import cn.vtyc.website.controller.BaseController;
import cn.vtyc.website.core.JSONResult;
import cn.vtyc.website.core.Result;
import cn.vtyc.website.dao.front.home.*;
import cn.vtyc.website.entity.front.Home;
import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping(value = "/frontApi")
public class HomePageController extends BaseController {

    @Autowired
    private HomeCarouselDao homeCarouselDao;
    @Autowired
    private HomeGalleryDao homeGalleryDao;
    @Autowired
    private HomeClientDao homeClientDao;
    @Autowired
    private HomeBoxDao homeBoxDao;
    @Autowired
    private HomeIntroduceDao homeIntroduceDao;


    @RequestMapping(value = "/home")
    @ResponseBody
    public Result home(@RequestBody JSONObject jsonObject) {
        String locales = jsonObject.getString("locales");
        Home home = new Home();
        home.setHomeCarousel(homeCarouselDao.selectAll());
        home.setHomeGallery(homeGalleryDao.getHomeGalleryByLocales(locales));
        home.setHomeClient(homeClientDao.getHomeClientByLocales(locales));
        home.setHomeIntroduce(homeIntroduceDao.getHomeIntroduceByLocales(locales).get(0));
        home.setHomeBox(homeBoxDao.getHomeBoxByLocales(locales));
        return new JSONResult(home);
    }

}
