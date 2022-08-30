<template>
  <div class="app-container">
    <!-- 顶部搜索 -->
    <div class="head-container">
      <!-- 给crud的query添加参数，执行封装的toQuery方法实现查询 -->
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="车牌号">
              <a-input
                v-model="crud.query.vehicleNumber"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <a-col :md="8" :sm="24">
            <a-form-item label="所属企业">
              <a-input
                v-model="crud.query.enterpriseName"
                placeholder="请输入"
              />
            </a-form-item>
          </a-col>
          <template v-if="crud.advanced">
            <a-col :md="8" :sm="24">
              <a-form-item label="所属车队">
                <a-input v-model="crud.query.fleetName" placeholder="请输入" />
              </a-form-item>
            </a-col>
            <a-col :md="8" :sm="24">
              <a-form-item label="车辆类型">
                <a-select v-model="crud.query.vehicleType" placeholder="请选择">
                  <a-select-option :value="1" :key="1">挂车</a-select-option>
                  <a-select-option :value="2" :key="2">车头</a-select-option>
                  <a-select-option :value="3" :key="3">整车</a-select-option>
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
      <Operations tableName="车辆信息列表" />
      <a-spin :spinning="crud.loading">
        <a-table
          :row-selection="{
            selectedRowKeys: crud.selections,
            onChange: crud.selectionChangeHandler
          }"
          rowKey="vehicleID"
          :columns="crud.columns"
          :data-source="crud.data"
          :pagination="false"
        >
          <template slot="operation" slot-scope="record">
            <a-button type="link" @click="toInfo(record)">
              详情
            </a-button>
            |
            <a-button type="link" @click="toDatav(record)">
              大屏监控
            </a-button>
            |
            <a-button type="link" @click="toTrajectory(record)">
              运行轨迹
            </a-button>
          </template>
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
        @ok="crud.submitCU"
      >
        <a-form-model
          ref="form"
          labelAlign="left"
          :model="form"
          :label-col="{ span: 6 }"
          :wrapper-col="{ span: 18 }"
          :rules="rules"
        >
          <a-form-model-item label="车牌号:" prop="vehicleNumber">
            <a-input v-model="form.vehicleNumber" />
          </a-form-model-item>
          <a-form-model-item label="车辆自编号:" prop="vehicleSelfNumber">
            <a-input v-model="form.vehicleSelfNumber" />
          </a-form-model-item>
          <a-form-model-item label="车辆类型:" prop="vehicleType">
            <a-select v-model="form.vehicleType" placeholder="请选择">
              <a-select-option :value="1" :key="1">挂车</a-select-option>
              <a-select-option :value="2" :key="2">车头</a-select-option>
              <a-select-option :value="3" :key="3">整车</a-select-option>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="车辆轮位数量:" prop="vehicleTyreNum">
            <a-input v-model="form.vehicleTyreNum" />
          </a-form-model-item>
          <a-form-model-item label="轮位类型:" prop="vehicleWheelModel">
            <a-select v-model="form.vehicleWheelModel" placeholder="请选择">
              <template v-if="form.vehicleType === 2">
                <a-select-option
                  v-for="item in headstockwheelList"
                  :value="item.value"
                  :key="item.key"
                  >{{ item.key }}</a-select-option
                >
              </template>
              <template v-if="form.vehicleType === 3">
                <a-select-option
                  v-for="item in vehiclewheelList"
                  :value="item.value"
                  :key="item.key"
                  >{{ item.key }}</a-select-option
                >
              </template>
              <template v-if="form.vehicleType === 1">
                <a-select-option
                  v-for="item in trailerwheelList"
                  :value="item.value"
                  :key="item.key"
                  >{{ item.key }}</a-select-option
                >
              </template>
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="所属企业:" prop="enterpriseID">
            <a-select
              v-model="form.enterpriseID"
              show-search
              :show-arrow="false"
              :filter-option="filterOption"
              :not-found-content="null"
              option-filter-prop="children"
              placeholder="请选择"
            >
              <a-select-option
                v-for="item in allEnterprise"
                :value="item.enterpriseID"
                :key="item.enterpriseID"
                >{{ item.NAME }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item label="所属车队:" prop="fleetID">
            <a-select v-model="form.fleetID" placeholder="请选择">
              <a-select-option
                v-for="item in allFleetList"
                :value="item.fleetID"
                :key="item.fleetName"
                >{{ item.fleetName }}</a-select-option
              >
            </a-select>
          </a-form-model-item>
          <a-form-model-item
            v-if="form.vehicleType === 1 || form.vehicleType === 2"
            label="关联车头/挂车:"
            prop="trailerNumber"
          >
            <a-input v-model="form.trailerNumber" />
          </a-form-model-item>
        </a-form-model>
      </a-modal>
    </div>

    <div>
      <a-modal
        wrapClassName="vehicleInfoDialog"
        :visible="InfoStatus !== ''"
        :width="1080"
        @cancel="cancelCU()"
      >
        <a-tabs :activeKey="activeKey" type="card" @change="callback">
          <a-tab-pane key="3" tab="轮位详情">
            <div class="tab3">
              <div class="tyreModule borderBox">
                <div class="_title">
                  车辆类型：{{
                    vehicleInfo.vehicleType === 1
                      ? "挂车"
                      : vehicleInfo.vehicleType === 2
                      ? "车头"
                      : vehicleInfo.vehicleType === 3
                      ? "整车"
                      : "不限"
                  }}
                </div>
                <div class="_title">
                  轮位类型：{{ vehicleInfo.vehicleWheelModel }}
                </div>
                <div class="_box borderBox">
                  <template v-for="(value, key, index) in vehicleWheelMap">
                    <div
                      :key="index"
                      :class="[
                        key.includes('F')
                          ? '_f'
                          : key.includes('D')
                          ? '_d'
                          : key.includes('T')
                          ? '_t'
                          : '_b'
                      ]"
                    >
                      <div
                        class="_row"
                        v-for="(item, sindex) in value"
                        :class="[
                          item.FH ? 'is' + item.FH : 'isLast',
                          item.index === 0 ? 'isFirst' : ''
                        ]"
                        :key="sindex"
                      >
                        <template v-if="key.includes('F')">
                          <div
                            v-for="(zitem, zindex) in item.value"
                            :key="zindex"
                            :class="[
                              zitem.key.includes('L')
                                ? '_l1 _blue'
                                : '_r1 _orange'
                            ]"
                          >
                            <div class="_tbox">
                              <div class="_txt">
                                <span class="_aligncenter _title">{{
                                  zitem.key
                                }}</span>
                              </div>
                              <div class="_b">
                                <template v-if="zitem.value !== ''">
                                  <div class="_txt">
                                    <span>{{ zitem.value.tyreNo }}</span>
                                  </div>
                                  <div class="_txt">
                                    <span
                                      >当前花纹 {{ zitem.value.pattern }}</span
                                    >
                                  </div>
                                  <div class="_txt">
                                    <span>胎温</span
                                    ><span>{{
                                      zitem.value.tyreTemperature
                                    }}</span>
                                  </div>
                                  <div class="_txt">
                                    <span>胎压</span
                                    ><span>{{ zitem.value.tyrePressure }}</span>
                                  </div>
                                  <a-button
                                    type="link"
                                    @click="showTpms(zitem.value.tyreNo)"
                                    ><span style="font-size:3px"
                                      >TPMS数据</span
                                    ></a-button
                                  >
                                </template>
                                <template v-else>
                                  <div class="_txt">
                                    <span class="_aligncenter">——</span>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="key.includes('D') || key.includes('T')">
                          <div
                            class="_l1"
                            v-for="(zitem, zindex) in item.value"
                            :key="zindex"
                            :class="[
                              zitem.key.includes('LO')
                                ? '_l2'
                                : zitem.key.includes('LI')
                                ? '_l1'
                                : zitem.key.includes('RI')
                                ? '_r1'
                                : '_r2'
                            ]"
                          >
                            <div class="_tbox">
                              <div class="_txt">
                                <span class="_aligncenter _title">{{
                                  zitem.key
                                }}</span>
                              </div>
                              <div class="_b">
                                <template v-if="zitem.value !== ''">
                                  <div class="_txt">
                                    <span>{{ zitem.value.tyreNo }}</span>
                                  </div>
                                  <div class="_txt">
                                    <span
                                      >当前花纹 {{ zitem.value.pattern }}</span
                                    >
                                  </div>

                                  <div class="_txt">
                                    <span>胎温</span
                                    ><span>{{
                                      zitem.value.tyreTemperature
                                    }}</span>
                                  </div>

                                  <div class="_txt">
                                    <span>胎压</span
                                    ><span>{{ zitem.value.tyrePressure }}</span>
                                  </div>
                                  <a-button
                                    type="link"
                                    @click="showTpms(zitem.value.tyreNo)"
                                    ><span style="font-size:3px"
                                      >TPMS数据</span
                                    ></a-button
                                  >
                                </template>
                                <template v-else>
                                  <div class="_txt">
                                    <span class="_aligncenter">——</span>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template v-if="key.includes('B')">
                          <div
                            v-for="(zitem, zindex) in item.value"
                            :key="zindex"
                            :class="[zitem.key.includes('L') ? '_l1' : '_r1']"
                          >
                            <div class="_tbox">
                              <div class="_txt">
                                <span class="_aligncenter _title">{{
                                  zitem.key
                                }}</span>
                              </div>
                              <div class="_b">
                                <template v-if="zitem.value !== ''">
                                  <div class="_txt">
                                    <span>{{ zitem.value.tyreNo }}</span>
                                  </div>
                                  <div class="_txt">
                                    <span
                                      >当前花纹 {{ zitem.value.pattern }}</span
                                    >
                                  </div>
                                  <div class="_txt" style="margin-top: 3px">
                                    <span>胎温</span
                                    ><span>{{
                                      zitem.value.tyreTemperature
                                    }}</span>
                                  </div>
                                  <div class="_txt">
                                    <span>胎压</span
                                    ><span>{{ zitem.value.tyrePressure }}</span>
                                  </div>
                                  <a-button
                                    type="link"
                                    @click="showTpms(zitem.value.tyreNo)"
                                    ><span style="font-size:3px"
                                      >TPMS数据</span
                                    ></a-button
                                  >
                                </template>
                                <template v-else>
                                  <div class="_txt">
                                    <span class="_aligncenter">——</span>
                                  </div>
                                </template>
                              </div>
                            </div>
                          </div>
                        </template>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="1" tab="车辆详情">
            <div class="tab1">
              <div>
                <div class="_l">
                  <span v-if="InfoStatus === 'edit'" style="color:red;">*</span
                  >车牌号：
                </div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.vehicleNumber
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.vehicleNumber"
                  />
                </div>
              </div>
              <div>
                <div class="_l">车载终端编号：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.vehicleDeviceID
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.vehicleDeviceID"
                  />
                </div>
              </div>
              <div>
                <div class="_l">关联车头/挂车：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.trailerNumber
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.trailerNumber"
                  />
                </div>
              </div>
              <div>
                <div class="_l">规格载重（吨）：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.loadWeight
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.loadWeight"
                  />
                </div>
              </div>
              <div>
                <div class="_l">车辆自编号：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.vehicleSelfNumber
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.vehicleSelfNumber"
                  />
                </div>
              </div>
              <div>
                <div class="_l">规格自重（吨）：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.selfWeight
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.selfWeight"
                  />
                </div>
              </div>
              <div>
                <div class="_l">车辆类型：</div>
                <div class="_r">
                  <span>{{
                    vehicleInfo.vehicleType === 1
                      ? "挂车"
                      : vehicleInfo.vehicleType === 2
                      ? "车头"
                      : vehicleInfo.vehicleType === 3
                      ? "整车"
                      : "不限"
                  }}</span>
                </div>
              </div>
              <div>
                <div class="_l">实际载重（吨）：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.actualWeight
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.actualWeight"
                  />
                </div>
              </div>
              <div>
                <div class="_l">轮位类型：</div>
                <div class="_r">{{ vehicleInfo.vehicleWheelModel }}</div>
              </div>
              <div>
                <div class="_l">载重类型：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.loadType
                  }}</span>
                  <a-select
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.loadType"
                    show-search
                    style="width:183px"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="item in loadTypeList"
                      :value="item.value"
                      :key="item.key"
                      >{{ item.key }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div>
                <div class="_l">车辆轮胎总数：</div>
                <div class="_r">{{ vehicleInfo.vehicleTyreNum }}</div>
              </div>
              <div>
                <div class="_l">载货类型：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.cargoType
                  }}</span>
                  <a-select
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.cargoType"
                    show-search
                    style="width:183px"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="item in cargoTypeList"
                      :value="item.value"
                      :key="item.key"
                      >{{ item.key }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div>
                <div class="_l">实际服务轮位数：</div>
                <div class="_r">{{ vehicleInfo.vehicleInstallTyreNum }}</div>
              </div>
              <div>
                <div class="_l">行驶路况：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.roadCondition
                  }}</span>
                  <a-select
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.roadCondition"
                    show-search
                    style="width:183px"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="item in roadConditionList"
                      :value="item.value"
                      :key="item.key"
                      >{{ item.key }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div>
                <div class="_l">
                  <span v-if="InfoStatus === 'edit'" style="color:red;">*</span
                  >车辆所属企业：
                </div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">
                    {{ vehicleInfo.enterpriseName }}</span
                  >
                  <a-select
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.enterpriseID"
                    style="width:183px"
                    show-search
                    :show-arrow="false"
                    :filter-option="filterOption"
                    :not-found-content="null"
                    placeholder="请选择"
                    @select="enterpriseChange"
                  >
                    <a-select-option
                      v-for="item in allEnterprise"
                      :value="item.enterpriseID"
                      :key="item.enterpriseID"
                      >{{ item.NAME }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div>
                <!-- <div class="_l">行驶距离：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.distanceType
                  }}</span>
                  <a-select
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.distanceType"
                    show-search
                    style="width:183px"
                    :show-arrow="false"
                    :filter-option="false"
                    :not-found-content="null"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="item in distancetypeList"
                      :value="item.value"
                      :key="item.key"
                      >{{ item.key }}</a-select-option
                    >
                  </a-select>
                </div> -->
              </div>
              <div>
                <div class="_l">
                  <span v-if="InfoStatus === 'edit'" style="color:red;">*</span
                  >车辆所属车队：
                </div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.fleetName
                  }}</span>
                  <a-select
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.fleetID"
                    style="width:183px"
                    show-search
                    :show-arrow="false"
                    :filter-option="filterOption"
                    :not-found-content="null"
                    placeholder="请选择"
                    @select="fleetChange"
                  >
                    <a-select-option
                      v-for="item in allFleetList"
                      :value="item.fleetID"
                      :key="item.fleetName"
                      >{{ item.fleetName }}</a-select-option
                    >
                  </a-select>
                </div>
              </div>
              <div>
                <div class="_l">车辆当前里程(GPS)：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.currentGPSMileage || 0
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.loadNumber"
                  />
                </div>
              </div>
              <div>
                <!-- <div class="_l">
                  <span v-if="InfoStatus === 'edit'" style="color:red;">*</span
                  >所属服务站：
                </div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.stationName
                  }}</span>
                  <a-select
                    v-model="csubmitForm.stationID"
                    v-if="InfoStatus === 'edit'"
                    show-search
                    style="width:183px"
                    :show-arrow="false"
                    @select="stationChange"
                    :filter-option="filterOption"
                    :not-found-content="null"
                    option-filter-prop="children"
                    placeholder="请选择"
                  >
                    <a-select-option
                      v-for="item in stationList"
                      :value="item.stationID"
                      :key="item.stationID"
                      >{{ item.name }}</a-select-option
                    >
                  </a-select>
                </div> -->
              </div>
              <div>
                <div class="_l">车辆初始里程：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.initialMileage
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.initialMileage"
                  />
                </div>
              </div>
              <div>
                <div class="_l">驾驶员姓名1:</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.driverInfo.length
                      ? vehicleInfo.driverInfo[0].driverName
                      : ""
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="cdriverForm[0].driverName"
                  />
                </div>
              </div>
              <div>
                <div class="_l">车辆当前里程：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.currentMileage
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.currentMileage"
                  />
                </div>
              </div>
              <div>
                <div class="_l">驾驶员手机号1：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.driverInfo.length
                      ? vehicleInfo.driverInfo[0].driverPhoneNum
                      : ""
                  }}</span>
                  <div v-if="InfoStatus === 'edit'">
                    <a-input v-model="cdriverForm[0].driverPhoneNum" />
                  </div>
                </div>
              </div>
              <div>
                <div class="_l">车辆累计里程：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'"
                    >{{
                      vehicleInfo.currentMileage - vehicleInfo.initialMileage
                    }}KM</span
                  >
                  <span v-if="InfoStatus === 'edit'"
                    >{{
                      csubmitForm.currentMileage - csubmitForm.initialMileage
                    }}KM</span
                  >
                </div>
              </div>
              <div>
                <div class="_l">驾驶员姓名2：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.driverInfo.length
                      ? vehicleInfo.driverInfo[1].driverName
                      : ""
                  }}</span>
                  <div v-if="InfoStatus === 'edit'">
                    <a-input v-model="cdriverForm[1].driverName" />
                  </div>
                </div>
              </div>
              <div>
                <div class="_l">平均速度：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.avgSpeed
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.avgSpeed"
                  />
                </div>
              </div>
              <div>
                <div class="_l">驾驶员手机号2：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.driverInfo.length
                      ? vehicleInfo.driverInfo[1].driverPhoneNum
                      : ""
                  }}</span>
                  <div v-if="InfoStatus === 'edit'">
                    <a-input v-model="cdriverForm[1].driverPhoneNum" />
                  </div>
                </div>
              </div>
              <div>
                <div class="_l">最大速度：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.maxSpeed
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.maxSpeed"
                  />
                </div>
              </div>
              <div>
                <div class="_l">车辆品牌：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.brand
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.brand"
                  />
                </div>
              </div>
              <div>
                <div class="_l">车辆型号：</div>
                <div class="_r">
                  <span v-if="InfoStatus === 'info'">{{
                    vehicleInfo.vehicleModel
                  }}</span>
                  <a-input
                    v-if="InfoStatus === 'edit'"
                    v-model="csubmitForm.vehicleModel"
                  />
                </div>
              </div>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2" tab="车辆位置">
            <div style="height:600px" id="dragContainer" tabindex="0"></div>
          </a-tab-pane>
        </a-tabs>
        <template slot="footer" v-if="activeKey === '1'">
          <div v-if="InfoStatus === 'info'">
            <a-button key="back" @click="toEdit()">
              修改
            </a-button>
          </div>
          <div v-if="InfoStatus === 'edit'">
            <a-button key="back" @click="resetForm">
              取消
            </a-button>
            <a-button key="submit" type="primary" @click="submitCU()">
              提交
            </a-button>
          </div>
        </template>
        <template slot="footer" v-if="activeKey !== '1'">
          <div></div>
        </template>
      </a-modal>
    </div>
  </div>
