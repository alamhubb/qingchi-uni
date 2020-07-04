<template>
    <view class="q-tab">
        <slot></slot>
    </view>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

  @Component
export default class QTab extends Vue {

}
</script>
