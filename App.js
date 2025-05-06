import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import Routes from './src/routes';

 function App() {
  return (
    <>
      <StatusBar style="auto" />
      <View style={styles.container}>
        <Routes/>
      </View>
    </>
  );
}
export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
