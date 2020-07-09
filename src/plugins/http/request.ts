/* eslint-disable */
/**
 * Request 0.0.9
 * @Class Request
 * @description luch-request 0.0.9 http请求插件
 * @Author lu-ch
 * @Date 2019-08-20
 * http://ext.dcloud.net.cn/plugin?id=392
 */
import ResultVO from '@/model/ResultVO'

interface header { // header 接口
  'Content-Type'?: string;

  [propName: string]: any;
}

interface config { // init 全局config接口
  baseUrl: string;
  header: header;
  method: string;
  dataType: string;
  responseType: string;
}

interface interceptor { // init 拦截器接口
  request: Function;
  response: Function;
}

interface options { // request 方法配置参数（public）
  url: string;
  dataType?: string;
  data?: object;
  header?: header;
  method?: string;
  responseType?: string;
}

interface handleOptions { // get/post 方法配置参数（public）
  header?: header;
  dataType?: string;
  responseType?: string;
}

interface newOptions { // 定义新的配置接口
  baseUrl: string;
  url: string;
  dataType: string;
  data: object;
  header: header;
  method: string;
  complete?: Function;
  responseType: string;
}

interface requestCb { // 请求拦截器回调
  (x: object, y: Function): object;
}

interface responseCb { // 相应拦截器回调
  (x: object): object;
}

interface response { // 响应体 (public)
  statusCode?: number;
  config: Record<string, any>;
  errMsg: string;

  [propName: string]: any;
}

interface requestConfig { // 请求之前参数配置项 (public)
  readonly baseUrl: string;
  url: string;
  dataType: string;
  data: object;
  header: header;
  method: string;
  readonly complete: Function;
  responseType: string;
}

export default class Request {
  config: config = {
    baseUrl: '',
    header: {
      'Content-Type': 'application/json'
    },
    method: 'GET',
    dataType: 'json',
    responseType: 'text'
  }

  static posUrl (url: string): boolean { /* 判断url是否为绝对路径 */
    return /(WebAPI|https):\/\/([\w.]+\/?)\S*/.test(url)
  }

  interceptor: interceptor = {
    request: (f: requestCb) => {
      if (f) {
        this.requestBeforeFun = f
      }
    },
    response: (cb: responseCb, ecb: responseCb) => {
      if (cb && ecb) {
        this.requestComFun = cb
        this.requestComFail = ecb
      }
    }
  }

  private requestBeforeFun (config: object, cancel?: Function): object {
    return config
  }

  private requestComFun (response: object): object {
    return response
  }

  private requestComFail (response: object): object {
    return response
  }

  setConfig (f: Function) {
    this.config = f(this.config)
  }

  request<T> (options: options) {
    const _options: newOptions = {
      baseUrl: this.config.baseUrl,
      dataType: options.dataType || this.config.dataType,
      responseType: options.responseType || this.config.responseType,
      url: Request.posUrl(options.url) ? options.url : (this.config.baseUrl + options.url),
      data: options.data || {},
      header: options.header || this.config.header,
      method: options.method || this.config.method
    }
    return new Promise<ResultVO<T>>((resolve: Function, reject: Function) => {
      let next = true
      let _config: object = {}
      _options.complete = (response: response) => {
        response.config = _config
        if (response.statusCode === 200) { // 成功
          resolve(this.requestComFun(response))
        } else {
          reject(this.requestComFail(response))
        }
      }
      const cancel = (t = 'handle cancel', config = _options): void => {
        const err = {
          errMsg: t,
          config: config
        }
        reject(err)
        next = false
      }
      _config = { ...this.requestBeforeFun(_options, cancel) }
      if (!next) return
      uni.request(_config)
    })
  }

  get (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'GET',
      ...options
    })
  }

  post<T> (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request <T>({
      url,
      data,
      method: 'POST',
      ...options
    })
  }

  // #ifndef MP-ALIPAY
  put (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'PUT',
      ...options
    })
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  delete (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'DELETE',
      ...options
    })
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN
  connect (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'CONNECT',
      ...options
    })
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  head (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'HEAD',
      ...options
    })
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN || MP-BAIDU
  options (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'OPTIONS',
      ...options
    })
  }

  // #endif

  // #ifdef APP-PLUS || H5 || MP-WEIXIN
  trace (url: string, data: object = {}, options: handleOptions = {}) {
    return this.request({
      url,
      data,
      method: 'TRACE',
      ...options
    })
  }

  // #endif
}

export {
  options,
  handleOptions,
  config,
  requestConfig,
  response
}
