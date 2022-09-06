/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2021-01-19 19:46:09
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-19 22:18:44
 */
// eslint-disable-next-line no-unused-vars
import {method} from "@/utils/request"

const Api = {
    Get: "order/list",
    DoneOrder: "order/done",
    GetOrderDetail: "order/detail",
    PostCheckOrder: "order/checkOrder",
    GetCheckOrderZip: "order/checkOrder",
    GetStoreList: "store/list"
}

const apiV2 = {
    GetOrderGoodList: "order/good/list",
    GetStoreList: "store/list",
    GetOperationList: "operation/tyre/list"
}

let url = process.env.VUE_APP_API_URL

/**
 * @param parameter
 * @returns {*}
 */

export function get(params) {
    return method(
        url,
        false
    )({
        url: apiV2.GetOrderGoodList,
        data: {...params},
        method: "get"
    })
}

export function doneOrder(data) {
    return method(
        url,
        false
    )({
        url: Api.DoneOrder,
        data,
        method: "put"
    })
}

export function getOrderDetail(data) {
    return method(
        url,
        false
    )({
        url: Api.GetOrderDetail,
        data,
        method: "get"
    })
}

export function postCheckOrder(data) {
    return method(
        url,
        false
    )({
        url: Api.PostCheckOrder,
        data,
        method: "post"
    })
}

export function getCheckOrderZip(data) {
    return method(
        url,
        false
    )({
        url: Api.GetCheckOrderZip,
        data,
        method: "get"
    })
}

export function getStoreList(data) {
    return method(
        url,
        false
    )({
        url: apiV2.GetStoreList,
        data,
        method: "get"
    })
}

export function getOperateList(data) {
    return method(
        url,
        false
    )({
        url: apiV2.GetOperationList,
        data,
        method: "get"
    })
}

export default {
    get,
    doneOrder,
    getOrderDetail,
    postCheckOrder,
    getStoreList,
    getOperateList,
    getCheckOrderZip
}
