import React, { useEffect, useRef, useState } from "react";
import { useRoute, useIsFocused } from "@react-navigation/native";
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from "react-native";
import MapView, { Marker } from "react-native-maps";
import useLocation from "../hooks/useLocation";

export default function Main({ navigation }) {
  const [usuarios, setUsuarios] = useState([]);
  const { coords, errorMsg } = useLocation();
  const route = useRoute();
  const isFocused = useIsFocused();
  const mapRef = useRef(null);

  useEffect(() => {
    if (isFocused && route.params?.novoUsuario) {
      const novoUsuario = route.params.novoUsuario;

      setUsuarios((prev) => {
        const jaExiste = prev.some(
          (user) =>
            user.nome === novoUsuario.nome &&
            user.endereco === novoUsuario.endereco
        );
        if (!jaExiste) {
          return [...prev, novoUsuario];
        }
        return prev;
      });

      // Centraliza no novo usuário
      setTimeout(() => {
        mapRef.current?.animateToRegion(
          {
            latitude: novoUsuario.latitude,
            longitude: novoUsuario.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          },
          1000
        );
      }, 300);

      // Limpa parâmetros para evitar duplicação ao voltar novamente
      navigation.setParams({ novoUsuario: null });
    }
  }, [isFocused, route.params?.novoUsuario]);

  if (errorMsg) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!coords) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Carregando localização...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true}
      >
        {/* Marcador da localização atual */}
        <Marker
          coordinate={{
            latitude: coords.latitude,
            longitude: coords.longitude,
          }}
          title="Você está aqui"
        />

        {/* Marcadores de usuários */}
        {usuarios.map((usuario, index) => (
          <Marker
            key={index}
            coordinate={{
              latitude: usuario.latitude,
              longitude: usuario.longitude,
            }}
            title={usuario.nome}
            description={usuario.endereco}
          />
        ))}
      </MapView>

      <TouchableOpacity
  style={styles.button}
  onPress={() =>
    navigation.navigate("Cadastro", {
      onCadastrarUsuario: (novoUsuario) => {
        setUsuarios((prev) => [...prev, novoUsuario]);

        // Centraliza no novo marcador
        setTimeout(() => {
          mapRef.current?.animateToRegion(
            {
              latitude: novoUsuario.latitude,
              longitude: novoUsuario.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000
          );
        }, 300);
      },
    })
  }
>
  <Text style={styles.buttonText}>Cadastrar Novo Usuário</Text>
</TouchableOpacity>
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
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  button: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    backgroundColor: "#4682B4",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    zIndex: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
