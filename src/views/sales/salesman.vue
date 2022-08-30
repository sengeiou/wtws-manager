<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="crud.query.displayName" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="手机号">
              <a-input v-model="crud.query.phoneTel" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <SearchOptions :toggleShowAdvance="false" style="width:100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格部分 -->
    <div class="table-container">
      <Operations tableName="销售人员列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          rowKey="userID"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="operation" slot-scope="record">
            <a-button
              type="link"
              :disabled="
                !$route.meta.code.includes('获取商机列表') ||
                  record.sciCount === 0
              "
              @click="showInfo(record)"
            >
              查看商机
            </a-button>
            |
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('获取打卡详情列表')"
              @click="details(record)"
            >
              打卡详情
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <a-modal
      wrapClassName="clockinrecord-modal"
      v-model="visible"
      title="商机详情"
      :mask="true"
      :width="800"
      :footer="null"
    >
      <a-table
        rowKey="name"
        :columns="columns"
        :data-source="SSIList"
        :pagination="false"
      >
      </a-table>
    </a-modal>
    <a-modal
      wrapClassName="clockinrecord-modal"
      v-model="cVisible"
      title="打卡详情"
      :mask="true"
      :footer="null"
    >
      <div class="_top">
        <!-- <div><span>时间范围：</span>{{ startTime }} 至 {{ endTime }}</div> -->
        <div><span>姓名：</span>{{ record.displayName }}</div>
        <div><span>打卡次数：</span>{{ checkinListInfo.length }}</div>
      </div>
      <a-divider />
      <div class="_bottom">
        <div v-for="item in checkinListInfo" :key="item.CIId">
          <div>
            <div>
              <div><span>客户名称：</span>{{ item.NAME }}</div>
              <div :class="item.status === '1' ? 'already' : 'not'">
                {{ item.status === "1" ? "已交易" : "未交易" }}
              </div>
            </div>
            <div><span>打卡地点：</span>{{ item.position }}</div>
            <div><span>打卡时间：</span>{{ item.createTime }}</div>
          </div>
          <a-divider />
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header } from "@crud/crud"
import businessApi from "@/api/sales/business"
import clockinRecord from "@/api/sales/clockinRecord"
import salesman from "@/api/sales/salesman"

export default {
  name: "Sale",
  // presenter 生成crud对象
  mixins: [presenter(), header()],
  // 配置crud
  cruds() {
    return CRUD({
      url: "user/getXsUserListInfo",
      title: "销售人员",
      columns: [
        {
          title: "工号",
          dataIndex: "workNo"
        },
        {
          title: "姓名",
          dataIndex: "displayName"
        },
        {
          title: "手机号",
          dataIndex: "phoneTel"
        },
        {
          title: "商机数量",
          dataIndex: "sciCount"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 200
        }
      ],
      idField: "userID",
      crudMethod: { ...salesman }
    })
  },
  filters: {},
  data() {
    return {
      visible: false,
      cVisible: false,
      checkinListInfo: [],
      record: {},
      startTime: "-",
      endTime: "-",
      SSIList: [],
      columns: [
        {
          title: "客户名称",
          dataIndex: "name"
        },
        {
          title: "联系人",
          dataIndex: "contactName"
        },
        {
          title: "联系电话",
          dataIndex: "contactTel"
        }
      ]
    }
  },
  methods: {
    showInfo(record) {
      this.SSIList = []
      businessApi
        .getSCIInfoList({ displayName: record.displayName })
        .then(res => {
          if (res.code === 0 && res.result.count !== 0) {
            this.visible = true
            this.SSIList = res.result.list
          }
        })
    },
    details(record) {
      clockinRecord
        .getCheckInLogInfoList({
          SSIId: record.userID
        })
        .then(response => {
          if (response.code === 0) {
            this.cVisible = true
            this.record = record
            this.checkinListInfo = response.result.checkInLogInfoList
          }
        })
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    let { code } = this.$route.meta
    console.log(code)
    this.crud.optShow = {
      download: true,
      add: false,
      del: false,
      edit: false,
      reset: true
    }
    this.crud.permission = {
      download: true
    }
  }
}
</script>
