/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-29 21:43:37
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-30 21:44:23
 */
import { method } from "@/utils/request"

const Api = {
  batchAddVehicleExcel: "vehicle/batchAddVehicleExcel",
  batchAddVehicle: "vehicle/batchAddVehicle"
}

let url = process.env.VUE_APP_API_MANAGE_URL

const batchAddVehicleExcel = parameter => {
  return method(
    url,
    true,
    "json",
    "form"
  )({
    url: Api.batchAddVehicleExcel,
    method: "post",
    data: parameter
  })
}

const batchAddVehicle = parameter => {
  return method(
    url,
    false
  )({
    url: Api.batchAddVehicle,
    method: "post",
    data: { dataList: parameter }
  })
}

export default {
  batchAddVehicleExcel,
  batchAddVehicle
}
