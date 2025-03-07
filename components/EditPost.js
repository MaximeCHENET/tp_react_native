import { useEffect, useState } from "react";
import {
	Text,
	TextInput,
	TouchableOpacity,
	View,
	StyleSheet,
	Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const EditPost = ({ route, navigation }) => {
	const { id } = route.params; // Récupère l'ID du post depuis la navigation
	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const [post, setPost] = useState({
		title: "",
		content: "",
	});
	const [loading, setLoading] = useState(true);

	// Charger les détails du post
	useEffect(() => {
		axios
			.get(`${apiUrl}/post/${id}`)
			.then((res) => {
				setPost(res.data.data);
				setLoading(false);
			})
			.catch((err) =>
				console.error("Erreur lors du chargement du post :", err)
			);
	}, []);

	// Fonction pour mettre à jour les valeurs
	const handleChange = (key, value) => {
		setPost((prevPost) => ({ ...prevPost, [key]: value }));
	};

	// Soumettre les modifications
	const handleSubmit = async () => {
		const token = await AsyncStorage.getItem("token");
		await axios
			.put(`${apiUrl}/post/updateOwnPost/${id}`, post, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then(() => {
				Alert.alert("Succès", "Le post a été modifié !");
				navigation.navigate("Home"); // Retourner à la liste après modification
			})
			.catch((err) => console.error("Erreur lors de la mise à jour :", err));
	};

	if (loading) {
		return <Text>Chargement...</Text>;
	} else {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Modifier le Post</Text>
				<TextInput
					style={styles.input}
					value={post.title}
					onChangeText={(text) => handleChange("title", text)}
					placeholder="Titre"
				/>
				<TextInput
					style={[styles.input, styles.textarea]}
					value={post.content}
					onChangeText={(text) => handleChange("content", text)}
					placeholder="Contenu"
					multiline
				/>
				<TouchableOpacity style={styles.button} onPress={handleSubmit}>
					<Text style={styles.buttonText}>Modfier</Text>
				</TouchableOpacity>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 20,
	},
	input: {
		width: "100%",
		height: 50,
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		paddingHorizontal: 15,
		marginBottom: 15,
		backgroundColor: "#fff",
	},
	textarea: {
		height: 120,
		textAlignVertical: "top",
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
