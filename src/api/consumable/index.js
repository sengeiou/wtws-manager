/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-11 14:21:36
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:18:40
 */
import { method } from "@/utils/request"

const apiV2 = {
  getTyreInfo: "consumable/info",
  downLoadAll: "consumable/ist",
  List: "consumable/list",
  getOperateList: "consumable/operate-list"
}

const urlV2 = process.env.VUE_APP_API_MANAGE_V2_URL

/**
 * @param {*} parameter
 */
export function get(parameter) {
  return method(
    urlV2,
    false
  )({
    url: apiV2.List,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function downLoadAll(params) {
  return method(
    urlV2,
    true,
    "file"
  )({
    url: apiV2.downLoadAll,
    data: params,
    method: "post",
    responseType: "blob"
  })
}

const getConsumableInfo = parameter => {
  return method(urlV2)({
    url: apiV2.getTyreInfo,
    method: "get",
    data: parameter
  })
}

const getOperationList = parameter => {
  return method(
    urlV2,
    false
  )({
    url: apiV2.getOperateList,
    method: "get",
    data: parameter
  })
}

export default {
  get,
  downLoadAll,
  getOperationList,
  getConsumableInfo
}
