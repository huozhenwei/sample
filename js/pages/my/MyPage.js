/**
 * Created by huozhenwei on 2017/5/30.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
} from 'react-native';

import NavigationBar from '../../common/NavigationBar';
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import ViewUtil from '../../util/ViewUtil';

import CustomKeyPage from './CustomKeyPage';
import SortKeyPage from './SortKeyPage';
import {FLAG_LANGUAGE}from '../../expand/dao/LanguageDao';
import AboutPage from '../about/AboutPage';
import AboutMePage from '../about/AboutMePage';

export default class MyPage extends Component{
    constructor(props){
        super(props);
    }
    onClick(tab){
        let TargetComponent, params = {...this.props,menuType:tab};
        switch (tab){
            case MORE_MENU.Custom_Language:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Sort_Language:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Custom_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Sort_Key:
                TargetComponent = SortKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                break;
            case MORE_MENU.Remove_Key:
                TargetComponent = CustomKeyPage;
                params.flag = FLAG_LANGUAGE.flag_key;
                params.isRemoveKey = true; //用于标识进入标签删除功能
                break;
            case MORE_MENU.Custom_Theme:
                break;
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.About:
                TargetComponent = AboutPage;
                break;
        }
        if(TargetComponent){
            this.props.navigator.push({
                component:TargetComponent,
                params:params
            })
        }
    }
    getItem(tag,icon,text){
        return ViewUtil.getSettingItem(()=>this.onClick(tag),icon,text,{tintColor:'#2196F3'},null);
    }
    render(){
        let navigatorBar = <NavigationBar
            title='我的'
            style={{backgroundColor:'#2196F3'}}
        />;
        return (<View style={GlobalStyles.root_container}>
            {navigatorBar}
            <ScrollView>
                <TouchableHighlight
                    onPress={()=>this.onClick(MORE_MENU.About)}
                >
                    <View style={styles.item}>
                        <View style={{flexDirection:'row',alignItems:'center'}}>
                            <Image
                                style={[{width:40,height:40,marginRight:10},{tintColor:'#2196F3'}]}
                                source={require('../../../res/images/ic_trending.png')}/>
                            <Text>GitHub Popular</Text>
                        </View>
                        <Image
                            style={[{marginRight:0,height:22,width:22},{tintColor:'#2196F3'}]}
                            source={require('../../../res/images/ic_tiaozhuan.png')}/>
                    </View>
                </TouchableHighlight>
                <View style={GlobalStyles.line}/>

                {/*趋势管理*/}
                <Text style={styles.groupTitle}>趋势管理</Text>
                {/*自定义语言*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Language, require('./img/ic_custom_language.png'), '自定义语言')}
                {/*语言排序*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Sort_Language, require('./img/ic_swap_vert.png'), '语言排序')}

                {/*最热管理*/}
                <Text style={styles.groupTitle}>最热管理</Text>
                {/*自定义标签*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Key, require('./img/ic_custom_language.png'), '自定义标签')}
                {/*标签排序*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Sort_Key, require('./img/ic_swap_vert.png'), '标签排序')}
                {/*标签移除*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Remove_Key, require('./img/ic_remove.png'), '标签移除')}

                {/*设置*/}
                <Text style={styles.groupTitle}>设置</Text>
                {/*自定义主题*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.Custom_Theme, require('./img/ic_view_quilt.png'), '自定义主题')}
                {/*关于作者*/}
                <View style={GlobalStyles.line}/>
                {this.getItem(MORE_MENU.About_Author, require('./img/ic_insert_emoticon.png'), '关于作者')}
                <View style={[{marginBottom: 60}]}/>
            </ScrollView>
        </View>)
    }
}

const styles = StyleSheet.create({
    item: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        padding:10,
        height:90,
        backgroundColor:'white'
    },
    groupTitle:{
        marginLeft:10,
        marginTop:10,
        marginBottom:5,
        fontSize:12,
        color:'gray'
    }
});