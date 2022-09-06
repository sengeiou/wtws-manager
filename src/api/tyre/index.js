/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-11 14:21:36
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:18:40
 */
import {method} from "@/utils/request"

const api = {
    List: "tyre/getTyreList",
    Add: "tyre/insertTyre",
    Edit: "tyre/insertTyre",
    downLoadAll: "tyre/getTyreList",
    getTyreInfo: "tyre/getTyreInfo",
    getOperationList: "operation/getOperationList"
}

const apiV2 = {
    getTyreInfo: "tyre/tyre-info",
    downLoadAll: "tyre/tyre-list",
    List: "tyre/tyre-list",
    inventoryTyre: "tyre/inventory"
}

const url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */
export function add(parameter) {
    return method(url)({
        url: api.Add,
        method: "post",
        data: {tyreInfo: parameter}
    })
}

/**
 * @param {*} parameter
 */
export function edit(parameter) {
    return method(url)({
        url: api.Edit,
        method: "post",
        data: {tyreInfo: parameter}
    })
}

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

const getTyreInfo = parameter => {
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
        url: api.getOperationList,
        method: "post",
        data: parameter
    })
}

const inventoryTyre = parameter => {
    return method(
        url,
        false
    )({
        url: apiV2.inventoryTyre,
        method: "post",
        data: parameter
    })
}

export default {
    add,
    edit,
    get,
    downLoadAll,
    getTyreInfo,
    getOperationList,
    inventoryTyre
}
