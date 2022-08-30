<!--
 * @Description: 
 * @Author: yuyongjie
 * @Date: 2020-12-28 21:38:04
 * @LastEditors: yuyongjie
 * @LastEditTime: 2020-12-31 16:40:21
-->
<template>
  <a-spin :spinning="upFileLoading">
    <div>
      <div class="_top">
        <a-steps :current="current">
          <a-step>
            <template slot="title">
              上传文件
            </template>
            <span slot="description">
              <div class="do" v-if="current === 0">
                <div style="margin-bottom:10px;">
                  请按照模版中的数据规范上传文件，您可以<span
                    style="color:#1890ff;cursor: pointer;"
                    @click="downloadMB"
                    >点此下载模板</span
                  >
                </div>
                <a-upload
                  name="file"
                  :multiple="false"
                  :before-upload="beforeUpload"
                  @change="uploadChange"
                >
                  <a-button type="primary" size="small">
                    <a-icon type="upload" />
                    点击上传
                  </a-button>
                </a-upload>
              </div>
              <div class="done" v-if="current > 0">
                <span>{{ fileList[0].name }} {{ parseTime(new Date()) }}</span>
              </div>
            </span>
          </a-step>
          <a-step>
            <template slot="title">
              修改异常
            </template>
            <span slot="description">
              <div class="do" v-if="current === 0">
                修改导入后有异常的数据
              </div>
              <div class="do" v-if="current === 1">
                <div>
                  导入成功{{ successCount }}条，导入失败{{
                    errList.length
                  }}条，请尽快修改，若以下数据不需要导入，您也可以<span
                    style="color:#1890ff;cursor: pointer;"
                    @click="abandon"
                    >点此放弃修改</span
                  >
                </div>
              </div>
              <div class="done" v-if="current > 1">
                <span>异常数据已全部修改完成</span>
              </div>
            </span>
          </a-step>
          <a-step title="完成">
            <span slot="description">
              <div class="do" v-if="current < 2">
                数据导入成功
              </div>
              <div class="done" v-if="current === 2">
                <div style="margin-bottom:10px;">
                  共导入{{ successCount }}条数据
                </div>
                <a-button type="primary" @click="abandon" size="small">
                  继续上传
                </a-button>
              </div>
            </span>
          </a-step>
        </a-steps>
      </div>
      <div class="_bottom">
        <div class="_t">
          <h2>导入结果</h2>
          <a-button
            @click="submit"
            v-if="current === 1 && errList.length"
            type="primary"
          >
            保存
          </a-button>
        </div>
        <div v-if="current === 0">
          <div class="_con">
            <a-empty />
          </div>
        </div>
        <div v-if="(current === 1 && errList.length === 0) || current === 2">
          <a-result status="success" title="导入成功！">
            <template #extra>
              <a-button key="console" @click="abandon" type="primary">
                继续上传
              </a-button>
            </template>
          </a-result>
        </div>
        <div v-if="current === 1 && errList.length">
          <a-table
            :scroll="{ x: 2300 }"
            :columns="columns"
            :data-source="errList"
            bordered
          >
            <template slot="vehicleType" slot-scope="text">
              {{
                String(text) === "2"
                  ? "车头"
                  : String(text) === "1"
                  ? "挂车"
                  : "整车"
              }}
            </template>
            <template
              v-for="col in ['vehicleNumber', 'enterpriseName', 'fleetName']"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <a-input
                  :readonly="!record.errCode.includes(col)"
                  :style="{
                    color: record.errCode.includes(col)
                      ? 'red'
                      : 'rgba(0, 0, 0, 0.65)'
                  }"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, index, col)"
                />
              </div>
            </template>
            <template slot="errReason" slot-scope="record">
              <span style="color:red">{{ record.join("|") }}</span>
            </template>
            <template slot="operation" slot-scope="text, record, index">
              <div class="editable-row-operations">
                <span>
                  <a-popconfirm title="确定删除？" @confirm="() => del(index)">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              </div>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
