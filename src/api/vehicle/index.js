/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-11 14:21:36
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-27 18:33:49
 */
import { method } from "@/utils/request"

const api = {
  List: "vehicle/getVehicleListByParams",
  Add: "vehicle/insertVehicle",
  Edit: "vehicle/updateVehicle",
  Del: "vehicle/delVehicle",
  downLoadAll: "vehicle/getVehicleListByParams",
  getVehicleInfo: "vehicle/vehicleInfo"
}

let url = process.env.VUE_APP_API_MANAGE_URL
const urlV2 = process.env.VUE_APP_API_MANAGE_V2_URL

const apiV2 = {
  GetVehicleTyresPattern: "vehicle/tyres-pattern"
}

/**
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  return method(url)({
    url: api.Add,
    method: "post",
    data: { vehicleInfo: parameter }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  return method(url)({
    url: api.Edit,
    method: "post",
    data: { vehicleInfo: parameter }
  })
}

/**
 * @param {*} parameter
 */
export function get(parameter) {
  return method(url)({
    url: api.List,
    method: "post",
    data: { paramsInfo: parameter }
  })
}

/**
 * @param {*} parameter
 */
export function del(parameter) {
  return method(url)({
    url: api.Del,
    method: "post",
    data: { vehicleIDs: parameter }
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
    data: { paramsInfo: params },
    method: "post",
    responseType: "blob"
  })
}

const getVehicleInfo = parameter => {
  return method(url)({
    url: api.getVehicleInfo,
    method: "post",
    data: parameter
  })
}

const getVehicleTyresPattern = parameter => {
  return method(urlV2)({
    url: apiV2.GetVehicleTyresPattern,
    method: "get",
    data: parameter
  })
}

export default {
  add,
  edit,
  get,
  downLoadAll,
  getVehicleInfo,
  del,
  getVehicleTyresPattern
}
