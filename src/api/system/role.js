import request, { method } from "@/utils/request"

const roleApi = {
  Add: "user/insertRole",
  Del: "user/deleteRoleByRoleID",
  Edit: "user/insertRoleFunction",
  Find: "user/getRoleList"
}

/**
 * login func
 * "roleID": "",
   "roleName": "测试角色"
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: roleApi.Add,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 * "roleID"
 */
export function del(parameter) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: roleApi.Del,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: roleApi.Edit,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function find() {
  return request({
    url: roleApi.Find,
    method: "post"
  })
}

export default { add, del, edit, find }
