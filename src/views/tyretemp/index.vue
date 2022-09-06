<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="6" :sm="24">
            <a-form-item label="品牌">
              <a-spin :spinning="brandLoading">
                <a-select
                  show-search
                  v-model="crud.query.brand"
                  @change="brandChange"
                >
                  <a-select-option
                    v-for="(item, index) in brandList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-spin>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="规格">
              <a-spin :spinning="specificationLoading">
                <a-select
                  show-search
                  v-model="crud.query.specification"
                  @change="specificationChange"
                >
                  <a-select-option
                    v-for="(item, index) in specificationList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-spin>
            </a-form-item>
          </a-col>
          <a-col :md="6" :sm="24">
            <a-form-item label="花纹">
              <a-spin :spinning="patternModelLoading">
                <a-select
                  show-search
                  v-model="crud.query.patternModel"
                  @change="patternModelChange"
                >
                  <a-select-option
                    v-for="(item, index) in patternModelList"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.label }}
                  </a-select-option>
                </a-select>
              </a-spin>
            </a-form-item>
          </a-col>
          <SearchOptions :grid="6" :toggleShowAdvance="false" />
        </a-row>
      </a-form>
    </div>
    <div class="table-container">
      <Operations tableName="轮胎种类列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="tyreTemplateID"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="isRetread" slot-scope="record">
            {{ record.isRetread === 1 ? "否" : "是" }}
          </template>
          <template slot="operation" slot-scope="record">
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('获取轮胎种类详情')"
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
          :label-col="{ span: 8 }"
          :wrapper-col="{ span: 16 }"
          :rules="rules"
        >
          <a-form-model-item label="品牌" prop="brand">
            <el-autocomplete
              style="width:100%;"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.brand"
              size="medium"
              :fetch-suggestions="querySearchBrand"
            ></el-autocomplete>
          </a-form-model-item>
          <a-form-model-item label="规格" prop="specification">
            <el-autocomplete
              style="width:100%;"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.specification"
              size="medium"
              :fetch-suggestions="querySearchSpecification"
            ></el-autocomplete>
          </a-form-model-item>
          <a-form-model-item label="花纹" prop="patternModel">
            <el-autocomplete
              style="width:100%;"
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.patternModel"
              size="medium"
              :fetch-suggestions="querySearchPatternModel"
            ></el-autocomplete>
          </a-form-model-item>
          <a-form-model-item label="是否翻新" prop="isRetread">
            <a-select
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.isRetread"
              placeholder="请选择"
            >
              <a-select-option :value="1">否</a-select-option>
              <a-select-option :value="2">是</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.isRetread === 2"
            label="翻新品牌"
            prop="retreadBrand"
          >
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.retreadBrand"
            />
          </a-form-model-item>
          <a-form-model-item
            v-if="form.isRetread === 2"
            label="翻新花纹"
            prop="retreadlPattern"
          >
            <a-input
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.retreadlPattern"
            />
          </a-form-model-item>
          <a-form-model-item
            v-if="form.isRetread === 2"
            label="翻新平均花纹深度"
            prop="retreadInitialPattern"
          >
            <a-input-number
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.retreadInitialPattern"
              :min="0"
              :max="100"
              :formatter="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d\d).*$/,
                    Math.floor(Number(value) * 100) / 100
                  )
              "
              :parser="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d\d).*$/,
                    Math.floor(Number(value) * 100) / 100
                  )
              "
              :step="0.1"
            /><span style="display:inlne-block;margin-left:10px">mm</span>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.isRetread === 1"
            label="新胎平均花纹深度"
            prop="initialPattern"
          >
            <a-input-number
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.initialPattern"
              :min="0"
              :max="100"
              :formatter="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d\d).*$/,
                    Math.floor(Number(value) * 100) / 100
                  )
              "
              :parser="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d\d).*$/,
                    Math.floor(Number(value) * 100) / 100
                  )
              "
              :step="0.1"
            /><span style="display:inlne-block;margin-left:10px">mm</span>
          </a-form-model-item>
          <a-form-model-item label="磨耗极限" prop="wearLimit">
            <a-input-number
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.wearLimit"
              :min="0"
              :max="9999"
              :formatter="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d).*$/,
                    Math.floor(Number(value) * 10) / 10
                  )
              "
              :parser="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d\d).*$/,
                    Math.floor(Number(value) * 10) / 10
                  )
              "
              :step="0.1"
            /><span style="display:inlne-block;margin-left:10px">mm</span>
          </a-form-model-item>
          <a-form-model-item label="花纹沟数" prop="initialPatternNum">
            <a-input-number
              :disabled="crud.status.in > 0 && crud.status.cu === 0"
              v-model="form.initialPatternNum"
              :min="1"
              :max="6"
              :formatter="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d).*$/,
                    Math.floor(Number(value))
                  )
              "
              :parser="
                value =>
                  `${value}`.replace(
                    /^(-)*(\d+)\.(\d).*$/,
                    Math.floor(Number(value))
                  )
              "
              :step="1"
            />
          </a-form-model-item>
          <a-form-model-item label="轮胎残值" prop="surplusValue">
            <a-input :disabled="true" v-model="form.surplusValue" />
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
import listApi from "@/api/tyretemp"
import { getTyreBrandList } from "@/api/tyretemp"
import _ from "lodash"

