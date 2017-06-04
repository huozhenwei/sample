/**
 * Created by huozhenwei on 2017/6/4.
 */
import React,{Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Dimensions,
    Platform
} from 'react-native';

import ParallaxScrollView from 'react-native-parallax-scroll-view';
import ViewUtil from '../../util/ViewUtil';
import {MORE_MENU} from '../../common/MoreMenu';
import GlobalStyles from '../../../res/styles/GlobalStyles';
export default class AboutPage extends Component{

    constructor(props) {
        super(props);
    }
    getParallaxRenderConfig(params){
        let config = {};
        config.renderBackground = () => (
            <View key="background">
                <Image source={{uri: params.backgroundImg,
                                width: window.width,
                                height: PARALLAX_HEADER_HEIGHT}}/>
                <View style={{position: 'absolute',
                              top: 0,
                              width: window.width,
                              backgroundColor: 'rgba(0,0,0,.4)',
                              height: PARALLAX_HEADER_HEIGHT}}/>
            </View>
        );
        config.renderForeground=() => (
            <View key="parallax-header" style={ styles.parallaxHeader }>
                <Image style={ styles.avatar } source={{
                  uri: params.avatar,
                  width: AVATAR_SIZE,
                  height: AVATAR_SIZE
                }}/>
                <Text style={ styles.sectionSpeakerText }>
                    {params.name}
                </Text>
                <Text style={ styles.sectionTitleText }>
                    {params.description}
                </Text>
            </View>
        );
        config.renderStickyHeader=() => (
            <View key="sticky-header" style={styles.stickySection}>
                <Text style={styles.stickySectionText}>{params.name}</Text>
            </View>
        );

        config.renderFixedHeader=() => (
            <View key="fixed-header" style={styles.fixedSection}>
                {ViewUtil.getLeftButton(()=>this.props.navigator.pop())}
            </View>
        );
        return config;
    }

    renderView(contentView,params) {
        let renderConfig = this.getParallaxRenderConfig(params);
        return (
          <ParallaxScrollView
              headerBackgroundColor="#333"
              backgroundColor = '#2196F3'
              stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
              parallaxHeaderHeight={ PARALLAX_HEADER_HEIGHT }
              backgroundSpeed={10}
              {...renderConfig}
          >
              {contentView}
          </ParallaxScrollView>
        )
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
        return this.renderView(contentView,{
            'name':'GitHub Popular',
            'description':'这是一个用来查看GitHub最受欢迎与最热项目的APP,它基于React Native支持Android和iOS双平台.',
            'avatar':'http://avatar.csdn.net/1/1/E/1_fengyuzhengfan.jpg',
            'backgroundImg':'http://www.devio.org/io/GitHubPopular/img/for_githubpopular_about_me.jpg'
        });
    }
}

const window = Dimensions.get('window');

const AVATAR_SIZE = 120;
const PARALLAX_HEADER_HEIGHT = 350;
const STICKY_HEADER_HEIGHT = 70;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    background: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: window.width,
        height: PARALLAX_HEADER_HEIGHT
    },
    stickySection: {
        height: STICKY_HEADER_HEIGHT,
        justifyContent: 'center',
        alignItems:'center',
        paddingTop:(Platform.OS === 'ios')?20:0
    },
    stickySectionText: {
        color: 'white',
        fontSize: 20,
        margin: 10
    },
    fixedSection: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left:0,
        top:0,
        paddingRight:8,
        flexDirection:'row',
        alignItems:'center',
        paddingTop:(Platform.OS === 'ios')?20:0,
        justifyContent:'space-between'
    },
    fixedSectionText: {
        color: '#999',
        fontSize: 20
    },
    parallaxHeader: {
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column',
        paddingTop: 100
    },
    avatar: {
        marginBottom: 10,
        borderRadius: AVATAR_SIZE / 2
    },
    sectionSpeakerText: {
        color: 'white',
        fontSize: 24,
        paddingVertical: 5
    },
    sectionTitleText: {
        color: 'white',
        fontSize: 16,
        paddingVertical: 5
    }
});