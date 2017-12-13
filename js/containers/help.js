import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    InteractionManager,
    Platform,
    Dimensions,
    PixelRatio,
    ListView,
    TouchableOpacity,
    Button
} from 'react-native';
import Resource from '../../resource/index';
import { connect } from 'react-redux';
import { List, ListItem } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';

var screenWidth = Dimensions.get("window").width;
var screenHeight = Dimensions.get("window").height;

class help extends Component {
    static navigationOptions  = ({ navigation }) => ({
        title: '帮助',
        headerLeft: (
          <TouchableOpacity onPress={() => {
              navigation.goBack();    
          }}
          >
              <Image style={{ width: 30, height: 30,marginLeft:10}}
                  source={Resource.image.ICON_BACK}
              />
          </TouchableOpacity>
      ),
      headerRight: (
        <View style={{height: 30,width: 55,justifyContent: 'center',paddingRight:15} }/>
    ),
    headerTitleStyle:{alignSelf:'center'},
      });
    constructor(props) {
        super(props);
    }

    _renderHeader(section) {
        return (
            <View>
                <List style={styles.list}>
                    <ListItem
                        style={styles.listItem}
                        roundAvatar
                        title={section.title}
                        avatar={Resource.image.ICOM_HELP_IMG}
                        avatarStyle={styles1.avatarStyle}
                        avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                    />
                </List>
            </View>
        );
    }

    _renderContent(section) {
        return (
            <View>
                <ListItem
                    style={styles.listItem}
                    title={section.content}
                    avatar={Resource.image.ICOM_ANSWER_IMG}
                    avatarStyle={styles1.avatarStyle}
                    hideChevron={true}
                    titleNumberOfLines={0}
                    titleStyle={styles1.line}
                    avatarOverlayContainerStyle={styles1.avatarOverlayContainerStyle}
                />
            </View>
        );
    }

    render() {
        const CONTENT = [
            {
                title: '实名认证?',
                content: '如果你无法简洁的表达你的想法，说明你还不够了解它。',
            },
            {
                title: 'D0到账是什么时间到账?',
                content: '如果你无法简洁的表达你的想法，说明你还不够了解它。',
            },
            {
                title: '如何查看分润?',
                content: '如果你无法简洁的表达你的想法，说明你还不够了解它。',
            }
        ];
        return (
            <Accordion
                sections={CONTENT}
                duration={30}
                touchableComponent={TouchableOpacity}
                renderHeader={this._renderHeader}
                renderContent={this._renderContent}
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F4F4F4',
        height: screenHeight,
    },
    list: {
        borderTopWidth: 0,
        marginTop: 19,
        backgroundColor: '#fff'
    },
    listItem: {
        paddingTop: 10,
        paddingBottom: 10,
        borderColor: '#efefef',
        backgroundColor: '#fff',
        flexWrap: 'wrap',
    },
    itemStyle1: {
        backgroundColor: "#FFFFFF",
        marginTop: 1,
        paddingTop: 5,
        paddingBottom: 5,
    },
    contentStyle: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center'
    }
});

const styles1 = StyleSheet.create({
    avatarOverlayContainerStyle: {
        backgroundColor: "#fff",
    },
    avatarStyle: {
        backgroundColor: "#fff",
        borderRadius: 0,
        width: 25,
        height: 25
    },
    line: {
        lineHeight:20        
    }
});

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,

});


export default connect(mapStateToProps)(help);