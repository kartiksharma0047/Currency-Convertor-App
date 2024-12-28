import React, { useEffect, useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  View,
  Text,
  Button,
  ActivityIndicator,
  Alert
} from 'react-native';
import { fetchCurrencyLatest, convertCurrencyAPI } from './api';

const App = () => {
  const [currencyList, setCurrencyList] = useState([]);
  const [open, setOpen] = useState(false);
  const [targetOpen, setTargetOpen] = useState(false);
  const [sourceAmount, setSourceAmount] = useState("");
  const [sourceCurrency, setSourceCurrency] = useState(null);
  const [targetAmount, setTargetAmount] = useState("");
  const [targetCurrency, setTargetCurrency] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCurrencyLatest()
      .then(list => setCurrencyList(list))
  }, [])

  const convertCurrency = (amount, sourceCurrency, targetCurrency) => {
    if (!amount || !sourceCurrency || !targetCurrency) {
      Alert.alert("Error", "All fields are required except the output field.");
      return;
    }

    if (sourceCurrency === targetCurrency) {
      setTargetAmount(amount);
      return;
    }

    setLoading(true);
    convertCurrencyAPI(amount, sourceCurrency, targetCurrency)
      .then(data => {
        const { rates } = data;
        setTargetAmount(String(rates[targetCurrency]));
        setLoading(false);
      })
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.mainContainer}>
          <View style={[styles.inputContainer, { zIndex: 2 }]}>
            <Text style={styles.label}>Source Amount</Text>
            <TextInput
              style={styles.textInput}
              keyboardType="numeric"
              onChangeText={value => setSourceAmount(value)}
              value={sourceAmount}
            />
            <Text style={styles.label}>Select Source Currency</Text>
            <DropDownPicker
              style={styles.dropdown}
              open={open}
              value={sourceCurrency}
              items={currencyList.map(currency => ({
                label: currency,
                value: currency,
              }))}
              setOpen={setOpen}
              setValue={setSourceCurrency}
              placeholder="Select a currency"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>
          <View style={[styles.inputContainer, { zIndex: 1 }]}>
            <Text style={styles.label}>Target Amount</Text>
            <TextInput
              style={styles.textInput}
              editable={false}
              value={targetAmount}
            />
            <Text style={styles.label}>Select Target Currency</Text>
            <DropDownPicker
              style={styles.dropdown}
              open={targetOpen}
              value={targetCurrency}
              items={currencyList.map(currency => ({
                label: currency,
                value: currency,
              }))}
              setOpen={setTargetOpen}
              setValue={setTargetCurrency}
              placeholder="Select a currency"
              zIndex={2000}
              zIndexInverse={1000}
            />
          </View>
          <View style={styles.buttonContainer}>
            {
              loading
                ? <ActivityIndicator color="#000000" size="large" />
                : <Button onPress={() => convertCurrency(sourceAmount, sourceCurrency, targetCurrency)} title="Convert" />
            }
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#e0f7fa', // Light cyan background color
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainContainer: {
    padding: 20,
    width: '90%',
    backgroundColor: "#ffffff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold',
  },
  textInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  dropdown: {
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default App;