import Api from "@/api/import/vehicle"
import { parseTime } from "@/utils/utils"
import _ from "lodash"
export default {
  data() {
    return {
      parseTime,
      current: 0,
      fileList: [],

      errList: [],
      successCount: 0,

      columns: [
        {
          title: "车辆类型",
          dataIndex: "vehicleType",
          scopedSlots: { customRender: "vehicleType" }
        },
        {
          title: "车牌号",
          dataIndex: "vehicleNumber",
          scopedSlots: { customRender: "vehicleNumber" },
          width: 200
        },
        {
          title: "车辆自编号",
          dataIndex: "vehicleSelfNumber"
        },
        {
          title: "轮位类型",
          dataIndex: "vehicleWheelModel"
        },
        {
          title: "车辆所属企业",
          dataIndex: "enterpriseName",
          scopedSlots: { customRender: "enterpriseName" },
          width: 200
        },
        {
          title: "车辆所属车队",
          dataIndex: "fleetName",
          scopedSlots: { customRender: "fleetName" },
          width: 200
        },
        {
          title: "车辆品牌",
          dataIndex: "brand"
        },
        {
          title: "驾驶员姓名1",
          dataIndex: "driver1Name"
        },
        {
          title: "驾驶员手机号1",
          dataIndex: "driver1Phone",
          width: 200
        },
        {
          title: "驾驶员姓名2",
          dataIndex: "driver2Name"
        },
        {
          title: "驾驶员手机号2",
          dataIndex: "driver2Phone",
          width: 200
        },
        {
          title: "错误原因",
          dataIndex: "errReason",
          scopedSlots: { customRender: "errReason" },
          fixed: "right",
          width: 300
        },
        {
          title: "操作",
          dataIndex: "operation",
          scopedSlots: { customRender: "operation" },
          fixed: "right",
          width: 100
        }
      ],
      data: [],
      upFileLoading: false
    }
  },
  methods: {
    handleChange(value, index, column) {
      // const newData = [...this.errList]
      // const target = newData.filter(item => key === item.key)[0]
      // if (target) {
      //   target[column] = value
      //   this.errList = newData
      // }
      this.$set(this.errList[index], column, value)
    },
    del(index) {
      this.errList.splice(index, 1)
    },
    downloadMB() {
      window.open(
        "https://import-excel.oss-cn-hangzhou.aliyuncs.com/%E8%BD%A6%E8%BE%86%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx"
      )
    },
    beforeUpload(file) {
      let arr = file.name.split(".")
      if (
        arr[arr.length - 1].trim() !== "xls" &&
        arr[arr.length - 1].trim() !== "xlsx"
      ) {
        return false
      }
      if (this.fileList.length === 0) {
        this.fileList = [...this.fileList, file]
      }
      return false
    },
    async uploadChange(data) {
      let arr = data.file.name.split(".")
      if (
        arr[arr.length - 1].trim() !== "xls" &&
        arr[arr.length - 1].trim() !== "xlsx"
      ) {
        this.$message.error("请上传excel文件！")
        data.fileList.pop()
        return false
      }
      if (data.fileList.length > 1) {
        data.fileList.pop()
      } else {
        if (data.fileList.length !== 0) {
          const formData = new FormData()
          formData.append("file", data.file)
          this.upFileLoading = true
          Api.batchAddVehicleExcel(formData)
            .then(res => {
              this.upFileLoading = false
              if (res.code === 0) {
                this.current = 1
                for (let i = 0; i < res.result.err.length; i++) {
                  const element = res.result.err[i]
                  element["errReason"] = []
                  element["errCode"] = []
                  // eslint-disable-next-line no-prototype-builtins
                  if (element.hasOwnProperty("vehicleNumberErr")) {
                    element["errReason"].push(element.vehicleNumberErr.errmsg)
                    element["errCode"].push(element.vehicleNumberErr.errField)
                  }
                  // eslint-disable-next-line no-prototype-builtins
                  if (element.hasOwnProperty("enterpriseNameErr")) {
                    element["errReason"].push(element.enterpriseNameErr.errmsg)
                    element["errCode"].push(element.enterpriseNameErr.errField)
                  }
                  // eslint-disable-next-line no-prototype-builtins
                  if (element.hasOwnProperty("fleetNameErr")) {
                    element["errReason"].push(element.fleetNameErr.errmsg)
                    element["errCode"].push(element.fleetNameErr.errField)
                  }
                }
                this.errList = res.result.err
                this.successCount = res.result.successCount
              }
            })
            .catch(() => {
              this.upFileLoading = false
            })
        }
      }
    },
    abandon() {
      this.errList = []
      this.successCount = 0
      this.fileList = []
      this.current = 0
    },
    submit() {
      let data = _.cloneDeep(this.errList)
      let passCount = 0
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        for (let j = 0; j < element.errCode.length; j++) {
          const ej = element.errCode[j]
          if (!element[ej].trim()) {
            passCount++
          }
        }
        delete element.errReason
        delete element.errCode
      }
      if (passCount) {
        this.$message.error("请填写表格中出错的项！")
        return
      }
      Api.batchAddVehicle(data).then(res => {
        if (res.code === 0) {
          this.successCount += data.length - res.result.err.length
          for (let i = 0; i < res.result.err.length; i++) {
            const element = res.result.err[i]
            element["errReason"] = []
            element["errCode"] = []
            // eslint-disable-next-line no-prototype-builtins
            if (element.hasOwnProperty("vehicleNumberErr")) {
              element["errReason"].push(element.vehicleNumberErr.errmsg)
              element["errCode"].push(element.vehicleNumberErr.errField)
            }
            // eslint-disable-next-line no-prototype-builtins
            if (element.hasOwnProperty("enterpriseNameErr")) {
              element["errReason"].push(element.enterpriseNameErr.errmsg)
              element["errCode"].push(element.enterpriseNameErr.errField)
            }
            // eslint-disable-next-line no-prototype-builtins
            if (element.hasOwnProperty("fleetNameErr")) {
              element["errReason"].push(element.fleetNameErr.errmsg)
              element["errCode"].push(element.fleetNameErr.errField)
            }
          }
          this.errList = res.result.err
          if (res.result.err.length === 0) {
            this.current = 2
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
._top {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  margin-bottom: 20px;
}
._bottom {
  background-color: #fff;
  border-radius: 5px;
  padding: 20px;
  ._t {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 30px;
    h2 {
      margin-bottom: 0;
    }
  }
  ._con {
    margin-bottom: 30px;
  }
}
</style>
