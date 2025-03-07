import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
	Alert,
} from "react-native";

export const PostDetail = ({ route }) => {
	const { id } = route.params;
	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [isLoggedIn, setIsLoggedIn] = useState(true);

	const [userId, setUserId] = useState(null);

	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const navigation = useNavigation();

	const getUserId = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token) {
				const decoded = jwtDecode(token);
				setUserId(decoded.id);
				console.log("userId: ", userId);
			}
		} catch (err) {
			console.error("Erreur lors du décodage du token :", err);
		}
	};

	const checkLogin = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token && decodeToken()) {
				const decoded = jwtDecode(token);
				console.log("token : ", decoded);
				setIsLoggedIn(true);
			} else {
				console.log("pas de token");
				navigation.navigate("Login");
				setIsLoggedIn(false);
			}
		} catch (err) {
			console.error("Erreur lors du décodage du token : ", err);
		}
	};

	const decodeToken = async () => {
		const token = await AsyncStorage.getItem("token");
		const decoded = jwtDecode(token);
		const currentTime = Date.now() / 1000;

		if (decoded.exp && decoded.exp < currentTime) {
			console.log("Token expiré");
			return false;
		}

		console.log("Token valide");
		return true;
	};

	// Récupérer le post
	const fetchPost = () => {
		axios
			.get(`${apiUrl}/post/${id}`)
			.then((res) => {
				setPost(res.data.data);
				console.log("post : ", post);

				setLoading(false);
			})
			.catch((err) => {
				console.error("Erreur lors du chargement du post :", err);
				setLoading(false);
			});
	};

	useEffect(() => {
		checkLogin();
		getUserId();
		if (isLoggedIn) {
			fetchPost();
		}
	}, []);

	const handleDelete = () => {
		Alert.alert("Confirmation", "Voulez-vous vraiment supprimer ce post ?", [
			{
				text: "Annuler",
				style: "cancel",
			},
			{
				text: "Supprimer",
				onPress: async () => {
					const token = await AsyncStorage.getItem("token");
					await axios
						.delete(`${apiUrl}/post/deleteOwnPost/${id}`, {
							headers: { Authorization: `Bearer ${token}` },
						})
						.then(() => {
							Alert.alert("Succès", "Le post a été supprimé !");
							navigation.navigate("Home");
						})
						.catch((err) => {
							console.error("Erreur lors de la suppression :", err);
						});
				},
				style: "destructive",
			},
		]);
	};

	if (loading) {
		return (
			<View style={styles.loadingContainer}>
				<ActivityIndicator size="large" color="#1DA1F2" />
			</View>
		);
	} else {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>{post.title}</Text>
				<Text style={styles.content}>{post.content}</Text>
				{userId === post.userId && (
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.button, styles.editButton]}
							onPress={() => {
								navigation.navigate("EditPost", { id: post.id });
							}}
						>
							<Text style={styles.buttonText}>Modifier</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.button, styles.deleteButton]}
							onPress={handleDelete}
						>
							<Text style={styles.buttonText}>Supprimer</Text>
						</TouchableOpacity>
					</View>
				)}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 20,
	},
	title: {
		fontSize: 22,
		fontWeight: "bold",
		marginBottom: 10,
	},
	content: {
		fontSize: 16,
		lineHeight: 24,
		marginBottom: 20,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-around",
		marginTop: 20,
	},
	button: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
		alignItems: "center",
	},
	editButton: {
		backgroundColor: "#1DA1F2",
	},
	deleteButton: {
		backgroundColor: "red",
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
		fontWeight: "bold",
	},
});
