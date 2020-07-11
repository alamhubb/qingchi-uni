<template>
  <view class="bg-default">
    <user-info :user="user"></user-info>
    <msg-input v-if="showMsgInput">
    </msg-input>
  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import TalkItem from '@/pages/talk/TalkItem.vue'
import UserVO from '@/model/user/UserVO'
import UserAPI from '@/api/UserAPI'
import TalkItemContent from '@/pages/talk/TalkItemContent.vue'
import UserInfo from '@/pages/user/UserInfo.vue'

@Component({
  components: { UserInfo, TalkItem, TalkItemContent }
})
export default class UserDetail extends Vue {
  user: UserVO = null
  showMsgInput = false

  onShow () {
    this.showMsgInput = true
  }

  onHide () {
    this.showMsgInput = false
  }

  onLoad (params: any) {
    // 这里有问题，有时候直接进入页面没有userId
    UserAPI.queryUserDetailAPI(params.userId).then((res: any) => {
      this.user = res.data
    })
  }
}
</script>
