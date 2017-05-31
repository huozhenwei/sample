/**
 * Created by huozhenwei on 2017/5/31.
 * 详情页面
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    WebView,
} from 'react-native';
import NavigationBar from '../../js/common/NavigationBar';
import ViewUtil from '../util/ViewUtil';
export default class RepositoryDetail extends Component{
    constructor(props){
        super(props);
        let url = this.props.item.html_url;
        let title = this.props.item.full_name;
        this.state = {
            url:url,
            title:title,
            canGoBack:false,
        }
    }

    onBack(){
        //先判断,能返回就返回,不能就关闭
        if(this.state.canGoBack){
            this.webView.goBack(); //返回上一页
        }
        else{
            this.props.navigator.pop();
        }
    }

    //函数被回调时返回navState参数
    onNavigationStateChange = (navState) => {
        this.setState({
            canGoBack: navState.canGoBack,
            url:navState.url
        })
    }

    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={this.state.title}
                    style={{backgroundColor:'#2196F3'}}
                    leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
                />

                <WebView
                    ref={webView=>this.webView=webView}
                    source={{uri: this.state.url}}
                    onNavigationStateChange={(e)=>this.onNavigationStateChange(e)}
                    startInLoadingState={true}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
    }
});