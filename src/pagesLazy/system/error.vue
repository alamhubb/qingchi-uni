<template>
  <view>

  </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { namespace } from 'vuex-class'


/**
 * todo 需要支持发表情,数据库字段，img字段img改为了src, 所有被封禁的用户允许登录查看，但是不允许操作，提示账号已被封禁
 * 发说说的时候限制字符长度 140个字
 * 取消身份认证功能
 */
@Component
export default class ErrorVue extends Vue {

}
</script>
