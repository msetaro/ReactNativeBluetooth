import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Typography, Button, List } from 'antd'
import useBle from './Hooks/useBle';

export default function App() {

  const {
    requestPermissions,
    scanForDevices,
    foundDevices
  } = useBle();

  return (
    <SafeAreaView style={styles.container}>
      <Typography>testing</Typography>
      <Button title='Start scanning' onClick={scanForDevices}></Button>
      <List dataSource={foundDevices}></List>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
