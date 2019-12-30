import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  Switch,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ScrollView
} from 'react-native';
import Axios from 'axios';
import coin from './assets/icons/coin-black.png';
import audio from './assets/icons/mute.png';
import Tts from 'react-native-tts';
import numberToWords from 'number-to-words';
const ID = '17MC8Gt5AwwAFzr7Awq3c85tV5baZJ--9U2drwnen8W8';

printError = e => console.log(JSON.parse(JSON.stringify(e)));

formatNumber = (number, decimal = 0) => {
  var splitNum;
  number = Math.abs(number);
  number = number.toFixed(decimal);
  splitNum = number.split('.');
  splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return splitNum.join('.');
};

export default class Main extends Component {
  state = {
    rate: [],
    dollar2Lebanese: 1900,
    lebanese2Dollar: 2000,
    money: 0,
    buyDollars: false,
    dateAndTime: ''
  };
  async componentDidMount() {
    let getSheetData;

    try {
      getSheetData = await Axios({
        url: `https://sheets.googleapis.com/v4/spreadsheets/${ID}/values/USD!A1:Z99`,
        method: 'get',
        headers: {
          'cache-control': 'no-cache',
          'Content-Type': 'application/json',
          Connection: 'keep-alive',
          'Accept-Encoding': 'gzip, deflate',
          Host: 'sheets.googleapis.com',
          'Cache-Control': 'no-cache',
          Accept: '*/*'
        },
        params: {
          key: 'AIzaSyCQRhkWG5X6CFP9uHRlpYe3e8NS7hLhhFA'
        }
      });
      if (getSheetData && getSheetData.status === 200) {
        index = 5;
        if (getSheetData.data.values.length > 0)
          if (
            getSheetData.data.values[index][2] == '-' ||
            getSheetData.data.values[index][3] == '-'
          ) {
            index++;
          }
        dollar2Lebanese = parseInt(
          getSheetData.data.values[index][2].replace(/,/g, '')
        );
        lebanese2Dollar = parseInt(
          getSheetData.data.values[index][3].replace(/,/g, '')
        );
        this.setState({
          dollar2Lebanese,
          lebanese2Dollar,
          dateAndTime:
            getSheetData.data.values[index][0] +
            ' ' +
            getSheetData.data.values[index][1],
          rate: getSheetData.data.values[index]
        });
      }
    } catch (e) {
      printError(e);
    }
  }

