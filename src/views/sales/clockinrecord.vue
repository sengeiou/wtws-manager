<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-range-picker
              v-model="crud.query.times"
              @change="timeChange"
              format="YYYY-MM-DD"
            />
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="姓名">
              <a-input v-model="crud.query.displayName" style="width: 100%" />
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="客户名称">
                <a-input v-model="crud.query.name" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>
          <SearchOptions />
        </a-row>
      </a-form>
    </div>

    <!-- 表格部分 -->
    <div class="table-container">
      <Operations tableName="打卡信息列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :rowKey="
            record => {
              return `${record.CIId}`
            }
          "
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
        </a-table>
      </a-spin>
      <Pagination />
    </div>
  </div>
</template>

<script>
import SearchOptions from "@/components/Crud/SearchOptions"
import Pagination from "@/components/Crud/Pagination"
import Operations from "@/components/Crud/Operations"
import clockinRecord from "@/api/sales/clockinRecord"
import CRUD, { presenter, header } from "@crud/crud"
import md5 from "js-md5" // 使用md5加密密码

// 表格的填充字段

export default {
  name: "Sale",
  // presenter 生成crud对象
  mixins: [presenter(), header()],
  // 配置crud
  cruds() {
    return CRUD({
      baseURL: process.env.VUE_APP_API_URL,
      url: "checkIn/getAdminLogInfoList",
      title: "打卡详情",
      // 响应数据中必须包含list字段
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
          title: "打卡地点",
          dataIndex: "position"
        },
        {
          title: "客户名称",
          dataIndex: "name"
        },
        {
          title: "打卡时间",
          dataIndex: "createTime"
        }
      ],
      crudMethod: { ...clockinRecord }
    })
  },
  filters: {},
  data() {
    return {
      md5,
      visible: false,
      record: {
        displayName: "",
        clockInCount: 0
      },
      checkinListInfo: [],
      startTime: "-",
      endTime: "-",
      timeRange: []
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    let { code } = this.$route.meta
    console.log(code)
    this.crud.optShow = {
      download: true,
      reset: true
    }
    this.crud.permission = {
      download: true // 要判断权限
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
    }
  }
}
</script>
