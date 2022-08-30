<!--
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-28 21:38:04
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-03 16:23:43
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
                <div style="display:flex;align-items:center;">
                  <div
                    style="display:flex;align-items:center;margin-right:10px"
                  >
                    <span style="display:block">请选择服务站：</span>
                    <a-select
                      style="width:200px"
                      v-model="activeStationID"
                      placeholder="请选择"
                    >
                      <a-select-option
                        v-for="item in stationData"
                        :value="item.stationID"
                        :key="item.stationID"
                        >{{ item.name }}</a-select-option
                      >
                    </a-select>
                  </div>
                  <a-upload
                    name="file"
                    :multiple="false"
                    :before-upload="beforeUpload"
                    @change="uploadChange"
                  >
                    <a-button
                      type="primary"
                      :disabled="!activeStationID"
                      size="small"
                    >
                      <a-icon type="upload" />
                      点击上传
                    </a-button>
                  </a-upload>
                </div>
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
            <template
              v-for="col in [
                'tyreStatusText',
                'tyreNo',
                'brand',
                'specification',
                'patternModel',
                'initPattern',
                'price',
                'arrivalTime',
                'patternNum',
                'pattern1',
                'pattern2',
                'pattern3',
                'pattern4',
                'pattern5'
              ]"
              :slot="col"
              slot-scope="text, record, index"
            >
              <div :key="col">
                <a-input
                  :readonly="record.errCode !== col"
                  :style="{
                    color: record.errCode == col ? 'red' : 'rgba(0, 0, 0, 0.65)'
                  }"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, index, col)"
                />
              </div>
            </template>
            <template slot="errReason" slot-scope="record">
              <span style="color:red">{{ record }}</span>
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
import Api from "@/api/import/tyre"
import { parseTime } from "@/utils/utils"
import api from "@/api/system/account"
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
          title: "轮胎状态",
          dataIndex: "tyreStatusText",
          scopedSlots: { customRender: "tyreStatusText" },
          width: 200
        },
        {
          title: "胎号",
          dataIndex: "tyreNo",
          scopedSlots: { customRender: "tyreNo" },
          width: 200
        },
        {
          title: "品牌",
          dataIndex: "brand",
          scopedSlots: { customRender: "brand" },
          width: 200
        },
        {
          title: "规格",
          dataIndex: "specification",
          scopedSlots: { customRender: "specification" },
          width: 200
        },
        {
          title: "花纹",
          dataIndex: "patternModel",
          scopedSlots: { customRender: "patternModel" },
          width: 200
        },
        {
          title: "新胎/回收胎/翻新胎采购价",
          dataIndex: "price",
          scopedSlots: { customRender: "price" },
          width: 200
        },
        {
          title: "到货时间",
          dataIndex: "arrivalTime",
          scopedSlots: { customRender: "arrivalTime" },
          width: 200
        },
        // {
        //   title: "翻新品牌",
        //   dataIndex: "retreadBrand",
        //   scopedSlots: { customRender: "retreadBrand" },
        //   width: 200
        // },
        {
          title: "平均花纹深度",
          dataIndex: "initPattern",
          scopedSlots: { customRender: "initPattern" },
          width: 150
        },

        {
          title: "花纹个数",
          dataIndex: "patternNum",
          scopedSlots: { customRender: "patternNum" },
          width: 100
        },
        {
          title: "沟1",
          dataIndex: "pattern1",
          scopedSlots: { customRender: "pattern1" },
          width: 100
        },
        {
          title: "沟2",
          dataIndex: "pattern2",
          scopedSlots: { customRender: "pattern2" },
          width: 100
        },
        {
          title: "沟3",
          dataIndex: "pattern3",
          scopedSlots: { customRender: "pattern3" },
          width: 100
        },
        {
          title: "沟4",
          dataIndex: "pattern4",
          scopedSlots: { customRender: "pattern4" },
          width: 100
        },
        {
          title: "沟5",
          dataIndex: "pattern5",
          scopedSlots: { customRender: "pattern5" },
          width: 100
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
      upFileLoading: false,
      activeStationID: "",
      stationData: []
    }
  },
  created() {
    this.getStationList()
  },
  methods: {
    // 获取服务站黎贝澳
    getStationList() {
      api.getStationList({}).then(res => {
        if (res.code === 0) {
          this.stationData = res.result.list
        }
      })
    },
    handleChange(value, index, column) {
      this.$set(this.errList[index], column, value)
    },
    del(index) {
      this.errList.splice(index, 1)
    },
    downloadMB() {
      window.open(
        "https://import-excel.oss-cn-hangzhou.aliyuncs.com/%E8%BD%AE%E8%83%8E%E5%AF%BC%E5%85%A5%E6%A8%A1%E7%89%88.xlsx"
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
          formData.append("stationID", this.activeStationID)
          this.upFileLoading = true
          Api.batchAddTyreExcel(formData)
            .then(res => {
              this.upFileLoading = false
              if (res.code === 0) {
                this.current = 1
                this.errList = res.result.err
                this.errList.forEach(item => {
                  console.log(
                    `item.initPatterns : ${JSON.stringify(item.initPatterns)}`
                  )
                  item.errReason = item.error.errMsg
                  item.errCode = item.error.errField
                  item.pattern1 = item.initPatterns[0]
                  item.pattern2 = item.initPatterns[1]
                  item.pattern3 = item.initPatterns[2] || ""
                  item.pattern4 = item.initPatterns[3] || ""
                  item.pattern5 = item.initPatterns[4] || ""
                })
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
      let passCount = false
      for (let i = 0; i < data.length; i++) {
        const element = data[i]
        if (!element[element.errCode].trim()) {
          passCount = true
        }
        delete element.errReason
        delete element.errCode
        delete element.error
      }
      if (passCount) {
        this.$message.error("请填写表格中出错的项！")
        return
      }
      data.forEach(item => {
        item.initPatterns = [
          parseFloat(item.pattern1),
          parseFloat(item.pattern2),
          parseFloat(item.pattern3),
          parseFloat(item.pattern4),
          parseFloat(item.pattern5)
        ].filter(item => (item && !isNaN(item)) || item === 0);
        item.patternNum = Number(item.patternNum)
        item.initPattern = Number(item.initPattern)
      })
      Api.batchAddTyre(data).then(res => {
        if (res.code === 0) {
          this.successCount += data.length - res.result.err.length
          this.errList = res.result.err
          this.errList.forEach(item => {
            item.errReason = item.error.errMsg
            item.errCode = item.error.errField
            item.pattern1 = item.initPatterns[0]
            item.pattern2 = item.initPatterns[1]
            item.pattern3 = item.initPatterns[2] || ""
            item.pattern4 = item.initPatterns[3] || ""
            item.pattern5 = item.initPatterns[4] || ""
          })
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
