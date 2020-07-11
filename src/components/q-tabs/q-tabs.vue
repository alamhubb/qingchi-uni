<template>
    <view class="flex-col pl-xs">
        <view class="row-col-center">
            <view class="flex-row q-tab-box" v-for="(tab,index) in tabs" @click="input(index)" :key="index">
                <view class="q-tab-item" :class="[uuid,index===value?activeClass:'']">
                    <slot v-bind:tab="tab" v-bind:index="index" v-bind:value="value">

                    </slot>
                </view>
                <view hover-class="uni-list-cell-hover">
                    <slot name="icon" v-bind:tab="tab" v-bind:index="index" v-bind:value="value"></slot>
                </view>
            </view>
        </view>
        <view>
            <view class="active-line" :style="[tabSlideStyle]"></view>
        </view>
    </view>
</template>

<script lang="ts">
import {
  Vue,
  Component, Prop, Model, Emit
} from 'vue-property-decorator'
import UniUtil from '@/utils/UniUtil'

  @Component
export default class QTabs extends Vue {
    //唯一id值
    uuid: string = 'u' + UniUtil.getUUID()

    @Model('input') readonly value: number
    @Prop({ default: [] }) readonly tabs: any[]
    @Prop({ default: '50' }) readonly barWidth: string
    scrollBarLeft: number = 0
    activeClass: string[] = ['active', 'tab-line']

    tabItemLefts: number[] = [0]
    //判断是否已加载过
    firstLoadAfter: boolean = false

    //滑块样式
    get tabSlideStyle () {
      return {
        transform: 'translate(' + this.tabItemLefts[this.value] + 'px, -80%)',
        //首次不开启动画
        'transition-duration': this.firstLoadAfter ? '0.5s' : '0',
        width: this.barWidth + 'rpx'
      }
    }

    @Emit()
    input (index: number) {
      return index
    }

    mounted () {
      this.init()
    }

    // 设置一个init方法，方便多处调用
    init () {
      //等待元素渲染
      this.getTabRect()
    }

    // 查询tab的布局信息
    getTabRect () {
      // 创建节点查询
      const query = uni.createSelectorQuery().in(this)
      // 历遍所有tab，这里是执行了查询，最终使用exec()会一次性返回查询的数组结果
      // 只要size和rect两个参数
      query.selectAll(`.${this.uuid}.q-tab-item`).boundingClientRect((res: any) => {
        this.tabItemLefts = []
        //如果元素还没加载出来，延迟0.1秒继续加载
        if (res && res.length) {
          res.forEach(item => {
            //设置每个tab滑块对应的位置
            this.tabItemLefts.push(item.left + item.width / 2 - UniUtil.upxToPx(Number(this.barWidth) / 2) - res[0].left)
          })
          //首次完成2秒后切换首次加载状态，因为首次加载不需要动画，首次加载后开启动画
          UniUtil.delayTime(2000).then(() => {
            this.firstLoadAfter = true
          })
        } else {
          UniUtil.delayTime(100).then(() => {
            this.getTabRect()
          })
        }
      })
      query.exec()
    }
}
</script>
