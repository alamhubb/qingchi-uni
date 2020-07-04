<template>
    <view v-if="talk" class="card" hover-class="uni-list-cell-hover">
        <talk-item-head :talk-prop="talk" :talk-tab-type="talkTabType" @deleteTalk="deleteTalk"/>
        <talk-item-content :talk="talk"/>
        <talk-item-comment v-if="!talk.globalTop || talk.globalTop===1" :talk-prop="talk"
                           :showAllComment="showAllComment"/>
    </view>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import TalkVO from '@/model/talk/TalkVO'
import TalkItemHead from '@/pages/talk/TalkItemHead.vue'
import TalkItemContent from '@/pages/talk/TalkItemContent.vue'
import TalkItemComment from '@/pages/talk/TalkItemComment.vue'

  @Component({
    components: {
      TalkItemComment,
      TalkItemContent,
      TalkItemHead
    }
  })
export default class TalkItem extends Vue {
    @Prop() talk: TalkVO
    @Prop() talkTabType: string
    @Prop({ type: Boolean, default: false }) readonly showAllComment: boolean

    @Emit()
    deleteTalk (talkId: number) {
      return talkId
    }
}
</script>
