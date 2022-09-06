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
  Get: "finance/getFinanceList",
  Update: "finance/batchTyrePrice",
  downLoadAll: "finance/getFinanceList"
}

let url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */
export function get(params) {
  return method(
    url,
    false
  )({
    url: Api.Get,
    data: params,
    method: "post"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function update(params) {
  return method(url)({
    url: Api.Update,
    data: params,
    method: "post"
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function downLoadAll(params) {
  return method(
    url,
    true,
    "file"
  )({
    url: Api.downLoadAll,
    data: params,
    method: "post",
    responseType: "blob"
  })
}

export default { get, downLoadAll, update }
