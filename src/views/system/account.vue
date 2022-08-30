<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <div class="head-container">
      <!-- 给crud的query添加参数，执行封装的toQuery方法实现查询 -->
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="crud.query.displayName" placeholder="请输入" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="crud.query.loginName" style="width: 100%" />
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="用户归属" mode="multiple">
                <a-select
                  v-model="crud.query.stationIDs"
                  placeholder="请选择"
                  mode="multiple"
                  :maxTagCount="1"
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
              <a-form-item label="角色">
                <a-select v-model="crud.query.roleID" placeholder="请选择">
                  <a-select-option
                    v-for="item in roleData"
                    :value="item.roleID"
                    :key="item.roleID"
                    >{{ item.roleName }}</a-select-option
                  >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="工号">
                <a-input v-model="crud.query.workNo" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>
          <SearchOptions />
        </a-row>
      </a-form>
    </div>
    <!-- 表格部分 -->
    <div class="table-container">
      <Operations tableName="账号列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          ref="table"
          rowKey="userID"
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="station1" slot-scope="station1">
            <a-tooltip placement="top">
              <template slot="title">
                <span>{{ station1 | stationFilter }}</span>
              </template>
              <div>{{ station1 | stationFilter }}</div>
            </a-tooltip>
          </template>
          <template slot="operation" slot-scope="record">
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('账号详情')"
              @click="
                crud.toInfo(record)
                showInfo(record)
              "
            >
              详情
            </a-button>
            |
            <a-button
              type="link"
              @click="Rest(record)"
              :disabled="!$route.meta.code.includes('修改密码')"
            >
              重置密码
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <!-- 填写表单部分 -->
    <div class="form-container">
      <a-modal
        class="account-modal"
        :visible="crud.status.cu > 0 || crud.status.in > 0"
        @cancel="crud.cancelCU()"
        :width="600"
        :title="crud.status.title"
      >
        <a-form-model
          ref="form"
          labelAlign="left"
          :class="
            crud.status.in > 0 && crud.status.cu === 0 ? 'disabled-form' : ''
          "
          :model="form"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :rules="rules"
        >
          <a-form-model-item label="工号:" prop="workNo">
            <a-input
              :disabled="
                !hasUserChange
                  ? true
                  : crud.status.in > 0 && crud.status.cu === 0
              "
              v-model="form.workNo"
              @change="userChanged = true"
            />
          </a-form-model-item>
          <a-form-model-item label="姓名:" prop="displayName">
            <a-input
              @change="userChanged = true"
              :disabled="
                !hasUserChange
                  ? true
                  : crud.status.in > 0 && crud.status.cu === 0
              "
              v-model="form.displayName"
            />
          </a-form-model-item>
          <a-form-model-item label="手机号:" prop="loginName">
            <a-input
              @change="loginNameChanged = true"
              :disabled="
                !hasLoginNameChange
                  ? true
                  : crud.status.in > 0 && crud.status.cu === 0
              "
              v-model="form.loginName"
            />
          </a-form-model-item>
          <a-form-model-item
            class="login-form-model-item"
            label="登录权限:"
            prop="userLoginAuth1"
          >
            <!-- <a-select
              v-model="form.userLoginAuth1"
              :defaultValue="form.userLoginAuth1"
              placeholder="请选择"
              :disabled="
                crud.status.in !== 0
                  ? true
                  : crud.status.cu > 0
                  ? crud.status.add > 0
                    ? false
                    : true
                  : true
              "
            >
              <a-select-option :value="1" :key="1">销售人员</a-select-option>
              <a-select-option :value="2" :key="2">后台用户</a-select-option>
              <a-select-option :value="3" :key="3"
                >现场端作业人员</a-select-option
              >
            </a-select> -->
            <a-checkbox-group
              @change="userRoleChanged = true"
              :disabled="
                !hasLoginNameChange
                  ? true
                  : crud.status.in > 0 && crud.status.cu === 0
              "
              v-model="form.userLoginAuth1"
            >
              <a-checkbox value="2" name="type">
                后台管理
              </a-checkbox>
              <a-checkbox value="1" name="type">
                销售端
              </a-checkbox>
              <a-checkbox value="3" name="type">
                现场端
              </a-checkbox>
              <!-- <a-checkbox value="4" name="type">
                司机端
              </a-checkbox>
              <a-checkbox value="5" name="type">
                企业端
              </a-checkbox> -->
            </a-checkbox-group>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.userLoginAuth1.includes('2')"
            label="角色:"
            prop="roleID"
          >
            <a-select
              v-model="form.roleID"
              :defaultValue="form.roleID"
              @change="userRoleChanged = true"
              placeholder="请选择"
              :disabled="
                !hasUserRoleChange
                  ? true
                  : crud.status.in > 0 && crud.status.cu === 0
              "
            >
              <a-select-option
                v-for="item in roleData"
                :value="item.roleID"
                :key="item.roleID"
                >{{ item.roleName }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="
              form.userLoginAuth1.includes('2') ||
                form.userLoginAuth1.includes('3')
            "
            label="用户归属:"
            prop="station"
          >
            <a-select
              v-show="crud.status.cu > 0"
              v-model="form.station"
              @change="userRoleChanged = true"
              placeholder="请选择"
              mode="multiple"
              :maxTagCount="1"
              :disabled="
                !hasUserRoleChange
                  ? true
                  : crud.status.in > 0 && crud.status.cu === 0
              "
            >
              <a-select-option
                v-for="item in stationData"
                :value="item.stationID + '@' + item.name"
                :key="item.stationID"
                >{{ item.name }}</a-select-option
              >
            </a-select>
            <div style="padding-left:10px;" v-show="crud.status.cu === 0">
              <div v-for="item in form.station1" :key="item.stationID">
                {{ item.stationName }}
              </div>
            </div>
          </a-form-model-item>
          <a-form-model-item
            v-if="crud.status.in > 0 && crud.status.cu === 0"
            label="创建时间:"
          >
            <div style="padding-left:10px;">
              {{ activeInfo.insertTime }}
            </div>
          </a-form-model-item>
          <a-form-model-item
            v-if="crud.status.in > 0 && crud.status.cu === 0"
            label="上次登录:"
          >
            <div style="padding-left:10px;">
              {{ activeInfo.lastLoginTime }}
            </div>
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
              @click="
                crud.submitCU(() => {
                  activeInfo = JSON.parse(JSON.stringify(crud.data[0]))
                  $message.success(
                    '新建成功！用户名为手机号，初始密码为123456，首次登录请修改密码'
                  )
                })
              "
            >
              提交
            </a-button>
            <a-button
              v-if="crud.status.edit > 0"
              key="submit"
              type="primary"
              @click="submit"
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
              @confirm="
                crud.doDelete(null, 'close', () => {
                  $message.success('删除成功！该用户已从系统中删除。')
                })
              "
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
import apiAccount from "@/api/system/account"
import apiMenu from "@/api/system/menu"
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header, form } from "@crud/crud"
import _ from "lodash"

