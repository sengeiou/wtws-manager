<!--
 * @Description: 
 * @Author: yuyongjie
 * @Date: 2020-12-20 16:25:23
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:06:14
-->
<template>
  <div class="page">
    <div class="top-card">
      <!-- 1 -->
      <a-card class="card card1" hoverable>
        <template slot="title">
          <div class="title">
            租赁车辆总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.vehicleCount) }}
            </span>
            <span>辆</span>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>
      <!-- 2 -->
      <a-card class="card card2" hoverable>
        <template slot="title">
          <div class="title">
            租赁车辆本月新增
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.monthVehicleCount) }}
            </span>
            <span>辆</span>
          </div>
          <div class="_bottom">
            <div class="HB">
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.vehiclePercentage) < 0 ? 'reduce' : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (parseFloat(dataObj.vehiclePercentage) * 100).toFixed(2)
                    }}%</span
                  >
                </span>
              </div>
            </div>
            <div>
              <div class="_title">
                今年累计新增
              </div>
              <div class="_right">
                <span>{{ splitNum(dataObj.yearVehicleCount) }}</span>
                <span>辆</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 3 -->
      <a-card class="card card3" hoverable>
        <template slot="title">
          <div class="title">
            租赁车辆总轮位数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.vehicleTyreNumCount) }}
            </span>
            <span>轮位</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{ splitNum(dataObj.monthVehicleTyreNumCount) }}</span>
                <span>轮位</span>
              </div>
            </div>
            <div class="HB">
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.vehicleTyreNumPercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (
                        parseFloat(dataObj.vehicleTyreNumPercentage) * 100
                      ).toFixed(2)
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
            租赁运营轮位数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.vehicleInstallTyreNumCount) }}
            </span>
            <span>轮位</span>
          </div>
          <div class="_bottom">
            <div class="HB">
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.vehicleInstallTyreNumPercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (
                        parseFloat(dataObj.vehicleInstallTyreNumPercentage) *
                        100
                      ).toFixed(2)
                    }}%</span
                  >
                </span>
              </div>
            </div>
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{
                  splitNum(dataObj.mothVehicleInstallTyreNumCount)
                }}</span>
                <span>个</span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
    </div>
    <div class="bottom-card">
      <a-card title="租赁车辆每月增长数量统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <span>今年累计新增</span>
            <span class="b">{{ splitNum(dataObj.yearVehicleCount) }}</span>
            <span>辆</span>
          </div>
          <div ref="chart1" style="width:100%;height:376px"></div>
        </div>
      </a-card>
      <a-card title="租赁运营轮位每月增长数量统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <span>今年累计新增</span>
            <span class="b">{{
              splitNum(dataObj.vehicleInstallTyreNumCount)
            }}</span>
            <span>轮位</span>
          </div>
          <div ref="chart2" style="width:100%;height:376px"></div>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import Api from "@/api/analysis"
import { splitNum, parseTime } from "@/utils/utils"
import echarts from "echarts"
export default {
  data() {
    return {
      splitNum,
      parseTime,
      dataObj: {
        lastMonthVehicleCount: 0,
        lastMonthVehicleTyreNumCount: "0",
        lastMothVehicleInstallTyreNumCount: 0,
        monthVehicleCount: 0,
        monthVehicleCountOrMonth: [],
        monthVehicleTyreNumCount: 0,
        monthVehicleTyreNumCountOrMonth: [],
        mothVehicleInstallTyreNumCount: 0,
        vehicleCount: 0,
        vehicleInstallTyreNumCount: "0",
        vehicleInstallTyreNumPercentage: "0",
        vehiclePercentage: "0",
        vehicleTyreNumCount: "0",
        vehicleTyreNumPercentage: "0",
        yearVehicleCount: 0,
        yearVehicleInstallTyreNumCount: 0
      },
      option1: {
        backgroundColor: "#fff",
        grid: {
          top: "20%",
          right: "10%",
          left: "10%",
          bottom: "12%"
        },
        xAxis: [
          {
            type: "category",
            color: "#AFAFAF",
            data: [],
            axisLabel: {
              formatter: "{value}月",
              margin: 20,
              color: "#DADADA",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(173,183,255,1)"
              }
            },
            axisTick: {
              show: false
            }
          }
        ],
        yAxis: [
          {
            axisLabel: {
              formatter: "{value}",
              color: "#AFAFAF",
              textStyle: {
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: "rgba(107,107,107,0.37)"
              }
            },
            axisTick: {
              show: false
            },
            splitLine: {
              lineStyle: {
                color: "rgba(131,101,101,0.2)",
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            type: "bar",
            data: [],
            barWidth: "20px",
            itemStyle: {
              normal: {
                color: function() {
                  //展示正值的柱子，负数设为透明
                  let colorArr = ["#C3E8FF", "#112AF8"]
                  return new echarts.graphic.LinearGradient(
                    0,
                    0,
                    0,
                    1,
                    [
                      {
                        offset: 0,
                        color: colorArr[0] // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: colorArr[1] // 100% 处的颜色
                      }
                    ],
                    false
                  )
                },
                barBorderRadius: [30, 30, 0, 0]
              }
            },
            label: {
              normal: {
                show: true,
                fontSize: 12,
                color: "#AFAFAF",
                position: "top"
              }
            }
          },
          {
            data: [],
            type: "line",
            smooth: true,
            name: "折线图",
            symbol: "none",
            lineStyle: {
              color: "#ADB7FF",
              width: 4,
              shadowColor: "rgba(0, 0, 0, 0.3)", //设置折线阴影
              shadowBlur: 15,
              shadowOffsetY: 20
            }
          }
        ]
      },
      option2: {}
    }
  },
  mounted() {
    this.option2 = this.option1
    this.initData()
  },
  methods: {
    initData() {
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
          this.dataObj = res.result
          this.drawChart1(res.result.monthVehicleCountOrMonth)
          this.drawChart2(res.result.monthVehicleTyreNumCountOrMonth)
        }
      })
    },
    drawChart1(data) {
      // 初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["chart1"])
      let x = []
      let y = []

      data.forEach(item => {
        x.push(item.month)
        y.push(item.monthVehicleCount)
      })
      this.option1.xAxis[0].data = x
      this.option1.series[0].data = y
      this.option1.series[1].data = y

      // 绘制图表
      myChart.setOption(this.option1)
    },
    drawChart2(data) {
      // 初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["chart2"])
      let x = []
      let y = []

      data.forEach(item => {
        x.push(item.month)
        y.push(item.monthVehicleTyreNumCount)
      })
      this.option2.xAxis[0].data = x
      this.option2.series[0].data = y
      this.option2.series[1].data = y

      // 绘制图表
      myChart.setOption(this.option2)
    }
  }
}
</script>
<style lang="scss" scoped>
.page {
  overflow-x: auto;
}
.top-card {
  min-width: 1156px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .card {
    margin-right: 18px;
    height: 232px;
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
    &.card1,
    &.card2,
    &.card3,
    &.card4 {
      .ant-card-body {
        ._content {
          ._bottom {
            & > div {
              &.HB {
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
  display: flex;
  align-items: center;
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
