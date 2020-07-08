<script lang="ts">
import Vue from 'vue'
import { systemModule } from '@/plugins/store'

export default Vue.extend({
  mpType: 'app',
  onLaunch () {
    systemModule.appInit()
  }
})
</script>
<style lang="scss">
  @import "./styles/iconfont/index.css";
  @import "./styles/index.scss";
</style>