// 表格的填充字段
const defaultForm = {
  workNo: "",
  displayName: "",
  loginName: "",
  roleID: "",
  userLoginAuth1: ["2"],
  station: []
}

export default {
  name: "Home",
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      url: "user/getUserListInfo",
      title: "用户账户",
      columns: [
        {
          title: "工号",
          dataIndex: "workNo",
          width: 150
        },
        {
          title: "姓名",
          dataIndex: "displayName",
          width: 150
        },
        {
          title: "手机号",
          dataIndex: "loginName",
          width: 150
        },
        {
          title: "角色",
          dataIndex: "roleName",
          width: 150
        },
        {
          title: "用户归属",
          dataIndex: "station1",
          scopedSlots: { customRender: "station1" },
          ellipsis: true
        },
        {
          title: "创建时间",
          dataIndex: "insertTime"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...apiAccount },
      idField: "userID", // 设置每一条记录的唯一标失
      queryFun: (data, crud) => {
        if (data.code === 0) {
          for (const key in data.result) {
            if (key.includes("list")) {
              let res = data.result[key]
              for (let i = 0; i < res.length; i++) {
                let element = res[i]
                element["roleName"] = element.role[0].roleName
                element["roleID"] = element.role[0].roleID
                element["userLoginAuth1"] = element.userLoginAuth.split(",")

                let arr = []
                let arr1 = []
                if (element.station && element.station !== "-") {
                  let stationList = JSON.parse(element.station)
                  for (let j = 0; j < stationList.length; j++) {
                    const it = stationList[j]
                    arr1.push({
                      stationID: `${it.stationID}@${it.stationName}`,
                      stationName: it.stationName
                    })
                    arr.push(`${it.stationID}@${it.stationName}`)
                  }
                }
                element["station1"] = arr1
                element.station = arr
              }
              crud.data = res
            }
          }
          crud.page.total = data.result.count
          crud.resetDataStatus()
        }
      }
    })
  },
  filters: {
    stationFilter(station) {
      let stationStr = ""
      if (station.length > 0) {
        let stationArr = _.map(station, it => {
          return it.stationName
        })
        stationStr += stationArr
      } else {
        stationStr = "-"
      }
      return stationStr
    }
  },
  watch: {
    "crud.form": {
      handler(newVal) {
        let station = newVal.station
        let newArr = []
        for (let i = 0; i < station.length; i++) {
          const element = station[i]
          newArr.push({
            stationID: element.split("@")[0],
            stationName: element.split("@")[1]
          })
        }
        this.crud.form["station1"] = newArr

        if (this.form.userLoginAuth1.includes("2")) {
          this.rules.roleID.required = true
        } else {
          this.crud.form.roleID = ""
          this.rules.roleID.required = false
        }

        if (!this.form.userLoginAuth1.includes("1")) {
          this.rules.station.required = true
        } else {
          if (
            this.crud.form.station.length > 0 &&
            this.form.userLoginAuth1.length === 1
          ) {
            this.crud.form.station = []
          }
          this.rules.station.required = false
        }
      },
      deep: true
    }
  },
  data() {
    let checkPending
    let checkLoginName = (rule, value, callback) => {
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

    let checkWorkNo = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入工号！"))
      }
      if (!/^[a-zA-Z0-9]+$/.test(value)) {
        callback(new Error("工号只能输入数字和英文！"))
      } else if (value.trim().length < 4 || value.trim().length > 10) {
        callback(new Error("工号只能4-10个字符！"))
      } else {
        callback()
      }
    }

    let checkDisplayName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入姓名！"))
      }
      if (!/^[\u4e00-\u9fa5]+$/.test(value)) {
        callback(new Error("姓名只能输入中文！"))
      } else if (value.trim().length < 2 || value.trim().length > 5) {
        callback(new Error("姓名只能2-5个字符！"))
      } else {
        callback()
      }
    }

    return {
      stationData: [],
      stationIDMap: [],
      role: [],
      roleIDMap: [],
      rules: {
        workNo: [{ required: true, validator: checkWorkNo, trigger: "blur" }],
        displayName: [
          { required: true, validator: checkDisplayName, trigger: "blur" }
        ],
        loginName: [
          { required: true, validator: checkLoginName, trigger: "blur" }
        ],
        roleID: [
          { required: true, message: "请选择用户角色", trigger: "change" }
        ],
        userLoginAuth1: [
          { required: false, message: "请选择登录权限", trigger: "change" }
        ],
        station: [{ required: true, message: "请选择所属", trigger: "change" }]
      },
      roleData: [],
      loginNameChanged: false,
      userChanged: false,
      userRoleChanged: false,
      hasLoginNameChange: this.$route.meta.code.includes("修改账户名"),
      hasUserChange: this.$route.meta.code.includes("修改账号基本信息"),
      hasUserRoleChange: this.$route.meta.code.includes("修改账户角色及所属地"),
      activeInfo: {}
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    /**
     * 设置按钮权限
     */
    let { code } = this.$route.meta
    // 关闭下载功能
    this.crud.optShow.download = false
    this.crud.optShow.edit = false
    console.log(code)
    // 显示以下按钮
    this.crud.permission = {
      add: code.includes("新增账号"),
      edit:
        code.includes("修改账户名") ||
        code.includes("修改账户角色及所属地") ||
        code.includes("修改账号基本信息"),
      del: code.includes("删除账号")
    }
    apiAccount.getStationList({}).then(res => {
      if (res.code === 0) {
        this.stationData = res.result.list
        this.stationIDMap = _.map(this.stationData, it => it.stationID)
      }
    })

    apiMenu.listRole().then(res => {
      if (res.code === 0) {
        this.roleData = res.result
        this.roleIDMap = _.map(this.role, it => it.roleID)
      }
    })
  },
  methods: {
    showInfo(record) {
      this.activeInfo = JSON.parse(JSON.stringify(record))
      console.log(this.activeInfo)
    },
    Rest(record) {
      this.$confirm({
        title: "确认要重置密码吗?",
        content: `重置密码后，该用户仅能通过初始密码123456登录系统，首次登录需修改密码`,
        onOk() {
          apiAccount.reset(record.userID).then(() => {})
        },
        onCancel() {}
      })
    },
    submit() {
      this.$refs["form"].validate(valid => {
        if (!valid) {
          return
        }
        let params = []
        let _this = this
        if (this.loginNameChanged) {
          params.push(this.loginname())
        }
        if (this.userChanged) {
          params.push(this.updateuser())
        }
        if (this.userRoleChanged) {
          params.push(this.userrole())
        }
        Promise.all(params).then(() => {
          _this.crud.cancelCU("info")
          _this.crud.toQuery()
          // _this.activeInfo = {}
        })
      })
    },
    loginname() {
      return new Promise((resolve, reject) => {
        apiAccount
          .updateuserloginname({
            userID: this.crud.copyForm.userID,
            loginName: String(this.crud.form.loginName)
          })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    updateuser() {
      return new Promise((resolve, reject) => {
        apiAccount
          .updateuser({
            userID: this.crud.copyForm.userID,
            workNo: this.crud.form.workNo,
            displayName: this.crud.form.displayName
          })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    userrole() {
      return new Promise((resolve, reject) => {
        apiAccount
          .updateuserorleandarea({
            userID: this.crud.copyForm.userID,
            userLoginAuth: _.cloneDeep(this.crud.form.userLoginAuth1).join(","),
            userRoleInfoList: [{ roleID: this.crud.form.roleID }],
            userStationInfoList: _.map(this.crud.form.station, it => {
              let itemArr = it.split("@")
              return {
                stationID: itemArr[0],
                stationName: itemArr[1]
              }
            })
          })
          .then(res => {
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    }
  }
}
</script>
