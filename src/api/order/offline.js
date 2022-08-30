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
  Get: "order/list",
  DoneOrder: "order/done",
  GetOrderDetail: "order/detail",
  PostCheckOrder: "order/checkOrder",
  GetCheckOrderZip: "order/checkOrder",
  GetStoreList: "store/list"
}

const apiV2 = {
  getOrderList: "order/list",
  GetStoreList: "store/list",
  GetOrderDetail: "order/detail"
}

let url = process.env.VUE_APP_API_MALL_URL
const urlV2 = process.env.VUE_APP_API_MANAGE_V2_URL
/**
 * @param parameter
 * @returns {*}
 */

export function get(params) {
  return method(
    urlV2,
    false
  )({
    url: apiV2.getOrderList,
    data: { ...params, orderType: 1 },
    method: "get"
  })
}

export function doneOrder(data) {
  return method(
    url,
    false
  )({
    url: Api.DoneOrder,
    data,
    method: "put"
  })
}

export function getOrderDetail(data) {
  return method(
    urlV2,
    false
  )({
    url: apiV2.GetOrderDetail,
    data: { ...data, isOffline: 1 },
    method: "get"
  })
}

export function postCheckOrder(data) {
  return method(
    url,
    false
  )({
    url: Api.PostCheckOrder,
    data,
    method: "post"
  })
}

export function getCheckOrderZip(data) {
  return method(
    url,
    false
  )({
    url: Api.GetCheckOrderZip,
    data,
    method: "get"
  })
}

export function getStoreList(data) {
  return method(
    urlV2,
    false
  )({
    url: apiV2.GetStoreList,
    data,
    method: "get"
  })
}

export default {
  get,
  doneOrder,
  getOrderDetail,
  postCheckOrder,
  getStoreList,
  getCheckOrderZip
}
