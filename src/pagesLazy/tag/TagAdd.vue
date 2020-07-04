<template>
    <view class="article">
        <view class="pa-sm pt-0 bg-white solid-bottom">
            <view>
                <view class="cu-form-group">
                    <view class="title">
                        <text class="text-red">*</text>
                        标签：
                    </view>
                    <input :cursor-spacing="20" maxlength="4" v-model.trim="tagName" placeholder="必填"/>
                    <view class="uni-icon uni-icon-clear" v-if="tagName" @click="clearTagName"></view>
                    <view class="text-red">最多四个字</view>
                </view>

                <view class="cu-form-group align-start">
                    <view class="title">
                        描述：
                    </view>
                    <textarea class="h150px" maxlength="300" v-model.trim="tagDescription" placeholder="非必填"
                              :show-confirm-bar="false"
                    ></textarea>
                </view>
            </view>
        </view>
        <view class="cu-bar bg-white">
            <view class="action ma-0 flex-sub">
                <view class="action ma-0 flex-sub" @click="closePopup">取消</view>
                <view class="action ma-0 flex-sub text-green solid-left" :disabled="tagName" @click="addTagClick">
                    创建
                </view>
            </view>
        </view>
    </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TagVO from '@/model/tag/TagVO'
import TagAPI from '@/api/TagAPI'
import ResultVO from '@/model/ResultVO'
import ErrorCode from '@/const/ErrorCode'
import UniUtils from '@/utils/UniUtils'

@Component
export default class TagAddVue extends Vue {
    // tag名称
    tagName = ''
    // tag描述
    tagDescription = ''

    closePopup () {
      this.$emit('close')
    }

    checkTag (tag: TagVO) {
      this.tagName = ''
      this.tagDescription = ''
      this.$emit('change', tag)
    }

    addTagClick () {
      TagAPI.addTagAPI(this.tagName, this.tagDescription).then((res: any) => {
        this.checkTag(res.data)
      }).catch((res: ResultVO<TagVO>) => {
        if (res.errorCode === ErrorCode.custom) {
          UniUtils.action(res.errorMsg, '使用').then(() => {
            this.checkTag(res.data)
          })
        }
      })
    }

    clearTagName () {
      this.tagName = ''
    }
}
</script>
