/**
 * Created by huozhenwei on 2017/6/4.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Linking
} from 'react-native';

import ViewUtil from '../../util/ViewUtil';
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon,{FLAG_ABOUT} from './AboutCommon';
import WebSitePage from '../WebSitePage';
import config from '../../../res/data/config.json';
import AboutMePage from './AboutMePage';
export default class AboutPage extends Component{

    constructor(props) {
        super(props);
        //组装者模式,把公用代码提取出来
        this.aboutCommon = new AboutCommon(
            props,
            (dic)=>this.updateState(dic),
            FLAG_ABOUT.flag_about,
            config
        );
        this.state = {
            projectModels:[],
            author:config.author
        }
    }
    componentDidMount(){
        this.aboutCommon.componentDidMount();
    }
    updateState(dic){
        this.setState(dic)
    }
    onClick(tab){
        let TargetComponent, params = {...this.props,menuType:tab};
        switch (tab){
            case MORE_MENU.About_Author:
                TargetComponent = AboutMePage;
                break;
            case MORE_MENU.Website:
                TargetComponent = WebSitePage;
                params.url = 'https://github.com/crazycodeboy';
                params.title = 'GitHubPopular';
                break;
            case MORE_MENU.Feedback:
                var url = 'mailto://718289183@qq.com';
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
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
        return ViewUtil.getSettingItem(()=>this.onClick(tag),icon,text,this.props.theme.styles.tabBarSelectedIcon,null);
    }

    render() {
        let contentView = <View>
            {this.aboutCommon.renderRepository(this.state.projectModels)}
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
            'avatar':this.state.author.avatar1,
            'backgroundImg':this.state.author.backgroundImg1
        });
    }
}