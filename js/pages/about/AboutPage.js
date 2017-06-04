/**
 * Created by huozhenwei on 2017/6/4.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
} from 'react-native';

import ViewUtil from '../../util/ViewUtil';
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon,{FLAG_ABOUT} from './AboutCommon';
export default class AboutPage extends Component{

    constructor(props) {
        super(props);
        //组装者模式,把公用代码提取出来
        this.aboutCommon = new AboutCommon(props,(dic)=>this.updateState(dic),FLAG_ABOUT.flag_about);
    }
    updateState(dic){
        this.setState(dic)
    }
    onClick(tab){
        let TargetComponent, params = {...this.props,menuType:tab};
        switch (tab){
            case MORE_MENU.About_Author:
                // TargetComponent = CustomKeyPage;
                // params.flag = FLAG_LANGUAGE.flag_language;
                break;
            case MORE_MENU.Website:
                break;
            case MORE_MENU.Feedback:

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

    render() {
        let contentView = <View>
            {this.getItem(MORE_MENU.Website, require('../../../res/images/ic_computer.png'), MORE_MENU.Website)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.About_Author, require('../my/img/ic_insert_emoticon.png'), MORE_MENU.About_Author)}
            <View style={GlobalStyles.line}/>
            {this.getItem(MORE_MENU.Feedback, require('../../../res/images/ic_feedback.png'), MORE_MENU.Feedback)}
            <View style={GlobalStyles.line}/>
        </View>;
        return this.aboutCommon.renderView(contentView,{
            'name':'GitHub Popular',
            'description':'这是一个用来查看GitHub最受欢迎与最热项目的APP,它基于React Native支持Android和iOS双平台.',
            'avatar':'http://avatar.csdn.net/1/1/E/1_fengyuzhengfan.jpg',
            'backgroundImg':'http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg'
        });
    }
}