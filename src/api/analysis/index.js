/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-31 17:01:01
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-02 15:03:55
 */
import { method } from "@/utils/request"

const Api = {
  generateMonthReport: "tyre/month-report",
  analysisVehicle: "analysis/vehicle",
  analysisEnterprise: "analysisEnterprise/analysisEnterpriseInfo",
  analysisStationInfo: "analysisStation/analysisStationInfo",
  analysisTyre: "analysis/tyre"
}

let url = process.env.VUE_APP_API_MANAGE_URL
let urlV2 = process.env.VUE_APP_API_MANAGE_V2_URL

const generateMonthReport = parameter => {
  return method(
    urlV2,
    true
  )({
    url: Api.generateMonthReport,
    method: "post",
    data: parameter,
    responseType: "blob"
  })
}
const analysisVehicle = parameter => {
  return method(
    urlV2,
    true
  )({
    url: Api.analysisVehicle,
    method: "get",
    data: parameter
  })
}
const analysisTyre = parameter => {
  return method(
    urlV2,
    true
  )({
    url: Api.analysisTyre,
    method: "get",
    data: parameter
  })
}

const analysisEnterprise = parameter => {
  return method(
    url,
    true
  )({
    url: Api.analysisEnterprise,
    method: "post",
    data: parameter
  })
}

const analysisStationInfo = parameter => {
  return method(
    url,
    true
  )({
    url: Api.analysisStationInfo,
    method: "post",
    data: parameter
  })
}

export default {
  generateMonthReport,
  analysisVehicle,
  analysisEnterprise,
  analysisStationInfo,
  analysisTyre
}
