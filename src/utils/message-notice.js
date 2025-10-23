import { Notification } from "element-ui";
import router from "@/router";
import moment from "moment";

import $store from "@/store";

function changeNotice(el, num) {
  el.close();
  console.log(num, "延期接口调用");
}

export default function showNotice(instance, noticeObj) {
  const dict = $store.state.Common.dict;
  const duration =
    (dict["sys_config"] ?? []).find((x) => x.dictValue == "messageStayTime")
      ?.dictLabel ?? 5000;
  const h = instance.$createElement;
  let notice = Notification({
    // title: '消息提示',
    dangerouslyUseHTMLString: true,
    duration: Number(duration) ?? 5000,
    offset: 55,
    position: "bottom-right",
    message: h("div", null, [
      h("div", { style: "font-size:18px" }, [
        h(
          "i",
          {
            class: "el-icon-s-claim",
            style: "color:var(--base-color);font-size:20px",
          },
          []
        ),
        h("span", { style: "margin-left:1px" }, "待办：" + noticeObj.func),
      ]),
      h(
        "div",
        {
          style:
            "font-weight:bold;font-size:18px;display:flex;height:40px;line-height:40px",
        },
        [
          h(
            "div",
            {
              style:
                "border-right:2px solid rgb(220,220,220);width:2px;height:18px;margin:10px 3px 0 3px",
            },
            ""
          ),
          h("span", null, noticeObj.name),
        ]
      ),
      h("div", null, [
        h("i", { class: "el-icon-time" }, []),
        h(
          "span",
          null,
          " " + moment(noticeObj.date).format("YYYY-MM-DD HH:mm:ss")
        ),
      ]),
      h(
        "div",
        {
          style:
            "margin-top:12px;width:100%;display: flex;align-content: center;justify-content: space-between;",
        },
        [
          h("el-dropdown", null, [
            h("span", { class: "el-dropdown-link" }, [
              h("span", null, "稍后提醒"),
              h("i", { class: "el-icon-arrow-down el-icon--right" }),
            ]),
            h("el-dropdown-menu", { slot: "dropdown" }, [
              h("el-dropdown-item", null, [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        changeNotice(notice, "0");
                      },
                    },
                  },
                  "延期15分钟"
                ),
              ]),
              h("el-dropdown-item", null, [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        changeNotice(notice, "1");
                      },
                    },
                  },
                  "延期30分钟"
                ),
              ]),
              h("el-dropdown-item", null, [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        changeNotice(notice, "2");
                      },
                    },
                  },
                  "延期1小时"
                ),
              ]),
              h("el-dropdown-item", null, [
                h(
                  "span",
                  {
                    on: {
                      click: () => {
                        changeNotice(notice, "3");
                      },
                    },
                  },
                  "不再显示"
                ),
              ]),
            ]),
          ]),
          h(
            "el-button",
            {
              style:
                "padding:5px 10px;color:white;background:var(--base-color);border:0;border-radius:3px",
              on: {
                click: () => {
                  router.push(noticeObj.detail);
                },
              },
            },
            "查看详情"
          ),
        ]
      ),
    ]),
  });
}
