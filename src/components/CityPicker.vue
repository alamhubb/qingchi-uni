<template>
  <u-popup v-model="showCityPopup" mode="bottom" :border-radius="20">
    <q-bar round class="solid-bottom">
      <view class="text-black text-lgg text-bold">城市筛选</view>
      <view class="flex-row">
        <view class="text-orange text-bold mx-xs px bg-active" @click="getPosition">
          <q-icon size="30" icon="map-fill" class="mr-mn"></q-icon>
          定位
        </view>
        <view class="text-blue text-bold mx-xs px bg-active" @click="close">取消</view>
        <view class="text-green text-bold ml-lg mr-sm px bg-active" @click="confirm">确定</view>
      </view>
    </q-bar>

    <q-row-line class="mt-sm">
      <view class="text-bold">
        当前选择：
      </view>
      <view v-if="bottomDistrict" class="row-col-center">
        <q-icon v-if="bottomDistrict.isPosition" size="30" class="mr-mn" icon="map-fill"/>
        <view class="text-bold" v-if="bottomDistrict.provinceName">
          {{bottomDistrict.provinceName}}
        </view>
        <view class="text-bold" v-else>
          {{bottomDistrict.adName}}
        </view>
        <view v-if="bottomDistrict.cityName" class="text-bold">
          - {{bottomDistrict.cityName}}
        </view>
        <view v-if="bottomDistrict.districtName" class="text-bold">
          - {{bottomDistrict.districtName}}
        </view>
      </view>
      <!--  如果在选择里双击，就会取消选中，bottomDistrict就没值了，就会显示这里-->
      <view v-else-if="district" class="row-col-center">
        <q-icon v-if="district.isPosition" size="30" class="mr-mn" icon="map-fill"/>
        <view class="text-bold" v-if="district.provinceName">
          {{district.provinceName}}
        </view>
        <view class="text-bold" v-else>
          {{district.adName}}
        </view>
        <view v-if="district.cityName" class="text-bold">
          - {{district.cityName}}
        </view>
        <view v-if="district.districtName" class="text-bold">
          - {{district.districtName}}
        </view>
      </view>
    </q-row-line>

    <view class="mt-sm h360px" v-if="districts && districts.length">
      <q-picker ref="citySelect" class="bg-white" v-model="bottomDistrict"
                :dataList="districts"></q-picker>
    </view>
  </u-popup>
</template>

<script lang="ts">
import { Vue, Component, Emit, Model, Watch, Prop } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import DistrictVO from '@/model/DistrictVO'
import { appModule } from '@/plugins/store'
import DistrictUtil from '@/utils/DistrictUtil'
import UniUtils from '@/utils/UniUtils'

const appStore = namespace('app')
@Component
export default class CityPicker extends Vue {
  public $refs!: {
    citySelect: any;
  }

  // 页面初始化模块
  @appStore.State('districts') readonly districts: DistrictVO[]
  @Prop() readonly district: DistrictVO
  bottomDistrict: DistrictVO = DistrictUtil.initDistrict
  showCityPopup = false

  @Model('input') readonly value!: any

  @Watch('value')
  valueWatch () {
    if (this.value) {
      this.open()
    }
  }

  open () {
    this.getPosition().catch(() => {
      this.bottomDistrict = this.district
    })
    this.showCityPopup = true
    // 如果第二个没有子节点且或者子节点为0
    if (!this.districts[1].childs || !this.districts[1].childs.length) {
      appModule.getDistrictsAction()
    }
  }

  close () {
    this.input()
    this.bottomDistrict = this.district
  }

  @Emit()
  input () {
    this.showCityPopup = false
    return false
  }

  @Emit()
  confirm () {
    this.input()
    this.initPopupCity()
    return this.bottomDistrict
  }

  initPopupCity () {
    this.$refs.citySelect.initSelectData()
  }

  // 如果当前定位是附近则发表后跳转到talk页要查询附近的，发表动态时修改store
  getPosition () {
    return DistrictUtil.getCurPositionBySDK().then((district: DistrictVO) => {
      this.bottomDistrict = district
      this.initPopupCity()
    }).catch(() => {
      UniUtils.hint('定位功能已关闭，请手动开启')
      throw Error()
    })
  }
}
</script>
