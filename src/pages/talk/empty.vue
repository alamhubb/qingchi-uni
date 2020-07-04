<template>
  <view class="flex-col h100r bg-default">
    <view class="row-around mt-xl">
      <q-icon icon="mdi-heart" size="72" color="#ec5a67"></q-icon>

      <q-icon icon="mdi-chat-outline" size="72" color="#4CAF50"></q-icon>

      <q-icon icon="mdi-account-box" size="72" color="#FF9800"></q-icon>
      <q-icon icon="mdi-account-box" size="72" color="#FF9800"></q-icon>
    </view>
  </view>
</template>

<script lang="ts">
import {
  Vue,
  Component
} from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import TalkSwipers from '@/pages/talk/talkSwipers.vue'

const configStore = namespace('config')


@Component({
  components: {
    TalkSwipers
  }
})
export default class EmptyVue extends Vue {
  @configStore.State('showSwipers') configShowSwipers: boolean
}
</script>