// 表格的填充字段
const defaultForm = {
  tyreTemplateID: "",
  brand: "",
  specification: "",
  patternModel: "",
  initialPattern: "",
  wearLimit: "",
  initialPatternNum: "",
  surplusValue: 40,
  isRetread: 1,
  retreadlPattern: "",
  retreadInitialPattern: "",
  retreadBrand: ""
}

export default {
  name: "Station",
  // presenter 生成crud对象
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      query: {
        brand: "",
        specification: "",
        patternModel: ""
      },
      baseURL: process.env.VUE_APP_API_URL,
      url: "/tyre/getTyreTemplateList",
      title: "轮胎种类",
      columns: [
        {
          title: "轮胎种类名称",
          dataIndex: "templateName"
        },
        // {
        //   title: "品牌",
        //   dataIndex: "brand"
        // },
        // {
        //   title: "规格",
        //   dataIndex: "specification"
        // },
        // {
        //   title: "花纹",
        //   dataIndex: "patternModel"
        // },

        {
          title: "新胎平均花纹深度",
          dataIndex: "initialPattern"
        },
        {
          title: "磨耗极限",
          dataIndex: "wearLimit"
        },
        {
          title: "花纹沟数",
          dataIndex: "initialPatternNum"
        },
        {
          title: "是否翻新",
          scopedSlots: { customRender: "isRetread" }
        },
        {
          title: "翻新平均花纹深度",
          dataIndex: "retreadInitialPattern"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...listApi },
      idField: "tyreTemplateID" // 设置每一条记录的唯一标失
    })
  },
  data() {
    let checkBrand = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入品牌名称！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("品牌名称只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 4) {
        callback(new Error("品牌名称只能2-4个字符！"))
      } else {
        callback()
      }
    }
    let checkSpecification = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入规格！"))
      }
      if (value.trim().length < 5 || value.trim().length > 15) {
        callback(new Error("规格只能5-15个字符！"))
      } else {
        callback()
      }
    }
    let checkPatternModel = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入花纹！"))
      }
      if (this.cpatternModelList.includes(value)) {
        callback(new Error("当前轮胎种类已存在，请重新填写！"))
      } else if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("花纹只能2-20个字符！"))
      } else {
        callback()
      }
    }
    let checkRetreadlPattern = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入翻新花纹！"))
      }
      if (value.trim().length < 2 || value.trim().length > 10) {
        callback(new Error("花纹只能2-10个字符！"))
      } else {
        callback()
      }
    }
    let checRereadkBrand = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入翻新品牌名称！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("品牌名称只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 8) {
        callback(new Error("品牌名称只能2-8个字符！"))
      } else {
        callback()
      }
    }
    return {
      stationData: [],
      stationIDMap: [],
      rules: {
        brand: [{ required: true, validator: checkBrand, trigger: "change" }],
        specification: [
          { required: true, validator: checkSpecification, trigger: "change" }
        ],
        patternModel: [
          { required: true, validator: checkPatternModel, trigger: "change" }
        ],
        initialPattern: [
          {
            required: true,
            message: "请填写新胎平均花纹深度！",
            trigger: "blur"
          }
        ],
        wearLimit: [
          { required: true, message: "请填写磨耗极限！", trigger: "blur" }
        ],
        initialPatternNum: [
          { required: true, message: "请填写花纹沟数！", trigger: "blur" }
        ],
        surplusValue: [
          { required: true, message: "请填写轮胎残值！", trigger: "blur" }
        ],
        retreadlPattern: [
          { required: true, validator: checkRetreadlPattern, trigger: "blur" }
        ],
        retreadInitialPattern: [
          {
            required: true,
            message: "请填写翻新平均花纹深度！",
            trigger: "blur"
          }
        ],
        retreadBrand: [
          { required: true, validator: checRereadkBrand, trigger: "change" }
        ]
      },
      brandLoading: false, // 品牌的加载
      addFilterList: [], // 最全数据
      brandList: [], // 品牌集合
      cbrandList: [], // 品牌集合
      specificationLoading: false, // 规格的加载
      specificationList: [], // 规格集合
      cspecificationList: [], // 规格集合
      patternModelLoading: false, // 花纹的加载
      patternModelList: [], // 花纹的集合
      cpatternModelList: [] // 花纹的集合
    }
  },
  components: { SearchOptions, Operations, Pagination },
  watch: {
    form: {
      handler() {
        if (this.form.isRetread === 1) {
          this.form.templateName = `${this.form.brand}_${this.form.specification}_${this.form.patternModel}`
        } else {
          this.form.templateName = `${this.form.brand}_${this.form.specification}_${this.form.patternModel}_${this.form.retreadBrand}_${this.form.retreadlPattern}`
        }
      },
      deep: true
    },
    "form.brand": {
      handler(newVal) {
        if (newVal && this.crud.status.cu > 0) {
          this.form.specification = ""
          this.cspecificationList = []
          this.form.patternModel = ""
          this.cpatternModelList = []
          this.getAddFilterList()
        }
      },
      deep: true
    },
    "form.specification": {
      handler(newVal) {
        if (newVal && this.crud.status.cu > 0) {
          this.form.patternModel = ""
          this.cpatternModelList = []
          this.getAddFilterList()
        }
      },
      deep: true
    },
    "crud.status.add": {
      handler(newVal) {
        if (newVal > 0) {
          this.getAddFilterList()
        }
      },
      deep: true
    },
    "form.isRetread": {
      handler(newVal) {
        if (newVal === 1) {
          this.form.retreadlPattern = ""
          this.form.retreadInitialPattern = ""
          this.form.retreadBrand = ""
        } else {
          this.form.initialPattern = ""
        }
      },
      deep: true
    }
  },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta

    // 关闭下载功能
    this.crud.optShow.download = true
    this.crud.optShow.edit = false
    this.crud.optShow.del = false
    // // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增轮胎种类"),
      edit: code.includes("修改轮胎种类"),
      download: true
    }

    this.getTyreBrandList()
  },
  methods: {
    // 获取筛选条件列表
    getTyreBrandList() {
      let { brand, specification, patternModel } = this.crud.query
      if (!brand) {
        this.brandLoading = true
      } else {
        if (!specification) {
          this.specificationLoading = true
        } else {
          if (!patternModel) {
            this.patternModelLoading = true
          }
        }
      }

      let postdata = _.cloneDeep(this.crud.getQueryParams())
      delete postdata.pageSize
      delete postdata.pageNum

      getTyreBrandList(postdata).then(res => {
        if (brand) {
          if (!specification) {
            let arr = []
            for (let i = 0; i < res.result.list.length; i++) {
              const element = res.result.list[i]
              arr.push({
                label: element.specification,
                value: element.specification
              })
            }
            this.specificationList = _.uniqBy(arr, "value")
            this.specificationLoading = false
          } else {
            if (!patternModel) {
              let arr = []
              for (let i = 0; i < res.result.list.length; i++) {
                const element = res.result.list[i]
                arr.push({
                  label: element.patternModel,
                  value: element.patternModel
                })
              }
              this.patternModelList = _.uniqBy(arr, "value")
              this.patternModelLoading = false
            }
          }
        } else {
          let arr = []
          for (let i = 0; i < res.result.list.length; i++) {
            const element = res.result.list[i]
            arr.push({ label: element.brand, value: element.brand })
          }
          this.brandList = _.uniqBy(arr, "value")
          this.brandLoading = false
        }
      })
    },
    getAddFilterList() {
      let { brand, specification, patternModel } = this.form
      if (!brand) {
        getTyreBrandList({}).then(res => {
          this.addFilterList = res.result.list
          let arr = []
          for (let i = 0; i < res.result.list.length; i++) {
            const element = res.result.list[i]
            arr.push({ label: element.brand, value: element.brand })
          }
          this.cbrandList = _.uniqBy(arr, "value")
          console.log(this.cbrandList)
        })
      } else {
        if (!specification) {
          let arr = []
          let list = this.addFilterList.filter(item => {
            return item.brand === this.form.brand
          })
          for (let i = 0; i < list.length; i++) {
            const element = list[i]
            arr.push({
              label: element.specification,
              value: element.specification
            })
          }
          this.cspecificationList = _.uniqBy(arr, "value")
        } else {
          if (!patternModel) {
            let arr = []
            let list = this.addFilterList.filter(item => {
              return (
                item.brand === this.form.brand &&
                item.specification === this.form.specification
              )
            })
            for (let i = 0; i < list.length; i++) {
              const element = list[i]
              arr.push({
                label: element.patternModel,
                value: element.patternModel
              })
            }
            this.cpatternModelList = _.uniqBy(arr, "value")
          }
        }
      }
    },
    querySearchBrand(queryString, cb) {
      let arr = queryString
        ? this.cbrandList.filter(item => {
            return item.value.includes(queryString)
          })
        : this.cbrandList
      cb(arr)
    },
    querySearchSpecification(queryString, cb) {
      let arr = queryString
        ? this.cspecificationList.filter(item => {
            return item.value.includes(queryString)
          })
        : this.cspecificationList
      cb(arr)
    },
    querySearchPatternModel(queryString, cb) {
      let arr = queryString
        ? this.cpatternModelList.filter(item => {
            return item.value.includes(queryString)
          })
        : this.cpatternModelList
      cb(arr)
    },
    brandChange(value) {
      this.crud.query.brand = value
      this.crud.query.specification = ""
      this.specificationList = []
      this.crud.query.patternModel = ""
      this.patternModelList = []
      this.getTyreBrandList()
    },
    specificationChange(value) {
      this.crud.query.specification = value
      this.crud.query.patternModel = ""
      this.patternModelList = []
      this.getTyreBrandList()
    },
    patternModelChange(value) {
      this.crud.query.patternModel = value
    }
  }
}
</script>
