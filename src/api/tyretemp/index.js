/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-07 14:09:52
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-03 16:17:25
 */
import { method } from "@/utils/request"

const api = {
  Add: "tyre/insertTyreTemplate",
  Edit: "tyre/insertTyreTemplate",
  getTyreBrandList: "tyre/getTyreTemplateListByParams",
  downLoadAll: "tyre/getTyreTemplateList",
  getTyreTemplateList: "/tyre/getTyreTemplateList"
}

let url = process.env.VUE_APP_API_MANAGE_URL

/**
 * @param parameter
 * @returns {*}
 */
export function getTyreBrandList(parameter) {
  return method(
    url,
    false,
    "bigData"
  )({
    url: api.getTyreBrandList,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  return method(url)({
    url: api.Add,
    method: "post",
    data: { tyretemplateInfo: parameter }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  return method(url)({
    url: api.Edit,
    method: "post",
    data: { tyretemplateInfo: parameter }
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
    url: api.downLoadAll,
    data: params,
    method: "post",
    responseType: "blob"
  })
}

const getTyreTemplateList = parameter => {
  return method(url)({
    url: api.getTyreTemplateList,
    method: "post",
    data: parameter
  })
}

export default {
  getTyreBrandList,
  add,
  edit,
  downLoadAll,
  getTyreTemplateList
}
