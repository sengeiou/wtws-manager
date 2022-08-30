<template>
  <div class="app-container">
    <div class="head-container">
      <a-form
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        layout="inline"
      >
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
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
          <a-col :md="8" :sm="24">
            <a-form-item label="胎号">
              <a-input v-model="crud.query.tyreNo" style="width: 100%" />
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="轮胎状态">
                <a-select v-model="crud.query.tyreStatus" placeholder="请选择">
                  <a-select-option
                    v-for="item in tyrestatusList"
                    :key="item.key"
                    :value="item.value"
                    >{{ item.key }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="轮胎仓储状态">
                <a-select
                  v-model="crud.query.storageStatus"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="item in storagestatusList"
                    :key="item.key"
                    :value="item.value"
                    >{{ item.key }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="轮胎品牌">
                <a-input v-model="crud.query.brand" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="轮胎规格">
                <a-input
                  v-model="crud.query.specification"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="车牌号">
                <a-input v-model="crud.query.vehicleNum" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="是否翻新胎">
                <a-select v-model="crud.query.isRetread" placeholder="请选择">
                  <a-select-option
                    v-for="item in isRetreadMap"
                    :key="item.key"
                    :value="item.value"
                    >{{ item.key }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="当前平均花纹深度">
                <a-select
                  v-model="crud.query.patternContent"
                  placeholder="请选择"
                >
                  <a-select-option
                    v-for="item in initialpatternList"
                    :key="item.key"
                    :value="item.value"
                    >{{ item.key }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="创建时间">
                <a-range-picker
                  v-model="crud.query.times"
                  format="YYYY-MM-DD"
                  @change="timeChange"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="到货时间">
                <a-range-picker
                  v-model="crud.query.arrivalTimes"
                  format="YYYY-MM-DD"
                  @change="arrivalTimeChange"
                />
              </a-form-item>
            </a-col>
          </template>
          <SearchOptions />
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="轮胎列表" />
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
          rowKey="tyreID"
        >
          <template slot="tyreStatus" slot-scope="record">
            {{ tyreStatusFilter(record.tyreStatus) }}
          </template>
          <template slot="storageStatus" slot-scope="record">
            {{ storageStatusFilter(record.storageStatus) }}
          </template>
          <template slot="operation" slot-scope="record">
            <a-button type="link" @click="toInfo(record)">
              详情
            </a-button>

            <a-button @click="inventoryTyre(record)">
              盘点
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <!-- 填写表单部分 -->
    <div class="form-container">
      <a-modal
        :title="crud.status.title"
        :visible="crud.status.cu > 0 || crud.status.in > 0"
        wrapClassName="stationListDialog"
        @cancel="crud.cancelCU()"
      >
        <a-form-model
          ref="form"
          :class="
            crud.status.in > 0 && crud.status.cu === 0 ? 'disabled-form' : ''
          "
          :label-col="{ span: 8 }"
          :model="form"
          :rules="rules"
          :wrapper-col="{ span: 16 }"
          labelAlign="left"
        >
          <a-form-model-item label="所属服务站" prop="stationID">
            <a-select
              v-model="form.stationID"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :filter-option="false"
              :not-found-content="null"
              :show-arrow="false"
              placeholder="请选择"
              show-search
              @search="handleSearch"
            >
              <a-select-option
                v-for="item in stationList"
                :key="item.stationID"
                :value="item.stationID"
                >{{ item.name }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="轮胎状态" prop="tyreStatus">
            <a-select
              v-model="form.tyreStatus"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            >
              <a-select-option
                v-for="item in tyrestatusList"
                :key="item.key"
                :value="item.value"
                >{{ item.key }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="轮胎编号" prop="tyreNo">
            <a-input
              v-model="form.tyreNo"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
            />
          </a-form-model-item>
          <a-form-model-item label="轮胎种类名称" prop="tyreTemplateID">
            <a-select
              v-model="form.tyreTemplateID"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :filter-option="false"
              :not-found-content="null"
              :show-arrow="false"
              placeholder="请选择"
              show-search
              @search="handleTempSearch"
            >
              <a-select-option
                v-for="item in tempList"
                :key="item.tyreTemplateID"
                :value="item.tyreTemplateID"
                >{{ item.templateName }}
              </a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.tyreStatus === '2'"
            label="回收胎平均花纹深度"
            prop="initPattern"
          >
            <a-input-number
              v-model="form.initPattern"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              :formatter="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d\d).*$/,
                    Math.floor(Number(value) * 1000) / 1000
                  )
              "
              :min="1"
              :parser="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d\d).*$/,
                    Math.floor(Number(value) * 1000) / 1000
                  )
              "
              :step="1"
            />
            <span style="marign-left:10px;display:inline-block;">mm</span>
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <div v-if="crud.status.cu > 0">
            <a-button
              v-if="crud.status.add > 0"
              key="back"
              @click="crud.resetForm()"
            >
              重置
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="back"
              @click="crud.cancelCU('uptoinfo')"
            >
              取消
            </a-button>
            <a-button
              v-if="crud.status.add > 0"
              key="submit"
              type="primary"
              @click="crud.submitCU()"
            >
              提交
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="submit"
              type="primary"
              @click="crud.submitCU()"
            >
              保存
            </a-button>
          </div>
          <div v-if="crud.status.in > 0 && crud.status.cu === 0">
            <a-button
              key="back"
              :disabled="!crud.permission.edit"
              @click="crud.toEdit()"
            >
              修改
            </a-button>
            <a-popconfirm
              cancel-text="取消"
              ok-text="删除"
              placement="topRight"
              @confirm="crud.doDelete(null, 'close')"
            >
              <template slot="title">
                你确定要删除吗？
              </template>
              <a-button
                key="submit"
                :disabled="!crud.permission.del"
                type="danger"
              >
                删除
              </a-button>
            </a-popconfirm>
          </div>
        </template>
      </a-modal>
    </div>
    <div>
      <a-modal
        :visible="InfoStatus !== ''"
        :width="1080"
        wrapClassName="tyreInfoDialog"
        @cancel="cancelCU()"
      >
        <a-tabs :activeKey="activeKey" type="card" @change="callback">
          <a-tab-pane key="1" tab="轮胎基本信息">
            <div class="tab1">
              <div>
                <div class="_l">轮胎胎号：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    tyreInfo.tyreNo
                  }}</span>
                  <!--                  <a-input-->
                  <!--                    v-if="InfoStatus === 'edit'"-->
                  <!--                    v-model="csubmitForm.tyreNo"-->
                  <!--                  />-->
                </div>
              </div>
              <div>
                <div class="_l">所属服务站：</div>
                <div class="_r">{{ tyreInfo.stationName }}</div>
              </div>
              <div>
                <div class="_l">轮胎状态：</div>
                <div class="_r">
                  {{ tyreStatusFilter(tyreInfo.tyreStatus) }}
                </div>
              </div>
              <div>
                <div class="_l">车辆所属企业：</div>
                <div class="_r">{{ tyreInfo.enterpriseName }}</div>
              </div>
              <div>
                <div class="_l">轮胎存储状态：</div>
                <div class="_r">
                  {{ storageStatusFilter(tyreInfo.storageStatus) }}
                </div>
              </div>
              <div>
                <div class="_l">车辆所属车队：</div>
                <div class="_r">{{ tyreInfo.fleetName }}</div>
              </div>
              <div>
                <div class="_l">品牌：</div>
                <div class="_r">{{ tyreInfo.brand }}</div>
              </div>
              <div>
                <div class="_l">安装车牌：</div>
                <div class="_r">{{ tyreInfo.vehicleNumber }}</div>
              </div>
              <div>
                <div class="_l">规格：</div>
                <div class="_r">{{ tyreInfo.specification }}</div>
              </div>
              <div>
                <div class="_l">安装轮位：</div>
                <div class="_r">{{ tyreInfo.wheelPosition }}</div>
              </div>
              <div>
                <div class="_l">花纹：</div>
                <div class="_r">{{ tyreInfo.patternModel }}</div>
              </div>
              <div></div>
              <div>
                <div class="_l">翻新次数：</div>
                <div class="_r">{{ tyreInfo.retreadNum }}</div>
              </div>
              <div></div>
              <div>
                <div class="_l">初测平均花纹深度：</div>
                <div class="_r">{{ tyreInfo.initPattern }}mm</div>
              </div>
              <div>
                <div class="_l">轮胎累计行驶里程：</div>
                <div class="_r">{{ tyreInfo.cumulativeMileage }}KM</div>
              </div>
              <div>
                <div class="_l">当前平均花纹深度：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'"
                    >{{ tyreInfo.patternContent }}mm</span
                  >
                  <!--                  <div v-if="InfoStatus === 'edit'">-->
                  <!--                    <a-input v-model="csubmitForm.patternContent" />-->
                  <!--                  </div>-->
                </div>
              </div>
              <div>
                <div class="_l">是否翻新：</div>
                <div class="_r">
                  {{ Number(tyreInfo.retreadNum) >= 1 ? "是" : "否" }}
                </div>
              </div>
              <div>
                <div class="_l">累计消耗平均花纹深度：</div>
                <div class="_r">{{ tyreInfo.cumulativePattern }}mm</div>
              </div>
              <div>
                <div class="_l">翻新品牌：</div>
                <div class="_r">{{ tyreInfo.retreadBrand }}</div>
              </div>
              <div>
                <div class="_l">磨耗极限:</div>
                <div class="_r">{{ tyreInfo.wearLimit }}</div>
              </div>
              <div>
                <div class="_l">翻新花纹：</div>
                <div class="_r">{{ tyreInfo.retreadlPattern }}</div>
              </div>
              <div>
                <div class="_l">胎温</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    tyreInfo.tyreTemperature
                  }}</span>
                  <!--                  <div v-if="InfoStatus === 'edit'">-->
                  <!--                    <a-input v-model="csubmitForm.tyreTemperature" />-->
                  <!--                  </div>-->
                </div>
              </div>
              <div></div>
              <div>
                <div class="_l">胎压：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    tyreInfo.tyrePressure
                  }}</span>
                  <!--                  <div v-if="InfoStatus === 'edit'">-->
                  <!--                    <a-input v-model="csubmitForm.tyrePressure" />-->
                  <!--                  </div>-->
                </div>
              </div>

              <div>
                <div class="_l">到货时间：</div>
                <div class="_r">
                  <span>{{ tyreInfo.arrivalTime || "-" }}</span>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="轮胎成本信息">
            <div class="tab2">
              <div>
                <div class="_l">轮胎胎号：</div>
                <div class="_r">{{ tyreInfo.tyreNo }}</div>
              </div>
              <div>
                <div class="_l">轮胎购买价：</div>
                <div class="_r">{{ tyreInfo.price }}</div>
              </div>
              <div>
                <div class="_l">增值税：</div>
                <div class="_r">{{ tyreInfo.valueAddedTax }}%</div>
              </div>
              <div>
                <div class="_l">不含税价：</div>
                <div class="_r">{{ tyreInfo.taxPrice }}</div>
              </div>
              <div>
                <div class="_l">累计消耗平均花纹深度：</div>
                <div class="_r">{{ tyreInfo.cumulativePattern }}mm</div>
              </div>
              <div>
                <div class="_l">累计行驶里程：</div>
                <div class="_r">{{ tyreInfo.cumulativeMileage }}KM</div>
              </div>
              <div>
                <div class="_l">KPM：</div>
                <div class="_r">{{ tyreInfo.KPM }}KM/mm</div>
              </div>
              <div>
                <div class="_l">CPK：</div>
                <div class="_r">{{ tyreInfo.CPK }}元/公里</div>
              </div>
              <div>
                <div class="_l">预计轮胎行驶里程：</div>
                <div class="_r">{{ tyreInfo.estimatedMileage }}KM</div>
              </div>
              <div>
                <div class="_l">剩余轮胎行驶里程：</div>
                <div class="_r">{{ tyreInfo.remainMileage }}KM</div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3" tab="轮胎操作记录">
            <OperationList :list="operationList" />
          </a-tab-pane>
        </a-tabs>
        <!--        <template slot="footer" v-if="activeKey === '1'">-->
        <!--          <div v-if="InfoStatus === 'info'">-->
        <!--            <a-button key="back" @click="toEdit()">-->
        <!--              修改-->
        <!--            </a-button>-->
        <!--          </div>-->
        <!--          <div v-if="InfoStatus === 'edit'">-->
        <!--            <a-button key="back" @click="resetForm">-->
        <!--              取消-->
        <!--            </a-button>-->
        <!--            <a-button key="submit" type="primary" @click="submitCU()">-->
        <!--              提交-->
        <!--            </a-button>-->
        <!--          </div>-->
        <!--        </template>-->
        <!--        <template slot="footer" v-if="activeKey !== '1'">-->
        <!--          <div></div>-->
        <!--        </template>-->
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
import tyreApi from "@/api/tyre"
import _ from "lodash"
import tyretempApi from "@/api/tyretemp"
import OperationList from "@/components/OperationList"

