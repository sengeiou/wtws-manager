import request, { method } from "@/utils/request"

const userApi = {
  Login: "/user/manegeSystemLogin",
  Logout: "/user/outLogin",
  UserInfo: "/user/getUserInfo",
  UpdateWD: "/user/updatePwd"
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function login(parameter) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: userApi.Login,
    method: "post",
    data: parameter
  })
}

/**
 * 获取用户信息
 * @param {*} parameter
 */
export function getInfo(parameter) {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: userApi.UserInfo,
    method: "post",
    data: parameter
  })
}

/**
 * 修改密码
 * @param {*} parameter
 */
export function updatepwd(parameter) {
  return request({
    url: userApi.UpdateWD,
    method: "post",
    data: parameter
  })
}

/**
 * 退出
 * @param {*} parameter
 */
export function logout() {
  return method(
    process.env.VUE_APP_API_BASE_URL,
    false
  )({
    url: userApi.Logout,
    method: "post",
    headers: {
      "Content-Type": "application/json;charset=UTF-8"
    }
  })
}
