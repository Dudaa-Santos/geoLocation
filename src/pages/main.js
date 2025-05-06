import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    Button,
    FlatList,
    TouchableOpacity,
    Alert,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Main({ navigation, route }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [showUserList, setShowUserList] = useState(false);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                if (route.params?.users) {
                    setUsers(route.params.users);
                    setLoading(false);
                    return;
                }

                const storedUsers = await AsyncStorage.getItem("users");
                if (storedUsers) {
                    setUsers(JSON.parse(storedUsers));
                }
                setLoading(false);
            } catch (err) {
                setError("Erro ao carregar dados dos usuários");
                setLoading(false);
                console.error(err);
            }
        };

        loadUserData();
    }, [route.params]);

    const deleteUser = (index) => {
        Alert.alert(
            "Confirmar exclusão",
            "Tem certeza que deseja excluir este usuário?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Excluir",
                    style: "destructive",
                    onPress: async () => {
                        const updatedUsers = [...users];
                        updatedUsers.splice(index, 1);
                        setUsers(updatedUsers);
                        await AsyncStorage.setItem("users", JSON.stringify(updatedUsers));
                    },
                },
            ]
        );
    };

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

    if (!users.length) {
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
                region={{
                    latitude: selectedLocation?.latitude || users[0].latitude,
                    longitude: selectedLocation?.longitude || users[0].longitude,
                    latitudeDelta: 0.1,
                    longitudeDelta: 0.1,
                }}
            >
                {users.map((user, index) => (
                    <Marker
                        key={index}
                        coordinate={{
                            latitude: user.latitude,
                            longitude: user.longitude,
                        }}
                        title={user.nome}
                        description={`${user.endereco}, ${user.numero} - ${user.cidade}`}
                    />
                ))}
            </MapView>

            <View style={styles.buttonContainer}>
                <Button
                    title="Cadastrar Novo Usuário"
                    onPress={() => navigation.navigate("Cadastro")}
                    color="#00d1b2"
                />
                <View style={{ marginTop: 10 }}>
                    <Button
                        title={showUserList ? "Ocultar Lista de Usuários" : "Ver Lista de Usuários"}
                        onPress={() => setShowUserList(!showUserList)}
                        color="#007aff"
                    />
                </View>
            </View>

            {showUserList && (
                <View style={styles.userListContainer}>
                    <FlatList
                        data={users}
                        keyExtractor={(_, index) => index.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.userItemRow}>
                                <TouchableOpacity
                                    style={styles.userItem}
                                    onPress={() => {
                                        setSelectedLocation({
                                            latitude: item.latitude,
                                            longitude: item.longitude,
                                        });
                                        setShowUserList(false);
                                    }}
                                >
                                    <Text style={styles.userText}>{item.nome}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => deleteUser(index)}
                                    style={styles.deleteButton}
                                >
                                    <Text style={styles.deleteText}>Excluir</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    />
                </View>
            )}
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
    userListContainer: {
        maxHeight: 200,
        backgroundColor: "#fff",
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderColor: "#ccc",
    },
    userItemRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
        paddingVertical: 10,
    },
    userItem: {
        flex: 1,
    },
    userText: {
        fontSize: 16,
        color: "#333",
    },
    deleteButton: {
        marginLeft: 10,
        paddingVertical: 4,
        paddingHorizontal: 8,
        backgroundColor: "#ff3b30",
        borderRadius: 4,
    },
    deleteText: {
        color: "white",
        fontSize: 14,
    },
});
