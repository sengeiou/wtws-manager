import request, { method } from "@/utils/request"
import _ from "lodash"

const api = {
  Add: "user/insertUser",
  Del: "user/updateUserIDsDelete",
  Edit: "",
  updateUser: "user/updateUser",
  UpdateUserLoginName: "user/updateUserLoginName",
  UpdateUserRoleAndArea: "user/updateUserRoleAndArea",
  getStationList: "station/getStationList",
  Get: "user/getUserInfo",
  Reset: "user/resetPwd"
}

/**
 * @param {*} parameter
 */
export function reset(id) {
  return request({
    url: api.Reset,
    method: "post",
    data: { userID: id }
  })
}

/**
 * getrole func
 * @param parameter
 * @returns {*}
 */
export function getStationList(parameter) {
  return request({
    url: api.getStationList,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * "userID": "",
   "loginName": ""
 * @returns {*}
 */
export function updateuserloginname(parameter) {
  return request({
    url: api.UpdateUserLoginName,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * "userID": "",
   "workNo": "",
   "displayName": ""
 * @returns {*}
 */
export function updateuser(parameter) {
  return request({
    url: api.updateUser,
    method: "post",
    data: parameter
  })
}

/**
 * @param parameter
 * @returns {*}
 */
export function updateuserorleandarea(parameter) {
  return request({
    url: api.UpdateUserRoleAndArea,
    method: "post",
    data: parameter
  })
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  parameter["phoneTel"] = String(parameter.loginName)
  parameter["userRoleInfoList"] = [{ roleID: parameter.roleID }]
  parameter["userStationInfoList"] = _.map(parameter.station, it => {
    let itemArr = it.split("@")
    return {
      stationID: itemArr[0],
      stationName: itemArr[1]
    }
  })
  parameter["userLoginAuth"] = parameter["userLoginAuth1"].join(",")

  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: api.Add,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: api.Del,
    method: "post",
    data: { userIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  parameter["userRoleInfoList"] = [{ roleID: parameter.roleID }]
  parameter["userStationInfoList"] = _.map(parameter.station, it => {
    let itemArr = it.split("@")
    return {
      stationID: itemArr[0],
      stationName: itemArr[1]
    }
  })

  return request({
    url: api.Edit,
    method: "post",
    data: parameter
  })
}

export default {
  getStationList,
  add,
  del,
  edit,
  updateuserloginname,
  updateuser,
  updateuserorleandarea,
  reset
}
