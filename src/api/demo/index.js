import request from "@/utils/request"

const demoApi = {
  Add: "xxxx",
  Del: "xxxx",
  Edit: "xxxx"
}

/**
 * login func
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
  return request({
    url: demoApi.Add,
    method: "get",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function del(parameter) {
  return request({
    url: demoApi.Del,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function edit() {
  return request({
    url: demoApi.Edit,
    method: "post"
  })
}

export default { add, del, edit }
