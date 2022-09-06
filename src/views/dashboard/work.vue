<!--
 * @Description:
 * @Author: yuyongjie
 * @Date: 2020-12-07 13:27:45
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-04 20:27:20
-->
<template>
  <div class="page">
    <div class="big-screen">
      <!--      <a-button type="primary" class="btn">-->
      <!--        数据大屏 1920*1080-->
      <!--      </a-button>-->
      <!--      <a-button type="primary" class="btn">-->
      <!--        数据大屏 3840*2160-->
      <!--      </a-button>-->
      <!--      <a-button class="btn" type="primary" @click="generateMonthReport()">-->
      <!--        生成2月份使用明细-->
      <!--      </a-button>-->
      <!--      <a-button class="btn" type="primary" @click="generateMonthReport1()">-->
      <!--        生成1月份使用明细-->
      <!--      </a-button>-->
    </div>
    <div class="top-card">
      <a-card class="card card1" hoverable>
        <template slot="title">
          <div class="title">
            轮胎总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(tyreDataObj.tyreNumCount) }}
            </span>
            <span>条</span>
          </div>
          <!-- <div class="_bottom">
            <div>
              <div class="_title">
                已装车新胎
              </div>
              <div class="_right">
                <span>666900</span>
                <span>66.69%</span>
              </div>
            </div>
            <div>
              <div class="_title">
                待装车轮胎
              </div>
              <div class="_right">
                <span>444100</span>
                <span>44.41%</span>
              </div>
            </div>
          </div> -->
        </div>
      </a-card>
      <!-- 2 -->
      <a-card class="card card2" hoverable>
        <template slot="title">
          <div class="title">
            车辆总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(vehicleDataObj.vehicleCount) }}
            </span>
            <span>辆</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{ splitNum(vehicleDataObj.monthVehicleCount) }}</span>
                <span>辆</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                    :class="[
                    parseFloat(vehicleDataObj.vehiclePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                  >{{
                      (
                          parseFloat(vehicleDataObj.vehiclePercentage) * 100
                      ).toFixed(2)
                    }}%</span
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 3 -->
      <a-card class="card card3" hoverable>
        <template slot="title">
          <div class="title">
            企业客户总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(enterpriseDataObj.signedEnterpriseCount) }}
            </span>
            <span>家企业客户</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{
                    splitNum(enterpriseDataObj.monthSignedEnterpriseCount)
                  }}</span>
                <span>户</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                    :class="[
                    parseFloat(enterpriseDataObj.signedEnterprisePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                  >{{
                      parseFloat(enterpriseDataObj.signedEnterprisePercentage) *
                      100
                    }}%</span
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 4 -->
      <a-card class="card card4" hoverable>
        <template slot="title">
          <div class="title">
            站点总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(stationDataObj.stationCount) }}
            </span>
            <span>个</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{ splitNum(stationDataObj.monthStationCount) }}</span>
                <span>个</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                    :class="[
                    parseFloat(stationDataObj.stationPercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                  >{{
                      (
                          parseFloat(stationDataObj.stationPercentage) * 100
                      ).toFixed(2)
                    }}%</span
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <div class="bottom-card">
      <a-card class="card" hoverable title="轮胎状态统计">
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <span>合计</span>
            <span class="b">{{ splitNum(tyreDataObj.tyreNumCount) }}</span>
            <span>条</span>
          </div>
          <div ref="chart" style="width:100%;height:376px"></div>
        </div>
      </a-card>
      <div></div>
    </div>
  </div>
</template>
<script>
import {parseTime, splitNum} from "@/utils/utils"
// import eventBus from "@/bus"
import Api from "@/api/analysis"
import {downloadFileByUrl} from "../../utils/utils"
// import echarts from "echarts"
export default {
  data() {
    return {
      parseTime,
      splitNum,
      option: {
        color: [
          "#FF6730",
          "#F2B101",
          "#3B7AFC",
          "#6DD400",
          "#47F4CD",
          "#3DC8FF",
          "#9273FF",
          "#FFDB4D",
          "#6D7278"
        ],
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: [],
          selected: []
        },
        series: [
          {
            name: "轮胎状态",
            type: "pie",
            radius: ["40%", "70%"],
            center: ["40%", "50%"],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      },
      stationDataObj: {
        lastMonthStationCount: 0,
        monthStationCount: 0,
        stationCount: 0,
        stationPercentage: "0.00"
      },
      tyreDataObj: {
        tyreNumCount: 0
      },
      vehicleDataObj: {
        vehicleCount: 0,
        monthVehicleCount: 0,
        vehiclePercentage: 0
      },
      enterpriseDataObj: {
        signedEnterpriseCount: 0,
        monthSignedEnterpriseCount: 0,
        signedEnterprisePercentage: 0
      },
      tyreSatatus: {
        s1: "1",
        s2: "2",
        s3: "3",
        s4: "4",
        s5: "5",
        s6: "6",
        s7: "7",
        s8: "8",
        s9: "9"
      }
    }
  },
  mounted() {
    this.initData()
  },
  methods: {
    initData() {
      Api.analysisStationInfo({}).then(res => {
        if (res.code === 0) {
          for (const key in res.result) {
            if (Object.hasOwnProperty.call(res.result, key)) {
              const element = res.result[key]
              if (element === null || element === undefined) {
                res.result[key] = 0
              }
            }
          }
          this.stationDataObj = res.result
        }
      })
      Api.analysisVehicle({}).then(res => {
        if (res.code === 0) {
          for (const key in res.result) {
            if (Object.hasOwnProperty.call(res.result, key)) {
              const element = res.result[key]
              if (element === null || element === undefined) {
                if (key.includes("OrMonth")) {
                  res.result[key] = []
                } else {
                  res.result[key] = 0
                }
              }
            }
          }
          this.vehicleDataObj = res.result
        }
      })
      Api.analysisEnterprise({}).then(res => {
        if (res.code === 0) {
          for (const key in res.result) {
            if (Object.hasOwnProperty.call(res.result, key)) {
              const element = res.result[key]
              if (element === null || element === undefined) {
                if (key.includes("By")) {
                  res.result[key] = []
                } else {
                  res.result[key] = 0
                }
              }
            }
          }
          this.enterpriseDataObj = res.result
        }
      })
      Api.analysisTyre({}).then(res => {
        if (res.code === 0) {
          for (const key in res.result) {
            if (Object.hasOwnProperty.call(res.result, key)) {
              const element = res.result[key]
              if (element === null || element === undefined) {
                res.result[key] = 0
              }
            }
          }
          this.tyreDataObj = res.result
          this.drawChart(this.tyreDataObj.tyreNumCountInfo)
        }
      })
    },
    drawChart(data) {
      if (!data) {
        return
      }
      let obj = data[0]
      let x = [],
          y = []
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
          const element = obj[key]
          if (parseInt(element) !== 0) {
            if (key.includes("Count")) {
              if (key !== "noInstalltyreNumCount") {
                const str = key.split("Count")[0]
                let title = str.charAt(str.length - 1)
                x.push(this.tyreSatatus[`s${title}`])
                y.push({
                  name: this.tyreSatatus[`s${title}`],
                  value: element
                })
              }
            }
          }
        }
      }
      this.option.legend.data = x
      this.option.series[0].data = y
      // 初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["chart"])
      // 绘制图表
      myChart.setOption(this.option)
    },
    async generateMonthReport() {
      downloadFileByUrl(
          "http://ksmanage.linkchaindata.com/static-file/a.xls",
          "2022年2月份西藏玉龙轮胎使用明细.xls"
      )
    },
  }
}
</script>
<style lang="scss" scoped>
.page {
  overflow-x: auto;
}

