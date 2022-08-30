<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-model-item label="服务站">
              <a-select
                v-model="crud.query.stationID"
                placeholder="请选择"
                @change="changeStation"
              >
                <a-select-option
                  v-for="item in stationData"
                  :key="item.stationID"
                  :value="item.stationID"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-model-item>
          </a-col>

          <a-col :md="8" :sm="24">
            <a-form-item label="起止时间">
              <a-range-picker
                v-model="crud.query.times"
                format="YYYY-MM-DD"
                @change="timeChange"
              />
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="车牌号">
                <a-input
                  allowClear
                  v-model="crud.query.vehicle"
                  placeholder="请填写"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-item label="胎号">
                <a-input
                  allowClear
                  v-model="crud.query.tyreNo"
                  placeholder="请填写"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-model-item label="操作人">
                <a-select
                  v-model="crud.query.operateUser"
                  placeholder="请选择操作人员"
                >
                  <a-select-option
                    v-for="user in users"
                    :key="user.userId"
                    :value="user.userId"
                    >{{ user.displayName }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="5" :sm="24">
              <a-form-model-item label="操作类型">
                <a-select
                  v-model="crud.query.operateType"
                  placeholder="请选择操作类型"
                >
                  <a-select-option
                    v-for="operateType in operateTypeList"
                    :key="operateType.value"
                    :value="operateType.value"
                    >{{ operateType.key }}</a-select-option
                  >
                </a-select>
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="24">
            <SearchOptions style="width:100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格部分 -->
    <div class="table-container order">
      <Operations tableName="操作记录列表"> </Operations>
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="order_sn"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="operateType" slot-scope="record">
            {{ showOperateType(record.operationType) }}
          </template>
          <template slot="operation" slot-scope="record">
            <a-button type="link" @click="toInfo(record)">
              详情
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>

    <!--    订单详情信息表-->
    <div>
      <a-modal
        wrapClassName="operateInfoDialog"
        :visible="infoStatus !== ''"
        :width="1080"
        @cancel="infoStatus = ''"
      >
        <a-tabs type="card">
          <a-tab-pane key="1" tab="操作记录信息">
            <div class="tab1">
              <div>
                <div class="_l">轮胎胎号</div>
                <div class="_r">
                  <span>{{ operateInfo.tyreNo }}</span>
                </div>
              </div>

              <div>
                <div class="_l">轮胎品牌</div>
                <div class="_r">
                  <span>{{ operateInfo.brand }}</span>
                </div>
              </div>

              <div>
                <div class="_l">轮胎规格</div>
                <div class="_r">
                  <span>{{ operateInfo.specification }}</span>
                </div>
              </div>

              <div>
                <div class="_l">轮胎花纹型号</div>
                <div class="_r">
                  <span>{{ operateInfo.patternModel }}</span>
                </div>
              </div>

              <div>
                <div class="_l">车牌号</div>
                <div class="_r">
                  <span>{{ operateInfo.vehicleNumber }} </span>
                </div>
              </div>
              <div>
                <div class="_l">操作轮位</div>
                <div class="_r">
                  <span>
                    {{ operateInfo.wheelPosition }}
                  </span>
                </div>
              </div>

              <div>
                <div class="_l">操作人</div>
                <div class="_r">
                  {{ operateInfo.operateUser }}
                </div>
              </div>

              <div>
                <div class="_l">操作人手机号</div>
                <div class="_r">
                  {{ operateInfo.phoneTel }}
                </div>
              </div>

              <div>
                <div class="_l">操作类型</div>
                <div class="_r">
                  {{ showOperateType(operateInfo.operationType) }}
                </div>
              </div>

              <div>
                <div class="_l">操作时间</div>
                <div class="_r">
                  {{ operateInfo.insertTime }}
                </div>
              </div>

              <a-divider>操作详情</a-divider>
              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.currentMileage
                "
              >
                <div class="_l">登记里程</div>
                <div class="_r">
                  {{ operateInfo.operationContent.currentMileage }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    (operateInfo.operationContent.patternAVG ||
                      (operateInfo.operationContent.startLW &&
                        operateInfo.operationContent.startLW.pattern &&
                        operateInfo.operationContent.startLW.pattern
                          .patternAVG))
                "
              >
                <div class="_l">平均花纹深度</div>
                <div class="_r">
                  {{
                    operateInfo.operationContent.patternAVG ||
                      operateInfo.operationContent.startLW.pattern.patternAVG
                  }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    (operateInfo.operationContent.pattern1 ||
                      (operateInfo.operationContent.startLW &&
                        operateInfo.operationContent.startLW.pattern &&
                        operateInfo.operationContent.startLW.pattern.pattern1))
                "
              >
                <div class="_l">沟1深度</div>
                <div class="_r">
                  {{
                    operateInfo.operationContent.pattern1 ||
                      operateInfo.operationContent.startLW.pattern.pattern1
                  }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    (operateInfo.operationContent.pattern2 ||
                      (operateInfo.operationContent.startLW &&
                        operateInfo.operationContent.startLW.pattern &&
                        operateInfo.operationContent.startLW.pattern.pattern2))
                "
              >
                <div class="_l">沟2深度</div>
                <div class="_r">
                  {{
                    operateInfo.operationContent.pattern2 ||
                      operateInfo.operationContent.startLW.pattern.pattern2
                  }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    (operateInfo.operationContent.pattern3 ||
                      (operateInfo.operationContent.startLW &&
                        operateInfo.operationContent.startLW.pattern &&
                        operateInfo.operationContent.startLW.pattern.pattern3))
                "
              >
                <div class="_l">沟3深度</div>
                <div class="_r">
                  {{
                    operateInfo.operationContent.pattern3 ||
                      operateInfo.operationContent.startLW.pattern.pattern3
                  }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    (operateInfo.operationContent.pattern4 ||
                      (operateInfo.operationContent.startLW &&
                        operateInfo.operationContent.startLW.pattern &&
                        operateInfo.operationContent.startLW.pattern.pattern4))
                "
              >
                <div class="_l">沟4深度</div>
                <div class="_r">
                  {{
                    operateInfo.operationContent.pattern4 ||
                      operateInfo.operationContent.startLW.pattern.pattern4
                  }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    (operateInfo.operationContent.pattern5 ||
                      (operateInfo.operationContent.startLW &&
                        operateInfo.operationContent.startLW.pattern &&
                        operateInfo.operationContent.startLW.pattern.pattern5))
                "
              >
                <div class="_l">沟5深度</div>
                <div class="_r">
                  {{
                    operateInfo.operationContent.pattern5 ||
                      operateInfo.operationContent.startLW.pattern.pattern5
                  }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.endLW &&
                    operateInfo.operationContent.endLW.pattern &&
                    operateInfo.operationContent.endLW.pattern.patternAVG
                "
              >
                <div class="_l">目标轮位平均花纹深度</div>
                <div class="_r">
                  {{ operateInfo.operationContent.endLW.pattern.patternAVG }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.endLW &&
                    operateInfo.operationContent.endLW.pattern &&
                    operateInfo.operationContent.endLW.pattern.pattern1
                "
              >
                <div class="_l">目标轮位沟1深度</div>
                <div class="_r">
                  {{ operateInfo.operationContent.endLW.pattern.pattern1 }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.endLW &&
                    operateInfo.operationContent.endLW.pattern &&
                    operateInfo.operationContent.endLW.pattern.pattern2
                "
              >
                <div class="_l">目标轮位沟2深度</div>
                <div class="_r">
                  {{ operateInfo.operationContent.endLW.pattern.pattern2 }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.endLW &&
                    operateInfo.operationContent.endLW.pattern &&
                    operateInfo.operationContent.endLW.pattern.pattern3
                "
              >
                <div class="_l">目标轮位沟3深度</div>
                <div class="_r">
                  {{ operateInfo.operationContent.endLW.pattern.pattern3 }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.endLW &&
                    operateInfo.operationContent.endLW.pattern &&
                    operateInfo.operationContent.endLW.pattern.pattern4
                "
              >
                <div class="_l">目标轮位沟4深度</div>
                <div class="_r">
                  {{ operateInfo.operationContent.endLW.pattern.pattern4 }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.endLW &&
                    operateInfo.operationContent.endLW.pattern &&
                    operateInfo.operationContent.endLW.pattern.pattern5
                "
              >
                <div class="_l">目标轮位沟5深度</div>
                <div class="_r">
                  {{ operateInfo.operationContent.endLW.pattern.pattern5 }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.testDate
                "
              >
                <div class="_l">批量巡检日期</div>
                <div class="_r">
                  {{ operateInfo.operationContent.testDate }}
                </div>
              </div>

              <div
                  v-if="
                  operateInfo.destinationName
                "
              >
                <div class="_l">转入服务站</div>
                <div class="_r">
                  {{ operateInfo.destinationName }}
                </div>
              </div>

              <div
                  v-if="
                  operateInfo.originStationName
                "
              >
                <div class="_l">转出服务站</div>
                <div class="_r">
                  {{ operateInfo.originStationName }}
                </div>
              </div>

              <div
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.note
                "
              >
                <div class="_l">备注</div>
                <div class="_r">
                  {{ operateInfo.operationContent.note }}
                </div>
              </div>

              <template
                v-if="
                  operateInfo.operationContent &&
                    operateInfo.operationContent.HCList &&
                    operateInfo.operationContent.HCList.length > 0
                "
              >
                <a-divider>使用耗材</a-divider>
                <div
                  v-for="hc in operateInfo.operationContent.HCList"
                  :key="hc.name"
                >
                  <div class="_l">耗材名称:{{ hc.name }}</div>
                  <div class="_r">耗材个数/备注:{{ hc.num }}</div>
                </div>
              </template>

              <template v-if="operateInfo.imagesContent && operateInfo.imagesContent.length > 0">
                <a-divider>现场照片</a-divider>
                  <el-image
                      class="operate-image"
                      v-for="(itemImage, index) in operateInfo.imagesContent"
                      :key="index"
                      style="margin-left: 10px;width: 100px; height: 100px"
                      :preview-src-list="[itemImage.url]"
                      :src="itemImage.url"
                  >
                  </el-image>
              </template>

            </div>
          </a-tab-pane>
        </a-tabs>
        <template slot="footer">
          <div>
            <a-button key="back" @click="resetForm">
              取消
            </a-button>
          </div>
        </template>
        <template slot="footer">
          <div></div>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import api from "@/api/system/account"
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header, form } from "@crud/crud"
import _ from "lodash"
import {
  getUserByStationIds,
  getOperateTypeList,
  get,
  getOperateDetail,
  downLoadAll
} from "../../api/operate"

const defaultForm = {
  vehicle: "",
  storeName: ""
}

export default {
  name: "Sale",
  mixins: [presenter(), header(), form(defaultForm)],
  // 配置crud
  cruds() {
    return CRUD({
      title: "操作列表",
      columns: [
        {
          title: "轮胎胎号",
          dataIndex: "tyreNo"
        },
        {
          title: "车辆车牌",
          dataIndex: "vehicleNumber"
        },
        {
          title: "操作轮位",
          dataIndex: "wheelPosition"
        },
        {
          title: "操作类型",
          scopedSlots: { customRender: "operateType" }
        },
        {
          title: "操作人",
          dataIndex: "operateUser"
        },
        {
          title: "操作日期",
          dataIndex: "insertTime"
        },

        {
          title: "操作",
          width: 100,
          scopedSlots: { customRender: "operation" }
        }
      ],
      idField: "orderNumber",
      crudMethod: { get,downLoadAll }
    })
  },
  filters: {},
  data() {
    return {
      stationData: [],
      stationList: [],
      operateTypeList: [],
      copyStationList: [],
      users: [],
      infoStatus: "",
      operateInfo: {},
      submitForm: {},
      csubmitForm: {}
    }
  },
  watch: {
    "crud.query": {
      handler(newVal) {
        let times = newVal.times
        if (!times) {
          return
        }
        if (times[0] && times[1]) {
          this.crud.query.startTime =
            new Date(times[0].replace(/-/g, "/")).getTime() / 1000
          this.crud.query.endTime =
            new Date(times[1].replace(/-/g, "/")).getTime() / 1000 +
            24 * 60 * 60
          this.startTime = times[0]
          this.endTime = times[1]
        } else {
          this.crud.query.startTime = ""
          this.crud.query.endTime = ""
          this.startTime = ""
          this.endTime = ""
        }
      },
      deep: true
    }
  },
  methods: {
    timeChange(dates, dateStrings) {
      if (dateStrings[0] && dateStrings[1]) {
        let time1 = dateStrings[0]
        let time2 = dateStrings[1]
        if (
          new Date(time2.replace(/-/g, "/")).getTime() / 1000 -
            (new Date(time1.replace(/-/g, "/")).getTime() / 1000 +
              24 * 60 * 60) >
          365 * 24 * 60 * 60
        ) {
          this.$message.info("请选择一年内的时间！")
          this.crud.query.times = [time1, time1]
          return
        }
      }
      this.crud.query.times = dateStrings
    },
    showOperateType(val) {
      const operateType = this.operateTypeList.find(item => item.value == val)
      return operateType ? operateType.key : "-"
    },

    //恢复表格编辑前的状态
    resetForm() {
      //将表格数据恢复成编辑前的状态
      this.infoStatus = ""
      this.csubmitForm = _.cloneDeep(this.submitForm)
    },

    async toInfo(recode) {
      const { result } = await getOperateDetail({
        operationID: recode.operationID
      })
      try {
        result.imagesContent = JSON.parse(result.imagesContent)
      } catch (e) {
        if (!result.imageContent) {
          result.imagesContent = []
        }
      }
      try {
        result.operationContent = JSON.parse(result.operationContent)
      } catch (e) {
        if (!result.operationContent) {
          result.operationContent = {}
        }
      }
      console.log(`result:${JSON.stringify(result)}`)
      this.infoStatus = "info"
      this.operateInfo = result
    },

    // 获取服务站列表
    async getStationList() {
      const res = await api.getStationList({})
      if (res.code === 0) {
        this.stationData = res.result.list
        this.stationList = res.result.list
        this.copyStationList = _.cloneDeep(res.result.list)
      }
    },
    async getOperateTypeMap() {
      const result = await getOperateTypeList({ typeName: "operateType" })
      this.operateTypeList = result.result
    },
    async getStationUsers(stationIds) {
      const result = await getUserByStationIds({ stationIds })
      this.users = result.result
    },
    async changeStation(value) {
      await this.getStationUsers([value])
      const operateUser = this.crud.query.operateUser
      if (
        operateUser &&
        !this.users.map(item => item.userId).includes(operateUser)
      ) {
        this.crud.query.operateUser = undefined
      }
    }
  },
  components: { SearchOptions, Operations, Pagination },
  async created() {
    this.crud.optShow.add = false
    this.crud.optShow.del = false
    this.crud.optShow.download = true
    this.crud.optShow.edit = false
    this.crud.permission.download = true
    await this.getStationList()
    const stationIDs = this.stationList.map(item => item.stationID)
    const that = this
    await Promise.all([
      that.getStationUsers(stationIDs),
      that.getOperateTypeMap()
    ])
  }
}
</script>
