<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="车牌号">
              <a-input v-model="crud.query.vehicleNumber" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="所属站">
              <a-select v-model="crud.query.stationID" placeholder="请选择">
                <a-select-option
                  v-for="item in stationData"
                  :value="item.stationID"
                  :key="item.stationID"
                  >{{ item.name }}</a-select-option
                >
              </a-select>
            </a-form-item>
          </a-col>
          <SearchOptions :toggleShowAdvance="false" />
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="流动服务车列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="serviceVehicleID"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="operation" slot-scope="record">
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('获取服务车详情')"
              @click="crud.toInfo(record)"
            >
              详情
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <!-- 填写表单部分 -->
    <div class="form-container">
      <a-modal
        wrapClassName="stationListDialog"
        :visible="crud.status.cu > 0 || crud.status.in > 0"
        @cancel="crud.cancelCU()"
        :title="crud.status.title"
      >
        <a-form-model
          ref="form"
          labelAlign="left"
          :class="
            crud.status.in > 0 && crud.status.cu === 0 ? 'disabled-form' : ''
          "
          :model="form"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :rules="rules"
        >
          <a-form-model-item label="车牌号" prop="vehicleNumber">
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.vehicleNumber"
            />
          </a-form-model-item>
          <a-form-model-item label="所属服务站" prop="stationID">
            <a-select
              v-model="form.stationID"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              show-search
              :show-arrow="false"
              :filter-option="filterOption"
              :not-found-content="null"
              placeholder="请选择"
              option-filter-prop="children"
            >
              <a-select-option
                v-for="item in stationData"
                :value="item.stationID"
                :key="item.stationID"
                >{{ item.name }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="联系人" prop="contactPerson">
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.contactPerson"
            />
          </a-form-model-item>
          <a-form-model-item label="联系电话" prop="phoneNum">
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.phoneNum"
            />
          </a-form-model-item>
        </a-form-model>
        <template slot="footer">
          <div v-if="crud.status.cu > 0">
            <a-button
              v-if="crud.status.add > 0"
              key="back"
              @click="crud.cancelCU()"
            >
              取消
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
              placement="topRight"
              ok-text="删除"
              cancel-text="取消"
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
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header, form } from "@crud/crud"
import Api from "@/api/station/vehicle"
import apiAccount from "@/api/system/account"

// 表格的填充字段
const defaultForm = {
  serviceVehicleID: "",
  stationID: "",
  vehicleNumber: "",
  contactPerson: "",
  phoneNum: ""
}

export default {
  name: "Station",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "流动服务车",
      columns: [
        {
          title: "车牌号",
          dataIndex: "vehicleNumber"
        },
        {
          title: "所属服务站",
          dataIndex: "name"
        },
        {
          title: "联系姓名",
          dataIndex: "contactPerson"
        },
        {
          title: "联系人电话",
          dataIndex: "phoneNum"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...Api },
      idField: "serviceVehicleID" // 设置每一条记录的唯一标失
    })
  },
  filters: {},
  data() {
    let checkvehicleNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入车牌号！"))
      }
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (reg.test(value)) {
        callback(new Error("车牌号只能输入中文、数字和字母！"))
      } else if (value.trim().length < 7 || value.trim().length > 8) {
        callback(new Error("车牌号只能7-8个字符！"))
      } else {
        callback()
      }
    }
    let checkPending
    let checkContactPhone = (rule, value, callback) => {
      clearTimeout(checkPending)
      if (!value) {
        return callback(new Error("请输入手机号！"))
      }
      checkPending = setTimeout(() => {
        if (!/^[0-9]+$/.test(value)) {
          callback(new Error("请输入数字！"))
        } else {
          if (!/^1[3456789]\d{9}$/.test(value)) {
            callback(new Error("请输入正确手机号"))
          } else {
            callback()
          }
        }
      }, 1000)
    }
    let checkContactPerson = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入联系人姓名！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("联系人姓名只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 5) {
        callback(new Error("联系人姓名只能2-5个字符！"))
      } else {
        callback()
      }
    }
    return {
      stationData: [],
      rules: {
        vehicleNumber: [
          { required: true, validator: checkvehicleNumber, trigger: "blur" }
        ],
        stationID: [
          { required: true, message: "请选择所属服务站", trigger: "change" }
        ],
        contactPerson: [
          { required: true, validator: checkContactPerson, trigger: "blur" }
        ],
        phoneNum: [
          { required: true, validator: checkContactPhone, trigger: "blur" }
        ]
      }
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta

    console.log(code)
    // 关闭下载功能
    this.crud.optShow.download = true
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增服务车"),
      del: code.includes("删除服务车"),
      edit: code.includes("修改服务车"),
      download: true
    }

    apiAccount.getStationList({}).then(res => {
      if (res.code === 0) {
        this.stationData = res.result.list
      }
    })
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    }
  }
}
</script>
