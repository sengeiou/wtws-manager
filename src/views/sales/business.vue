<template>
  <div class="app-container">
    <div class="head-container">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="客户名称">
              <a-input v-model="crud.query.name" style="width: 100%" />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="联系人">
              <a-input v-model="crud.query.contactName" style="width: 100%" />
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="联系电话">
                <a-input v-model="crud.query.contactTel" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="销售姓名">
                <a-input v-model="crud.query.displayName" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="销售电话">
                <a-input v-model="crud.query.phoneTel" style="width: 100%" />
              </a-form-item>
            </a-col>
          </template>
          <a-col :md="8" :sm="24">
            <SearchOptions style="width:100%" />
          </a-col>
        </a-row>
      </a-form>
    </div>

    <!-- 表格部分 -->
    <div class="table-container">
      <Operations tableName="商机明细表" />
      <a-spin :spinning="crud.loading">
        <a-table
          rowKey="name"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="VVIcount" slot-scope="record">
            {{ record.VVIcount === null ? 0 : record.VVIcount }}
          </template>
          <template slot="operation" slot-scope="record">
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('获取客户详情')"
              @click="showInfo(record)"
            >
              详情
            </a-button>
            |
            <a-button
              type="link"
              :disabled="!$route.meta.code.includes('删除商机')"
              @click="delRecord(record)"
            >
              删除
            </a-button>
          </template>
        </a-table>
      </a-spin>
      <Pagination />
    </div>
    <a-modal
      wrapClassName="business-modal"
      v-model="visible"
      title="详情"
      :mask="true"
      :width="1000"
      :footer="null"
    >
      <div style="padding:10px 20px;">
        <div class="block">
          <div class="title">基本信息</div>
          <div class="info">
            <div>
              <div class="_label">客户名称：</div>
              <div>{{ activeInfo.sciInfo.name }}</div>
            </div>
            <div>
              <div class="_label">行业类别：</div>
              <div>{{ activeInfo.sciInfo.industryDes }}</div>
            </div>
            <div>
              <div class="_label">联系人名称：</div>
              <div>{{ activeInfo.sciInfo.contactName }}</div>
            </div>
            <div>
              <div class="_label">联系人电话：</div>
              <div>{{ activeInfo.sciInfo.contactTel }}</div>
            </div>
            <div>
              <div class="_label">销售姓名：</div>
              <div>{{ activeInfo.sciInfo.displayName }}</div>
            </div>
            <div>
              <div class="_label">销售电话：</div>
              <div>{{ activeInfo.sciInfo.phoneTel }}</div>
            </div>
            <div>
              <div class="_label">客户地址：</div>
              <div>{{ activeInfo.sciInfo.address }}</div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ activeInfo.sciInfo.remarks }}</div>
            </div>
          </div>
        </div>
        <div class="block" v-if="activeInfo.vvcList.length !== 0">
          <div class="title">车辆信息</div>
          <div
            class="info"
            v-for="(item, index) in activeInfo.vvcList"
            :key="index"
          >
            <div>
              <div class="_label">车辆品牌：</div>
              <div>{{ item.vehicleBrand }}</div>
            </div>
            <div>
              <div class="_label">品牌型号：</div>
              <div>{{ item.brandModel }}</div>
            </div>
            <div>
              <div class="_label">轮位类型：</div>
              <div>{{ item.vehicleWheelPosition }}</div>
            </div>
            <div>
              <div class="_label">自重(吨)：</div>
              <div>{{ item.deadWeight }}</div>
            </div>
            <div>
              <div class="_label">载重(吨)：</div>
              <div>{{ item.load }}</div>
            </div>
            <div>
              <div class="_label">数量(辆)：</div>
              <div>{{ item.vehicleNumber }}</div>
            </div>
            <div>
              <div class="_label">载货类型：</div>
              <div>{{ item.cargoType }}</div>
            </div>
            <div>
              <div class="_label">单程行驶距离：</div>
              <div>{{ item.oneDistanceTraveled }}</div>
            </div>
            <div>
              <div class="_label">车辆平均速度：</div>
              <div>{{ item.avgSpeed }}</div>
            </div>
            <div>
              <div class="_label">车辆最大速度：</div>
              <div>{{ item.maxSpeed }}</div>
            </div>
            <div>
              <div class="_label">行驶距离(km/月)</div>
              <div>{{ item.distanceTraveled }}</div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ item.remarks }}</div>
            </div>
            <div class="one">
              路况类型：
            </div>
            <template v-if="item.roadCondition !== null">
              <div
                class="_25"
                v-for="(zitem, zkey, zindex) in item.roadCondition"
                :key="zindex"
              >
                <div class="_label">
                  {{
                    zkey === "mixed"
                      ? "混合"
                      : zkey === "highway"
                      ? "高速良路"
                      : zkey === "provincialRoad"
                      ? "国道省道"
                      : "非铺装路面"
                  }}
                </div>
                <div>{{ zitem }}%</div>
              </div>
            </template>
          </div>
        </div>
        <div class="block" v-if="activeInfo.toiList.length !== 0">
          <div class="title">轮胎运营信息</div>
          <div
            class="info"
            v-for="(item, index) in activeInfo.toiList"
            :key="index"
          >
            <div>
              <div class="_label">轮胎规格：</div>
              <div>{{ item.specifications }}</div>
            </div>
            <div>
              <div class="_label">消耗数量(条/月)：</div>
              <div>{{ item.consumptionNumber }}</div>
            </div>
            <div class="one">
              轮胎品牌：
            </div>
            <template v-if="item.tyreRand !== null">
              <div
                class="_25"
                v-for="(zitem, zindex) in item.tyreRand"
                :key="zindex"
              >
                <div class="_label">
                  {{ zitem.brand }}
                </div>
                <div>{{ zitem.percentage }}</div>
              </div>
            </template>

            <div class="one">
              轮胎寿命：
            </div>
            <div>
              <div class="_label">里程(km/月)：</div>
              <div>{{ item.mileage }}</div>
            </div>
            <div>
              <div class="_label">时间(月)：</div>
              <div>{{ item.time }}</div>
            </div>
            <div>
              <div class="_label">购买价格：</div>
              <div>{{ item.price }}</div>
            </div>
            <div>
              <div class="_label">主要故障：</div>
              <div>{{ item.fault }}</div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ item.remarks }}</div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title">轮胎翻新信息</div>
          <div class="info">
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">翻新占比：</div>
              <div>{{ activeInfo.triInfo.proportion }}</div>
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">轮胎数量(条/月)：</div>
              <div>{{ activeInfo.triInfo.tyreNumber }}</div>
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">翻新次数(回/条)：</div>
              <div>{{ activeInfo.triInfo.renovationNumber }}</div>
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">价格(元/条)：</div>
              <div>{{ activeInfo.triInfo.price }}</div>
            </div>
            <div class="one" v-show="activeInfo.triInfo.whether === '1'">
              轮胎寿命：
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">里程(km/月)：</div>
              <div>{{ activeInfo.triInfo.mileage }}</div>
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">时间(月)：</div>
              <div>{{ activeInfo.triInfo.time }}</div>
            </div>
            <div class="one" v-show="activeInfo.triInfo.whether === '1'">
              翻新来源：
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">自有胎体加工：</div>
              <div>{{ activeInfo.triInfo.oneself }}%</div>
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">购买翻新胎：</div>
              <div>{{ activeInfo.triInfo.purchase }}%</div>
            </div>
            <div v-show="activeInfo.triInfo.whether === '1'">
              <div class="_label">翻新胎主要故障：</div>
              <div>{{ activeInfo.triInfo.fault }}</div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ activeInfo.triInfo.remarks }}</div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title">轮胎维护</div>
          <div class="info">
            <div>
              <div class="_label">固定保养店铺：</div>
              <div>{{ activeInfo.tmiInfo.maintenanceShop }}</div>
            </div>
            <div>
              <div class="_label">气压：</div>
              <div>{{ activeInfo.tmiInfo.pressure }}</div>
            </div>
            <div>
              <div class="_label">轮胎规格：</div>
              <div>{{ activeInfo.tmiInfo.specifications }}</div>
            </div>
            <div>
              <div class="_label">气压检查频率(回/条)：</div>
              <div>{{ activeInfo.tmiInfo.detectionFrequency }}</div>
            </div>
            <div>
              <div class="_label">里程检查(km/次)：</div>
              <div>{{ activeInfo.tmiInfo.mileageDetection }}</div>
            </div>
            <div>
              <div class="_label">换位：</div>
              <div>
                {{
                  activeInfo.tmiInfo.transposition === "1"
                    ? "是"
                    : activeInfo.tmiInfo.transposition === "2"
                    ? "否"
                    : ""
                }}
              </div>
            </div>
            <div>
              <div class="_label">修补耗材品牌名称：</div>
              <div>{{ activeInfo.tmiInfo.consumablesBrand }}</div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ activeInfo.tmiInfo.remarks }}</div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title">车辆维护</div>
          <div class="info">
            <div>
              <div class="_label">维护数量(辆)：</div>
              <div>{{ activeInfo.vmiInfo.vehicleNumber }}</div>
            </div>
            <div>
              <div class="_label">平均维护次数(次/月)：</div>
              <div>{{ activeInfo.vmiInfo.maintenanceTimes }}</div>
            </div>
            <div>
              <div class="_label">车轮定位检查：</div>
              <div>
                {{
                  activeInfo.vmiInfo.detection === "1"
                    ? activeInfo.vmiInfo.detectionAddress
                    : activeInfo.vmiInfo.detection === "2"
                    ? "否"
                    : ""
                }}
              </div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ activeInfo.vmiInfo.remarks }}</div>
            </div>
          </div>
        </div>
        <div class="block">
          <div class="title">客户运营成本</div>
          <div class="info">
            <div>
              <div class="_label">车队轮胎采购成本(元/月)：</div>
              <div>{{ activeInfo.omcInfo.procurementCost }}</div>
            </div>
            <div>
              <div class="_label">每辆车行驶里程(km/月)：</div>
              <div>{{ activeInfo.omcInfo.mileage }}</div>
            </div>
            <div>
              <div class="_label">车队维护成本(元/年)：</div>
              <div>{{ activeInfo.omcInfo.maintenanceCost }}</div>
            </div>
            <div>
              <div class="_label">车队平均维护成本(元/月)</div>
              <div>{{ activeInfo.omcInfo.avgVehicleMaintenanceCost }}</div>
            </div>
            <div class="one">
              作业人员：
            </div>
            <div class="_33">
              <div class="_label">管理者(人)：</div>
              <div>{{ activeInfo.omcInfo.controller }}</div>
            </div>
            <div class="_33">
              <div class="_label">作业员(人)：</div>
              <div>{{ activeInfo.omcInfo.operator }}</div>
            </div>
            <div class="_33">
              <div class="_label">人员费用(元/月)：</div>
              <div>{{ activeInfo.omcInfo.operationCost }}</div>
            </div>
            <div class="one">
              轮胎废弃点比例：
            </div>
            <div class="_25">
              <div class="_label">胎冠：</div>
              <div>{{ activeInfo.omcInfo.tyreTread }}%</div>
            </div>
            <div class="_25">
              <div class="_label">胎肩：</div>
              <div>{{ activeInfo.omcInfo.tyreShoulder }}%</div>
            </div>
            <div class="_25">
              <div class="_label">胎侧：</div>
              <div>{{ activeInfo.omcInfo.tyreSidewall }}%</div>
            </div>
            <div class="_25">
              <div class="_label">胎圈：</div>
              <div>{{ activeInfo.omcInfo.tyreBead }}%</div>
            </div>
            <div class="one">
              轮胎异常磨损点：
            </div>
            <div class="_25">
              <div class="_label">中间：</div>
              <div>{{ activeInfo.omcInfo.middle }}%</div>
            </div>
            <div class="_25">
              <div class="_label">双侧胎肩：</div>
              <div>{{ activeInfo.omcInfo.bilateralTireShoulder }}%</div>
            </div>
            <div class="_25">
              <div class="_label">单侧胎肩：</div>
              <div>{{ activeInfo.omcInfo.unilateralTireShoulder }}%</div>
            </div>
            <div class="_25">
              <div class="_label">其他：</div>
              <div>{{ activeInfo.omcInfo.other }}%</div>
            </div>
            <div class="_100">
              <div class="_label">备注：</div>
              <div>{{ activeInfo.omcInfo.remarks }}</div>
            </div>
          </div>
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

