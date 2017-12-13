/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Navigator,
    TextInput,
    Alert,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    Image,
    TouchableHighlight
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import ModalDropdown from 'react-native-modal-dropdown';
import { user, card } from '../actions';
import Service from '../common/service';
import Session from '../common/session';
import Restful from '../api/restful';
import { User } from '../api';
import Toast, { DURATION } from 'react-native-easy-toast';
import Resource from '../../resource';
import config from '../config';
//var ImagePicker = require('react-native-image-picker');
import Spinner from '../components/spinner';
import { NavigationActions } from 'react-navigation'
import ImagePicker from 'react-native-image-picker';

import ImageResizer from 'react-native-image-resizer';
import AnalyticsUtil from '../utils/AnalyticsUtil';


const imagePickerOptions = {
    title: '选择图片',
    cancelButtonTitle: '取消',
    takePhotoButtonTitle: '拍照一张',
    chooseFromLibraryButtonTitle: '从相册选取',
    quality: 0.4,
    storageOptions: {
        skipBackup: true,
        quality: 0.3,
        path: 'images'
    }
};

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height

const IMG_FRONT = 1;
const IMG_BACK = 2;
const IMG_HAND = 3;


class UploadIdcard extends Component {

    static navigationOptions = ({ navigation }) => ({
        title: '上传身份证',
        headerLeft: (
            <TouchableOpacity onPress={() => {
                navigation.goBack();
            }}
            >
                <Image style={{ width: 30, height: 30, marginLeft: 10 }}
                    source={Resource.image.ICON_BACK}
                />
            </TouchableOpacity>
        ),
        headerRight: (
            <View style={{ height: 30, width: 55, justifyContent: 'center', paddingRight: 15 }} />
        ),
        headerTitleStyle: { alignSelf: 'center' },
    });

    constructor(props) {
        super(props);
        this.state = {
            frontPicture: null,
            backPicture: null,
            inHandPicture: null,
            resizeUri: ''
        }
    }

    componentDidMount() {

    }

    getFileObject(imageSource) {

        ImageResizer.createResizedImage(imageSource.uri, 400, 300, 'PNG', 80)
            .then((reponse) => {
                var index = reponse.uri.lastIndexOf("\/");
                var name = reponse.uri.substring(index + 1, reponse.uri.length);
                let file = { uri: reponse.uri, type: 'multipart/form-data', name: name };

                return file;
            }).catch((err) => {
            });
    }

    confirm() {

        const that = this;

        if (!this.state.frontPicture
            || !this.state.backPicture
            || !this.state.inHandPicture) {
            this.refs.toast.show('请选择图片');
            return;
        }

        const { navigate } = this.props.navigation;

        let formData = new FormData();
        let formData1 = new FormData();
        let formData2 = new FormData();
        let formData3 = new FormData();
        ImageResizer.createResizedImage(this.state.frontPicture.uri, 640, 480, 'PNG', 90)
            .then((reponse) => {
                var index = reponse.uri.lastIndexOf("\/");
                var name = reponse.uri.substring(index + 1, reponse.uri.length);
                let file = { uri: reponse.uri, type: 'multipart/form-data', name: name };
                formData1.append('frontPicture', file);

            });

        ImageResizer.createResizedImage(this.state.backPicture.uri, 640, 480, 'PNG', 90)
            .then((reponse) => {
                var index = reponse.uri.lastIndexOf("\/");
                var name = reponse.uri.substring(index + 1, reponse.uri.length);
                let file = { uri: reponse.uri, type: 'multipart/form-data', name: name };
                formData2.append('backPicture', file);

            });

        ImageResizer.createResizedImage(this.state.inHandPicture.uri, 640, 480, 'PNG', 90)
            .then((reponse) => {
                var index = reponse.uri.lastIndexOf("\/");
                var name = reponse.uri.substring(index + 1, reponse.uri.length);
                let file = { uri: reponse.uri, type: 'multipart/form-data', name: name };
                formData3.append('inHandPicture', file);

            });

        const url = config.serverURL + '/certificates/upload/identification';
        that.refs.spinner.loading();

        var timer = setInterval(function () {
            var bl = true;
            if (formData1._parts && formData1._parts.length == 0) {
                bl = false;
            }
            if (formData2._parts && formData2._parts.length == 0) {
                bl = false;
            }
            if (formData3._parts && formData3._parts.length == 0) {
                bl = false;
            }
            if (bl) {

                var arr1 = formData1._parts[0];
                var arr2 = formData2._parts[0];
                var arr3 = formData3._parts[0];
                if (arr1.length > 1) {
                    formData.append(arr1[0], arr1[1]);
                }
                if (arr2.length > 1) {
                    formData.append(arr2[0], arr2[1]);
                }
                if (arr3.length > 1) {
                    formData.append(arr3[0], arr3[1]);
                }
                Restful.upload(url, formData).then((res) => {
                        Service.getUserInfo();
                        that.refs.spinner.done();
                        that.refs.toast.show("上传成功");
                        setTimeout(() => {
                        const resetAction = NavigationActions.reset({
                            index: 0,
                            actions: [
                                NavigationActions.navigate({ routeName: 'TabBar' }),
                            ]
                        });
                        that.props.navigation.dispatch(resetAction);
                        }, 1500);
                    }, (err) => {
                        that.refs.spinner.done();
                        that.refs.toast.show(err);
                    });
                window.clearInterval(timer);
            }
        }, 100);

    }

