import React, { Component } from "react";
import {
    View,
    TextInput,
    TouchableOpacity,
    Text,
    StyleSheet,
    Alert,
    ActivityIndicator
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from 'expo-location';

export default class Cadastro extends Component {
    state = {
        nome: "",
        estado: "",
        cidade: "",
        endereco: "",
        numero: "",
        loading: false
    };
  
    handleCadastro = async () => {
        const { nome, estado, cidade, endereco, numero } = this.state;
        
        if (!nome || !estado || !cidade || !endereco || !numero) {
            Alert.alert("Atenção", "Preencha todos os campos!");
            return;
        }

        this.setState({ loading: true });

        try {
            const enderecoCompleto = `${endereco}, ${numero}, ${cidade}`;
            
            const locations = await Location.geocodeAsync(enderecoCompleto);
            
            if (locations.length === 0) {
                Alert.alert("Erro", "Não foi possível encontrar a localização do endereço informado.");
                return;
            }

            const { latitude, longitude } = locations[0];

            const user = {
                nome,
                estado,
                cidade,
                endereco,
                numero,
                latitude,
                longitude
            };

            await AsyncStorage.setItem("user", JSON.stringify(user));
            this.props.navigation.navigate("Main", { user });
        } catch (error) {
            Alert.alert("Erro", "Ocorreu um erro ao processar o endereço.");
            console.error(error);
        } finally {
            this.setState({ loading: false });
        }
    };
  
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>CADASTRO</Text>
                
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome"
                        placeholderTextColor="#000"
                        value={this.state.nome}
                        onChangeText={(nome) => this.setState({ nome })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Estado"
                        placeholderTextColor="#000"
                        value={this.state.estado}
                        onChangeText={(estado) => this.setState({ estado })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Cidade"
                        placeholderTextColor="#000"
                        value={this.state.cidade}
                        onChangeText={(cidade) => this.setState({ cidade })}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Endereço"
                        placeholderTextColor="#000"
                        value={this.state.endereco}
                        onChangeText={(endereco) => this.setState({ endereco })}
                    />
                </View>

                <View style={styles.inputContainer}>    
                    <TextInput
                        style={styles.input}
                        placeholder="Número"
                        placeholderTextColor="#000"
                        value={this.state.numero}
                        onChangeText={(numero) => this.setState({ numero })}
                        keyboardType="number-pad"
                    />
                </View>

                <TouchableOpacity 
                    style={styles.button} 
                    onPress={this.handleCadastro}
                    disabled={this.state.loading}
                >
                    {this.state.loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>CADASTRAR</Text>
                    )}
                </TouchableOpacity>
            </View>
        );
    }
}
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#d9d9d9", 
      paddingHorizontal: 20,
    },
    title: {
      color: "#000",
      fontSize: 28,
      fontWeight: "bold",
      marginBottom: 40,
      textAlign: "center",
    },
    inputContainer: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      width: "80%",
      backgroundColor: "#fff", 
      borderRadius: 5, 
      paddingHorizontal: 10,
      paddingVertical: 5,
    },
    input: {
      flex: 1,
      color: "#000",
      fontSize: 16,
      paddingLeft: 15, 
    },
    icon: {
      position: "absolute",
      left: 10,
      zIndex: 1,
      color: "#00d1b2", 
    },
    button: {
      borderWidth: 1,
      borderColor: "#00d1b2",
      backgroundColor: "#00d1b2", 
      borderRadius: 10, 
      paddingVertical: 12, 
      paddingHorizontal: 20, 
      width: "60%", 
      alignItems: "center",
      marginVertical: 10,
      shadowColor: "#00d1b2",
      shadowOpacity: 0.4,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 2 },
    },
    buttonText: {
      color: "#fff", 
      fontWeight: "bold",
      fontSize: 16,
    },
  });
  