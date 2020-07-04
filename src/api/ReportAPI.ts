import http from '@/plugins/http'
import ReportAddVO from '@/model/report/ReportAddVO'

export default class ReportAPI {
  static addReportAPI (reportAdd: ReportAddVO) {
    return http.post('report/addReport', reportAdd)
  }
}
