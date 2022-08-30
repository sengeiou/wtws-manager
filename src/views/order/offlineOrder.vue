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
            <a-form-model-item label="订单号">
              <a-input
                allowClear
                v-model="crud.query.orderNumber"
                placeholder="请填写订单号"
              >
              </a-input>
            </a-form-model-item>
          </a-col>

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

          <template v-if="crud.advanced">
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
              <a-form-model-item label="订单状态">
                <a-select
                  allowClear
                  v-model="crud.query.orderStatus"
                  placeholder="请选择订单状态"
                >
                  <a-select-option :value="0">未付款</a-select-option>
                  <a-select-option :value="2">已付款</a-select-option>
                  <a-select-option :value="3">部分安装</a-select-option>
                  <a-select-option :value="5">已完成</a-select-option>
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
          rowKey="order_sn"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
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
          <a-tab-pane key="1" tab="订单信息">
            <div class="tab1">
              <div>
                <div class="_l">订单单号：</div>
                <div class="_r">
                  <span v-if="infoStatus === 'info'">{{
                    orderInfo.order_sn
                  }}</span>
                </div>
              </div>
              <div>
                <div class="_l">选择店名：</div>
                <div class="_r">
                  <span v-if="!isEditCheckOrder"
                    >{{ orderInfo.storeName }}
                  </span>
                  <!--                  <a-input-->
                  <!--                      v-if="isEditCheckOrder"-->
                  <!--                      v-model="csubmitForm.storeName"-->
                  <!--                  />-->
                  <a-select
                    v-if="isEditCheckOrder"
                    v-model="csubmitForm.storeName"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="item in storeList"
                      :value="item.name"
                      :key="item.id"
                      >{{ item.name }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div>
                <div class="_l">车牌号</div>
                <div class="_r">
                  <span v-if="!isEditCheckOrder">
                    {{ orderInfo.vehicle }}
                  </span>
                  <a-input
                    v-if="isEditCheckOrder"
                    v-model="csubmitForm.vehicle"
                  />
                </div>
              </div>

              <div>
                <div class="_l">用户姓名</div>
                <div class="_r">
                  {{ orderInfo.consignee }}
                </div>
              </div>

              <div>
                <div class="_l">订单手机号码</div>
                <div class="_r">
                  {{ orderInfo.mobile }}
                </div>
              </div>

              <div>
                <div class="_l">订单状态</div>
                <div class="_r">
                  {{ oderStatusFilter(orderInfo.order_status) }}
                </div>
              </div>

              <div>
                <div class="_l">支付方式</div>
                <div class="_r">
                  {{ paymentMethodFilter(orderInfo.payment_method) }}
                </div>
              </div>

              <div>
                <div class="_l">商品金额</div>
                <div class="_r">
                  {{ orderInfo.goods_price }}
                </div>
              </div>

              <div>
                <div class="_l">实付金额</div>
                <div class="_r">
                  {{ orderInfo.actual_price }}
                </div>
              </div>

              <div>
                <div class="_l">订单创建时间</div>
                <div class="_r">
                  {{ timeToString(orderInfo.add_time) }}
                </div>
              </div>

              <div>
                <div class="_l">订单支付时间</div>
                <div class="_r">
                  {{ timeToString(orderInfo.pay_time) }}
                </div>
              </div>

              <a-divider>商品列表</a-divider>
              <div
                class="good-list"
                v-for="(item, sindex) in orderInfo.goods"
                :key="sindex"
              >
                <template>
                  <a-form layout="inline">
                    <a-row :gutter="150">
                      <a-col :md="8" :sm="24">
                        <div class="_gl">轮胎胎号</div>
                        <div class="_gr">
                          {{ item.tyreNo }}
                        </div>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <div class="_gl">轮胎品牌</div>
                        <div class="_gr">
                          {{ item.brand }}
                        </div>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <div class="_gl">轮胎规格</div>
                        <div class="_gr">
                          {{ item.specification }}
                        </div>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <div class="_gl">轮胎花纹</div>
                        <div class="_gr">
                          {{ item.patternModel }}
                        </div>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <div class="_gl">轮胎进价</div>
                        <div class="_gr">
                          {{ item.price }}
                        </div>
                      </a-col>
                      <a-col :md="8" :sm="24">
                        <div class="_gl">轮胎售价</div>
                        <div class="_gr">
                          {{ item.salePrice || 0 }}
                        </div>
                      </a-col>
                      <a-col :md="8" :sm="24" v-if="isEditCheckOrder">
                        <div class="_gl" style="color: red">本次安装数量:</div>
                        <div class="_gr">
                          <a-input-number
                            :disabled="item.maxInstallNumber > 0 ? false : true"
                            :min="0"
                            :max="item.maxInstallNumber"
                            v-model="item.currentInstallNumber"
                          />
                        </div>
                      </a-col>
                    </a-row>
                  </a-form>
                </template>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
        <template slot="footer">
          <div v-if="!isEditCheckOrder">
            <a-button
              key="toGetChekOrder"
              v-if="orderInfo.order_status == 5 || orderInfo.order_status == 3"
              @click="toGetChekOrder()"
            >
              获取历史客户确认单
            </a-button>
            <a-button
              key="toEditCheckOrder"
              v-if="orderInfo.order_status != 5"
              @click="toEditCheckOrder()"
            >
              生成客户确认单并出库安装
            </a-button>
            <a-button key="back" @click="infoStatus = ''">
              取消
            </a-button>
          </div>
          <div v-if="isEditCheckOrder">
            <a-button key="back" @click="resetForm">
              取消
            </a-button>
            <a-button
              key="submit"
              type="primary"
              @click="submitCU()"
              :disabled="waitChekOut"
            >
              生成并出库安装
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
import orderApi from "@/api/order/offline"
import { orderConfig } from "@/config/index"
import { downloadFileByUrl } from "../../utils/utils"
import Dayjs from "dayjs"
import {
  postCheckOrder,
  getStoreList,
  getCheckOrderZip
} from "../../api/order/offline"
import _ from "lodash"

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
      title: "订单列表",
      columns: [
        {
          title: "单号",
          dataIndex: "order_sn"
        },
        {
          title: "车牌号",
          dataIndex: "vehicle"
        },
        {
          title: "用户手机号",
          dataIndex: "mobile"
        },
        {
          title: "商品总金额",
          dataIndex: "goods_price"
        },
        {
          title: "实付金额",
          dataIndex: "actual_price"
        },
        {
          title: "订单状态",
          scopedSlots: { customRender: "orderStatus" }
        },

        {
          title: "支付方式",
          scopedSlots: { customRender: "paymentMethod" }
        },
        {
          title: "支付时间",
          scopedSlots: { customRender: "payTime" }
        },
        {
          title: "创建时间",
          scopedSlots: { customRender: "addTime" }
        },

        {
          title: "操作",
          width: 100,
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
      canEdit: this.$route.meta.code.includes("批量编辑价格"),
      stationData: [],
      allEnterprise: [],
      infoStatus: "",
      orderInfo: {},
      waitChekOut: false,
      isEditCheckOrder: false,
      submitForm: {},
      csubmitForm: {},
      storeList: []
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
      const { result } = await orderApi.getOrderDetail({
        orderID: recode.id
      })
      result.goods.forEach(good => {
        good.currentInstallNumber =
          good.number - Number(good.installed_number || 0)
        good.maxInstallNumber = good.number - Number(good.installed_number || 0)
      })
      this.infoStatus = "info"
      this.orderInfo = result
    }
  },
  components: { SearchOptions, Operations, Pagination },
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
