/*
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-11 14:21:36
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:18:40
 */
import {method} from "@/utils/request"

const apiV2 = {
    getVehicleTrajectory: "vehicle/trajectory"
}

const url = process.env.VUE_APP_API_URL

const getVehicleTrajectory = parameter => {
    return method(url)({
        url: apiV2.getVehicleTrajectory,
        method: "get",
        data: parameter
    })
}

export default {
    getVehicleTrajectory
}
