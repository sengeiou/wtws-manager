<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="选择门店">
              <a-select v-model="crud.query.storeID" placeholder="请选择">
                <a-select-option
                  v-for="item in storeList"
                  :key="item.id"
                  :value="item.id"
                  >{{ item.name }}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-item label="胎号">
              <a-input
                allowClear
                v-model="crud.query.tyreNo"
                placeholder="请输入胎号"
              >
              </a-input>
            </a-form-item>
          </a-col>

          <a-col :md="6" :sm="24">
            <a-form-model-item label="订单号">
              <a-input
                allowClear
                v-model="crud.query.orderNumber"
                placeholder="请填写订单号"
              >
              </a-input>
            </a-form-model-item>
          </a-col>

          <template v-if="crud.advanced">
            <a-col :md="6" :sm="24">
              <a-form-item label="手机号">
                <a-input
                  allowClear
                  v-model="crud.query.mobile"
                  placeholder="请选择"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker
                  v-model="crud.query.times"
                  @change="timeChange"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="品牌">
                <a-input
                  allowClear
                  v-model="crud.query.brand"
                  placeholder="请填写"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="规格">
                <a-input
                  allowClear
                  v-model="crud.query.specification"
                  placeholder="请填写"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="花纹">
                <a-input
                  allowClear
                  v-model="crud.query.patternModel"
                  placeholder="请填写"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-item label="车牌号">
                <a-input
                  allowClear
                  v-model="crud.query.vehicle"
                  placeholder="请填写"
                >
                </a-input>
              </a-form-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-model-item label="订单类型">
                <a-select
                  allowClear
                  v-model="crud.query.orderType"
                  placeholder="请选择订单类型"
                >
                  <a-select-option :value="0">线上商城订单</a-select-option>
                  <a-select-option :value="1">线下操作订单</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>

            <a-col :md="6" :sm="24">
              <a-form-model-item label="支付方式">
                <a-select
                  allowClear
                  v-model="crud.query.paymentMethod"
                  placeholder="请选择支付方式"
                >
                  <a-select-option :value="1">微信付款</a-select-option>
                  <a-select-option :value="0">对公转账</a-select-option>
                </a-select>
              </a-form-model-item>
            </a-col>
          </template>
          <a-col :md="6" :sm="24">
            <SearchOptions style="width:100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格部分 -->
    <div class="table-container order">
      <Operations tableName="订单信息列表">
        <!--        <div class="_left leftbtn" slot="left">-->
        <!--          <div style="display:flex;align-items:center">-->
        <!--            <a-button-->
        <!--                type="primary"-->
        <!--                :disabled="!crud.selections.length && canEdit"-->
        <!--                @click="doneOrder"-->
        <!--            >完成订单-->
        <!--            </a-button-->
        <!--            >-->
        <!--          </div>-->
        <!--        </div>-->
      </Operations>
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
          :scroll="{ x: 2000 }"
        >
          <template slot="goodName" slot-scope="record">
            {{ goodNameFilter(record) }}
          </template>

          <template slot="salePrice" slot-scope="record">
            {{ salePriceFilter(record) }}
          </template>

          <template slot="orderStatus" slot-scope="record">
            <div
              :style="{
                color:
                  record.order_status === 0
                    ? 'red'
                    : record.order_status === 5
                    ? 'blue'
                    : record.order_status === 3
                    ? '#44bcd8'
                    : 'green'
              }"
            >
              {{ oderStatusFilter(record.order_status) }}
            </div>
          </template>

          <template slot="payStatus" slot-scope="record">
            {{ payStatusFilter(record.pay_status) }}
          </template>
          <template slot="paymentMethod" slot-scope="record">
            {{ paymentMethodFilter(record.payment_method) }}
          </template>
          <template slot="payTime" slot-scope="record">
            {{ record.pay_time ? timeToString(record.pay_time) : "" }}
          </template>
          <template slot="addTime" slot-scope="record">
            {{ timeToString(record.add_time) }}
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
        wrapClassName="orderInfoDialog"
        :visible="infoStatus !== ''"
        :width="1080"
        @cancel="infoStatus = ''"
      >
        <a-tabs type="card">
          <a-tab-pane key="1" tab="轮胎操作记录">
            <OperationList :list="operationList" />
          </a-tab-pane>
        </a-tabs>
        <template slot="footer">
          <div>
            <a-button key="back" @click="infoStatus = ''">
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
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header, form } from "@crud/crud"
import orderApi from "@/api/order/orderGoods"
import { orderConfig } from "@/config/index"
import { downloadFileByUrl } from "../../utils/utils"
import Dayjs from "dayjs"
import {
  postCheckOrder,
  getStoreList,
  getCheckOrderZip
} from "../../api/order/orderGoods"
import OperationList from "@/components/OperationList"
import _ from "lodash"

