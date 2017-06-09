/**
 * Created by huozhenwei on 2017/6/5.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Linking,
    Clipboard,
    DeviceEventEmitter
} from 'react-native';

import ViewUtil from '../../util/ViewUtil';
import GlobalStyles from '../../../res/styles/GlobalStyles';
import AboutCommon,{FLAG_ABOUT} from './AboutCommon';
import WebSitePage from '../WebSitePage';
import Toast,{DURATION} from 'react-native-easy-toast';
import config from '../../../res/data/config.json';
const FLAG = {
    REPOSITORY: '开源项目',
    BLOG: {
        name: '技术博客',
        items: {
            PERSONAL_BLOG: {
                title: '个人博客',
                url: 'http://jiapenghui.com',
            },
            CSDN: {
                title: 'CSDN',
                url: 'http://blog.csdn.net/fengyuzhengfan',
            },
            JIANSHU: {
                title: '简书',
                url: 'http://www.jianshu.com/users/ca3943a4172a/latest_articles',
            },
            GITHUB: {
                title: 'GitHub',
                url: 'https://github.com/crazycodeboy',
            },
        }
    },
    CONTACT: {
        name: '联系方式',
        items: {
            QQ: {
                title: 'QQ',
                account: '1586866509',
            },
            Email: {
                title: 'Email',
                account: 'crazycodeboy@gmail.com',
            },
        }
    },
    QQ: {
        name: '技术交流群',
        items: {
            MD: {
                title: '移动开发者技术分享群',
                account: '335939197',
            },
            RN: {
                title: 'React Native学习交流群',
                account: '165774887',
            }
        },
    },
};
export default class AboutMePage extends Component{

    constructor(props) {
        super(props);
        //组装者模式,把公用代码提取出来
        this.aboutCommon = new AboutCommon(
            props,
            (dic)=>this.updateState(dic),
            FLAG_ABOUT.flag_about_me,
            config
        );
        this.state = {
            projectModels:[],
            author:config.author,
            showRepository:false, //显示开源项目
            showBlog:false, //显示博客
            showQQ:false, //显示QQ
            showContact:false //显示联系方式
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
            case FLAG.REPOSITORY:
                this.updateState({showRepository: !this.state.showRepository});
                break;
            case FLAG.BLOG:
                this.updateState({showBlog: !this.state.showBlog});
                break;
            case FLAG.QQ:
                this.updateState({showQQ: !this.state.showQQ});
                break;
            case FLAG.CONTACT:
                this.updateState({showContact: !this.state.showContact});
                break;
            case FLAG.CONTACT.items.Email:
                var url = 'mailto://'+tab.account;
                Linking.canOpenURL(url).then(supported => {
                    if (!supported) {
                        console.log('Can\'t handle url: ' + url);
                    } else {
                        return Linking.openURL(url);
                    }
                }).catch(err => console.error('An error occurred', err));
                break;
            case FLAG.CONTACT.items.QQ:
                Clipboard.setString(tab.account);
                this.toast.show('QQ:' + tab.account + '已复制到剪切板。');
                break;
            case FLAG.QQ.items.MD:
            case FLAG.QQ.items.RN:
                Clipboard.setString(tab.account);
                this.toast.show('群号:' + tab.account + '已复制到剪切板。');
                break;
            case FLAG.BLOG.items.CSDN:
            case FLAG.BLOG.items.GITHUB:
            case FLAG.BLOG.items.JIANSHU:
            case FLAG.BLOG.items.PERSONAL_BLOG:
                TargetComponent = WebSitePage;
                params.url = tab.url;
                params.title = tab.title;
                break;
        }
        if(TargetComponent){
            this.props.navigator.push({
                component:TargetComponent,
                params:params
            })
        }
    }

    /**
     * 获取item右侧图标
     * @param isShow
     */
    getClickIcon(isShow){
        return isShow ? require('../../../res/images/ic_tiaozhuan_up.png')
            :require('../../../res/images/ic_tiaozhuan_down.png');
    }

    /**
     * 显示列表数据
     * @param dic
     * @param isShowAccount  显示交流群和联系方式用
     */
    renderItems(dic,isShowAccount){
        if(!dic)return null;
        let views = [];
        for(let i in dic){
            let title = isShowAccount ? dic[i].title + ': ' + dic[i].account : dic[i].title;
            views.push(
                <View key={i}>
                    {ViewUtil.getSettingItem(()=>this.onClick(dic[i]), '', title, this.props.theme.styles.tabBarSelectedIcon, null)}
                    <View style={GlobalStyles.line}/>
                </View>
            )
        }
        return views;
    }
    render() {
        let contentView = <View>
            {ViewUtil.getSettingItem(()=>this.onClick(FLAG.BLOG), require('../../../res/images/ic_computer.png'),
                FLAG.BLOG.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showBlog))}
            <View style={GlobalStyles.line}/>
            {this.state.showBlog ? this.renderItems(FLAG.BLOG.items, false) : null}

            {ViewUtil.getSettingItem(()=>this.onClick(FLAG.REPOSITORY), require('../../../res/images/ic_code.png'),
                FLAG.REPOSITORY, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showRepository))}
            <View style={GlobalStyles.line}/>
            {this.state.showRepository ? this.aboutCommon.renderRepository(this.state.projectModels):null}

            {ViewUtil.getSettingItem(()=>this.onClick(FLAG.QQ), require('../../../res/images/ic_computer.png'),
                FLAG.QQ.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showQQ))}
            <View style={GlobalStyles.line}/>
            {this.state.showQQ ? this.renderItems(FLAG.QQ.items, true) : null}

            {ViewUtil.getSettingItem(()=>this.onClick(FLAG.CONTACT), require('../../../res/images/ic_contacts.png'),
                FLAG.CONTACT.name, this.props.theme.styles.tabBarSelectedIcon, this.getClickIcon(this.state.showContact))}
            <View style={GlobalStyles.line}/>
            {this.state.showContact ? this.renderItems(FLAG.CONTACT.items, true) : null}
        </View>;
        return (<View style={styles.container}>
            {this.aboutCommon.renderView(contentView,this.state.author)}
            {/* Toast 要在根视图底部使用 */}
            <Toast ref={toast=>this.toast=toast} />
        </View>)
    }
}
const styles = StyleSheet.create({
    container:{
        flex:1
    }
});