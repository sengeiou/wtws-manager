<!--
 * @Description: 
 * @Author: yuyongjie
 * @Date: 2020-12-20 16:25:23
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-01-29 19:43:26
-->
<template>
  <div class="page">
    <div class="top-card">
      <!-- 1 -->
      <a-card class="card card1" hoverable>
        <template slot="title">
          <div class="title">
            已销售轮胎
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{ splitNum(dataObj.tyreNumCountInfo[0].tyreNum5Count) }}
              </span>
              <span>条</span>
            </div>
            <div class="_r">
              <div>
                <div class="_title">
                  本月新增
                </div>
                <div class="_right">
                  <span>{{ splitNum(dataObj.monthTyreNum1Count) }}</span>
                  <span>条</span>
                </div>
              </div>
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      parseFloat(dataObj.installTyrePercentage) < 0
                        ? 'reduce'
                        : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (
                          parseFloat(dataObj.installTyrePercentage) * 100
                        ).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>
      <!-- 2 -->
      <a-card class="card card2" hoverable>
        <template slot="title">
          <div class="title">
            库存轮胎
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{
                  splitNum(dataObj.tyreNumCountInfo[0].noInstalltyreNumCount)
                }}
              </span>
              <span>条</span>
            </div>
            <div class="_r">
              <div>
                <div class="_title">
                  增加/减少
                </div>
                <div class="_right">
                  <span>{{
                    splitNum(dataObj.monthNoInstalltyreNumCount)
                  }}</span>
                  <span>条</span>
                </div>
              </div>
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      parseFloat(dataObj.noInstallTyrePercentage) < 0
                        ? 'reduce'
                        : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (
                          parseFloat(dataObj.noInstallTyrePercentage) * 100
                        ).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>
      <!-- 3 -->
      <a-card class="card card3" hoverable>
        <template slot="title">
          <div class="title">
            本月新入库轮胎
          </div>
        </template>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_content">
          <div class="_top">
            <div class="_l">
              <span>
                {{
                  splitNum(
                    dataObj.monthStorageStatusCountInfo[0].storageStatusCount
                  )
                }}
              </span>
              <span>条</span>
            </div>
          </div>
          <div class="_bottom"></div>
        </div>
      </a-card>
    </div>
    <div class="bottom-card">
      <a-card title="轮胎品牌统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <span>合计</span>
            <span class="b">{{ splitNum(dataObj.tyreNumCount) }}</span>
            <span>条</span>
          </div>
          <div ref="chart3" style="width:100%;height:376px"></div>
        </div>
      </a-card>
      <a-card title="站点销售统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <div>
              <span>本月装车轮胎</span>
              <span class="b">{{ splitNum(dataObj.monthTyreNum1Count) }}</span>
              <span>条</span>
            </div>
            <div class="HB">
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.installTyrePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (parseFloat(dataObj.installTyrePercentage) * 100).toFixed(
                        2
                      )
                    }}%</span
                  >
                </span>
              </div>
            </div>
          </div>
          <div ref="chart1" style="width:100%;height:376px"></div>
        </div>
      </a-card>
      <a-card title="入库轮胎统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t last">
            <div class="_l">
              <div>
                <span>本月入库轮胎</span>
                <span class="b">{{
                  splitNum(
                    dataObj.monthStorageStatusCountInfo[0].storageStatusCount
                  )
                }}</span>
                <span>条</span>
              </div>
              <div class="HB">
                <div class="_title">
                  环比上月
                </div>
                <div class="_right">
                  <span
                    :class="[
                      parseFloat(dataObj.storageStatusPercentage) < 0
                        ? 'reduce'
                        : 'add'
                    ]"
                  >
                    <span></span>
                    <span
                      >{{
                        (
                          parseFloat(dataObj.storageStatusPercentage) * 100
                        ).toFixed(2)
                      }}%</span
                    >
                  </span>
                </div>
              </div>
            </div>
            <div class="_r">
              <div>
                本年单月峰值<span>{{ rData.max }}</span
                >条
              </div>
              <div>
                本年单月平均值<span>{{ rData.avg }}</span
                >条
              </div>
            </div>
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
        installTyrePercentage: 0,
        lastMonthNoInstalltyreNumCount: 0,
        lastMonthStorageStatus1Count: 0,
        lastMonthTyreNum1Count: 0,
        monthNoInstalltyreNumCount: 0,
        monthStorageStatus1CountOrMonth: [],
        monthStorageStatusCountInfo: [
          {
            storageStatus1Count: 0,
            storageStatus2Count: 0,
            storageStatus4Count: 0,
            storageStatusCount: 0
          }
        ],
        monthTyreNum1Count: 0,
        noInstallTyrePercentage: 0,
        storageStatusPercentage: 0,
        tyreNumCount: 0,
        tyreNumCountInfo: [
          {
            noInstalltyreNumCount: 0,
            tyreNum1Count: 0,
            tyreNum2Count: 0,
            tyreNum3Count: 0,
            tyreNum4Count: 0,
            tyreNum5Count: 0,
            tyreNum6Count: 0,
            tyreNum7Count: 0,
            tyreNum8Count: 0,
            tyreNum9Count: 0
          }
        ],
        xrkNum: 0
      },
      vehicleDataObj: {
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
      option3: {
        color: [
          "#3B7AFC",
          "#FF6730",
          "#F2B101",
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
      option2: {},
      tyreSatatus: {
        s1: "普利司通",
        s2: "成山",
        s3: "玲珑",
        s4: "正新",
        s5: "双星",
        s6: "米其林",
        s7: "固特异",
        s8: "双钱",
        s9: "其他"
      }
    }
  },
  computed: {
    rData() {
      let arr = []
      let obj = this.dataObj.monthStorageStatus1CountOrMonth
      let sum = 0
      for (let i = 0; i < obj.length; i++) {
        const element = obj[i]
        arr.push(parseInt(element.monthStorageStatus1Count))
        sum += parseInt(element.monthStorageStatus1Count)
      }
      return {
        max: Math.max(...arr),
        avg: (sum / arr.length).toFixed(1)
      }
    }
  },
  mounted() {
    this.option2 = this.option1
    this.initData()
  },
  methods: {
    initData() {
      Api.analysisTyre({}).then(res => {
        if (res.code === 0) {
          for (const key in res.result) {
            if (Object.hasOwnProperty.call(res.result, key)) {
              const element = res.result[key]
              if (element === null || element === undefined) {
                res.result[key] = 0
              }
              if (key === "monthStorageStatusCountInfo") {
                let num = 0
                let obj = element[0]
                for (const k1 in obj) {
                  if (Object.hasOwnProperty.call(obj, k1)) {
                    const e1 = obj[k1]
                    num += parseInt(e1)
                  }
                }
                res.result["xrkNum"] = num
              }
            }
          }
          this.dataObj = res.result
          // this.drawChart1(res.result.monthStorageStatus1CountOrMonth)
          this.drawChart2(res.result.monthStorageStatus1CountOrMonth)
          this.drawChart3(this.dataObj.tyreNumCountInfo)
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
          this.drawChart1(res.result.monthVehicleTyreNumCountOrMonth)
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
        y.push(item.monthVehicleTyreNumCount)
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
        y.push(item.monthStorageStatus1Count)
      })
      this.option2.xAxis[0].data = x
      this.option2.series[0].data = y
      this.option2.series[1].data = y
      // 绘制图表
      myChart.setOption(this.option2)
    },
    drawChart3(data) {
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
              // if (key === "noInstalltyreNumCount") {
              //   x.push("未装胎数量")
              //   y.push({
              //     name: "未装胎数量",
              //     value: element
              //   })
              // } else {
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
      this.option3.legend.data = x
      this.option3.series[0].data = y
      // 初始化echarts实例
      let myChart = this.$echarts.init(this.$refs["chart3"])
      // 绘制图表
      myChart.setOption(this.option3)
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
    // height: 232px;
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
      }
      .ant-card-extra {
        font-size: 14px;
        font-weight: 400;
        text-align: left;
        color: #afafaf;
      }
    }
    /deep/ .ant-card-body {
      padding-top: 12px;
      padding-bottom: 16px;
      ._content {
        ._top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          // margin-bottom: 18px;
          ._l {
            display: flex;
            align-items: center;
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
          ._r {
            & > div {
              &.HB {
                margin-top: 9px;
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
    }

    &.card1,
    &.card2,
    &.card3,
    &.card4 {
      .ant-card-body {
        ._content {
          ._top {
            ._r {
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
  }
}
.bottom-card {
  margin-top: 24px;
  min-width: 1156px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
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
        align-items: center;
        z-index: 88;
        & > div,
        &.last > ._l > div {
          display: flex;
          align-items: flex-end;
          &.HB {
            display: flex;
            align-items: center;
            margin-top: 13px;
            margin-left: 15px;
            margin-right: 15px;
            ._title {
              height: 20px;
              font-size: 14px;
              font-weight: 400;
              text-align: left;
              color: #afafaf;
              line-height: 20px;
              margin-right: 22px;
            }
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
                      position: relative;
                      left: -15px;
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
                      position: relative;
                      left: -15px;
                    }
                  }
                }
              }
            }
          }
        }
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
      ._t.last {
        justify-content: space-between;
        width: 95%;
        & > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          &._r {
            display: block !important;
            & > div {
              margin-bottom: 12px;
              &:last-child {
                margin-bottom: 0;
              }
              color: #afafaf;
              display: flex;
              align-items: center;
              span {
                color: #3b3b3b;
                font-weight: bold;
              }
            }
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