  render() {
    let calculated = 0;
    if (!this.state.buyDollars) {
      calculated = this.state.money * this.state.dollar2Lebanese;
    } else {
      calculated = this.state.money * this.state.lebanese2Dollar;
    }
    calculatedInNumbers = calculated;
    let money = this.state.money + '';
    money = formatNumber(money, 2);
    dollar2Lebanese = this.state.dollar2Lebanese + '';
    dollar2Lebanese = formatNumber(this.state.dollar2Lebanese);
    lebanese2Dollar = this.state.lebanese2Dollar + '';
    lebanese2Dollar = formatNumber(this.state.lebanese2Dollar);
    calculated = formatNumber(calculated, 0);
    calculatedInWords =
      calculated !== '' &&
      numberToWords.toWords(calculatedInNumbers) + ' Lebanese Liras';
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        <ScrollView contentContainerStyle={{ flex: 1 }}>
          <KeyboardAvoidingView
            keyboardVerticalOffset={0}
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : null}
          >
            <View
              style={{
                flex: 1,
                width: '100%',
                alignItems: 'center',
                backgroundColor: '#FFF',
                justifyContent: 'space-around'
              }}
            >
              <View style={[styles.textView, { flex: 0.5 }]}>
                <Text style={styles.text}>Black Market Dollar</Text>
              </View>
              <View style={[styles.textView, { flex: 0.5 }]}>
                <Text style={styles.text}>
                  {this.state.dateAndTime}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 2, borderWidth: 0.2 }}>
                    <View style={[styles.textView, { borderBottomWidth: 0.2 }]}>
                      <Text style={styles.text}>Sell</Text>
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.text}>
                        {dollar2Lebanese}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[styles.textView, { flex: 1, borderWidth: 0.2 }]}
                  >
                    <Image
                      style={{
                        width: 50,
                        borderRadius: 50 / 2,
                        overflow: 'hidden',
                        height: 50,
                        zIndex: 100
                      }}
                      resizeMode="contain"
                      source={coin}
                    />
                  </View>
                  <View style={{ flex: 2, borderWidth: 0.2 }}>
                    <View style={[styles.textView, { borderBottomWidth: 0.2 }]}>
                      <Text style={styles.text}>Buy</Text>
                    </View>
                    <View style={styles.textView}>
                      <Text style={styles.text}>
                        {lebanese2Dollar}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <View style={[{ flex: 3, borderWidth: 0, width: '100%' }]}>
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 1,
                    minHeight: 30,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <View
                    style={{
                      width: Dimensions.get('window').width,
                      flex: 1,
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      zIndex: 100,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    pointerEvents="none"
                  >
                    <Image
                      style={{
                        width: 35,
                        borderRadius: 35 / 2,
                        overflow: 'hidden',
                        height: 35,
                        zIndex: 100
                      }}
                      resizeMode="contain"
                      source={coin}
                    />
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 20,
                      paddingRight: 0
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ buyDollars: false });
                      }}
                      style={{
                        backgroundColor: this.state.buyDollars
                          ? '#ecf0f1'
                          : '#27ae60',
                        height: 50,
                        maxHeight: 50,
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 0.25,
                        borderEndWidth: 0,
                        borderColor: !this.state.buyDollars
                          ? '#ecf0f1'
                          : '#27ae60',
                        borderTopEndRadius: 0,
                        borderBottomEndRadius: 0,
                        borderRadius: 15
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            fontSize: 20,
                            color: '#e67e22',
                            fontWeight: this.state.buyDollars
                              ? 'normal'
                              : 'bold'
                          }
                        ]}
                      >
                        Sell
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      padding: 20,
                      paddingLeft: 0
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        this.setState({ buyDollars: true });
                      }}
                      style={{
                        backgroundColor: this.state.buyDollars
                          ? '#27ae60'
                          : '#ecf0f1',
                        borderStartWidth: 0,
                        borderColor: this.state.buyDollars
                          ? '#ecf0f1'
                          : '#27ae60',
                        height: 50,
                        maxHeight: 50,
                        flex: 1,
                        borderTopStartRadius: 0,
                        borderBottomStartRadius: 0,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 0.5,
                        borderRadius: 15
                      }}
                    >
                      <Text
                        style={[
                          styles.text,
                          {
                            fontSize: 20,
                            color: '#e67e22',
                            fontWeight: this.state.buyDollars
                              ? 'bold'
                              : 'normal'
                          }
                        ]}
                      >
                        Buy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flex: 1
                  }}
                >
                  <TextInput
                    keyboardType="number-pad"
                    placeholder={'Enter Money Amount'}
                    maxLength={12}
                    value={this.state.money}
                    placeholderTextColor="#576574"
                    onChangeText={money => {
                      if (money.match(/[0-9]*/gm)) {
                        this.setState({
                          money
                          // money: money.replace(/[- #*;,.<>\{\}\[\]\\\/]/gi, '')
                        });
                      } else {
                        this.setState({ money: this.state.money });
                      }
                    }}
                    style={{
                      borderWidth: 0.25,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      height: 40,
                      borderColor: '#576574',
                      width: '90%',
                      color: '#1dd1a1'
                    }}
                  />
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <View
                    style={{
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      flex: 1,
                      width: '80%',
                      borderRightWidth: 1,
                      flexWrap: 'wrap'
                    }}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          fontSize: 20,
                          alignItems: 'center',
                          justifyContent: 'center',
                          alignSelf: 'center'
                        }
                      ]}
                    >
                      {calculated} {'L.L.'}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      height: 35,
                      width: '20%',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                      Tts.speak(calculatedInWords);
                    }}
                  >
                    <Image source={audio} style={{ width: 25, height: 25 }} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.textView, { flex: 2, borderWidth: 0 }]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        fontSize: 14,
                        alignItems: 'center',
                        justifyContent: 'center',
                        alignSelf: 'center',
                        textTransform: 'capitalize'
                      }
                    ]}
                  >
                    {calculatedInWords}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.textView,
                  {
                    height: 50,
                    flex: 0.1,
                    backgroundColor: '#FFF',
                    marginBottom: 10
                  }
                ]}
              >
                <Text
                  style={[styles.text, { fontSize: 14, fontWeight: '300' }]}
                >
                  This data is gathered from LebaneseLira.org
                </Text>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = {
  textView: {
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  text: {
    color: '#34495e',
    fontSize: 30,
    width: '100%',
    textAlign: 'center',
    textAlignVertical: 'center'
  }
};
