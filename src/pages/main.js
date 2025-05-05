import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Main({ navigation, route }) {
    const [userLocation, setUserLocation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                // Verifica se recebeu dados pela navegação
                if (route.params?.user) {
                    setUserLocation(route.params.user);
                    setLoading(false);
                    return;
                }

                // Se não, tenta carregar do AsyncStorage
                const userData = await AsyncStorage.getItem("user");
                if (userData) {
                    setUserLocation(JSON.parse(userData));
                }
                setLoading(false);
            } catch (err) {
                setError("Erro ao carregar dados do usuário");
                setLoading(false);
                console.error(err);
            }
        };

        loadUserData();
    }, [route.params]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3498DB" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (!userLocation || !userLocation.latitude) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>Nenhuma localização cadastrada</Text>
                <Button
                    title="Cadastrar Localização"
                    onPress={() => navigation.navigate("Cadastro")}
                    color="#00d1b2"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            region={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker
            coordinate={{
                latitude: userLocation.latitude,
                longitude: userLocation.longitude,
            }}
            title={userLocation.nome}
            description={`${userLocation.endereco}, ${userLocation.numero} - ${userLocation.cidade}`}
            >
            <View style={styles.markerContainer}>
                <View style={styles.markerBubble}>
                <Text style={styles.markerText}>
                    {userLocation.nome}
                </Text>
                </View>
                <View style={styles.markerArrow} />
            </View>
            </Marker>
          </MapView>
          <View style={styles.buttonContainer}>
            <Button
              title="Cadastrar Novo Usuário"
              onPress={() => navigation.navigate("Cadastro")}
              color="#00d1b2"
            />
          </View>
        </View>
      );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        fontSize: 16,
        color: "black",
        textAlign: "center",
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
    },
    buttonContainer: {
        padding: 10,
        backgroundColor: "#fff",
    },
    markerContainer: {
        alignItems: 'center',
      },
      markerBubble: {
        backgroundColor: '#9a0526',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#fff',
      },
      markerText: {
        color: '#fff',
        fontWeight: 'bold',
      },
      markerArrow: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 5,
        borderRightWidth: 5,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#9a0526',
        transform: [{ rotate: '180deg' }],
        marginTop: -2,
      },
    });
