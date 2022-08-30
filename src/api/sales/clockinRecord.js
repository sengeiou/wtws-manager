import { method } from "@/utils/request"
// request,

const Api = {
  getCheckInLogInfoList: "checkIn/checkInAdminLogInfoList",
  downLoadAll: "checkIn/getAdminLogInfoList"
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function getCheckInLogInfoList(params) {
  return method(process.env.VUE_APP_API_SALE_URL)({
    url: Api.getCheckInLogInfoList,
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
    process.env.VUE_APP_API_SALE_URL,
    true,
    "file"
  )({
    url: Api.downLoadAll,
    data: params,
    method: "post",
    responseType: "blob"
  })
}

export default { getCheckInLogInfoList, downLoadAll }
