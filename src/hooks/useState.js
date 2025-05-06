import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export function useState(initialValue = []) {
    const [state, setState] = useState(initialValue);

    // Carregar o estado inicial do AsyncStorage
    useEffect(() => {
        const loadState = async () => {
            try {
                const storedState = await AsyncStorage.getItem("state");
                if (storedState) {
                    setState(JSON.parse(storedState));
                }
            } catch (error) {
                console.error("Erro ao carregar estado:", error);
            }
        };

        loadState();
    }, []);

    // Salvar o estado no AsyncStorage sempre que ele mudar
    useEffect(() => {
        const saveState = async () => {
            try {
                await AsyncStorage.setItem("state", JSON.stringify(state));
            } catch (error) {
                console.error("Erro ao salvar estado:", error);
            }
        };

        saveState();
    }, [state]);

    return [state, setState];
}
