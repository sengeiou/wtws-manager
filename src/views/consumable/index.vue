<template>
  <div class="app-container">
    <div class="head-container">
      <a-form
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        layout="inline"
      >
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="服务站">
              <a-select v-model="crud.query.stationID" placeholder="请选择">
                <a-select-option
                  v-for="item in stationData"
                  :key="item.stationID"
                  :value="item.stationID"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="耗材编号">
              <a-input v-model="crud.query.consumableNo" style="width: 100%" />
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="耗材类型">
              <a-select
                v-model="crud.query.consumableType"
                placeholder="请选择"
              >
                <a-select-option
                  v-for="item in consumableTypeList"
                  :key="item.key"
                  :value="Number(item.value)"
                  >{{ item.key }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="耗材状态">
                <a-select
                  v-model="crud.query.consumableStatus"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="item in consumableStatusList"
                    :key="item.key"
                    :value="Number(item.value)"
                    >{{ item.key }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="耗材品牌">
                <a-input v-model="crud.query.brand" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <a-form-item label="耗材规格">
                <a-input
                  v-model="crud.query.specification"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="耗材系列">
                <a-input v-model="crud.query.series" style="width: 100%" />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="车牌号">
                <a-input
                  v-model="crud.query.vehicleNumber"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker
                  v-model="crud.query.createdTime"
                  format="YYYY-MM-DD"
                  @change="timeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="到货时间">
                <a-range-picker
                  v-model="crud.query.arrivalTimes"
                  format="YYYY-MM-DD"
                  @change="arrivalTimeChange"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24"></a-col>
          </template>

          <a-col :md="6" :sm="24">
            <SearchOptions style="width:100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="耗材列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          :scroll="{ x: 2000 }"
          rowKey="consumableID"
        >
          <template slot="type" slot-scope="record">
            {{ consumableTypeFilter(record.type) }}
          </template>
          <template slot="status" slot-scope="record">
            {{ statusFilter(record.status) }}
          </template>
          <template slot="storageStatus" slot-scope="record">
            {{ storageStatusFilter(record.storageStatus) }}
          </template>
          <template slot="arrivalTime" slot-scope="record">
            {{ arrivalTimeFilter(record.arrivalTime) }}
          </template>
          <template slot="stationID" slot-scope="record">
            {{ stationFilter(record.stationID) }}
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

    <div>
      <a-modal
        :visible="InfoStatus !== ''"
        :width="1080"
        wrapClassName="tyreInfoDialog"
        @cancel="cancelCU()"
        @ok="cancelCU()"
      >
        <a-tabs :activeKey="activeKey" type="card" @change="callback">
          <a-tab-pane key="1" tab="耗材基本信息">
            <div class="tab1">
              <div>
                <div class="_l">耗材编号：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    consumableInfo.consumableNo
                  }}</span>
                </div>
              </div>
              <div>
                <div class="_l">所属服务站：</div>
                <div class="_r">
                  {{ stationFilter(consumableInfo.stationID) }}
                </div>
              </div>
              <div>
                <div class="_l">耗材类型：</div>
                <div class="_r">
                  {{ consumableTypeFilter(consumableInfo.type) }}
                </div>
              </div>
              <div>
                <div class="_l">轮胎存储状态：</div>
                <div class="_r">
                  {{ storageStatusFilter(consumableInfo.storageStatus) }}
                </div>
              </div>
              <div>
                <div class="_l">安装车牌：</div>
                <div class="_r">{{ consumableInfo.vehicleNumber || "-" }}</div>
              </div>
              <div>
                <div class="_l">品牌：</div>
                <div class="_r">{{ consumableInfo.brand }}</div>
              </div>
              <div>
                <div class="_l">系列：</div>
                <div class="_r">{{ consumableInfo.series }}</div>
              </div>
              <div>
                <div class="_l">规格：</div>
                <div class="_r">{{ consumableInfo.specification }}</div>
              </div>
              <div>
                <div class="_l">到货时间：</div>
                <div class="_r">
                  <span>{{ consumableInfo.arrivalTime || "-" }}</span>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="耗材操作记录">
            <OperationList :list="operationList" />
          </a-tab-pane>
        </a-tabs>
      </a-modal>
    </div>
  </div>
</template>

<script>
import api from "@/api/system/account"
import engineerApi from "@/api/engineer"
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { form, header, presenter } from "@crud/crud"
import consumableApi from "@/api/consumable"
import _ from "lodash"
import OperationList from "@/components/OperationList"

// 表格的填充字段
const defaultForm = {
  stationID: ""
}