    /**
     * 打开选择图片
     * @param {*} type 
     */
    launchImageLibrary(type) {
        ImagePicker.showImagePicker(imagePickerOptions, (response) => {

            if (response.didCancel) {
            } else if (response.error) {
            } else if (response.customButton) {
            } else {
                let source = { uri: response.uri };
                if (type === IMG_FRONT) {
                    this.setState({ frontPicture: source });
                } else if (type === IMG_BACK) {
                    this.setState({ backPicture: source });
                } else if (type === IMG_HAND) {
                    this.setState({ inHandPicture: source });
                }
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Spinner ref="spinner" />
                <Toast ref="toast" position='top' opacity={0.8} />
                <View style={styles.form}>

                    <View style={styles.legend}>
                        <Text style={styles.legendLabel}>上传身份证照片</Text>
                    </View>

                    <View style={styles.pickImgGroup}>
                        <View style={styles.pickItem}>
                            <TouchableHighlight onPress={() => this.launchImageLibrary(IMG_FRONT)}>
                                <View style={styles.pickImgContainer}>
                                    <Image style={styles.pickImg} source={this.state.frontPicture || Resource.image.ICOM_ADD_IMG} />
                                </View>
                            </TouchableHighlight>
                            <Text style={styles.textMuted}>身份证正面照</Text>
                        </View>

                        <View style={styles.pickItem}>
                            <TouchableHighlight onPress={() => this.launchImageLibrary(IMG_BACK)}>
                                <View style={styles.pickImgContainer}>
                                    <Image style={styles.pickImg} source={this.state.backPicture || Resource.image.ICOM_ADD_IMG} />
                                </View>
                            </TouchableHighlight>
                            <Text style={styles.textMuted}>身份证反面照</Text>
                        </View>

                        <View style={styles.pickItem}>
                            <TouchableHighlight onPress={() => this.launchImageLibrary(IMG_HAND)}>
                                <View style={styles.pickImgContainer}>
                                    <Image style={styles.pickImg} source={this.state.inHandPicture || Resource.image.ICOM_ADD_IMG} />
                                </View>
                            </TouchableHighlight>
                            <Text style={styles.textMuted}>手持身份证照</Text>
                        </View>
                    </View>

                    <Button
                        title='确认上传'
                        color="#fff"
                        backgroundColor="#0076ff"
                        borderRadius={4}
                        containerViewStyle={{ marginTop: 20, marginLeft: 20, marginRight: 20 }}
                        onPress={() => this.confirm()}
                    />

                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        backgroundColor: 'white',
        height: screenHeight
    },
    legend: {
        paddingTop: 15,
        paddingBottom: 15,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#efefef'
    },
    legendLabel: {
        color: '#666',
        fontSize: 16,
    },
    pickImgGroup: {
        //flex: 1,
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'stretch',
        paddingTop: 20,
        paddingBottom: 20,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: '#fff',
    },
    pickItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickImgContainer: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor: '#efefef',
        padding: 2,
        alignItems: 'center',
        justifyContent: 'center'
    },
    pickImg: {
        width: 65,
        height: 65,
    },
    textMuted: {
        color: '#999',
        fontSize: 12,
        paddingTop: 5,
        paddingBottom: 5,
    }
})

const mapStateToProps = state => ({

});

const mapDispatchToProps = dispatch => ({
    dispatch: dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(UploadIdcard);
