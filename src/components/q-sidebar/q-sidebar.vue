<template>
  <view :class="[uuid]" class="q-sidebar-box">
    <scroll-view class="flex-none h100r" :scroll-top="leftBoxScrollTop" scroll-y
                 :style="{'width':leftBoxWidth+'rpx'}">
      <view v-for="(item,index) in dataList" :class="[uuid]" class="sidebar-left-item" :key="index"
            @click="leftMenuClick(index)"
      >
        <slot name="leftRow" v-bind:item="item" v-bind:index="index" v-bind:current="chooseIndex"></slot>
      </view>
    </scroll-view>
    <scroll-view class="flex-auto h100r bg-white" :scroll-into-view="rightBoxScrollIntoId" scroll-y
                 @scroll="rightBoxScroll">
      <view v-for="(item,index) in dataList" :class="[uuid]" class="sidebar-right-item"
            :id="'sidebar-right-'+index"
            :key="index"
            :style="{'height': index === dataList.length - 1 ? rightLastHeightPx : ''}"
      >
        <slot name="rightRow" v-bind:item="item"></slot>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import UniUtils from '@/utils/UniUtils'
import SelectorQuery = UniApp.SelectorQuery
import NodesRef = UniApp.NodesRef

/*
显示出来已经选了的城市，给她画上钩
* */
@Component
export default class AboutLinkage extends Vue {
  /**
   * 避免组件重复，设置uuid
   */
  readonly uuid: string = 'u' + UniUtils.getUUID()
  /**
   * 展示的数据
   */
  @Prop() readonly dataList: any []
  /**
   * 左侧菜单宽度
   */
  @Prop({ default: 200 }) readonly leftBoxWidth: number
  /**
   * 提前量，提前多少高度px显示到下一个
   */
  @Prop({ default: 100 }) readonly preShow: number
  /**
   * 控制左侧滚动
   */
  leftBoxScrollTop: number = 0
  /**
   * 当前选中的位置索引
   */
  chooseIndex: number = 0
  /**
   * 控制右侧滚动
   */
  rightBoxScrollIntoId: string = ''
  /**
   * 获取整个元素高度，默认200
   */
  componentHeight: number = 200
  /**
   * 记录左侧每个索引对应的滚动位置
   */
  leftItemTops: any[] = []
  /**
   * 记录右侧每个索引对应的滚动位置，切换下一个菜单
   */
  rightItemTops: any[] = []

  //渲染完毕后计算高度
  mounted () {
    this.initBoxItemTops()
  }

  //数据变化时重新计算高度
  @Watch('dataList')
  dataListWatch () {
    this.initBoxItemTops()
  }

  //计算高度
  initBoxItemTops () {
    this.initComponentsHeight()
    this.initRightBoxItemTops()
    this.initLeftBoxItemTops()
  }

  //计算组建高度
  initComponentsHeight () {
    //获取整个组件的高度
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    const nodeBox: NodesRef = query.select('.' + this.uuid + '.q-sidebar-box')
    nodeBox.boundingClientRect((res) => {
      if (res) {
        this.componentHeight = res.height
      } else {
        UniUtils.delayTime(100).then(() => {
          this.initComponentsHeight()
        })
      }
    }).exec()
  }

  //计算左侧菜单元素临界点
  initLeftBoxItemTops () {
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    //存储左侧菜单需要滚动到的点
    const nodeLeft: NodesRef = query.selectAll('.' + this.uuid + '.sidebar-left-item')
    nodeLeft.boundingClientRect((res: any) => {
      if (!res.length) {
        UniUtils.delayTime(100).then(() => {
          this.initLeftBoxItemTops()
        })
      } else {
        this.leftItemTops = []
        res.forEach(item => {
          //每次滚动到屏幕组件中间的位置
          //当前高度 + 自己本身一半的高度 - 屏幕一半的高度 - 首个元素距离屏幕顶部的高度
          const top = item.top + item.height / 2 - this.componentHeight / 2 - res[0].top
          this.leftItemTops.push(top)
        })
      }
    }).exec()
  }

  //计算右侧菜单元素滚动高度
  initRightBoxItemTops () {
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    //存储右侧菜单滚动时的临界点
    const node: NodesRef = query.selectAll('.' + this.uuid + '.sidebar-right-item')
    node.boundingClientRect((res: any) => {
      if (!res.length) {
        UniUtils.delayTime(100).then(() => {
          this.initRightBoxItemTops()
        })
      } else {
        this.rightItemTops = []
        res.forEach((item, index) => {
          //需要减去头一个元素到顶部的距离，因为高度是从顶部0算的
          let top = item.top - res[0].top
          //如果不是第一个，可以设置提前量
          //因为需要和滚动条位置对比，所以不能出现负数
          if (index) {
            //获取上一个元素高度
            const lastItemHeight = res[index - 1].height
            //如果提前量大于上一个高度
            if (this.preShow > lastItemHeight) {
              //则提前量为上一个的一半
              top = top - lastItemHeight / 2
            } else {
              top = top - this.preShow
            }
          }
          this.rightItemTops.push(top)
        })
      }
    }).exec()
  }

  //传入左侧选中 样式类
  leftMenuClick (index: number) {
    //如果选中的当前的，则直接返回
    if (index === this.chooseIndex) return
    this.leftScrollToIndex(index)
    //右侧滚动到对应位置
    this.rightBoxScrollIntoId = 'sidebar-right-' + index
  }

  leftScrollToIndex (index: number) {
    //设置当前
    this.chooseIndex = index
    this.leftBoxScrollTop = this.leftItemTops[index]
  }

  rightBoxScroll (e) {
    const scrollTop = e.detail.scrollTop
    const scrollIndex = this.rightItemTops.findIndex((item, index) => {
      const height1 = item
      const height2 = this.rightItemTops[index + 1]
      //这里使用大于等于 是要考虑到第一个为0的情况
      return index === this.rightItemTops.length - 1 || (scrollTop >= height1 && scrollTop < height2)
    })
    this.leftScrollToIndex(scrollIndex)
  }


  //最后一个元素占满屏幕高度，如果不给额外高度，无法滚动到最后一个，因为是靠上边界决定左侧菜单的
  get rightLastHeightPx () {
    return this.componentHeight + 'px'
  }
}
</script>
