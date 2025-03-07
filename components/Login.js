import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import {
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
	Modal,
    Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export const Login = () => {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const [successLogin, setSuccessLogin] = useState(false);
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const navigation = useNavigation();

	const handleChange = (key, value) => {
		setUser((prevUser) => ({ ...prevUser, [key]: value }));
	};

	const handleSubmit = async () => {
		console.log(user);
		console.log(apiUrl);

		try {
			await axios.post(`${apiUrl}/user/login`, user).then((res) => {
				AsyncStorage.setItem("token", res.data.token);
				Alert.alert("Succès", "Connexion réussie !");
				navigation.navigate("Home");
			});
		} catch (err) {
			console.error("Erreur lors de l'inscription : ", err.message);
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Se connecter</Text>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Email"
					value={user.email}
					onChangeText={(text) => handleChange("email", text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Mot de passe"
					value={user.password}
					onChangeText={(text) => handleChange("password", text)}
					secureTextEntry
				/>

				<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
					<Text style={styles.buttonText}>Se connecter</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		// justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 20,
		color: "#333",
	},
	form: {
		width: "1000%",
		maxWidth: 400,
		backgroundColor: "#fff",
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	input: {
		width: "100%",
		height: 50,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#f9f9f9",
	},
	button: {
		backgroundColor: "#1DA1F2",
		paddingVertical: 15,
		borderRadius: 8,
		alignItems: "center",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},

	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: 250,
		maxHeight: 200,
		margin: "auto",
		backgroundColor: "white",
		borderRadius: 15,
	},
});
