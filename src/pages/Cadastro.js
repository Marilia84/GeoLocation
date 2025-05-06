import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import { useRoute } from "@react-navigation/native";

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const validar = () => {
    if (!nome || !rua || !numero || !cidade || !estado) {
      alert("Preencha todos os campos!");
      return false;
    }
    return true;
  };

  const route = useRoute();
  const { onCadastrarUsuario } = route.params ?? {};
  
  const handleCadastro = async () => {
    if (!validar()) return;
  
    const enderecoCompleto = `${rua}, ${numero}, ${cidade}, ${estado}`;
  
    try {
      const geocode = await Location.geocodeAsync(enderecoCompleto);
  
      if (geocode.length === 0) {
        Alert.alert("Erro", "Endereço não encontrado.");
        return;
      }
  
      const { latitude, longitude } = geocode[0];
  
      const novoUsuario = {
        nome,
        endereco: enderecoCompleto,
        latitude,
        longitude,
      };
  
      // Envia o novo usuário para Main
      if (onCadastrarUsuario) {
        onCadastrarUsuario(novoUsuario);
      }
  
      // Volta para a Main sem empilhar
      navigation.goBack();
  
      Alert.alert("Sucesso", "Usuário cadastrado!");
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Falha ao obter localização.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />

      <TextInput
        style={styles.input}
        placeholder="Rua"
        value={rua}
        onChangeText={setRua}
      />

      <TextInput
        style={styles.input}
        placeholder="Número"
        value={numero}
        onChangeText={setNumero}
      />

      <TextInput
        style={styles.input}
        placeholder="Cidade"
        value={cidade}
        onChangeText={setCidade}
      />

      <TextInput
        style={styles.input}
        placeholder="Estado"
        value={estado}
        onChangeText={setEstado}
      />

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "#B0C4DE",
    borderWidth: 2,

    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
