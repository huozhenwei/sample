/**
 * Created by huozhenwei on 2017/5/30.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    Image,
    Alert,
    DeviceEventEmitter,
} from 'react-native';
import CheckBox from 'react-native-check-box';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import ArrayUtils from '../../util/ArrayUtils';
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import {ACTION_HOME,FLAG_TAB} from '../../pages/HomePage';
export default class CustomKeyPage extends Component{
    constructor(props){
        super(props);
        //自定义标签 和 标签移除两功能, 页面复用较多,用isRemoveKey标识进行区分
        this.isRemoveKey = this.props.isRemoveKey ? true: false;
        //用于记录用户的修改
        this.changeValues = [];
        this.state={
            dataArray:[] //语言标签
        }
    }

    //组件完成加载时候就调用
    componentDidMount(){
        //初始化LanguageDao
        this.languageDao = new LanguageDao(this.props.flag);
        this.loadData();
    }

    //从 LanguageDao 加载标签
    loadData(){
        this.languageDao.fetch()
            .then(result=>{
                this.setState({
                    dataArray:result
                })
            })
            .catch(error=>{
                console.log(error);
            })
    }

    //渲染自定义标签
    renderView(){
        if(!this.state.dataArray || this.state.dataArray.length === 0 )return null;
        let len = this.state.dataArray.length;
        let views = [];
        //每两个元素作为一组遍历, 每次增长2个元素
        for(let i=0,l=len-2;i<l; i+=2){
        // for(let i=0;i<len-2; i+=2){
            views.push(
                <View key={i}>
                    <View style={styles.item}>
                        {this.renderCheckBox(this.state.dataArray[i])}
                        {this.renderCheckBox(this.state.dataArray[i+1])}
                    </View>
                    <View style={styles.line}></View>
                </View>
            )
        }
        //因为循环时len-2,如果数组长度是2会少2个元素, 长度是3会少1个元素
        views.push(
            <View key={len-1}>
                <View style={styles.item}>
                    {len%2 === 0 ? this.renderCheckBox(this.state.dataArray[len-2]):null}
                    {this.renderCheckBox(this.state.dataArray[len-1])}
                </View>
                <View style={styles.line}></View>
            </View>
        )
        return views;
    }

    //渲染checkbox组件(左侧文字,右侧选择/未选中框)
    renderCheckBox(data){
        let leftText = data.name;
        //此页面如果是用于删除标签, 则默认复选框不选中
        let isChecked = this.isRemoveKey ? false : data.checked;
        //不设置样式,文字显示不出来
        return (
            <CheckBox
                style={{flex:1, padding:10}}
                onClick={()=>this.onClick(data)}
                isChecked={isChecked}
                leftText={leftText}
                checkedImage={<Image
                    style={this.props.theme.styles.tabBarSelectedIcon}
                    source={require('./img/ic_check_box.png')}/>}
                unCheckedImage={<Image
                    style={this.props.theme.styles.tabBarSelectedIcon}
                    source={require('./img/ic_check_box_outline_blank.png')}/>}
            />
        )
    }

    //点击复选框
    onClick(data){
        //不是标签移除, 改变数据状态
        if(!this.isRemoveKey){
            data.checked = !data.checked;
        }
        //记录用户的修改
        ArrayUtils.updateArray(this.changeValues, data);
    }

    //用户点击返回按钮,校验保存
    onBack(){
        if(this.changeValues.length === 0)
        {
            this.props.navigator.pop();
            return;
        }
        //有修改提示用户
        Alert.alert(
            '提示',
            '要保存修改吗?',
            [
                {text: '不保存', onPress: () => {
                    this.props.navigator.pop();
                }, style: 'cancel'},
                {text: '保存', onPress: () => {this.onSave()}},
            ]
        )
    }

    onSave(){
        //如果this.changeValues不为空,需要保存数据
        if(this.changeValues.length === 0){
            this.props.navigator.pop(); //返回上一页
            return;
        }
        //如果是删除标签功能, 要把发生变化的标签从数据库中移除,最后在保存
        if(this.isRemoveKey){
            for(let i =0,len=this.changeValues.length; i<len;i++){
                ArrayUtils.remove(this.state.dataArray, this.changeValues[i]);
            }
        }
        //this.changeValues仅用于判断用户是否操作, 数据的变化实时同步到dataArray, 保存dataArray即可
        this.languageDao.save(this.state.dataArray);

        //传入事件名,类型 和 默认tab
        var jumpToTab = this.props.flag === FLAG_LANGUAGE.flag_key
            ? FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab;
        DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART, jumpToTab);
    }

    render(){
        let title = this.isRemoveKey ? '标签移除':'自定义标签';
        title = this.props.flag === FLAG_LANGUAGE.flag_language?'自定义语言':title;
        let rightButtonText = this.isRemoveKey ? '移除':'保存';
        let navigationBar = <NavigationBar
            title={title}
            leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
            style={this.props.theme.styles.navBar}
            rightButton={ViewUtil.getRightButton(rightButtonText,()=>this.onSave())}
        />;
        return (
            <View style={styles.container}>
                {navigationBar}
                <ScrollView>
                    {this.renderView()}
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    },
    save:{
        fontSize:20,
        color:'white',
    },
    line:{
        height:0.3,
        backgroundColor:'darkgray'
    },
    item:{
        flexDirection:'row',
        alignItems:'center',
    }
});