.big-screen {
  & > .btn {
    width: 186px;
    height: 48px;
    background: linear-gradient(135deg, #83dcfe 1%, #5ba2fa 54%, #6173ff 100%);
    border-radius: 7px;
    text-align: center;
    line-height: 48px;
    color: #fff;
    font-size: 16px;
    border-radius: 7px;
    margin-right: 22px;
    outline: none;
    border: none !important;
  }

  margin-bottom: 24px;
}

.top-card {
  min-width: 1156px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  .card {
    height: 232px;
    margin-right: 18px;

    &:last-child {
      margin-right: 0;
    }

    flex: 1;
    min-width: 275px;
    border: none;
    border-radius: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);

    /deep/ .ant-card-head,
    /deep/ .ant-card-body {
      padding-left: 19px;
      padding-right: 19px;
    }

    /deep/ .ant-card-head {
      padding-top: 14px;
      padding-bottom: 14px;

      .ant-card-head-title {
        padding: 0;
      }

      .title {
        height: 30px;
        font-size: 22px;
        font-weight: 500;
        text-align: left;
        color: #3d3d3d;
        line-height: 30px;
        margin-bottom: 9px;
      }

      .date {
        height: 20px;
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #afafaf;
        line-height: 20px;
      }
    }

    /deep/ .ant-card-body {
      padding-top: 12px;
      padding-bottom: 16px;

      ._content {
        ._top {
          display: flex;
          align-items: center;
          margin-bottom: 18px;

          span {
            display: block;

            &:first-child {
              height: 47px;
              font-size: 40px;
              font-weight: 700;
              text-align: left;
              color: #3d3d3d;
              line-height: 47px;
              letter-spacing: 2px;
            }

            &:last-child {
              height: 20px;
              font-size: 14px;
              font-weight: 400;
              text-align: left;
              color: #afafaf;
              line-height: 20px;
              margin-top: 10px;
              margin-left: 9px;
            }
          }
        }

        ._bottom {
          & > div {
            margin-bottom: 9px;

            &:last-child {
              margin-bottom: 0;
            }

            display: flex;
            align-items: center;

            ._title {
              height: 20px;
              font-size: 14px;
              font-weight: 400;
              text-align: left;
              color: #afafaf;
              line-height: 20px;
              margin-right: 22px;
            }
          }
        }
      }
    }

    &.card1,
    &.card2,
    &.card3,
    &.card4 {
      .ant-card-body {
        ._content {
          ._bottom {
            & > div {
              ._right {
                display: flex;
                align-items: center;

                span {
                  display: block;
                  max-width: 58px;

                  &:first-child {
                    height: 22px;
                    font-size: 16px;
                    font-weight: 500;
                    text-align: left;
                    color: #3b3b3b;
                    line-height: 22px;
                    margin-right: 16px;
                  }

                  &:last-child {
                    height: 20px;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: left;
                    color: #6f7fff;
                    line-height: 20px;
                  }
                }
              }
            }
          }
        }
      }
    }

    &.card2,
    &.card3,
    &.card4 {
      .ant-card-body {
        ._content {
          ._bottom {
            & > div {
              &:last-child {
                ._right {
                  span {
                    display: flex;
                    align-items: center;

                    & > * {
                      display: block;
                    }

                    span {
                      &:last-child {
                        margin-left: -8px;
                      }
                    }

                    &.add {
                      span {
                        color: #ff4343;

                        &:first-child {
                          width: 0;
                          height: 0;
                          border-left: 9px solid transparent;
                          border-right: 9px solid transparent;
                          border-bottom: 10px solid red;
                        }
                      }
                    }

                    &.reduce {
                      span {
                        color: #05c065;

                        &:first-child {
                          width: 0;
                          height: 0;
                          border-left: 9px solid transparent;
                          border-right: 9px solid transparent;
                          border-top: 10px solid #05c065;
                        }
                      }
                    }
                  }
                }
              }

              ._right {
                display: flex;
                align-items: center;

                span {
                  &:last-child {
                    color: #afafaf;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}

.bottom-card {
  margin-top: 24px;
  min-width: 1156px;

  .card {
    border: none;
    border-radius: 10px;
    box-shadow: 4px 4px 8px 0px rgba(201, 201, 201, 0.5);
    margin-bottom: 10px;

    /deep/ .ant-card-head {
      .ant-card-head-title {
        font-size: 22px;
        font-weight: 500;
        text-align: left;
        color: #3d3d3d;
      }

      .ant-card-extra {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #afafaf;
      }
    }

    ._box {
      position: relative;
      overflow: hidden;

      ._t {
        position: absolute;
        left: 18px;
        top: -5px;
        display: flex;
        align-items: flex-end;
        z-index: 88;

        span {
          font-size: 14px;
          font-weight: 400;
          color: #afafaf;
          display: block;

          &.b {
            color: #6f7fff;
            font-size: 22px;
            font-weight: 500;
            margin: 0 7px;
          }
        }
      }
    }
  }

  & > * {
    width: calc(50% - 9px);

    &:first-child {
      margin-right: 18px;
    }
  }
}
</style>
