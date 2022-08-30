import message from "ant-design-vue/es/message"
import themeColor from "./themeColor.js"

const colorList = [
  {
    key: "薄暮",
    color: "#F5222D"
  },
  {
    key: "火山",
    color: "#FA541C"
  },
  {
    key: "日暮",
    color: "#FAAD14"
  },
  {
    key: "明青",
    color: "#13C2C2"
  },
  {
    key: "极光绿",
    color: "#52C41A"
  },
  {
    key: "拂晓蓝（默认）",
    color: "#1890FF"
  },
  {
    key: "极客蓝",
    color: "#2F54EB"
  },
  {
    key: "酱紫",
    color: "#722ED1"
  }
]

const updateTheme = newPrimaryColor => {
  const hideMessage = message.loading("正在切换主题！", 0)
  themeColor.changeColor(newPrimaryColor).finally(() => {
    setTimeout(() => {
      hideMessage()
    }, 10)
  })
}

const PageSetting = {
  headerHeight: 64, // Header高度
  collapsedWidth: 80, // Slider折叠后宽度
  sliderWidth: 200, // Slider展开后宽度
  primaryColor: "#1890FF", // 默认主题色
  pageStyle: "dark", // 页面风格
  NavigationMode: "fixed" // Header、Slider Fixed
}

const orderConfig = Object.freeze({
  ORDER_STATUS: {
    0: "未支付",
    1: "已取消",
    2: "已支付",
    3: "部分安装",
    5: "已完成"
  },
  PAY_STATUS: {
    0: "未支付",
    2: "已支付"
  },
  PAYMENT_METHOD: {
    0: "对公转账",
    1: "微信",
    2: "支付宝"
  }
})

export { updateTheme, colorList, PageSetting, orderConfig }
