<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="创建时间">
              <a-range-picker
                v-model="crud.query.times"
                @change="timeChange"
                format="YYYY-MM-DD"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="车辆所属企业">
              <a-select
                allowClear
                v-model="crud.query.enterpriseID"
                placeholder="请选择"
              >
                <a-select-option
                  v-for="item in allEnterprise"
                  :value="item.enterpriseID"
                  :key="item.enterpriseID"
                  >{{ item.NAME }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属站">
                <a-select
                  allowClear
                  v-model="crud.query.stationID"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="item in stationData"
                    :value="item.stationID"
                    :key="item.stationID"
                    >{{ item.name }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="付费方式">
                <a-select
                  allowClear
                  v-model="crud.query.fleetPayType"
                  placeholder="请选择付费方式"
                >
                  <a-select-option :value="1">预付</a-select-option>
                  <a-select-option :value="2">后付</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-model-item label="计费方式">
                <a-select
                  allowClear
                  v-model="crud.query.fleetChargingType"
                  placeholder="请选择计费方式"
                >
                  <a-select-option :value="1">按时间计费</a-select-option>
                  <a-select-option :value="2">按里程计费</a-select-option>
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
    <div class="table-container finance">
      <Operations tableName="轮胎信息列表">
        <div class="_left leftbtn" slot="left">
          <div style="display:flex;align-items:center">
            <template v-if="isEdit">
              <div>轮胎采购价：</div>
              <a-input-number style="margin-right:10px" v-model="inputValue" />
              <a-button
                type="primary"
                style="margin-right:10px;"
                @click="submit"
                >保存</a-button
              >
              <a-button
                type="default"
                @click="
                  isEdit = false
                  inputValue = ''
                "
                >取消</a-button
              >
            </template>
            <a-button
              type="primary"
              v-if="!isEdit"
              :disabled="!crud.selections.length && canEdit"
              @click="isEdit = true"
              >编辑采购价</a-button
            >
          </div>
        </div>
      </Operations>
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="tyreID"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="vehicleType" slot-scope="record">
            {{
              record.vehicleType === 3
                ? "整车"
                : record.vehicleType === 2
                ? "车头"
                : record.vehicleType === 1
                ? "挂车"
                : "其他"
            }}
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header } from "@crud/crud"
import financeApi from "@/api/finance/index"
import engineerApi from "@/api/engineer"
import api from "@/api/system/account"

export default {
  name: "Sale",
  mixins: [presenter(), header()],
  // 配置crud
  cruds() {
    return CRUD({
      title: "轮胎信息列表",
      columns: [
        {
          title: "装车日期",
          dataIndex: "installTime"
        },
        {
          title: "车辆所属企业",
          dataIndex: "enterpriseName"
        },
        {
          title: "车辆所属车队",
          dataIndex: "fleetName"
        },
        {
          title: "付费方式",
          dataIndex: "fleetPayType"
        },
        {
          title: "计费方式",
          dataIndex: "fleetChargingType"
        },
        {
          title: "车牌号",
          dataIndex: "vehicleNumber"
        },
        {
          title: "车辆类型",
          dataIndex: "vehicleType"
        },
        {
          title: "轮位类型",
          dataIndex: "vehicleWheelModel"
        },
        {
          title: "轮胎胎号",
          dataIndex: "tyreNo"
        },
        {
          title: "轮胎类型",
          dataIndex: "brand"
        }
      ],
      idField: "tyreID",
      crudMethod: { ...financeApi }
    })
  },
  filters: {},
  data() {
    return {
      isEdit: false,
      inputValue: "",
      canEdit: this.$route.meta.code.includes("批量编辑价格"),
      stationData: [],
      allEnterprise: []
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
    // 获取服务站黎贝澳
    getStationList() {
      api.getStationList({}).then(res => {
        if (res.code === 0) {
          this.stationData = res.result.list
        }
      })
    },
    getAallEnterprise() {
      engineerApi.get({}, false).then(res => {
        this.allEnterprise = res.result.list
      })
    },
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
          this.crud.query.times = [time1, time1]
          return
        }
      }
      this.crud.query.times = dateStrings
    },
    submit() {
      if (!this.inputValue) {
        this.$message.error("请填写轮胎采购价！")
        return
      }
      let postData = {
        tyreIDs: this.crud.selections,
        price: this.inputValue
      }
      financeApi.update(postData).then(res => {
        if (res.code === 14) {
          setTimeout(() => {
            this.inputValue = ""
            this.isEdit = false
          }, 500)
        }
      })
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    let { code } = this.$route.meta
    console.log(code)
    this.crud.optShow.add = false
    this.crud.optShow.del = false
    this.crud.optShow.download = true

    this.crud.permission = {
      download: true
    }
    this.getStationList()
    this.getAallEnterprise()
  }
}
</script>
