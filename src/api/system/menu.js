import request from "@/utils/request"

const menuApi = {
  GetRole: "/user/getRoleFunctionByRoleID",
  ListRole: "/user/getRoleList"
}

/**
 * getrole func
 * requirerole_id 填写的话是角色的权限列表 没填写是全部的权限列表
 * @param parameter
 * @returns {*}
 */
export function getrole(role_id = "") {
  let parameter = {
    roleID: role_id
  }
  return request({
    url: menuApi.GetRole,
    method: "post",
    data: parameter
  })
}

export function listRole() {
  return request({
    url: menuApi.ListRole,
    method: "post"
  })
}

export default {
  getrole,
  listRole
}
