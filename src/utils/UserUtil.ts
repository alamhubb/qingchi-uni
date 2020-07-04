import Constants from '@/const/Constant'
import GenderType from '@/const/GenderType'
import UserVO from '@/model/user/UserVO'
import FollowSatus from '@/const/FollowSatus'

export default class UserUtil {
  static getGenderIcon (user: UserVO): string {
    if (user && user.gender === GenderType.girl) {
      return GenderType.girlIcon
    } else {
      return GenderType.boyIcon
    }
  }

  static getGenderCuIcon (user: UserVO): string {
    if (user && user.gender === GenderType.girl) {
      return GenderType.girlCuIcon
    } else {
      return GenderType.boyCuIcon
    }
  }

  static getGenderColor (user: UserVO): string {
    if (user && user.gender === GenderType.girl) {
      return GenderType.girlColor
    } else {
      return GenderType.boyColor
    }
  }

  static getGenderBgColor (user: UserVO): string {
    if (user && user.gender === GenderType.girl) {
      return GenderType.girlBgColor
    } else {
      return GenderType.boyBgColor
    }
  }

  static getFollowStatusIcon (followStatus: string): string {
    if (followStatus === FollowSatus.follow) {
      return 'plus'
    } else if (followStatus === FollowSatus.eachFollow) {
      // return 'swap_horiz'
      return ''
    } else {
      return 'checkmark'
    }
  }

  static getFollowStatusColor (followStatus: string): string {
    if (followStatus === FollowSatus.follow) {
      return 'blue'
    } else {
      return 'gray'
    }
  }

  static getOnlineColor (user: UserVO): string {
    if (user.onlineFlag) {
      return Constants.onlineColor
    } else if (user.lastOnlineTime) {
      const lastDateTime = new Date(user.lastOnlineTime).getTime()
      const curDateTime = new Date().getTime()
      if (curDateTime / Constants.minute - 30 < lastDateTime / Constants.minute) {
        return Constants.onlineColor
      }
    }
    return Constants.offlineColor
  }
}
