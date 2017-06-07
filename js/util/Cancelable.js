/**
 * Created by huozhenwei on 2017/6/7.
 */

export default function makeCancelable(promise) {
    //用于标识用户是否取消请求
    let _hasCanceled = false;
    const wrapPromise = new Promise((resolve, reject)=> {
        promise.then((val)=> {
            _hasCanceled ? reject({isCanceled: true}) : resolve(val);
        });
        promise.catch((error)=> {
            _hasCanceled ? reject({isCanceled: true}) : resolve(error);
        });
    });

    return {
        promise: wrapPromise,
        cancel(){
            //用户点击取消后, 改变标识
            _hasCanceled = true;
        }
    }
}