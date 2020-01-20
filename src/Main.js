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
  Linking,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  NativeModules,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import Axios from 'axios';
import coin from './assets/icons/coin-black.png';
import audio from './assets/icons/audio-speaker-on.png';
import Tts from 'react-native-tts';
import numberToWords from 'number-to-words';
import moment from 'moment';
import 'moment/locale/fr';
import 'moment/locale/ar';
var left = 'left';
var right = 'right';
var arabicNumbers = '٠١٢٣٤٥٦٧٨٩';
var arabicMap = arabicNumbers.split('');
let locale = '';
let isiPhone = Platform.OS === 'ios';
locale = isiPhone
  ? NativeModules.SettingsManager.settings.AppleLocale
  : NativeModules.I18nManager.localeIdentifier; // "fr_FR"
if (locale === undefined) {
  // iOS 13 workaround, take first of AppleLanguages array  ["en", "en-NZ"]
  locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
  if (locale == undefined) {
    locale = 'en'; // default language
  }
}
if (isiPhone && locale.includes('ar')) {
  left = 'right';
  right = 'left';
}
console.log(locale);

const ID = '17MC8Gt5AwwAFzr7Awq3c85tV5baZJ--9U2drwnen8W8';

printError = e => console.log(JSON.parse(JSON.stringify(e)));
convertToArabic = number => number.replace(/\d/g, m => arabicMap[parseInt(m)]);
arabicDesc = [
  'مرحبًا بك في تطبيق ثورة دولار',
  '!معرفة مقدار دولار تستحق اليوم',
  'LebaneseLira.org يتم جمع هذه البيانات من'
];
englishDesc = [
  'Welcome to Thawra Dollar app.',
  'Find out how much dollars are worth today!',
  'This Data is gathered from LebaneseLira.org'
];
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
    dollar2Lebanese: '',
    lebanese2Dollar: '',
    money: 0,
    keyboardDidShow: false,
    buyDollars: false,
    dateAndTime: '',
    loading: true
  };
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.keyboardWillHideListener.remove();
    this.keyboardWillShowListener.remove();
    clearInterval(this.interval);
    this.interval = null;
  }

  _keyboardDidShow() {
    this.setState({ keyboardDidShow: true });
  }

  _keyboardDidHide() {
    this.setState({ keyboardDidShow: false });
  }
  async componentDidMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => this._keyboardDidShow()
    );
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => this._keyboardDidHide()
    );
    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardWillShow',
      () => this._keyboardDidShow()
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardWillHide',
      () => this._keyboardDidHide()
    );
    this.getRate();
    this.interval = setInterval(this.getRate, 60 * 1000);
  }
  getRate = async () => {
    let getSheetData;
    let isArabic = locale && locale.includes('ar');
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
          while (
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
        dateAndTime = `${getSheetData.data.values[index][0]} ${getSheetData.data
          .values[index][1]}`;
        if (isArabic) {
          moment.locale('ar');
          dateAndTimesss = moment(dateAndTime, 'dd, MMM D, YYYY HH:mm');
          dateAndTime = moment(new Date(dateAndTime)).format(
            'ddd MMM D YYYY HH:mm'
          );
        }
        this.setState({
          dollar2Lebanese,
          lebanese2Dollar,
          dateAndTime,
          rate: getSheetData.data.values[index],
          loading: false
        });
      }
    } catch (e) {
      printError(e);
    }
  };
  render() {
    let isArabic = locale && locale.includes('ar');
    let { keyboardDidShow } = this.state;
    let calculated = 0;
    let dayName = null,
      dayDate = null,
      monthName = null,
      year = null,
      dateAndTimeSplitted = null,
      time = null;
    let money = (this.state.money + '').replace(/,/g, '');
    if (!this.state.buyDollars) {
      calculated = money * this.state.dollar2Lebanese;
    } else {
      calculated = money * this.state.lebanese2Dollar;
    }
    calculatedInNumbers = calculated;
    money = formatNumber(money, 2);
    dollar2Lebanese = this.state.dollar2Lebanese + '';
    dollar2Lebanese = formatNumber(this.state.dollar2Lebanese);
    lebanese2Dollar = this.state.lebanese2Dollar + '';
    lebanese2Dollar = formatNumber(this.state.lebanese2Dollar);
    calculated = formatNumber(calculated, 0);
    calculatedInWords =
      calculated !== '' &&
      numberToWords.toWords(calculatedInNumbers) + ' Lebanese Liras';
    if (this.state.dateAndTime !== '') {
      dateAndTimeSplitted = this.state.dateAndTime.replace(',', '').split(' ');
      if (isArabic) dateAndTimeSplitted = dateAndTimeSplitted.reverse();
      dayName = dateAndTimeSplitted.length >= 1 && dateAndTimeSplitted[0];
      dayDate = dateAndTimeSplitted.length >= 3 && dateAndTimeSplitted[2];
      if (dayDate) {
        dayDate = dayDate.replace(',', '');
      }
      monthName = dateAndTimeSplitted.length >= 2 && dateAndTimeSplitted[1];
      year = dateAndTimeSplitted.length >= 4 && dateAndTimeSplitted[3];
      time = dateAndTimeSplitted.length >= 5 && dateAndTimeSplitted[4];
    }
    let calculatedNumber = calculated + 'L.L.';
    if (isArabic) {
      calculatedNumber = ' ل.ل.' + convertToArabic(calculated);
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
        {!this.state.loading &&
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <View style={{ flex: 1, width: '80%' }}>
              {!keyboardDidShow &&
                <View style={{ flex: 0.3 }}>
                  <View
                    style={{
                      flex: 0.5,
                      width: '100%',
                      alignItems: 'center',
                      backgroundColor: '#FFF',
                      justifyContent: 'center'
                    }}
                  >
                    <View
                      style={[
                        styles.textView,
                        {
                          borderBottomWidth: 0.5,
                          borderColor: '#DBDBDB',
                          alignItems: 'flex-start'
                        }
                      ]}
                    >
                      <Text
                        style={
                          (
                            styles.text,
                            {
                              textAlign: left,
                              width: '100%',

                              fontWeight: '700',
                              color: '#4968C0',
                              fontSize: 21
                            }
                          )
                        }
                      >
                        {isArabic ? 'ثورة دولار' : 'Thawra Dollar'}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={[
                      styles.textView,
                      {
                        flex: 1,
                        borderBottomWidth: 0.5,
                        borderColor: '#DBDBDB',
                        alignItems: 'flex-start'
                      }
                    ]}
                  >
                    <Text
                      style={[
                        styles.text,
                        {
                          width: '100%',
                          textAlign: left,
                          color: '#949494',
                          fontSize: 14
                        }
                      ]}
                    >
                      {isArabic ? arabicDesc[0] : englishDesc[0]}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          width: '100%',
                          textAlign: left,
                          color: '#949494',
                          fontSize: 14
                        }
                      ]}
                    >
                      {isArabic ? arabicDesc[1] : englishDesc[1]}
                    </Text>
                    <Text
                      style={[
                        styles.text,
                        {
                          width: '100%',
                          textAlign: left,
                          color: '#949494',
                          fontSize: 14
                        }
                      ]}
                    >
                      {isArabic
                        ? arabicDesc[2].replace('LebaneseLira.org', ' ')
                        : englishDesc[2].replace('LebaneseLira.org', ' ')}
                      <Text
                        accessibilityRole="link"
                        onPress={() =>
                          Linking.openURL('http://lebaneselira.org')}
                        style={[
                          styles.text,
                          {
                            textAlign: left,
                            color: 'blue',
                            fontSize: 14
                          }
                        ]}
                      >
                        {' '}LebaneseLira.org
                      </Text>
                    </Text>
                  </View>
                </View>}
              <KeyboardAvoidingView
                keyboardVerticalOffset={0}
                style={{ flex: 1, width: '100%' }}
                behavior={isiPhone ? 'padding' : null}
              >
                <View style={[styles.textView, { height: 40, flex: null }]}>
                  <Text
                    style={[
                      styles.text,
                      {
                        color: '#949494',
                        fontSize: 14,
                        textAlign: left
                      }
                    ]}
                  >
                    {isArabic ? 'التاريخ' : 'Date'}
                  </Text>
                </View>
                <View
                  style={[
                    styles.textView,
                    {
                      flex: 0.5,
                      flexDirection: isArabic ? 'row-reverse' : 'row',
                      borderRadius: 8,
                      backgroundColor: '#ECEEF2',
                      height: 50,
                      marginBottom: 15,
                      paddingVertical: 5
                    }
                  ]}
                >
                  <View style={styles.dateBox}>
                    <Text style={[styles.text, styles.dateBoxText]}>
                      {dayName && dayName}
                    </Text>
                  </View>
                  <View style={styles.dateBox}>
                    <Text style={[styles.text, styles.dateBoxText]}>
                      {dayDate && dayDate}
                    </Text>
                  </View>
                  <View style={styles.dateBox}>
                    <Text style={[styles.text, styles.dateBoxText]}>
                      {monthName && monthName}
                    </Text>
                  </View>
                  <View style={styles.dateBox}>
                    <Text style={[styles.text, styles.dateBoxText]}>
                      {time && time}
                    </Text>
                  </View>
                  <View style={[styles.dateBox, { borderEndWidth: 0 }]}>
                    <Text style={[styles.text, styles.dateBoxText]}>
                      {year && year}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flex: 0.8,
                    minHeight: 120,
                    height: 120,
                    maxHeight: 120,
                    flexDirection: 'row'
                  }}
                >
                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ buyDollars: false });
                    }}
                    style={[
                      styles.priceBox,
                      { marginEnd: 5 },
                      !this.state.buyDollars && {
                        backgroundColor: '#4968C0'
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.textView,
                        styles.priceTitleBox,
                        this.state.buyDollars && { borderColor: '#A5A5A5' }
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          styles.priceTitle,
                          !this.state.buyDollars && { color: '#FFF' }
                        ]}
                      >
                        {isArabic ? 'بيع' : 'Sell'}
                      </Text>
                    </View>
                    <View style={styles.textView}>
                      <Text
                        style={[
                          styles.text,
                          styles.priceText,
                          !this.state.buyDollars && { color: '#FFFFFF' }
                        ]}
                      >
                        {dollar2Lebanese}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => {
                      this.setState({ buyDollars: true });
                    }}
                    style={[
                      styles.priceBox,
                      { marginStart: 5 },
                      this.state.buyDollars && {
                        backgroundColor: '#4968C0'
                      }
                    ]}
                  >
                    <View
                      style={[
                        styles.textView,
                        styles.priceTitleBox,
                        !this.state.buyDollars && { borderColor: '#A5A5A5' }
                      ]}
                    >
                      <Text
                        style={[
                          styles.text,
                          styles.priceTitle,
                          this.state.buyDollars && { color: '#FFF' }
                        ]}
                      >
                        {isArabic ? 'شراء' : 'Buy'}
                      </Text>
                    </View>
                    <View style={styles.textView}>
                      <Text
                        style={[
                          styles.text,
                          styles.priceText,
                          this.state.buyDollars && { color: '#FFFFFF' }
                        ]}
                      >
                        {lebanese2Dollar}
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    {
                      flex: 2,
                      width: '100%',
                      marginTop: 20
                    }
                  ]}
                >
                  <View
                    style={{
                      height: 1,
                      width: '100%',
                      backgroundColor: '#CCCCCC',
                      marginBottom: 20
                    }}
                  />
                  <View
                    style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      flex: 1
                    }}
                  >
                    <TextInput
                      contextMenuHidden={true}
                      keyboardType="number-pad"
                      placeholder={'Enter Money Amount'}
                      maxLength={12}
                      value={this.state.money + ''}
                      placeholderTextColor="#848FAD"
                      onChangeText={money => {
                        if (/^\d+$/.test(money) || money === '') {
                          this.setState({
                            money
                          });
                        }
                      }}
                      style={{
                        borderRadius: 8,
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                        height: 60,
                        backgroundColor: '#ECECEC',
                        width: '100%',
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#4968C0'
                      }}
                    />
                  </View>
                  <View
                    style={[
                      styles.textView,
                      { flex: 2, justifyContent: 'space-around' }
                    ]}
                  >
                    {!keyboardDidShow &&
                      <View style={[styles.textView, { flex: 1 }]}>
                        <Text
                          style={[
                            styles.text,
                            {
                              fontSize: 14,
                              color: '#949494',
                              alignItems: 'center',
                              justifyContent: 'center',
                              alignSelf: 'center',
                              textTransform: 'capitalize'
                            }
                          ]}
                        >
                          {calculatedInWords}
                        </Text>
                      </View>}
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                      <View
                        style={{
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                          flex: 1,
                          borderRadius: 8,
                          padding: 10,
                          backgroundColor: '#ECECEC',
                          marginEnd: 5,
                          width: '100%',
                          height: 60,
                          padding: 5,
                          paddingHorizontal: 0
                        }}
                      >
                        <Text
                          style={[
                            styles.text,
                            {
                              fontSize: 18,
                              color: '#040404',
                              fontWeight: '600',
                              alignItems: 'center',
                              justifyContent: 'center',
                              alignSelf: 'center'
                            }
                          ]}
                        >
                          {calculatedNumber}
                        </Text>
                      </View>
                      <TouchableOpacity
                        style={{
                          height: 60,
                          width: 68,
                          backgroundColor: '#ECECEC',
                          borderRadius: 8,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        activeOpacity={0.8}
                        onPress={() => {
                          Tts.speak(calculatedInWords);
                        }}
                      >
                        <Image
                          source={audio}
                          style={{ width: 25, height: 25 }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
            </View>
          </ScrollView>}
        {this.state.loading &&
          <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <ActivityIndicator />
          </View>}
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
  },
  dateBox: {
    borderColor: '#DBDBDB',
    flex: 1,
    borderEndWidth: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  dateBoxText: {
    color: '#040404',
    fontSize: 14,
    lineHeight: 30,
    height: 30,
    textAlign: 'center'
  },
  priceText: {
    fontWeight: '300',
    fontSize: 25
  },
  priceBox: {
    flex: 2,
    height: 120,
    borderRadius: 8,
    backgroundColor: '#ECEEF2',
    alignItems: 'center',
    justifyContent: 'center'
  },
  priceTitle: {
    color: '#4968C0',
    fontSize: 25,
    fontWeight: '700'
  },
  priceTitleBox: {
    borderBottomWidth: 1,
    borderColor: '#FFF',

    width: '70%'
  }
};
