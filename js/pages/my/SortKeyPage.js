/**
 * Created by huozhenwei on 2017/5/30.
 */
import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight,
    TouchableOpacity,
    Alert,
    DeviceEventEmitter
} from 'react-native';
import {ACTION_HOME,FLAG_TAB} from '../../pages/HomePage';
import NavigationBar from '../../common/NavigationBar';
import LanguageDao, {FLAG_LANGUAGE} from '../../expand/dao/LanguageDao';
import ArrayUtils from '../../util/ArrayUtils';
import SortableListView  from 'react-native-sortable-listview';
import ViewUtil from '../../util/ViewUtil';

export default class SortKeyPage extends Component {
    constructor(props) {
        super(props);
        this.dataArray = []; //从数据库中取出的原始标签数据
        this.sortResultArray = []; //最终排序后的数组
        this.originalCheckedArray = []; //上一次标签排序的顺序
        this.state = {
            checkedArray: [] //已经订阅的标签
        }

        //初始化LanguageDao
        this.languageDao = new LanguageDao(this.props.flag);
    }

    //组件完成加载时候就调用
    componentDidMount() {
        this.loadData();
    }

    //从 LanguageDao 加载标签
    loadData() {
        this.languageDao.fetch()
            .then(result=> {
                this.getCheckedItems(result);
            })
            .catch(error=> {
                console.log(error);
            })
    }

    //筛选出用户已订阅的标签
    getCheckedItems(result) {
        this.dataArray = result; //原始数据备份,最后数据对比用
        let checkedArray = [];
        for (let i = 0, len = result.length; i < len; i++) {
            let data = result[i];
            if (data.checked)checkedArray.push(data);
        }
        //已订阅的标签
        this.setState({
            checkedArray: checkedArray
        });
        //赋值一份给originalCheckedArray
        this.originalCheckedArray = ArrayUtils.clone(checkedArray);
    }

    //返回按鈕事件
    onBack() {
        if(ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray)){
            this.props.navigator.pop();
            return;
        }
        Alert.alert(
            '提示',
            '要保存排序吗?',
            [
                {text: '不保存', onPress: () => {
                    this.props.navigator.pop();
                }, style: 'cancel'},
                {text: '保存', onPress: () => {this.onSave(true)}},
            ]
        )
    }

    onSave(isChecked){
        /**
         * 判断排序后数组checkedArray 和 排序前数组originalCheckedArray两者之间元素是不是一一对应
         * 不是一一对应需要保存
         */
        let flag = ArrayUtils.isEqual(this.originalCheckedArray,this.state.checkedArray);
        if(!isChecked && flag){
            this.props.navigator.pop();
            return;
        }
        //两数组不相等, 就获取排序后新的数组
        this.getSortResult();
        this.languageDao.save(this.sortResultArray); //保存最终结果

        //传入事件名,类型 和 默认tab
        var jumpToTab = this.props.flag === FLAG_LANGUAGE.flag_key
            ? FLAG_TAB.flag_popularTab : FLAG_TAB.flag_trendingTab;
        DeviceEventEmitter.emit('ACTION_HOME',ACTION_HOME.A_RESTART, jumpToTab);
    }

    //获取重新排序后的所有标签的方法
    getSortResult(){
        //先初始化一下, 两者元素相同
        this.sortResultArray = ArrayUtils.clone(this.dataArray);
        for(let i=0,len=this.originalCheckedArray.length; i<len; i++){
            let item = this.originalCheckedArray[i];
            //获取元素在原始数组中的位置
            let index = this.dataArray.indexOf(item);
            //保存最新排序后的元素
            this.sortResultArray.splice(index, 1, this.state.checkedArray[i]);
        }
    }

    render() {
        let rightButton = <TouchableOpacity
            onPress={()=>this.onSave(false)}
        >
            <View style={{margin:10}}>
                <Text style={styles.save}>保存</Text>
            </View>
        </TouchableOpacity>;
        let title = this.props.flag === FLAG_LANGUAGE.flag_language?'语言排序':'标签排序';
        return (<View style={styles.container}>
            <NavigationBar
                title={title}
                style={{backgroundColor:'#2196F3'}}
                leftButton={ViewUtil.getLeftButton(()=>this.onBack())}
                rightButton={rightButton}
            />
            <SortableListView
                style={{flex: 1}}
                data={this.state.checkedArray}
                order={Object.keys(this.state.checkedArray)}
                onRowMoved={e => {
                    this.state.checkedArray.splice(e.to, 0, this.state.checkedArray.splice(e.from, 1)[0]);
                    this.forceUpdate();
                }}
                renderRow={row => <SortCell data={row} />}
            />
        </View>)
    }
}

class SortCell extends Component {
    render() {
        return (
            <TouchableHighlight
                underlayColor={'#eee'}
                delayLongPress={500}
                style={styles.item}
                {...this.props.sortHandlers}
            >
                <View style={styles.row}>
                    <Image style={styles.image}
                           source={require('./img/ic_sort.png')}/>
                    <Text>{this.props.data.name}</Text>
                </View>

            </TouchableHighlight>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    tips: {
        fontSize: 29
    },
    item: {
        padding: 15,
        backgroundColor: "#F8F8F8",
        borderBottomWidth: 1,
        borderColor: '#eee'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    image: {
        tintColor: '#2196F3',
        width: 16,
        height: 16,
        marginRight: 10
    },
    save:{
        fontSize:20,
        color:'#FFFFFF',
    },
});