export default {
  name: "Consumable",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "耗材",
      columns: [
        {
          title: "耗材编号",
          width: 150,
          dataIndex: "consumableNo"
        },
        {
          title: "耗材类型",
          width: 100,
          scopedSlots: { customRender: "type" }
        },
        {
          title: "耗材状态",
          width: 110,
          scopedSlots: { customRender: "status" }
        },
        {
          title: "耗材仓储状态",
          width: 120,
          scopedSlots: { customRender: "storageStatus" }
        },
        {
          title: "耗材品牌",
          width: 100,
          dataIndex: "brand"
        },
        {
          title: "系列",
          width: 100,
          dataIndex: "series"
        },
        {
          title: "规格",
          width: 120,
          dataIndex: "specification"
        },
        {
          title: "安装车牌",
          width: 120,
          dataIndex: "vehicleNumber"
        },
        {
          title: "所属服务站名称",
          width: 200,
          scopedSlots: { customRender: "stationID" }
        },

        {
          title: "到货时间",
          width: 100,
          scopedSlots: { customRender: "arrivalTime" }
        },
        {
          title: "创建时间",
          width: 150,
          dataIndex: "insertTime"
        },

        {
          title: "上次盘点日期",
          width: 150,
          dataIndex: "inventoryTime"
        },
        {
          title: "操作",
          fixed: "right",
          width: 100,
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...consumableApi },
      idField: "consumableID" // 设置每一条记录的唯一标失
    })
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
    },
    "crud.status.cu": {
      handler(newVal) {
        if (newVal > 0) {
          this.getStationList()
          this.getTempList()
        }
      },
      deep: true
    }
  },
  data() {
    return {
      stationData: [],
      stationList: [],
      copyStationList: [],
      stationIDMap: [],

      isRetreadMap: [],
      consumableTypeList: [],
      consumableStatusList: [],
      consumableStorageStatusList: [],

      InfoStatus: "",
      consumableInfo: {},
      submitForm: {},
      activeTyreID: "",
      activeKey: "1",
      operationList: []
    }
  },
  components: { SearchOptions, Operations, Pagination, OperationList },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta

    console.log(code)
    // 关闭下载功能
    this.crud.optShow.download = true
    this.crud.optShow.edit = true
    this.crud.optShow.del = false
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增轮胎"),
      del: code.includes("删除轮胎"),
      edit: code.includes("修改轮胎"),
      download: false
    }

    this.getStationList()

    this.getDictionary("consumableType")
    this.getDictionary("consumableStatus")
    this.getDictionary("consumableStorageStatus")
  },
  methods: {
    timeChange(dates, dateStrings) {
      if (dateStrings[0] && dateStrings[1]) {
        let time1 = dateStrings[0]
        let time2 = dateStrings[1]
        console.log(time1, time2)
        if (
          new Date(time2.replace(/-/g, "/")).getTime() / 1000 -
            (new Date(time1.replace(/-/g, "/")).getTime() / 1000 +
              24 * 60 * 60) >
          365 * 24 * 60 * 60
        ) {
          this.$message.info("请选择一年内的时间！")
          this.crud.query.createdTime = [time1, time1]
          return
        }
      }
      this.crud.query.createdTime = dateStrings
    },
    arrivalTimeChange(dates, dateStrings) {
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
          this.crud.query.arrivalTime = [time1, time1]
          return
        }
      }
      this.crud.query.arrivalTime = dateStrings
    },
    // 获取服务站列表
    getStationList() {
      api.getStationList({}).then(res => {
        if (res.code === 0) {
          this.stationData = res.result.list
          this.stationList = res.result.list
          this.copyStationList = _.cloneDeep(res.result.list)
        }
      })
    },
    handleSearch(value) {
      this.stationList = this.copyStationList.filter(item => {
        return item.name.includes(value)
      })
    },
    // 获取字典信息
    /**
     * companytype 企业类别  industrytype 行业类别
     */
    getDictionary(typeName) {
      this.isRetreadMap = [
        {
          key: "否",
          value: 1
        },
        {
          key: "是",
          value: 2
        }
      ]
      engineerApi.getDictionary({ typeName }).then(res => {
        if (res.code === 0) {
          switch (typeName) {
            case "consumableType":
              this.consumableTypeList = res.result.list
              break
            case "consumableStatus":
              this.consumableStatusList = res.result.list
              break
            case "consumableStorageStatus":
              this.consumableStorageStatusList = res.result.list
              break
            default:
              break
          }
        }
      })
    },
    consumableTypeFilter(val) {
      let arr =
        this.consumableTypeList === null
          ? []
          : this.consumableTypeList.filter(item => {
              return item.value == String(val)
            })
      return arr.length > 0 ? arr[0].key : ""
    },
    statusFilter(val) {
      let arr =
        this.consumableStatusList === null
          ? []
          : this.consumableStatusList.filter(item => {
              return item.value == String(val)
            })
      return arr.length > 0 ? arr[0].key : ""
    },
    storageStatusFilter(val) {
      let arr =
        this.consumableStorageStatusList === null
          ? []
          : this.consumableStorageStatusList.filter(item => {
              return item.value == String(val)
            })
      return arr.length > 0 ? arr[0].key : ""
    },
    stationFilter(val) {
      const station = (this.stationList || []).find(
        item => item.stationID === val
      )
      return station ? station.name : "-"
    },
    arrivalTimeFilter(val) {
      if (val && val !== "-") {
        return val.match(/\d{4}-\d{1,2}-\d{1,2}/)[0]
      } else {
        return "-"
      }
    },
    toInfo(record) {
      this.consumableInfo = {}
      this.InfoStatus = "info"
      this.operationList = []
      consumableApi
        .getConsumableInfo({ consumableID: record.consumableID })
        .then(res => {
          if (res.code === 0) {
            this.consumableInfo = res.result
            consumableApi
              .getOperationList({ consumableID: record.consumableID })
              .then(res => {
                if (res.code === 0 && res.result.list) {
                  this.operationList = res.result.list
                }
              })
          }
        })
    },
    callback(key) {
      console.log(key)
      this.activeKey = key
    },
    cancelCU() {
      this.InfoStatus = ""
      this.consumableInfo = {}
      this.submitForm = {}
      this.activeTyreID = ""
    },
    submitCU() {
      this.InfoStatus = ""
      this.consumableInfo = {}
      this.submitForm = {}
      this.activeTyreID = ""
      this.crud.toQuery()
    }
  }
}
</script>