</template>

<script>
import vehicleApi from "@/api/vehicle"
import SearchOptions from "@/components/Crud/SearchOptions"
import Operations from "@/components/Crud/Operations"
import Pagination from "@/components/Crud/Pagination"
import CRUD, { presenter, header, form } from "@crud/crud"
import engineerApi from "@/api/engineer"
import _ from "lodash"
import accountApi from "@/api/system/account"
import AMap from "AMap"
import AMapUI from "AMapUI"

const defaultForm = {
  vehicleNumber: "",
  vehicleSelfNumber: "",
  vehicleType: 3,
  vehicleWheelModel: "",
  enterpriseID: "",
  fleetID: "",
  vehicleTyreNum: 0,
  trailerNumber: ""
}

export default {
  name: "Home",
  mixins: [presenter(), header(), form(defaultForm)],
  cruds() {
    return CRUD({
      title: "车辆",
      columns: [
        {
          title: "车牌号",
          dataIndex: "vehicleNumber"
        },
        {
          title: "车辆类型",
          dataIndex: "vehicleType"
        },
        {
          title: "轮位类型",
          dataIndex: "vehicleWheelModel"
        },
        {
          title: "车辆所属企业",
          dataIndex: "enterpriseName"
        },
        {
          title: "车辆所属车队",
          dataIndex: "fleetName"
        },
        // {
        //   title: "关联车头/挂车",
        //   dataIndex: "trailerNumber"
        // },
        {
          title: "操作",
          width: 300,
          scopedSlots: { customRender: "operation" }
        }
      ],
      crudMethod: { ...vehicleApi },
      idField: "vehicleID" // 设置每一条记录的唯一标失
    })
  },
  data() {
    let checkvehicleNumber = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入车牌号！"))
      }
      // eslint-disable-next-line no-useless-escape
      let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
      if (reg.test(value)) {
        callback(new Error("车牌号只能输入中文、数字和字母！"))
      } else if (value.trim().length < 3 || value.trim().length > 20) {
        callback(new Error("车牌号只能3-20个字符！"))
      } else {
        callback()
      }
    }
    let checkvehicleSelfNumber = (rule, value, callback) => {
      if (value) {
        // eslint-disable-next-line no-useless-escape
        let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
        if (reg.test(value)) {
          callback(new Error("车辆自编号只能输入中文、数字和字母！"))
        } else if (value.trim().length < 3 || value.trim().length > 8) {
          callback(new Error("车辆自编号只能3-8个字符！"))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let checktrailerNumber = (rule, value, callback) => {
      if (value) {
        // eslint-disable-next-line no-useless-escape
        let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
        if (reg.test(value)) {
          callback(new Error("关联车头/挂车车牌只能输入中文、数字和字母！"))
        } else if (value.trim().length < 4 || value.trim().length > 8) {
          callback(new Error("关联车头/挂车车牌只能4-8个字符！"))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    let checkvehicleTyreNum = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入车牌轮位数量！"))
      }
      // eslint-disable-next-line no-useless-escape
      let reg = /^\d{1,}$/
      if (!reg.test(value)) {
        callback(new Error("车牌轮位数量只能输入数字!"))
      } else {
        callback()
      }
    }
    return {
      rules: {
        vehicleNumber: [
          { required: true, validator: checkvehicleNumber, trigger: "blur" }
        ],
        vehicleSelfNumber: [
          {
            required: false,
            validator: checkvehicleSelfNumber,
            trigger: "blur"
          }
        ],
        vehicleType: [
          { required: true, message: "请选择车辆类型", trigger: "blur" }
        ],
        vehicleWheelModel: [
          { required: true, message: "请选择轮位类型", trigger: "blur" }
        ],
        enterpriseID: [
          { required: true, message: "请选择所属企业", trigger: "blur" }
        ],
        fleetID: [
          { required: true, message: "请选择所属车队", trigger: "blur" }
        ],
        vehicleTyreNum: [
          {
            required: true,
            validator: checkvehicleTyreNum,
            trigger: "blur"
          }
        ],
        trailerNumber: [
          {
            required: false,
            validator: checktrailerNumber,
            trigger: "blur"
          }
        ]
      },
      headstockwheelList: [],
      vehiclewheelList: [],
      trailerwheelList: [],
      allEnterprise: [],
      copyAllEnterprise: [],
      allFleetList: [],
      roadConditionList: [],
      loadTypeList: [],
      distancetypeList: [],
      cargoTypeList: [],

      InfoStatus: "",
      vehicleInfo: {
        driverInfo: []
      },
      submitForm: {},
      csubmitForm: {},
      activeVehicleID: "",
      activeKey: "1",

      driverForm: [
        {
          driverName: "",
          driverPhoneNum: ""
        },
        {
          driverName: "",
          driverPhoneNum: ""
        }
      ],
      cdriverForm: null,
      stationList: [],
      vehicleWheelModel: "",
      vehicleWheelMap: {}
    }
  },
  components: { SearchOptions, Operations, Pagination },
  created() {
    let { code } = this.$route.meta

    console.log(code)

    this.crud.optShow.edit = false

    this.crud.permission = {
      download: true,
      add: code.includes("新增车辆"),
      edit: code.includes("修改车辆"),
      del: code.includes("删除车辆")
    }

    this.getStationList()
    this.getAllEnterprise()

    this.getDictionary("headstockwheel")
    this.getDictionary("vehiclewheel")
    this.getDictionary("trailerwheel")
    this.getDictionary("roadCondition")
    this.getDictionary("loadType")
    this.getDictionary("distancetype")
    this.getDictionary("cargoType")
  },
  watch: {
    "crud.status.cu": {
      handler(newVal) {
        if (newVal > 0) {
          this.getAllEnterprise()
        }
      },
      deep: true
    },
    "form.vehicleType": {
      handler() {
        this.form.trailerNumber = ""
        this.form.vehicleWheelModel = ""
      },
      deep: true
    },
    "form.enterpriseID": {
      handler() {
        this.getFleetList()
        this.form.fleetID = ""
      },
      deep: true
    }
  },
  methods: {
    initMap() {
      const _this = this
      // eslint-disable-next-line no-unused-vars
      AMapUI.loadUI(["misc/PositionPicker"], PositionPicker => {
        // 基础配置
        let mapconfig = {
          mapStyle: "amap://styles/9870b774a725a19a5af9366c12f092a0", // 样式URL,
          resizeEnable: true,
          zoom: 18,
          lang: "zh"
        }

        if (
          _this.vehicleInfo.longitude !== "" &&
          _this.vehicleInfo.latitude !== ""
        ) {
          mapconfig.center = [
            parseFloat(_this.vehicleInfo.longitude),
            parseFloat(_this.vehicleInfo.latitude)
          ]
        }
        _this.map = new AMap.Map("dragContainer", mapconfig)
        if (
          _this.vehicleInfo.longitude !== "" &&
          _this.vehicleInfo.latitude !== ""
        ) {
          var marker = new AMap.Marker({
            icon: "https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png",
            position: mapconfig.center
          })
          _this.map.add(marker)
        }
      })
    },
    // 获取服务站列表
    getStationList() {
      accountApi.getStationList({}).then(res => {
        if (res.code === 0) {
          this.stationList = res.result.list
        }
      })
    },
    getDictionary(typeName) {
      engineerApi.getDictionary({ typeName }).then(res => {
        if (res.code === 0) {
          switch (typeName) {
            case "headstockwheel":
              this.headstockwheelList = res.result.list
              break
            case "vehiclewheel":
              this.vehiclewheelList = res.result.list
              break
            case "trailerwheel":
              this.trailerwheelList = res.result.list
              break
            case "roadCondition":
              this.roadConditionList = res.result.list
              break
            case "loadType":
              this.loadTypeList = res.result.list
              console.log(
                `this.loadTypeList:${JSON.stringify(this.loadTypeList)}`
              )
              break
            case "distancetype":
              this.distancetypeList = res.result.list
              break
            case "cargoType":
              this.cargoTypeList = res.result.list
              break
            default:
              break
          }
        }
      })
    },
    async getAllEnterprise() {
      return new Promise(reslove => {
        engineerApi.get({}, false).then(res => {
          this.allEnterprise = res.result.list
          this.copyAllEnterprise = res.result.list
          reslove()
        })
      })
    },
    handleSearch(value) {
      this.allEnterprise = this.copyAllEnterprise.filter(item => {
        return item.NAME.includes(value)
      })
    },
    getFleetList() {
      engineerApi
        .getFleetList({ enterpriseID: this.form.enterpriseID })
        .then(res => {
          if (res.code === 0) {
            if (res.result.list.length) {
              let arr = res.result.list
              this.allFleetList = arr
            }
          }
        })
    },
    toDatav(record) {
      console.log(`record:${JSON.stringify(record)}`)
      window.open(
        `https://datav.aliyuncs.com/share/74491e2d1c449116a8eb2e0a0be0e1ae?vehicle=${record.vehicleNumber}`,
        "_blank"
      )
    },
    toTrajectory(record) {
      const newPage = this.$router.resolve({
        path: "/trajectory",
        name: "Trajectory",
        query: {
          vehicle: record.vehicleNumber
        }
      })
      window.open(newPage.href, "_blank")
    },
    toInfo(record) {
      this.vehicleInfo = {
        driverInfo: []
      }
      this.InfoStatus = "info"
      this.activeVehicleID = record.vehicleID
      const that = this
      vehicleApi.getVehicleInfo({ vehicleID: record.vehicleID }).then(res => {
        if (res.code === 0) {
          res.result.driverInfo = res.result.driverInfo
            ? res.result.driverInfo.length === 1
              ? [
                  ...res.result.driverInfo,
                  { driverName: "", driverPhoneNum: "" }
                ]
              : res.result.driverInfo
            : [
                { driverName: "", driverPhoneNum: "" },
                { driverName: "", driverPhoneNum: "" }
              ]
          that.vehicleInfo = res.result
          that.vehicleWheelMap = that.resolveVehicleWheel(
            that.vehicleInfo.vehicleWheelModel,
            that.vehicleInfo.vehicleType
          )
          vehicleApi
            .getVehicleTyresPattern({ vehicleID: record.vehicleID })
            .then(res2 => {
              that.resolveVehicleTEMP(res.result.tyreInfo, that.vehicleWheelMap)
              const patterns = res2.result
              console.log(`patterns:${JSON.stringify(patterns)}`)
              Object.keys(that.vehicleWheelMap).forEach(key =>
                that.vehicleWheelMap[key].forEach(item =>
                  item.value.forEach(itemSub => {
                    let tyreInfo = itemSub.value
                    console.log(`tyreInfo:${JSON.stringify(tyreInfo)}`)
                    if (tyreInfo) {
                      tyreInfo["pattern"] = patterns[tyreInfo.tyreNo]
                      console.log(
                        `patterns[tyreInfo.tyreNo]:${patterns[tyreInfo.tyreNo]}`
                      )
                    }
                    console.log(`after   tyreInfo:${JSON.stringify(tyreInfo)}`)
                  })
                )
              )
              console.log(`that.vehicleWheelMap`)
            })
        }
      })
    },
    resolveVehicleWheel(model, vehicleType) {
      let arr = model.split("-")
      let FHArr = []
      for (let i = 0; i < model.split("").length; i++) {
        const element = model.split("")[i]
        if (i !== 0 && (i + 1) % 3 === 0) {
          FHArr.push(element)
        }
      }
      let F = []
      let D = []
      let T = []
      let B = []
      for (let i = 0; i < arr.length; i++) {
        const element = arr[i]
        let k = i + 1
        if (element.includes("F")) {
          F.push({
            key: `F${k}`,
            value: [
              {
                key: `F${k}L`,
                value: ""
              },
              {
                key: `F${k}R`,
                value: ""
              }
            ],
            FH: FHArr[i]
              ? FHArr[i] === "-"
                ? "_"
                : FHArr[i] === "~"
                ? "___"
                : "__"
              : undefined,
            index: i
          })
        }
        if (element.includes("D")) {
          if (element.includes("2")) {
            D.push({
              key: `D${k}`,
              value: [
                {
                  key: `D${k}LO`,
                  value: ""
                },
                {
                  key: `D${k}RO`,
                  value: ""
                }
              ],
              FH: FHArr[i]
                ? FHArr[i] === "-"
                  ? "_"
                  : FHArr[i] === "~"
                  ? "___"
                  : "__"
                : undefined,
              index: i
            })
          }
          if (element.includes("4")) {
            D.push({
              key: `D${k}`,
              value: [
                {
                  key: `D${k}LO`,
                  value: ""
                },
                {
                  key: `D${k}LI`,
                  value: ""
                },
                {
                  key: `D${k}RI`,
                  value: ""
                },
                {
                  key: `D${k}RO`,
                  value: ""
                }
              ],
              FH: FHArr[i] ? (FHArr[i] === "-" ? "_" : "__") : undefined,
              index: i
            })
          }
        }
        if (element.includes("T")) {
          if (element.includes("2")) {
            T.push({
              key: `T${k}`,
              value: [
                {
                  key: `T${k}LO`,
                  value: ""
                },
                {
                  key: `T${k}RO`,
                  value: ""
                }
              ],
              FH: FHArr[i]
                ? FHArr[i] === "-"
                  ? "_"
                  : FHArr[i] === "~"
                  ? "___"
                  : "__"
                : undefined,
              index: i
            })
          }
          if (element.includes("4")) {
            T.push({
              key: `T${k}`,
              value: [
                {
                  key: `T${k}LO`,
                  value: ""
                },
                {
                  key: `T${k}LI`,
                  value: ""
                },
                {
                  key: `T${k}RI`,
                  value: ""
                },
                {
                  key: `T${k}RO`,
                  value: ""
                }
              ],
              FH: FHArr[i] ? (FHArr[i] === "-" ? "_" : "__") : undefined,
              index: i
            })
          }
        }
      }
      if (vehicleType === 3 || vehicleType === 1) {
        B.push({
          key: `B`,
          value: [
            {
              key: `BL`,
              value: ""
            },
            {
              key: `BR`,
              value: ""
            }
          ],
          FH: undefined,
          index: arr.length
        })
      }
      let data = {
        F,
        D,
        T,
        B
      }
      return data
    },
    resolveVehicleTEMP(result, vehicleWheelMap) {
      result =
        (typeof result === "string" &&
          result.startsWith("[") &&
          result.endsWith("]") &&
          JSON.parse(result)) ||
        []

      console.log(`result:${JSON.stringify(result)}`)

      result.forEach(it => {
        let key = it.wheelPosition
        let first = key.split("")[0]
        let second = `${key.split("")[0]}${key.split("")[1]}`
        let item = vehicleWheelMap[first]

        console.log(`it:${JSON.stringify(it)}`)

        for (let i = 0; i < item.length; i++) {
          let elementi = item[i]
          if (second.includes("B")) {
            for (let j = 0; j < elementi.value.length; j++) {
              let elementj = elementi.value[j]
              if (elementj.key === key) {
                if (JSON.stringify(it) !== "{}") {
                  elementj.value = it
                }
              }
            }
          } else {
            if (elementi.key === second) {
              for (let j = 0; j < elementi.value.length; j++) {
                let elementj = elementi.value[j]

                if (elementj.key === key) {
                  if (JSON.stringify(it) !== "{}") {
                    elementj.value = it
                  }
                }
              }
            }
          }
        }
      })
    },
    callback(key) {
      if (key === "2") {
        this.initMap()
      }
      this.activeKey = key
    },
    toEdit() {
      this.InfoStatus = "edit"
      console.log(`this.vehicleInfo:${JSON.stringify(this.vehicleInfo)}`)
      if (this.vehicleInfo.driverInfo.length) {
        this.driverForm =
          this.vehicleInfo.driverInfo.length === 1
            ? [
                ...this.vehicleInfo.driverInfo,
                { driverName: "", driverPhoneNum: "" }
              ]
            : this.vehicleInfo.driverInfo
        this.cdriverForm = _.cloneDeep(this.driverForm)
      } else {
        this.driverForm = [
          { driverName: "", driverPhoneNum: "" },
          { driverName: "", driverPhoneNum: "" }
        ]
        this.cdriverForm = _.cloneDeep(this.driverForm)
      }
      this.submitForm = _.cloneDeep(this.vehicleInfo)
      this.csubmitForm = _.cloneDeep(this.vehicleInfo)
      console.log(`this.submitForm:${JSON.stringify(this.submitForm)}`)
      console.log(`this.csubmitForm:${JSON.stringify(this.csubmitForm)}`)
    },
    resetForm() {
      this.csubmitForm = _.cloneDeep(this.submitForm)
      this.cdriverForm = _.cloneDeep(this.driverForm)
      this.InfoStatus = "info"
    },
    submitCU() {
      let { vehicleNumber, fleetID, enterpriseID } = this.csubmitForm
      if (!vehicleNumber) {
        this.$message.error("请填写车牌号！")
        return
      } else {
        // eslint-disable-next-line no-useless-escape
        let reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'·！#￥（——）：；“”‘、，|《。》？、【】[\]]/im
        if (reg.test(vehicleNumber)) {
          this.$message.error("车牌号只能输入中文、数字和字母！")
          return
        } else if (
          vehicleNumber.trim().length < 3 ||
          vehicleNumber.trim().length > 20
        ) {
          this.$message.error("车牌号只能3-20个字符！")
          return
        }
      }
      if (!enterpriseID) {
        this.$message.error("请选择所属企业！")
        return
      }
      if (!fleetID) {
        this.$message.error("请选择所属车队！")
        return
      }
      // if (!stationID) {
      //   this.$message.error("请选择所属服务站！")
      //   return
      // }

      this.csubmitForm.driverInfo = this.cdriverForm
      let postData = _.cloneDeep(this.csubmitForm)
      vehicleApi.edit(postData).then(res => {
        console.log(res)
        if (res.code === 14) {
          this.InfoStatus = "info"
          this.toInfo({ vehicleID: this.activeVehicleID })
          this.crud.toQuery()
        }
      })
    },
    cancelCU() {
      this.InfoStatus = ""
      this.vehicleInfo = {
        driverInfo: []
      }
      this.submitForm = {}
      this.csubmitForm = {}
      this.activeVehicleID = ""
      this.driverForm = [
        {
          driverName: "",
          driverPhoneNum: ""
        },
        {
          driverName: "",
          driverPhoneNum: ""
        }
      ]
      this.cdriverForm = null
      this.vehicleWheelMap = {}
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    stationChange(value) {
      this.csubmitForm.stationName = this.stationList.filter(item => {
        return item.stationID === value
      })[0].name
      this.csubmitForm.fleetID = ""
      this.csubmitForm.fleetName = ""
      this.csubmitForm.enterpriseID = ""
      this.csubmitForm.enterpriseName = ""
    },
    enterpriseChange(value) {
      this.csubmitForm.enterpriseName = this.allEnterprise.filter(item => {
        return item.enterpriseID === value
      })[0].NAME
      this.csubmitForm.fleetID = ""
      this.csubmitForm.fleetName = ""
      this.getFleetList()
    },
    fleetChange(value) {
      this.csubmitForm.fleetName = this.allFleetList.filter(item => {
        return item.fleetID === value
      })[0].fleetName
    },

    showTpms(tyreNo) {
      window.open(
        `${process.env.VUE_APP_WEB_URL}/senser/index.html?tyreid=${tyreNo}&`,
        "_blank"
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.tyreModule {
  width: 100%;
  padding: 20px;
  & > ._title {
    font-size: 16px;
    font-weight: bold;
    color: rgba(51, 51, 51, 1);
    height: 16px;
    line-height: 16px;
    margin-bottom: 20px;
  }
  ._box {
    padding: 0px 25px;
    margin-bottom: 85px;
    display: flex;
    flex-direction: column;
    align-items: center;
    ._f {
      margin: 0 auto;
      margin-top: 100px;
      position: relative;
      ._row {
        position: relative;
        width: 1px;
        height: 1px;
        margin-bottom: 188px;
        &::after {
          content: "";
          display: block;
          width: 215px;
          height: 1px;
          background-color: #333;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 55;
        }
        &::before {
          content: "";
          display: block;
          width: 1px;
          height: 188px;
          background-color: #333;
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 55;
        }
        &.isFirst {
          &::before {
            height: 188px;
            top: 0;
          }
        }
      }
      ._l1 {
        left: -183px;
        transform: rotateZ(-15deg);
        ._tbox {
          transform: rotateZ(15deg);
        }
      }
      ._r1 {
        left: 83px;
        transform: rotateZ(-15deg);
        ._tbox {
          transform: rotateZ(15deg);
        }
      }
    }
    ._d,
    ._t {
      margin: 0 auto;
      & > ._row {
        &.isLast {
          position: relative;
          &::before {
            top: -106px;
            transform: translate(-50%, 0);
            z-index: 99;
          }
        }
        &.isFirst {
          &::before {
            top: 1px;
            transform: translate(-50%, 0);
          }
        }
        &.isLast.isFirst {
          &::before {
            display: none;
          }
        }
        &.is__,
        &.is___ {
          margin-bottom: 225px;
          &::before {
            height: 300px;
          }
        }
        margin-bottom: 153px;
        width: 1px;
        height: 1px;
        position: relative;
        &::after {
          content: "";
          display: block;
          width: 286px;
          height: 1px;
          background-color: #333;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 55;
        }
        &::before {
          content: "";
          display: block;
          width: 1px;
          height: 107px;
          background-color: #333;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 55;
        }
        ._l1 {
          right: 13px;
        }
        ._l2 {
          right: 125px;
        }
        ._r1 {
          left: 13px;
        }
        ._r2 {
          left: 125px;
        }
      }
    }

    ._b {
      position: relative;
      ._row {
        width: 1px;
        height: 1px;
        position: relative;
        &::before {
          content: "";
          display: block;
          width: 3px;
          height: 225px;
          background-color: #fff;
          position: absolute;
          top: -225px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 55;
        }
      }
      ._l1 {
        right: 125px;
      }
      ._r1 {
        right: 13px;
      }
    }
    ._l1,
    ._l2,
    ._r2,
    ._r1 {
      position: absolute;
      top: 50%;
      margin-top: -80px;
      width: 100px;
      height: 150px;
      background: rgba(255, 255, 255, 1);
      border-radius: 12px;
      border: 4px solid rgba(51, 51, 51, 1);
      z-index: 66;
      display: flex;
      align-items: center;
      justify-content: center;
      // &._blue {
      //   background: #70b7ff;
      // }
      // &._orange {
      //   background: #ffa067;
      // }
      ._tbox {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // margin-bottom: 10px;
        ._b {
          display: flex;
          flex-direction: column;
          justify-content: center;
          width: 80%;
        }
        ._txt {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          overflow: hidden;
          margin-bottom: 1px;
          &:last-child {
            margin-bottom: 0;
          }
          & > span {
            display: block;
            font-size: 12px;
            width: 100%;
            word-break: break-all;
            &._aligncenter {
              width: 100%;
              text-align: center;
            }
            &._title {
              height: 16px;
              font-size: 16px;
              line-height: 16px;
              font-weight: bolder;
            }
          }
        }
      }
    }
  }
}
</style>