const defaultForm = {
  vehicle: "",
  storeName: ""
}

export default {
  name: "OrderGoods",
  mixins: [presenter(), header(), form(defaultForm)],
  // 配置crud
  cruds() {
    return CRUD({
      title: "订单列表",
      columns: [
        {
          title: "单号",
          width: 200,
          dataIndex: "order_sn"
        },
        {
          title: "商品名",
          width: 150,
          scopedSlots: { customRender: "goodName" }
        },
        {
          title: "车牌号",
          width: 100,
          dataIndex: "vehicle"
        },
        {
          title: "用户手机号",
          width: 120,
          dataIndex: "mobile"
        },
        {
          title: "胎号",
          width: 150,
          dataIndex: "tyreNo"
        },
        {
          title: "品牌",
          width: 100,
          dataIndex: "brand"
        },
        {
          title: "规格",
          width: 120,
          dataIndex: "specification"
        },
        {
          title: "花纹",
          width: 120,
          dataIndex: "patternModel"
        },
        {
          title: "进价",
          width: 80,
          dataIndex: "price"
        },
        {
          title: "售价",
          width: 80,
          scopedSlots: { customRender: "salePrice" }
        },
        {
          title: "订单状态",
          width: 100,
          scopedSlots: { customRender: "orderStatus" }
        },

        {
          title: "支付方式",
          width: 100,
          scopedSlots: { customRender: "paymentMethod" }
        },
        {
          title: "支付时间",
          width: 170,
          scopedSlots: { customRender: "payTime" }
        },
        {
          title: "创建时间",
          width: 170,
          scopedSlots: { customRender: "addTime" }
        },

        {
          title: "操作",
          width: 100,
          fixed: "right",
          scopedSlots: { customRender: "operation" }
        }
      ],
      idField: "orderNumber",
      crudMethod: { ...orderApi }
    })
  },
  filters: {},
  data() {
    return {
      isEdit: false,
      inputValue: "",
      infoStatus: "",
      orderInfo: {},
      waitChekOut: false,
      isEditCheckOrder: false,
      submitForm: {},
      csubmitForm: {},
      storeList: [],
      operationList: []
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
    salePriceFilter(record) {
      if (record.salePrice && record.salePrice != "-") {
        return record.salePrice
      } else if (record.actual_price && record.actual_price != "-") {
        return record.actual_price
      } else {
        return "-"
      }
    },
    goodNameFilter(record) {
      if (record.goods_name && record.goods_name != "-") {
        return record.goods_name
      } else {
        return `${record.brand}-${record.patternModel}`
      }
    },
    oderStatusFilter(val) {
      return orderConfig.ORDER_STATUS[val]
    },
    payStatusFilter(val) {
      return orderConfig.PAY_STATUS[val]
    },
    paymentMethodFilter(val) {
      return orderConfig.PAYMENT_METHOD[val]
    },
    timeToString(val) {
      return new Dayjs(Number(val)).format("YYYY-MM-DD hh:mm:ss")
    },

    //待使用
    async doneOrder() {
      const orderNumbers = this.crud.selections
      const res = await orderApi.doneOrder({ orderNumbers })
      console.log(`done order response:${JSON.stringify(res)}`)
      this.crud.toQuery()
      // if(!orderNumbers || orderNumbers.length === 0){
      //   return
      // }
    },

    //待使用
    async toDoneSingleOrder() {
      const orderNumbers = [this.orderInfo.order_sn]
      console.log(`this.orderInfo:${JSON.stringify(this.orderInfo)}`)
      const goods = this.orderInfo.goods
      let currentTotalInstalledNumber = goods.reduce(
        (acc, cur) => acc + cur.currentInstallNumber,
        0
      )
      console.log(`currentTotalInstalledNumber:${currentTotalInstalledNumber}`)
      if (!currentTotalInstalledNumber) {
        alert("请确认商品数量")
        return
      }
      await orderApi.doneOrder({ orderNumbers, goods })
      this.infoStatus = ""
      this.crud.toQuery()
    },

    //开启表格编辑效果状态
    toEditCheckOrder() {
      this.isEditCheckOrder = true
      //将需要编辑的数据进行备份
      let obj = {
        vehicle: this.orderInfo.vehicle,
        storeName: this.orderInfo.storeName
      }
      //取消编辑后，submitForm备份过的数据，可以用来恢复；csubmitForm的数据可以用来记录修改
      this.submitForm = _.cloneDeep(obj)
      this.csubmitForm = _.cloneDeep(obj)
    },

    async toGetChekOrder() {
      const orderNumber = this.orderInfo.order_sn
      console.log(`orderNumber:${orderNumber}`)
      const { data, errno } = await getCheckOrderZip({ orderNumber })
      if (!errno && data && data.length > 0) {
        this.infoStatus = ""
        const downLoadPdfPromises = data.map(ossUrl => {
          const [, fileName] = ossUrl.match(/http:\/\/.*\/.*\/(.*)/)
          return downloadFileByUrl(ossUrl, fileName)
        })
        Promise.all(downLoadPdfPromises)
      }
    },

    //恢复表格编辑前的状态
    resetForm() {
      //将表格数据恢复成编辑前的状态
      this.csubmitForm = _.cloneDeep(this.submitForm)
      this.isEditCheckOrder = false
    },

    //提交表格编辑的数据
    async submitCU() {
      const orderId = this.orderInfo.id
      const goods = this.orderInfo.goods
      let currentTotalInstalledNumber = goods.reduce(
        (acc, cur) => acc + cur.currentInstallNumber,
        0
      )
      if (!currentTotalInstalledNumber) {
        alert("请确认商品数量")
        return
      }
      this.waitChekOut = true
      const { data, errno, errmsg } = await postCheckOrder({
        ...this.csubmitForm,
        id: orderId,
        goods
      })
      this.waitChekOut = false
      if (!errno) {
        this.infoStatus = ""
        this.resetForm()
        window.open(data.result, "_blank")
      } else {
        alert(errmsg)
      }
    },

    async toInfo(recode) {
      this.isEditCheckOrder = false
      this.waitChekOut = false
      const { result } = await orderApi.getOperateList({
        tyreID: recode.tyreID
      })
      this.infoStatus = "info"
      this.operationList = result.list
      console.log(`this.operationList : ${JSON.stringify(this.operationList)}`)
    }
  },
  components: { SearchOptions, Operations, Pagination, OperationList },
  async created() {
    // let { code } = this.$route.meta
    // console.log(`code:${JSON.stringify(code)}`)
    this.crud.optShow.add = false
    this.crud.optShow.del = false
    this.crud.optShow.download = false
    this.crud.optShow.edit = false
    // this.crud.permission = {
    //   download: true
    // }
    const { result: data } = await getStoreList()
    this.storeList = data.list
  }
}
</script>
