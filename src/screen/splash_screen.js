import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function SplashScreen({ navigation }) {
useEffect(() => {
const timer = setTimeout(() => {
navigation.replace('Login');
}, 2000);
return () => clearTimeout(timer);
}, [navigation]);
return (
<View style={styles.container}>
<Text style={styles.logo}>MEU APP</Text>
<Text style={styles.subtitle}>Bem-vindo!</Text>
</View>
);
}
const styles = StyleSheet.create({
container: {
flex: 1,
justifyContent: 'center',
alignItems: 'center',
backgroundColor: '#ffffff',
},
logo: {
fontSize: 32,
fontWeight: 'bold',
},
subtitle: {
marginTop: 10,
fontSize: 16,
},
});