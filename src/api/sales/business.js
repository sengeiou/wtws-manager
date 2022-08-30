// eslint-disable-next-line no-unused-vars
import request, { method } from "@/utils/request"

const Api = {
  getSCIInfoList: "user/getAdminSCIInfoList",
  Del: "/user/deleteAdminUser",
  userSCIInfo: "user/userAdminSCIInfo",
  downLoadAll: "user/getAdminSCIInfoList"
}

/**
 * @param parameter
 * @returns {*}
 */
export function getSCIInfoList(params) {
  return method(
    process.env.VUE_APP_API_SALE_URL,
    false
  )({
    url: Api.getSCIInfoList,
    data: params,
    method: "post"
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return method(
    process.env.VUE_APP_API_SALE_URL,
    false
  )({
    url: Api.Del,
    method: "post",
    data: { userIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function userSCIInfo(params) {
  return method(
    process.env.VUE_APP_API_SALE_URL,
    false
  )({
    url: Api.userSCIInfo,
    method: "post",
    data: params
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

export default { getSCIInfoList, del, userSCIInfo, downLoadAll }
