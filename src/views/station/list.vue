<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="服务站">
              <a-input v-model="crud.query.name" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="联系人">
              <a-input v-model="crud.query.contactPerson" style="width: 100%" />
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="地址">
                <a-input v-model="crud.query.address" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>
          <SearchOptions />
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="服务站信息列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="stationID"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="operation" slot-scope="record">
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('获取服务站详情')"
              @click="crud.toInfo(record)"
            >
              详情
            </a-button>
            |
            <a-button type="link" @click="showMap(record)">
              地图
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <map-drag
      :type="showType"
      :mapVisible.sync="mapVisible"
      @getLocation="getLocation"
      :lng.sync="lng"
      :lat.sync="lat"
    ></map-drag>
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
          <a-form-model-item label="服务站名称" prop="name">
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.name"
            />
          </a-form-model-item>
          <a-form-model-item label="联系人" prop="contactPerson">
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.contactPerson"
            />
          </a-form-model-item>
          <a-form-model-item label="联系电话" prop="contactPhone">
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.contactPhone"
            />
          </a-form-model-item>
          <a-form-model-item
            class="address-form-model-item"
            label="详细地址"
            prop="address"
          >
            <a-input :disabled="true" v-model="form.address" />
            <a-button
              v-if="crud.status.cu > 0"
              @click="showMap({}, 'choose')"
              type="primary"
              >选择地址</a-button
            >
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
import mapDrag from "@/components/MapDrag"
import listApi from "@/api/station/list"

// 表格的填充字段
const defaultForm = {
  stationID: "",
  name: "",
  address: "",
  contactPerson: "",
  contactPhone: "",
  longitude: "",
  latitude: ""
}

export default {
  name: "Station",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      url: "/station/getStationList",
      title: "服务站",
      columns: [
        {
          title: "服务站名称",
          dataIndex: "name"
        },
        {
          title: "联系人",
          dataIndex: "contactPerson"
        },
        {
          title: "联系电话",
          dataIndex: "contactPhone"
        },
        {
          title: "详细地址",
          dataIndex: "address"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...listApi },
      idField: "stationID" // 设置每一条记录的唯一标失
    })
  },
  filters: {},
  data() {
    let checkName = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (!value) {
        return callback(new Error("请输入服务站名称！"))
      }
      if (reg.test(value)) {
        callback(new Error("不能输入特殊字符！"))
      } else {
        if (value.trim().length < 5 || value.trim().length > 20) {
          callback(new Error("服务站名称只能5-20个字符"))
        } else {
          callback()
        }
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
      stationIDMap: [],
      mapVisible: false,
      lng: "",
      lat: "",
      showType: "info",
      rules: {
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        contactPerson: [
          { required: true, validator: checkContactPerson, trigger: "blur" }
        ],
        contactPhone: [
          { required: true, validator: checkContactPhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请选择服务站地址", trigger: "blur" }
        ]
      }
    }
  },
  components: { SearchOptions, Operations, Pagination, mapDrag },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta

    // 关闭下载功能
    this.crud.optShow.download = false
    this.crud.optShow.edit = false
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增服务站"),
      del: code.includes("删除服务站"),
      edit: code.includes("编辑服务站")
    }
  },
  methods: {
    getLocation(res) {
      if (this.showType !== "info") {
        if (res.status === "confirm") {
          this.form.longitude = res.data.lng
          this.form.latitude = res.data.lat
          this.form.address = res.data.address
        }
      }
    },
    showMap(it, type = "info") {
      if (type === "info") {
        this.lat = String(it.latitude)
        this.lng = String(it.longitude)
      }
      this.mapVisible = true
      this.showType = type
    }
  }
}
</script>
