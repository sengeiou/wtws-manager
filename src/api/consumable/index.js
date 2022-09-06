/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-11 14:21:36
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:18:40
 */
import {method} from "@/utils/request"

const apiV2 = {
    getTyreInfo: "consumable/info",
    downLoadAll: "consumable/ist",
    List: "consumable/list",
    getOperateList: "consumable/operate-list"
}

const url = process.env.VUE_APP_API_URL

/**
 * @param {*} parameter
 */
export function get(parameter) {
    return method(
        url,
        false
    )({
        url: apiV2.List,
        method: "post",
        data: parameter
    })
}

/**
 * @param parameter
 * @returns {*}
 */
export function downLoadAll(params) {
    return method(
        url,
        true,
        "file"
    )({
        url: apiV2.downLoadAll,
        data: params,
        method: "post",
        responseType: "blob"
    })
}

const getConsumableInfo = parameter => {
    return method(url)({
        url: apiV2.getTyreInfo,
        method: "get",
        data: parameter
    })
}

const getOperationList = parameter => {
    return method(
        url,
        false
    )({
        url: apiV2.getOperateList,
        method: "get",
        data: parameter
    })
}

export default {
    get,
    downLoadAll,
    getOperationList,
    getConsumableInfo
}
