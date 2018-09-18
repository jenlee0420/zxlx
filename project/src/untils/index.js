import wepy from 'wepy'
import qs from 'qs'
/* 当前模式 */
let mode = 'dev'

const config = {
    dev: {
        api: {
            default: 'http://wxapi.zxlx123.com/'
        },
        imgUrl:'http://test.cn/'
    },
}
let currentConfig = config[mode]

const init = {
    /*拦截器*/
    intercept: [
        /*网络请求拦截处理*/
        {
            name: 'request',
            data: {
                config(request) {
                    /* baseUrl > urlKey > defaultMode */
                    let data = request.data
                    let baseUrl = currentConfig.api.default
                    let token = wepy.getStorageSync('token')
                    if (request.urlKey) baseUrl = currentConfig.api[request.urlKey]
                    if (request.baseUrl !== undefined) baseUrl = request.baseUrl
                    request.url = baseUrl + request.url
                    request.header = Object.assign({}, {'Content-Type': 'application/x-www-form-urlencoded'}, request.header)
                    if (!request.noToken && !!token){
                        data.token = token
                    }
                    if (request.method === 'POST') {
                        request.data = qs.stringify(request.data)
                    }
                    return request
                },
                success(response, re) {
                    /*if( response.code != 1 ){
                        wepy.clearStorageSync()
                    }*/
                    console.log('errr',response.statusCode)
                    if (response.statusCode === 200) {
                        if ((response.data.code === '870101' || response.data.code === '870104' || response.data.code === '990016'|| response.data.code === '990013')) {
                            if(!wepy.getStorageSync('relogin')){
                                wepy.setStorageSync('relogin','true')
                                this.relogin('/' + this.getCurrentPageUrl())
                            }
                        }
                        if(response.data.code){
                            response.data.code = String(response.data.code)
                        }
                        return response.data
                    } else {
                        let msg = `服务器异常错误码：${response.statusCode}，联系管理员`
                        wepy.showModal({content:msg,showCancel:false})
                        return response
                    }
                    console.log(response)
                },
                fail(err,re) {
                    return err
                }
            }
        }
    ]
}

module.exports = {config, init, mode}
