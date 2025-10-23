import request from "@/utils/request";
import { resolveUrl } from "@/utils/resolve-url";
import { findMenuByTitle, findMenuByCode } from "@/utils/menu";

const URLs = {
  getColumnsConfigUrl: resolveUrl("button/columns-config/getInfo"),
  getColumnsConfigMultiUrl: resolveUrl("button/columns-config/getInfos"),
  getFormsConfigUrl: resolveUrl("button/columns-config/getInfo"),
  getFormsConfigMultiUrl: resolveUrl("button/columns-config/getInfos"),
  getSearchConfigUrl: resolveUrl("button/columns-config/getInfo"),
  //获取业务页面按钮
  postDetailBtnListUrl: resolveUrl("button/button-control/getWebButton"),
};

class ApiInstance {
    //获取业务页面按钮
    postDetailBtnList(menuCode, data) {
      // const menu = findMenuByTitle(title)
      const menu = findMenuByCode(menuCode);
      return request({
        method: "post",
        url: URLs.postDetailBtnListUrl,
        data: {
          ...data,
          menuId: menu?.menuId,
        },
      });
    }
  //表格配置
  getColumnsConfig(menuCode, data) {
    const menu = findMenuByCode(menuCode);
    return request({
      method: "get",
      url: URLs.getColumnsConfigUrl,
      params: {
        ...data,
        menuId: menu?.menuId,
        configType: "table",
      },
    });
  }
  getColumnsConfigMulti(menuCode, data) {
    const menu = findMenuByCode(menuCode);
    return request({
      method: "get",
      url: URLs.getColumnsConfigMultiUrl,
      params: {
        ...data,
        menuId: menu?.menuId,
        configType: "table",
      },
    });
  }
  //表单配置
  getFormsConfig(menuCode, data) {
    const menu = findMenuByCode(menuCode);
    return request({
      method: "get",
      url: URLs.getFormsConfigUrl,
      params: {
        ...data,
        menuId: menu?.menuId,
        configType: "form",
      },
    });
  }
  //表单配置
  getFormsConfigMulti(menuCode, data) {
    const menu = findMenuByCode(menuCode);
    return request({
      method: "get",
      url: URLs.getFormsConfigMultiUrl,
      params: {
        ...data,
        menuId: menu?.menuId,
        configType: "form",
      },
    });
  }
  //搜索配置
  getSearchConfig(menuCode, data) {
    const menu = findMenuByCode(menuCode);
    return request({
      method: "get",
      url: URLs.getSearchConfigUrl,
      params: {
        ...data,
        menuId: menu?.menuId,
        configType: "search",
      },
    });
  }
}

export default ApiInstance;
