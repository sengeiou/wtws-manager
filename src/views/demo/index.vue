<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="规则编号">
              <a-input v-model="crud.query.id" placeholder="" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="使用状态">
              <a-select
                v-model="crud.query.status"
                placeholder="请选择"
                default-value="0"
              >
                <a-select-option value="0">全部</a-select-option>
                <a-select-option value="1">关闭</a-select-option>
                <a-select-option value="2">运行中</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="调用次数">
                <a-input-number
                  v-model="crud.query.callNo"
                  style="width: 100%"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="更新日期">
                <a-date-picker
                  v-model="crud.query.date"
                  style="width: 100%"
                  placeholder="请输入更新日期"
                />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select
                  v-model="crud.query.useStatus"
                  placeholder="请选择"
                  default-value="0"
                >
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="使用状态">
                <a-select placeholder="请选择" default-value="0">
                  <a-select-option value="0">全部</a-select-option>
                  <a-select-option value="1">关闭</a-select-option>
                  <a-select-option value="2">运行中</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </template>
          <SearchOptions />
        </a-row>
      </a-form>
    </div>
    <!-- 表格部分 -->
    <div class="table-container">
      <Operations />
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <!-- 填写表单部分 -->
    <div class="form-container">
      <a-modal
        :visible="crud.status.cu > 0"
        @cancel="crud.cancelCU"
        :title="crud.status.title"
        @ok="crud.resetForm"
      >
        <a-form-model
          ref="form"
          labelAlign="left"
          :model="form"
          :label-col="{ span: 4 }"
          :wrapper-col="{ span: 20 }"
          :rules="rules"
        >
          <a-form-model-item label="Name" prop="name">
            <a-input v-model="form.name" />
          </a-form-model-item>
          <a-form-model-item label="Age" prop="age">
            <a-input v-model="form.age" />
          </a-form-model-item>
          <a-form-model-item label="Address" prop="address">
            <a-input v-model="form.address" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>
  </div>
</template>

<script>
import api from "@/api/demo"
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header, form } from "@crud/crud"

const defaultForm = {
  key: null,
  name: null,
  age: 22,
  address: null
}

export default {
  name: "Home",
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      url: "/demo",
      title: "Demo示例",
      columns: [
        {
          title: "Name",
          dataIndex: "name"
        },
        {
          title: "Age",
          dataIndex: "age"
        },
        {
          title: "Address",
          dataIndex: "address"
        }
      ],
      crudMethod: { ...api },
      idField: "key" // 设置每一条记录的唯一标失
    })
  },
  data() {
    return {
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        age: [{ required: true, message: "请输入年龄", trigger: "blur" }],
        address: [{ required: true, message: "请输入住址", trigger: "blur" }]
      }
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    // // 设置Table列
    // this.crud.columns = [
    //   {
    //     title: "Name",
    //     dataIndex: "name"
    //   },
    //   {
    //     title: "Age",
    //     dataIndex: "age"
    //   },
    //   {
    //     title: "Address",
    //     dataIndex: "address"
    //   }
    // ]
  }
}
</script>
