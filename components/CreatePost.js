import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
	StyleSheet,
	Text,
	View,
	TextInput,
	Modal,
	TouchableOpacity,
	Alert,
} from "react-native";
import axios from "axios";

export const CreatePost = () => {
	const navigation = useNavigation();

	const [post, setPost] = useState({ title: "", content: "", userId: null });
	const [successLogin, setSuccessLogin] = useState(false);
	const handleChange = (key, value) => {
		setPost((prevPost) => ({ ...prevPost, [key]: value }));
	};
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const handleSubmit = async () => {
		console.log(post);

		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) {
				return;
			}

			await axios
				.post(`${apiUrl}/post/new`, post, {
					headers: { Authorization: `Bearer ${token}` },
				})
				.then(() => {
					Alert.alert("Succès", "Le post a été créé avec succès !");
					navigation.navigate("Home");
				});
		} catch (err) {
			console.log(err.response.data.message);
		}
	};

	const isAdmin = async () => {
		const token = await AsyncStorage.getItem("token");
		if (!token) {
			navigation.navigate("Login");
		}
	};

	useEffect(() => {
		isAdmin();
	}, []);

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Créer un post</Text>
			<View style={styles.form}>
				<TextInput
					style={styles.input}
					placeholder="Titre"
					value={post.title}
					onChangeText={(text) => handleChange("title", text)}
				/>
				<TextInput
					style={styles.input}
					placeholder="Contenu"
					value={post.content}
					onChangeText={(text) => handleChange("content", text)}
				/>

				<TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
					<Text style={styles.buttonText}>Créer</Text>
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
});
