<template>
  <div class="map-outbox">
    <!--地图容器-->
    <div id="my-container" class="map">
      <!--时间选择器-->
      <div class="block time_picker">
        <div>
          <el-tag
            style="width: 100px;height: 30px;line-height: 30px;text-align: center;font-size: 15px"
            >时间选择器</el-tag
          >
        </div>

        <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          @change="changeTime"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
      <!-- 数字时钟 -->
      <div class="clock">
        <p class="date">{{ date }}</p>
        <p class="time">{{ time }}</p>
      </div>

      <!--测距工具-->
      <div class="ranging_tool">
        <div id="info">
          <p class="range_info">点击地图获取量测点，右键或双击左键结束测量</p>
        </div>
        <div>
          <el-button type="primary" id="custom">测距</el-button>
        </div>
        <!--        <div class="input-card" style="width:20rem;background-color:transparent;box-shadow:none">-->
        <!--          <div class="input-item">-->
        <!--            <input type="button" class="btn" id='custom' value="自定义样式测距"/>-->
        <!--          </div>-->
        <!--        </div>-->
      </div>

      <!--控制条-->
      <div class="speed_controller">
        <el-row :gutter="20">
          <el-col :span="2">
            <el-button
              v-if="!isPlaying"
              icon="el-icon-video-play"
              type="primary"
              @click="start()"
            ></el-button>
            <el-button
              v-if="isPlaying"
              icon="el-icon-video-pause"
              type="primary"
              @click="pause()"
            ></el-button>
          </el-col>
          <el-col :span="19">
            <el-slider v-model="sliderVal" @input="changeValue()"></el-slider>
          </el-col>
          <el-col :span="3">
            <el-select
              v-model="value"
              placeholder="请选择"
              @change="setSpeed()"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
import AMap from "AMap"
import AMapUI from "AMapUI"
import vehicleApi from "@/api/trajectory"

