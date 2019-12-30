/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import codePush from 'react-native-code-push';
import React, { Fragment } from 'react';
import { StatusBar } from 'react-native';

import Main from './src/Main';

let App = () => {
  return (
    <Fragment>
      <StatusBar barStyle="light-content" />
      <Main />
    </Fragment>
  );
};
App = codePush({
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME,
  installMode: codePush.InstallMode.IMMEDIATE
})(App);

export default App;