class Info {
  constructor(info) {
    let {
      omcInfo,
      sciInfo,
      tmiInfo,
      toiList,
      triInfo,
      vmiInfo,
      vvcList,
      ssiInfo
    } = info
    this.omcInfo = omcInfo || {}
    this.sciInfo = sciInfo || {}
    this.tmiInfo = tmiInfo || {}
    this.triInfo = triInfo || {}
    this.vmiInfo = vmiInfo || {}
    this.toiList = toiList || []
    this.vvcList = vvcList || []
    this.ssiInfo = ssiInfo || {}
  }
}

export default {
  name: "Sale",
  mixins: [presenter(), header()],
  // 配置crud
  cruds() {
    return CRUD({
      baseURL: process.env.VUE_APP_API_SALE_URL,
      url: "user/getAdminSCIInfoList",
      title: "商机列表",
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
        },
        {
          title: "行业类别",
          dataIndex: "industryDes"
        },
        {
          title: "车辆数",
          dataIndex: "VVIcount"
        },
        {
          title: "销售姓名",
          dataIndex: "displayName"
        },
        {
          title: "销售电话",
          dataIndex: "phoneTel"
        },
        {
          title: "操作",
          scopedSlots: { customRender: "operation" },
          width: 200
        }
      ],
      idField: "SCIId",
      crudMethod: { ...businessApi }
    })
  },
  filters: {},
  data() {
    return {
      visible: false,
      activeInfo: new Info({})
    }
  },
  methods: {
    showInfo(record) {
      this.activeInfo = new Info({})
      businessApi.userSCIInfo({ SCIID: record.SCIId }).then(res => {
        console.log("[showInfo]  ====>  res:", res)
        if (res.code === 0) {
          this.visible = true
          this.activeInfo = new Info(res.result)
          console.log("[showInfo]  ====>  activeInfo:", this.activeInfo)
        }
      })
    },
    delRecord(record) {
      let _this = this
      this.$confirm({
        title: "确认要删除吗？",
        content: `删除后不可恢复，该商机在销售端小程序中也将一同删除，请谨慎操作?`,
        onOk() {
          _this.crud.delAllLoading = true
          _this.crud.doDelete([record.SCIId]).then(res => {
            if (res.code === 0) {
              _this.$message.success("删除成功！该商机已从系统中删除！")
            }
          })
        },
        onCancel() {}
      })
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    let { code } = this.$route.meta
    console.log(code)
    this.crud.optShow.add = false
    this.crud.optShow.del = false
    this.crud.optShow.download = true

    this.crud.permission = {
      download: true
    }
  }
}
</script>
