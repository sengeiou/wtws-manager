/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2021-01-19 19:46:09
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-19 22:18:44
 */
// eslint-disable-next-line no-unused-vars
import { method } from "@/utils/request"

const Api = {
  Get: "operation/list",
  GetOperateTypeList: "dictionary",
  getUserByStationIds: "user/stationIds",
  getOperateDetail: "operation/detail",
}

let url = process.env.VUE_APP_API_MANAGE_V2_URL

export function get(params) {
  return method(
    url,
    false
  )({
    url: Api.Get,
    data: params,
    method: "get"
  })
}

export function getOperateTypeList(data) {
  return method(
    url,
    false
  )({
    url: Api.GetOperateTypeList,
    data,
    method: "get"
  })
}

export function getUserByStationIds(data) {
  return method(
    url,
    false
  )({
    url: Api.getUserByStationIds,
    data,
    method: "post"
  })
}

export function getOperateDetail(data) {
  return method(
    url,
    false
  )({
    url: Api.getOperateDetail,
    data,
    method: "get"
  })
}

export function downLoadAll(params) {
  return method(
      url,
      true,
      "file"
  )({
    url: Api.Get,
    data: params,
    method: "get",
    responseType: "blob"
  })
}

export default {
  getOperateTypeList,
  getUserByStationIds,
  getOperateDetail,
  downLoadAll
}
