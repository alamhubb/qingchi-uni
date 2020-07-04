export default class ChatType {
    // 系统
    static readonly system: string = '公告'
    // 解除通知
    static readonly notify: string = '通知'
    static readonly single: string = '私聊'
    static readonly group: string = '群聊'
    static readonly system_group: string = '官方群聊'

    static readonly systemChats: string[] = [ChatType.system, ChatType.system_group]
}