// 表格的填充字段
const defaultForm = {
  tyreID: "",
  stationID: "",
  tyreStatus: "",
  tyreNo: "",
  tyreTemplateID: "",
  initPattern: "",
  patternContent: "",
  tyreTemperature: "",
  tyrePressure: "",
  currentMileage: ""
}

export default {
  name: "Tyre",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "轮胎",
      columns: [
        {
          title: "胎号",
          dataIndex: "tyreNo"
        },
        {
          title: "轮胎状态",
          scopedSlots: { customRender: "tyreStatus" }
        },
        {
          title: "轮胎仓储状态",
          scopedSlots: { customRender: "storageStatus" }
        },
        {
          title: "轮胎品牌",
          dataIndex: "brand"
        },
        {
          title: "规格",
          dataIndex: "specification"
        },
        {
          title: "花纹",
          dataIndex: "patternModel"
        },
        {
          title: "所属服务站名称",
          width: 350,
          dataIndex: "stationName"
        },
        {
          title: "安装车牌",
          dataIndex: "vehicleNumber"
        },
        {
          title: "安装轮位",
          dataIndex: "wheelPosition"
        },
        {
          title: "上次盘点日期",
          width: 200,
          dataIndex: "inventoryTime"
        },
        {
          title: "操作",
          fixed: "right",
          width: 200,
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...tyreApi },
      idField: "tyreID" // 设置每一条记录的唯一标失
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
    let checkTyreNo = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (!value) {
        return callback(new Error("请输入胎号！"))
      }
      if (!/^[a-zA-Z0-9_]{0,}$/.test(value)) {
        callback(new Error("胎号不能输入中文！"))
      } else if (reg.test(value)) {
        callback(new Error("不能输入特殊字符！"))
      } else if (value.trim().length < 5 || value.trim().length > 15) {
        callback(new Error("胎号只能5-15个字符！"))
      } else {
        callback()
      }
    }
    let checkInitPattern = (rule, value, callback) => {
      if (this.form.tyreStatus === "2") {
        if (!value) {
          return callback(new Error("请输入回收胎平均花纹深度！"))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      stationData: [],
      stationList: [],
      copyStationList: [],
      stationIDMap: [],
      rules: {
        stationID: [
          { required: true, message: "请选择服务站", trigger: "change" }
        ],
        tyreStatus: [
          { required: true, message: "请选择轮胎状态", trigger: "change" }
        ],
        tyreNo: [{ required: true, validator: checkTyreNo, trigger: "blur" }],
        tyreTemplateID: [
          { required: true, message: "请选择轮胎种类", trigger: "change" }
        ],
        initPattern: [
          {
            required: true,
            validator: checkInitPattern,
            trigger: "blur"
          }
        ]
      },
      tyrestatusList: [],
      storagestatusList: [],
      isRetreadMap: [],
      initialpatternList: [],
      summileageList: [],

      tempList: [],
      cpoyTempList: [],

      InfoStatus: "",
      tyreInfo: {},
      submitForm: {},
      csubmitForm: {},
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
      download: true
    }

    this.getStationList()

    this.getDictionary("tyrestatus")
    this.getDictionary("storagestatus")
    this.getDictionary("initialpattern")
    this.getDictionary("summileage")
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
          this.crud.query.arrivalTimes = [time1, time1]
          return
        }
      }
      this.crud.query.arrivalTimes = dateStrings
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
            case "tyrestatus":
              this.tyrestatusList = res.result.list
              break
            case "storagestatus":
              this.storagestatusList = res.result.list
              break
            case "initialpattern":
              this.initialpatternList = res.result.list
              break
            case "summileage":
              this.summileageList = res.result.list
              break
            default:
              break
          }
        }
      })
    },
    tyreStatusFilter(val) {
      let arr =
        this.tyrestatusList === null
          ? []
          : this.tyrestatusList.filter(item => {
              return item.value == String(val)
            })
      return arr.length > 0 ? arr[0].key : ""
    },
    storageStatusFilter(val) {
      let arr =
        this.storagestatusList === null
          ? []
          : this.storagestatusList.filter(item => {
              return item.value == String(val)
            })
      return arr.length > 0 ? arr[0].key : ""
    },
    getTempList() {
      tyretempApi.getTyreTemplateList({}).then(res => {
        if (res.code === 0) {
          this.tempList = res.result.list
          this.cpoyTempList = res.result.list
        }
      })
    },
    handleTempSearch(value) {
      this.tempList = this.cpoyTempList.filter(item => {
        return item.templateName.includes(value)
      })
    },
    toInfo(record) {
      this.tyreInfo = {}
      this.InfoStatus = "info"
      this.operationList = []
      this.activeTyreID = record.tyreID
      tyreApi.getTyreInfo({ tyreID: record.tyreID }).then(res => {
        if (res.code === 0) {
          this.tyreInfo = res.result.tyreInfo
          tyreApi
            .getOperationList({ paramsInfo: { tyreID: record.tyreID } })
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
    toEdit() {
      this.InfoStatus = "edit"
      let obj = {
        tyreID: this.activeTyreID,
        tyreNo: this.tyreInfo.tyreNo,
        patternContent: this.tyreInfo.patternContent,
        tyreTemperature: this.tyreInfo.tyreTemperature,
        tyrePressure: this.tyreInfo.tyrePressure
      }
      this.submitForm = _.cloneDeep(obj)
      this.csubmitForm = _.cloneDeep(obj)
    },
    resetForm() {
      this.csubmitForm = _.cloneDeep(this.submitForm)
      this.InfoStatus = "info"
    },
    submitCU() {
      tyreApi.edit(this.csubmitForm).then(res => {
        console.log(res)
        if (res.code === 14) {
          this.InfoStatus = "info"
          this.tyreInfo.tyreNo = this.csubmitForm.tyreNo
          this.tyreInfo.patternContent = this.csubmitForm.patternContent
          this.tyreInfo.tyreTemperature = this.csubmitForm.tyreTemperature
          this.tyreInfo.tyrePressure = this.csubmitForm.tyrePressure
          this.crud.toQuery()
        }
      })
    },
    cancelCU() {
      this.InfoStatus = ""
      this.tyreInfo = {}
      this.submitForm = {}
      this.csubmitForm = {}
      this.activeTyreID = ""
    },
    async inventoryTyre(record) {
      await tyreApi.inventoryTyre({ tyreID: record.tyreID })
      this.crud.refresh()
    }
  }
}
</script>
