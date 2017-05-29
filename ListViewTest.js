/**
 * Created by huozhenwei on 2017/5/27.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Button,
    ListView,
    Image,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import Toast,{DURATION} from 'react-native-easy-toast';
import NavigationBar from './js/common/NavigationBar';

var data = {
    "result":[
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"李斯"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        },
        {
            "email":"asdfasdf@ds.com",
            "fullName":"张三"
        }
    ],
    "statusCode":0
};

export default class ListViewTest extends Component{
    constructor(props){
        super(props);
        //为ListView 创建数据源
        const ds = new ListView.DataSource({rowHasChanged:(r1,r2) => r1!==r2});
        this.state = {
            dataSource:ds.cloneWithRows(data.result),
            isLoading: true, //什么时候显示刷新视图,默认是true
        }
        //因为下拉刷新组件 在页面加载时默认是刷新的, 要调用处理函数
        this.onLoad();
    }

    //指定ListView每行返回的视图
    renderRow(item){
        return <View style={styles.row}>
            <TouchableOpacity
                onPress={()=>{
                //单击某一行, 提示信息
                this.customToast.show('你单击了:'+item.fullName, DURATION.LENGTH_LONG);
            }}>
                <Text style={styles.tips}>{item.fullName}</Text>
                <Text style={styles.tips}>{item.email}</Text>
            </TouchableOpacity>
        </View>
    }

    renderSeparator(sectionID, rowID, adjacentRowHighlighted){
        return <View key={rowID} style={styles.line}></View>
    }

    renderFooter(){
        //网络图片需指定宽高
        return <Image style={{width:400,height:100}}
                      source={{uri:'https://images.gr-assets.com/hostedimages/1406479536ra/10555627.gif'}} />
    }

    //在视图开始刷新时调用, 监听RefreshControl组件下拉刷新状态
    onLoad (){
        setTimeout(()=>{
            this.setState({
                isLoading:false
            });
        },2000);
    }

    render(){
        return (
            <View style={styles.container}>
                <NavigationBar
                    title = 'ListViewTest'
                />

                <ListView
                    dataSource = {this.state.dataSource}
                    //每行返回的视图
                    renderRow = {(item)=> this.renderRow(item)}
                    //设置 renderSeparator属性,实现行之间的分割
                    renderSeparator={(sectionID, rowID, adjacentRowHighlighted)=> this.renderSeparator(sectionID, rowID, adjacentRowHighlighted)}
                    //上拉到底部时渲染的视图
                    renderFooter={()=>this.renderFooter()}
                    //下拉刷新
                    refreshControl={<RefreshControl
                        refreshing={this.state.isLoading}
                        onRefresh={()=>this.onLoad()} />}
                    />
                {/* Toast 要在根视图底部使用; 当Toast组件被渲染的时候,将组件赋值给customToast */}
                <Toast ref={toast=>{this.customToast = toast}} />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'white',
    },
    tips:{
        fontSize: 18
    },
    row:{
        height: 50
    },
    line:{
        height:1,
        backgroundColor:'black'
    }
});