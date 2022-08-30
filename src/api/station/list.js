import request from "@/utils/request"

const api = {
  Add: "station/insertStation",
  Del: "station/updateStationIDsDelete",
  Edit: "station/updateStation",
  getStationList: "station/getStationList"
}

/**
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
 * @returns {*}
 */
export function add(parameter) {
  return request({
    url: api.Add,
    method: "post",
    data: parameter
  })
}

/**
 * @param {*} parameter
 */
export function del(ids) {
  return request({
    url: api.Del,
    method: "post",
    data: { stationIDs: ids }
  })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
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
  edit
}
