/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-07 13:27:45
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-14 22:32:09
 */
import { method } from "@/utils/request"
// request,

const Api = {
  downLoadAll: "user/getXsUserListInfo",
  getXsUserListInfo: "user/getXsUserListInfo"
}

const get = parameter => {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    true
  )({
    url: Api.getXsUserListInfo,
    data: parameter,
    method: "post"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function downLoadAll(params) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    true,
    "file"
  )({
    url: Api.downLoadAll,
    data: params,
    method: "post",
    responseType: "blob"
  })
}

export default { downLoadAll, get }
