<template>
  <view :class="[uuid]" class="q-picker-box">
    <scroll-view scroll-y :scroll-top="oneScrollTop">
      <view v-for="(item,index) in dataList"
            :key="index" @click="oneLevelChange(index)"
            class="q-picker-one-level-item row-col-center"
            :class="{uuid,'q-picker-item-active':index === checkedOne}"
      >
        <q-row-item class="flex-auto">
          {{item.adName}}
        </q-row-item>
      </view>
    </scroll-view>
    <scroll-view scroll-y :scroll-top="twoScrollTop">
      <view v-for="(item,index) in twoLevelData"
            :key="index" @click="twoLevelChange(index)"
            class="q-picker-two-level-item row-col-center"
            :class="{uuid,'q-picker-item-active':index === checkedTwo}"
      >
        <q-row-item class="flex-auto">
          {{item.adName}}
        </q-row-item>
      </view>
    </scroll-view>
    <scroll-view scroll-y :scroll-top="threeScrollTop">
      <view v-for="(item,index) in threeLevelData"
            :key="index" @click="threeLevelChange(index)"
            class="q-picker-three-level-item row-col-center"
            :class="{uuid,'q-picker-item-active':index === checkedThree}"
      >
        <q-row-item class="flex-auto">
          {{item.adName}}
        </q-row-item>
      </view>
    </scroll-view>
  </view>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit, Model, Watch } from 'vue-property-decorator'

import UniUtils from '@/utils/UniUtils'
import QRowItem from '../q-row-item/q-row-item.vue'
import SelectorQuery = UniApp.SelectorQuery
import NodesRef = UniApp.NodesRef

/*
显示出来已经选了的城市，给她画上钩

默认当前选择城市，
如果选择了则展示选择的，
最后取消选择，还显示当前选择的

* */
@Component({
  components: {
    QRowItem
  }
})
export default class QPicker extends Vue {
  readonly uuid: string = 'u' + UniUtils.getUUID()
  @Model('input') readonly value!: any
  @Prop() readonly dataList: any []

  mounted () {
    this.pageInit()
  }

  @Watch('dataList')
  dataListWatch () {
    this.pageInit()
  }

  pageInit () {
    this.getComponentsHeight()
    this.getOneNodeTops()
    this.getTwoNodeTops()
    this.getThreeNodeTops()
  }

  /**
   * 获取整个元素高度
   */
  scrollBoxHeight = 0

  getComponentsHeight () {
    //获取整个元素的高度
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    const nodeBox: NodesRef = query.select('.' + this.uuid + '.q-picker-box')
    nodeBox.boundingClientRect((res) => {
      if (res) {
        this.scrollBoxHeight = res.height
      } else {
        UniUtils.delayTime(100).then(() => {
          this.getComponentsHeight()
        })
      }
    }).exec()
  }

  /**
   * 记录右侧每个索引对应的滚动位置
   */
  oneTops: any[] = []

  getOneNodeTops () {
    //获取整个元素的高度
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    //存储左侧菜单需要滚动到的点
    const nodeOne: NodesRef = query.selectAll('.' + this.uuid + '.q-picker-one-level-item')
    nodeOne.boundingClientRect((res: any) => {
      if (res.length) {
        this.oneTops = []
        res.forEach(item => {
          const top = item.top + item.height / 2 - this.scrollBoxHeight / 2 - res[0].top
          this.oneTops.push(top)
        })
      } else {
        UniUtils.delayTime(100).then(() => {
          this.getOneNodeTops()
        })
      }
    }).exec()
  }

  /**
   * 记录左侧每个索引对应的滚动位置
   */
  twoTops: any[] = []

  getTwoNodeTops () {
    //获取整个元素的高度
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    //存储左侧菜单需要滚动到的点
    const nodeTwo: NodesRef = query.selectAll('.' + this.uuid + '.q-picker-two-level-item')
    nodeTwo.boundingClientRect((res: any) => {
      if (res.length) {
        this.twoTops = []
        res.forEach(item => {
          const top = item.top + item.height / 2 - this.scrollBoxHeight / 2 - res[0].top
          this.twoTops.push(top)
        })
      } else {
        UniUtils.delayTime(100).then(() => {
          this.getTwoNodeTops()
        })
      }
    }).exec()
  }

  /**
   * 记录左侧每个索引对应的滚动位置
   */
  threeTops: any[] = []

  getThreeNodeTops () {
    //获取整个元素的高度
    const query: SelectorQuery = uni.createSelectorQuery().in(this)
    //存储左侧菜单需要滚动到的点
    const nodeThree: NodesRef = query.selectAll('.' + this.uuid + '.q-picker-three-level-item')
    nodeThree.boundingClientRect((res: any) => {
      if (res.length) {
        this.threeTops = []
        res.forEach(item => {
          const top = item.top + item.height / 2 - this.scrollBoxHeight / 2 - res[0].top
          this.threeTops.push(top)
        })
      } else {
        UniUtils.delayTime(100).then(() => {
          this.getThreeNodeTops()
        })
      }
    }).exec()
  }


  //选中的一级
  checkedOne = 0
  //选中的二级
  checkedTwo = null
  //选中的二级
  checkedThree = null

  @Emit()
  input () {
    if (this.checkedThree || this.checkedThree === 0) {
      return this.threeLevelData[this.checkedThree]
    } else if (this.checkedTwo || this.checkedTwo === 0) {
      return this.twoLevelData[this.checkedTwo]
    } else if (this.checkedOne) {
      return this.dataList[this.checkedOne]
    } else {
      return null
    }
  }

  get twoLevelData () {
    if ((this.checkedOne === 0 || this.checkedOne) && this.dataList[this.checkedOne]) {
      return this.dataList[this.checkedOne].childs
    } else {
      return []
    }
  }

  get threeLevelData () {
    if ((this.checkedTwo === 0 || this.checkedTwo) && this.twoLevelData[this.checkedTwo]) {
      return this.twoLevelData[this.checkedTwo].childs
    } else {
      return []
    }
  }

  //供外父组件使用，清空内部值
  initSelectData () {
    this.checkedOne = 0
    this.checkedTwo = null
    this.checkedThree = null
  }

  oneScrollTop = 0

  //点击菜单，如果重复点击则为取消选中
  oneLevelChange (index) {
    if (this.checkedOne === index) {
      this.checkedOne = 0
    } else {
      this.checkedOne = index
      this.oneScrollTop = this.oneTops[index]
      this.$nextTick(() => {
        this.getTwoNodeTops()
      })
    }
    this.checkedTwo = null
    this.checkedThree = null
    this.input()
  }

  twoScrollTop = 0

  twoLevelChange (index) {
    if (this.checkedTwo === index) {
      this.checkedTwo = null
    } else {
      this.checkedTwo = index
      this.twoScrollTop = this.twoTops[index]
      this.$nextTick(() => {
        this.getThreeNodeTops()
      })
    }
    this.checkedThree = null
    this.input()
  }

  threeScrollTop: number = 0

  threeLevelChange (index) {
    if (this.checkedThree === index) {
      this.checkedThree = null
    } else {
      this.checkedThree = index
      this.threeScrollTop = this.threeTops[index]
    }
    this.input()
  }
}
</script>
