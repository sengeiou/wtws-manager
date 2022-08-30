/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-31 17:01:01
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-31 17:05:05
 */
import { method } from "@/utils/request"

const Api = {
  batchAddTyreExcel: "tyre/batch-add-tyre-excel",
  batchAddTyre: "tyre/batch-add-tyre"
}

// let url = process.env.VUE_APP_API_MANAGE_URL
const urlV2 = process.env.VUE_APP_API_MANAGE_V2_URL

const batchAddTyreExcel = parameter => {
  return method(
    urlV2,
    true,
    "json",
    "form"
  )({
    url: Api.batchAddTyreExcel,
    method: "post",
    data: parameter
  })
}

const batchAddTyre = parameter => {
  return method(
    urlV2,
    false
  )({
    url: Api.batchAddTyre,
    method: "post",
    data: { dataList: parameter }
  })
}

export default {
  batchAddTyreExcel,
  batchAddTyre
}
