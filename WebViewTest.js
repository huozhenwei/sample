/**
 * Created by huozhenwei on 2017/5/30.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    WebView,
    DeviceEventEmitter
} from 'react-native';
import NavigationBar from './js/common/NavigationBar';

const URL = 'http://www.imooc.com'; //WebView默认加载URL
export default class WebViewTest extends Component{
    constructor(props){
        super(props);
        this.state = {
            url:URL,
            title:'',
            canGoBack:false,
        }
    }
    go(){
        this.setState({
            url: this.text
        })
    }
    goBack(){
        //先判断
        if(this.state.canGoBack){
            this.webView.goBack(); //返回上一页
        }
        else{
            //向首页发送通知
            DeviceEventEmitter.emit('showToast','已经到顶了');
        }
    }
    //函数被回调时返回navState参数
    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            title:navState.title
        })
    }
    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title='WebView使用'
                    style={{backgroundColor:'#2196F3'}}
                />

                <View style={styles.row}>
                    <Text
                        style={styles.tips}
                        onPress={()=>{
                            this.goBack()
                        }}
                    >返回</Text>
                    <TextInput
                        style={styles.input}
                        defaultValue={URL}
                        onChangeText={text=>this.text=text}
                    />
                    <Text
                        style={styles.tips}
                        onPress={()=>{
                            this.go()
                        }}
                    >前往</Text>
                </View>

                <WebView
                    ref={webView=>this.webView=webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    },
    tips:{
        fontSize: 20
    },
    row:{
        flexDirection:'row',
        alignItems:'center',
        margin:10,
    },
    input:{
        height:40,
        flex:1,
        borderWidth:1,
        margin:2,
    }
});