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
} from 'react-native';
import CheckBox from 'react-native-check-box';
import NavigationBar from '../../common/NavigationBar';
import ViewUtil from '../../util/ViewUtil';
import ArrayUtils from '../../util/ArrayUtils';
import LanguageDao,{FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
export default class CustomKeyPage extends Component{
    constructor(props){
        super(props);
        //初始化LanguageDao
        this.languageDao = new LanguageDao(FLAG_LANGUAGE.flag_key);
        //用于记录用户的修改
        this.changeValues = [];
        this.state={
            dataArray:[], //语言标签
        }
    }

    //组件完成加载时候就调用
    componentDidMount(){
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

    //用户点击返回按钮,校验保存
    onSave(){
        //如果this.changeValues不为空,需要保存数据
        if(this.changeValues.length === 0){
            this.props.navigator.pop(); //返回上一页
            return;
        }
        //this.changeValues仅用于判断用户是否操作, 数据的变化实时同步到dataArray, 保存dataArray即可
        this.languageDao.save(this.state.dataArray);
        this.props.navigator.pop();
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
        //不设置样式,文字显示不出来
        return (
            <CheckBox
                style={{flex:1, padding:10}}
                onClick={()=>this.onClick(data)}
                isChecked={data.checked}
                leftText={leftText}
                checkedImage={<Image
                    style={{tintColor:'#2196F3'}}
                    source={require('./img/ic_check_box.png')}/>}
                unCheckedImage={<Image
                    style={{tintColor:'#2196F3'}}
                    source={require('./img/ic_check_box_outline_blank.png')}/>}
            />
        )
    }

    //点击复选框
    onClick(data){
        //取反
        data.checked = !data.checked;
        //记录用户的修改
        ArrayUtils.updateArray(this.changeValues, data);
    }

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

    render(){
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave()}
        >
            <View style={{margin:10}}>
                <Text style={styles.save}>保存</Text>
            </View>
        </TouchableOpacity>;
        return (<View style={styles.container}>
            <NavigationBar
                title='自定义标签'
                style={{backgroundColor:'#2196F3'}}
                leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
                rightButton={rightButton}
            />
            <ScrollView>
                {this.renderView()}
            </ScrollView>
        </View>)
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