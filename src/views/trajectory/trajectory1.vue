<template>
  <div>
    <div class="amap-wrapper">
      <!-- 高德地图 -->
      <amap ref="myMap" :center="center" :zoom="zoom" @complete="mapLoading">
        <!-- 左上角旋转工具 -->
        <amap-tool-bar />
        <!-- 右下角缩放工具 -->
        <amap-control-bar
          :position="{
            top: '10px',
            left: '10px'
          }"
        />

        <!-- 起点标志位置 -->
        <amap-marker ref="myMarker1" :position="position1" />
        <amap-text
          :dom-style="{
            color: '#f00'
          }"
          :position="position1"
          :text="text1"
        />

        <!-- 终点标志 -->
        <amap-marker ref="myMarker2" :position="position2" />
        <amap-text
          :dom-style="{
            color: '#f00'
          }"
          :position="position2"
          :text="text2"
        />

        <!-- 轨迹 -->
        <amap-polyline :path="path" :stroke-weight="8" stroke-color="#f00" />

        <!-- 时间标志点 -->
        <amap-marker
          v-for="(item, key) in locationDetails"
          :key="key"
          :icon="iconimg"
          :offset="[0, -10]"
          :position.sync="item.path"
          clickable
          @mouseover="showMouseover(item)"
        />

        <!-- 时间信息层 -->
        <amap-info-window
          :offset="[10, -8]"
          :position="coordinatesData ? coordinatesData.path : null"
          :visible="!!coordinatesData"
          auto-move
          is-custom
        >
          <div v-if="coordinatesData">
            <div v-show="coordinatesTo">
              <div class="parcel">
                <i class="el-icon-close" @click="coordinatesData = null"></i>
                <div class="text_li_css" style="padding-top: 30px">
                  时间：{{ coordinatesData.gtm }}
                </div>
                <div class="text_li_css">
                  经度：{{ coordinatesData.path[0] }}
                </div>
                <div class="text_li_css">
                  维度：{{ coordinatesData.path[1] }}
                </div>
              </div>
              <div class="mark_css"></div>
            </div>
          </div>
        </amap-info-window>
      </amap>
    </div>
  </div>
</template>

<script>
import iconimg from "@/assets/image/logo.png"
import Amap from "@amap/amap-vue/lib/amap"
import AmapMarker from "@amap/amap-vue/lib/marker"
import AmapText from "@amap/amap-vue/lib/text"
import AmapPolyline from "@amap/amap-vue/lib/polyline"
import AmapControlBar from "@amap/amap-vue/lib/control-bar"
import AmapToolBar from "@amap/amap-vue/lib/tool-bar"
import AmapInfoWindow from "@amap/amap-vue/lib/info-window"

export default {
  components: {
    Amap,
    AmapMarker,
    AmapText,
    AmapPolyline,
    AmapControlBar,
    AmapToolBar,
    AmapInfoWindow
  },

  data() {
    return {
      //引入的时间标志图标
      iconimg,
      //时间标志位置数据
      locationDetails: [],
      //时间信息层坐标位置
      coordinatesData: { path: [116.397447, 39.909183], gtm: "" },
      //时间信息层初始隐藏
      coordinatesTo: false,
      //地图显示坐标位置
      center: [116.397447, 39.909183],
      //地图初始缩放等级
      zoom: 15,
      //起点标志位置
      position1: [0, 0],
      text1: "起点位置",
      //终点标志位置
      position2: [0, 0],
      text2: "终点位置",
      //轨迹坐标数据
      path: [],
      //异步网络请求的坐标数据
      locationData: {}
    }
  },

  methods: {
    //地图初始化调用
    mapLoading() {
      //发起网络请求接口返回坐标数据
      // carriageTracesByTime({ vehicleId: 61 }).then(res => {
      //   //数据格式res.data:[{"lon":"73963554","lat":"25073040","gtm":"20210916/170808"},...]
      //   this.locationData = res.data
      //   //起点标志位置
      //   this.position1 = [this.locationData[0].lon, this.locationData[0].lat]
      //   //终点标志位置
      //   this.position2 = [
      //     this.locationData[this.locationData.length - 1].lon,
      //     this.locationData[this.locationData.length - 1].lat
      //   ]
      //   //地图显示坐标位置
      //   this.center = [
      //     this.locationData[this.locationData.length - 1].lon,
      //     this.locationData[this.locationData.length - 1].lat
      //   ]
      //   //轨迹坐标数据
      //   var path = []
      //   //时间标志位置数据
      //   var locationDetails = []
      //   for (let i of this.locationData) {
      //     path.push([i.lon, i.lat])
      //     locationDetails.push({
      //       path: [i.lon, i.lat],
      //       gtm: i.gtm
      //     })
      //   }
      //   this.path = path
      //   this.locationDetails = this.intervalMethods(locationDetails)
      // })
    },
    //每隔60条就取一条时间坐标
    intervalMethods(data) {
      const mapData = data
      var i = 0
      const value = []
      const mapMethods = () => {
        i += 60
        if (i < mapData.length) {
          value.push(mapData[i])
          mapMethods()
        }
      }

      mapMethods()
      return value
    },

    //显示时间信息层
    showMouseover(data) {
      this.coordinatesTo = true
      //时间信息层坐标位置
      this.coordinatesData = data
    }
  }
}
</script>

<style scoped>
.amap-wrapper {
  width: 100%;
  height: 700px;
}

/* 信息层css */
.parcel {
  width: 220px;
  height: 120px;
  background-color: #fff;
  border: 2px #3e94f9 solid;
  font-size: 14px;
  color: #000;
  position: relative;
  border-radius: 5px;
}

.el-icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 18px;
  cursor: pointer;
}

.text_li_css {
  width: 90%;
  line-height: 20px;
  margin-left: 18px;
}

.mark_css {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 14px solid #3e94f9;
  margin-left: 100px;
}
</style>
