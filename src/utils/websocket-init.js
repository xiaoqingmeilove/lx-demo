import showNotice from "@/utils/message-notice";

export default function webSocketInit(that, window) {
  const WS_HOST =
    process.env.NODE_ENV === "development"
      ? `192.168.3.118:8096`
      : `${location.hostname}:${location.port}`;
  if ("WebSocket" in window) {
    let token = JSON.parse(localStorage.getItem("token"))?.value;

    if (that.webSocket == null) {
      that.webSocket = new WebSocket(
        `ws://${WS_HOST}/api/message-center/ws/useMsg`,
        [token]
      );
    } else {
      console.log("您已进入WebSocket...");
    }
    that.webSocket.onopen = () => {
      console.log("WebSocket已经连接");
    };
    that.webSocket.onmessage = (evt) => {
      // console.log(evt,'获取WebSocket内容')
      let msgInfo = JSON.parse(evt.data);
      let content = msgInfo?.content ? JSON.parse(msgInfo?.content) : "";
    //   && !localStorage.getItem("rnable_reminder") === "false"

      (msgInfo.applicationName && !(localStorage.getItem("rnable_reminder") === "false"))
        ? showNotice(that, {
            name: msgInfo.applicationName,
            func: msgInfo.funcEvent,
            date: msgInfo.createTime || "",
            detail: content?.url || "",
          })
        : "";
    };
    that.webSocket.onclose = () => {
      console.log("连接已关闭...");
      that.webSocket = null;
      that.webSocketCount = null;
      JSON.parse(localStorage.getItem("token"))?.value
        ? webSocketInit(that, window)
        : "";
    };

    if (that.webSocketCount == null) {
      that.webSocketCount = new WebSocket(
        `ws://${WS_HOST}/api/message-center/ws/unRead`,
        [token]
      );
    } else {
      console.log("您已进入WebSocket...");
    }
    that.webSocketCount.onopen = () => {
      console.log("WebSocket已经连接");
    };
    that.webSocketCount.onmessage = (evt) => {
      // console.log(evt,'获取WebSocket内容')
      that.$store._mutations["Message/updateUnread"][0](evt.data - 0);
    };
    that.webSocketCount.onclose = () => {
      console.log("连接已关闭...");
      that.webSocket = null;
      that.webSocketCount = null;
      JSON.parse(localStorage.getItem("token"))?.value
        ? webSocketInit(that, window)
        : "";
    };
  } else {
    alert("您的浏览器不支持 WebSocket!");
  }
}
