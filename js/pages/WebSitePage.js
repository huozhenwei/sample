/**
 * Created by huozhenwei on 2017/6/4.
 */
import React,{Component} from 'react';
import {
    Text,
    View,
    WebView,
} from 'react-native';
import NavigationBar from '../common/NavigationBar';
import GlobalStyles from '../../res/styles/GlobalStyles';
import ViewUtil from '../util/ViewUtil';

export default class WebSitePage extends Component{
    constructor(props){
        super(props);
        this.state = {
            url: this.props.url,
            title:this.props.title,
            canGoBack:false
        }
    }
    //函数被回调时返回navState参数
    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            url:navState.url
        })
    }
    onBackPress(){
        //先判断
        if(this.state.canGoBack){
            this.webView.goBack(); //返回上一页
        }
        else{
            this.props.navigator.pop();
        }
    }
    render(){
        return (
            <View style={GlobalStyles.root_container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor:'#2196F3'}}
                    leftButton={ViewUtil.getLeftButton(()=>this.onBackPress())}
                />
                <WebView
                    ref={webView=>this.webView=webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                />
            </View>
        )
    }
}