export default {
  data() {
    return {
      centerLongitude: 116.397428,
      centerLatitude: 39.90923,

      vehicle: "",
      gpsDatas: [],
      pathArray: [],

      timeRange: [],
      startTime: 0,
      endTime: 0,
      date: "0000-00-00",
      time: "00:00:00",
      isPlaying: false,
      pathSimplifierIns: {},
      sliderVal: 0,
      navg: {},
      value: 1, //倍速
      speed: 400, //速度
      options: [
        {
          value: 1,
          label: "1倍速"
        },
        {
          value: 2,
          label: "倍速2"
        },
        {
          value: 3,
          label: "倍速3"
        },
        {
          value: 4,
          label: "倍速4"
        },
        {
          value: 5,
          label: "倍速5"
        },
        {
          value: 10,
          label: "倍速10"
        },
        {
          value: 20,
          label: "倍速20"
        }
      ]
    }
  },
  //渲染前
  created: function() {
    this.vehicle = this.$route.query.vehicle
  },
  beforeDestroy: function() {
    document.onkeydown = function() {}
  },
  props: ["dialogVisible", "form", "dialogTitle"],
  methods: {
    dialogClose: function() {
      // this.$emit("dialogClose", false)
    },
    initMap: function() {
      const $this = this
      const map = new AMap.Map("my-container", {
        center: [this.centerLongitude, this.centerLatitude], // [纬度，经度]
        resizeEnable: true,
        zoom: 15,
        mapStyle: "amap://styles/whitesmoke"
      })

      this.map = map

      AMap.plugin(
        ["AMap.ToolBar", "AMap.MapType", "AMap.RangingTool"],
        function() {
          //异步加载插件
          const toolbar = new AMap.ToolBar()
          $this.map.addControl(toolbar)

          const ruler1 = new AMap.RangingTool(map)

          //自定义样式
          var startMarkerOptions = {
            icon: new AMap.Icon({
              size: new AMap.Size(19, 31), //图标大小
              imageSize: new AMap.Size(19, 31),
              image: "https://webapi.amap.com/theme/v1.3/markers/b/start.png"
            })
          }
          var endMarkerOptions = {
            icon: new AMap.Icon({
              size: new AMap.Size(19, 31), //图标大小
              imageSize: new AMap.Size(19, 31),
              image: "https://webapi.amap.com/theme/v1.3/markers/b/end.png"
            }),
            offset: new AMap.Pixel(-9, -31)
          }
          var midMarkerOptions = {
            icon: new AMap.Icon({
              size: new AMap.Size(19, 31), //图标大小
              imageSize: new AMap.Size(19, 31),
              image: "https://webapi.amap.com/theme/v1.3/markers/b/mid.png"
            }),
            offset: new AMap.Pixel(-9, -31)
          }
          var lineOptions = {
            strokeStyle: "solid",
            strokeColor: "#FF33FF",
            strokeOpacity: 1,
            strokeWeight: 2
          }
          var rulerOptions = {
            startMarkerOptions: startMarkerOptions,
            midMarkerOptions: midMarkerOptions,
            endMarkerOptions: endMarkerOptions,
            lineOptions: lineOptions
          }
          const ruler2 = new AMap.RangingTool(map, rulerOptions)

          //启用自定义样式测距
          document.getElementById("custom").onclick = function() {
            ruler1.turnOff()
            ruler2.turnOn()
          }
        }
      )

      AMapUI.load(["ui/misc/PathSimplifier"], $this.initMapData)
    },
    changeTime: function() {
      if (this.timeRange.length != 2) {
        alert("请正确的选择起止时间")
        return
      }
      const startTime = new Date(this.timeRange[0]).getTime()
      const endTime = new Date(this.timeRange[1]).getTime()
      if (endTime - startTime > 7 * 1000 * 60 * 60 * 24) {
        alert("请选择七天之内的时间!")
        this.timeRange = []
        return
      }
      const $this = this
      $this.startTime = startTime / 1000
      $this.endTime = endTime / 1000

      // $this.map.destroy()
      // $this.initMap()

      // $this.navg.destroy()
      // $this.pathSimplifierIns.clearPathNavigators()

      $this.pathSimplifierIns.hide()
      // $this.navg.destroy()
      // $this.pathSimplifierIns.clearPathNavigators()
      $this.pause()
      $this.sliderVal = 0

      AMapUI.load(["ui/misc/PathSimplifier"], $this.initMapData)
    },
    initMapData: function(PathSimplifier) {
      const $this = this
      if (!PathSimplifier.supportCanvas) {
        alert("当前环境不支持 Canvas！")
        return
      }
      //创建一个巡航轨迹路线
      $this.pathSimplifierIns = new PathSimplifier({
        zIndex: 100, //地图层级，
        map: $this.map, //所属的地图实例
        //巡航路线轨迹列表
        getPath: function(pathData) {
          return pathData.path
        },
        //hover每一个轨迹点，展示内容
        getHoverTitle: function(pathData, pathIndex, pointIndex) {
          if (pointIndex >= 0) {
            return (
              pathData.name + "，点：" + pointIndex + "/" + pathData.path.length
            )
          }
          return pathData.name + "，点数量" + pathData.path.length
        },
        clickToSelectPath: false,
        //自定义样式，可设置巡航器样式，巡航轨迹样式，巡航轨迹点击、hover等不同状态下的样式，不设置则用默认样式，详情请参考api文档
        // renderOptions: {},
        //绘制路线节点
        renderOptions: {
          pathTolerance: 0.0001,
          // keyPointTolerance: 0,
          renderAllPointsIfNumberBelow: 3000 //绘制路线节点，如不需要可设置为-1
        }
      })

      //设置数据
      vehicleApi
        .getVehicleTrajectory({
          vehicle: $this.vehicle,
          startTime: $this.startTime,
          endTime: $this.endTime
        })
        .then(res => {
          if (res.result.length > 0) {
            const timeStr = res.result[res.result.length - 1].report_time
            const timeArr = timeStr.match(
              /(\d{4}-\d{1,2}-\d{1,2})T(\d{1,2}:\d{1,2}:\d{1,2})Z/
            )
            $this.date = timeArr[1]
            $this.time = timeArr[2]
          }
          const sortResult = (res.result || []).sort((a, b) => {
            const aTime = new Date(a.report_time).getTime()
            const bTime = new Date(b.report_time).getTime()
            return aTime - bTime
          })
          $this.gpsDatas = sortResult

          const pathArr = sortResult.map(item => [
            item.longitude,
            item.latitude
          ])
          $this.pathArr = pathArr
          $this.pathSimplifierIns.setData([
            {
              name: "轨迹",
              path: pathArr
            }
          ])

          //对第一条线路（即索引 0）创建一个巡航器
          $this.navg = $this.pathSimplifierIns.createPathNavigator(0, {
            loop: false, //循环播放
            speed: $this.speed, //巡航速度，单位千米/小时
            dirToPosInMillsecs: 0,
            animInterval: 10,
            pathNavigatorStyle: {
              width: 20,
              height: 30,
              //使用图片
              content: PathSimplifier.Render.Canvas.getImageContent(
                "https://a.amap.com/jsapi_demos/static/demo-center-v2/car.png",
                onload,
                onerror
              ),
              strokeStyle: null,
              fillStyle: null,
              //经过路径的样式
              pathLinePassedStyle: {
                lineWidth: 2,
                strokeStyle: "blue"
              }
            }
          })
          $this.navg.on("move", function() {
            let idx = this.getCursor().idx //走到了第几个点
            const timeStr = $this.gpsDatas[idx].report_time
            const timeArr = timeStr.match(
              /(\d{4}-\d{1,2}-\d{1,2})T(\d{1,2}:\d{1,2}:\d{1,2})Z/
            )
            $this.date = timeArr[1]
            $this.time = timeArr[2]
            let tail = this.getCursor().tail //至下一个节点的比例位置
            let totalIdx = idx + tail

            // 进度条实时展示tail
            $this.sliderVal =
              (totalIdx / $this.navg.getPathEndIdx()).toFixed(2) * 100
          })
        })
    },
    start: function() {
      // stop：停止状态，start之前或者stop之后处于该状态
      // moving：巡航状态，start或者resume之后处于该状态
      // pause：暂停状态，pause之后处于该状态
      this.isPlaying = true
      if (this.navg.isCursorAtPathEnd()) {
        this.navg.start()
        return
      }
      if (this.navg.getNaviStatus() == "pause") {
        this.navg.resume()
      } else if (this.navg.getNaviStatus() == "stop") {
        this.navg.start()
      }
    },
    pause: function() {
      if (this.navg.getNaviStatus() == "moving") {
        this.navg.pause()
        this.isPlaying = false
      }
    },
    setSpeed: function() {
      this.navg.setSpeed(this.speed * this.value)
    },
    getCheckDate: function(t) {
      if (t.length >= 2) {
        this.checkDate.begintime = t[0]
        this.checkDate.endtime = t[1]
      }
    },
    changeValue: function() {
      // let newVal = typeof(newVal) === 'number' ? val : this.sliderVal
      let num, decimal
      if (this.navg && this.navg.getPathEndIdx) {
        num = parseInt((this.sliderVal / 100) * this.navg.getPathEndIdx())
        decimal =
          String((this.sliderVal / 100) * this.navg.getPathEndIdx()).split(
            "."
          )[1] || 0
        this.navg.moveToPoint(num, Number("0." + decimal))
        this.pathSimplifierIns.renderLater()
        if (num == this.navg.getPathEndIdx()) {
          this.isPlaying = false
        }
      }
    }
  },
  //渲染后
  mounted() {
    this.initMap()
  }
}
</script>

