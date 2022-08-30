<!--
 * @Description: 
 * @Author: yuyongjie
 * @Date: 2020-12-07 13:27:45
 * @LastEditors: yuyongjie
 * @LastEditTime: 2021-02-03 17:32:24
-->
<template>
  <div class="page">
    <div class="top-card">
      <!-- 1 -->
      <a-card class="card card1" hoverable>
        <template slot="title">
          <div class="title">
            签约企业总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.signedEnterpriseCount) }}
            </span>
            <span>家</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{ splitNum(dataObj.monthSignedEnterpriseCount) }}</span>
                <span>家</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.signedEnterprisePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (
                        parseFloat(dataObj.signedEnterprisePercentage) * 100
                      ).toFixed(2)
                    }}%</span
                  >
                </span>
              </div>
            </div>
          </div>
        </div>
      </a-card>
      <!-- 2 -->
      <a-card class="card card2" hoverable>
        <template slot="title">
          <div class="title">
            潜在客户总数
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.potentialEnterpriseCount) }}
            </span>
            <span>家</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                本月新增
              </div>
              <div class="_right">
                <span>{{
                  splitNum(dataObj.monthPotentialEnterpriseCount)
                }}</span>
                <span>家</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.potentialEnterprisePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (
                        parseFloat(dataObj.potentialEnterprisePercentage) * 100
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
            签约企业本月新增
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.monthSignedEnterpriseCount) }}
            </span>
            <span>家企业客户</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                上月新增
              </div>
              <div class="_right">
                <span>{{
                  splitNum(dataObj.lastMonthSignedEnterpriseCount)
                }}</span>
                <span>家</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.signedEnterprisePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (
                        parseFloat(dataObj.signedEnterprisePercentage) * 100
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
            潜在客户本月新增
          </div>
          <div class="date">截止{{ parseTime(new Date()) }}</div>
        </template>
        <div class="_content">
          <div class="_top">
            <span>
              {{ splitNum(dataObj.yearSignedEnterpriseCount) }}
            </span>
            <span>家</span>
          </div>
          <div class="_bottom">
            <div>
              <div class="_title">
                上月新增
              </div>
              <div class="_right">
                <span>{{
                  splitNum(dataObj.lastMonthPotentialEnterpriseCount)
                }}</span>
                <span>家</span>
              </div>
            </div>
            <div>
              <div class="_title">
                环比上月
              </div>
              <div class="_right">
                <span
                  :class="[
                    parseFloat(dataObj.potentialEnterprisePercentage) < 0
                      ? 'reduce'
                      : 'add'
                  ]"
                >
                  <span></span>
                  <span
                    >{{
                      (
                        parseFloat(dataObj.potentialEnterprisePercentage) * 100
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
      <a-card title="行业类别统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <span>合计</span>
            <span class="b">{{ splitNum(dataObj.signedEnterpriseCount) }}</span>
            <span>家</span>
          </div>
          <div ref="chart1" style="width:100%;height:376px"></div>
        </div>
      </a-card>
      <a-card title="已签约企业统计" class="card" hoverable>
        <span slot="extra">截止{{ parseTime(new Date()) }}</span>
        <div class="_box">
          <div class="_t">
            <span>本月签约企业</span>
            <span class="b">{{
              splitNum(dataObj.monthSignedEnterpriseCount)
            }}</span>
            <span>家</span>
          </div>
          <div ref="chart2" style="width:100%;height:376px"></div>
        </div>
      </a-card>
    </div>
  </div>
</template>
<script>
import { splitNum, parseTime } from "@/utils/utils"
import eventBus from "@/bus"
import Api from "@/api/analysis"
import echarts from "echarts"
export default {
  data() {
    return {
      splitNum,
      parseTime,
      option1: {
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
          data: []
        },
        series: [
          {
            name: "行业类别",
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
      option2: {
        backgroundColor: "#fff",
        // tooltip: {
        //   show: true,
        //   trigger: "axis",
        //   axisPointer: {
        //     type: "shadow"
        //   }
        // },
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
      dataObj: {
        lastMonthPotentialEnterpriseCount: 0,
        lastMonthSignedEnterpriseCount: 0,
        monthPotentialEnterpriseCount: 0,
        monthSignedEnterpriseCount: 0,
        monthSignedEnterpriseCountByMonth: [],
        potentialEnterpriseCount: 0,
        potentialEnterprisePercentage: "0.00",
        signedEnterpriseCount: 0,
        signedEnterpriseCountByType: [],
        signedEnterprisePercentage: "0.00",
        yearPotentialEnterpriseCount: 0,
        yearSignedEnterpriseCount: 0
      },
      myChart1: null,
      myChart2: null
    }
  },
  mounted() {
    this.initData()
    this.$nextTick(() => {
      eventBus.$on("collapsed", () => {
        this.myChart1.resize()
        this.myChart2.resize()
      })
    })
  },
  methods: {
    initData() {
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
          this.dataObj = res.result
          this.drawChart1(this.dataObj.signedEnterpriseCountByType)
          this.drawChart2(this.dataObj.monthSignedEnterpriseCountByMonth)
        }
      })
    },
    drawChart1(data) {
      // 初始化echarts实例
      this.myChart1 = this.$echarts.init(this.$refs["chart1"])
      let x = []
      let y = []

      data.forEach(item => {
        x.push(item.type)
        y.push({
          name: item.type,
          value: item.signedEnterpriseCountByType
        })
      })
      this.option1.legend.data = x
      this.option1.series[0].data = y
      // 绘制图表
      this.myChart1.setOption(this.option1)
    },
    drawChart2(data) {
      // 初始化echarts实例
      this.myChart2 = this.$echarts.init(this.$refs["chart2"])
      let x = []
      let y = []

      data.forEach(item => {
        x.push(item.month)
        y.push(item.monthSignedEnterpriseCountByMonth)
      })
      this.option2.xAxis[0].data = x
      this.option2.series[0].data = y
      this.option2.series[1].data = y

      // 绘制图表
      this.myChart2.setOption(this.option2)
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
