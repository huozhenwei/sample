/**
 * Created by huozhenwei on 2017/5/29.
 */

import React, {Component} from 'react';
import {
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    TextInput,
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';
import Toast,{DURATION} from 'react-native-easy-toast';
const KEY = 'text';
export default class AsyncStorageTest extends Component {
    constructor(props) {
        super(props);
    }

    onSave(){
        AsyncStorage.setItem(KEY,this.text,(error)=>{
            if(!error){
                this.customToast.show('保存成功', DURATION.LENGTH_LONG);
            }
            else{
                this.customToast.show('保存失败', DURATION.LENGTH_LONG);
            }
        })
    }

    onRemove(){
        AsyncStorage.removeItem(KEY,(error)=>{
            if(!error){
                this.customToast.show('移除成功', DURATION.LENGTH_LONG);
            }
            else{
                this.customToast.show('移除失败', DURATION.LENGTH_LONG);
            }
        })
    }

    onFetch(){
        //第二个参数 result 即为KEY对应内容
        AsyncStorage.getItem(KEY,(error,result)=>{
            if(!error){
                if(result){
                    this.customToast.show('取出的内容为:' + result, DURATION.LENGTH_LONG);
                }
                else{
                    this.customToast.show('内容不存在', DURATION.LENGTH_LONG);
                }
            }
            else{
                this.customToast.show('提出失败', DURATION.LENGTH_LONG);
            }
        })
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='AsyncStorage的使用'
                    statusBar={{backgroundColor:'#2196F3'}}
                />
                <TextInput
                    style={{borderWidth:1,height:40,margin:6}}
                    onChangeText={text => this.text = text}
                />
                <View style={{flexDirection:'row'}}>
                    <Text style={styles.tips}
                          onPress={()=>this.onSave()}>保存</Text>
                    <Text style={styles.tips}
                          onPress={()=>this.onRemove()}>移除</Text>
                    <Text style={styles.tips}
                          onPress={()=>this.onFetch()}>取出</Text>
                </View>
                {/* Toast 要在根视图底部使用; 当Toast组件被渲染的时候,将组件赋值给customToast */}
                <Toast ref={toast=>{this.customToast = toast}} />
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    tips: {
        fontSize: 24,
        margin:5,
    }
});