<style lang="scss" scoped>
.map-outbox {
  width: 100%;
  height: 100%;

  .map {
    width: 100%;
    height: 100%;
    position: relative;
    z-index: 10;

    .time_picker {
      position: absolute;
      top: 40px;
      left: 100px;
      z-index: 100;
    }

    .ranging_tool {
      position: absolute;
      width: 15%;
      height: 50px;
      bottom: 15%;
      right: 3%;
      z-index: 100;
      color: rgb(4, 35, 127);
      text-align: center;
      text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
      .range_info {
        letter-spacing: 0.1em;
        font-size: 8px;
      }
    }

    .clock {
      font-family: "Share Tech Mono", monospace;
      color: rgb(4, 35, 127);
      text-align: center;
      position: absolute;
      right: 10%;
      top: 5%;
      text-shadow: 0 0 20px #0aafe6, 0 0 20px rgba(10, 175, 230, 0);
      z-index: 100;
      .time {
        letter-spacing: 0.05em;
        font-size: 80px;
      }

      .date {
        letter-spacing: 0.1em;
        font-size: 24px;
      }
    }

    .speed_controller {
      width: 100%;
      height: 4.2%;
      //float: bottom;
      position: absolute;
      bottom: 3%;
      z-index: 100;
    }
  }
}
</style>
