import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";

export const Profile = () => {
	const navigation = useNavigation();

	const [user, setUser] = useState({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

    const apiUrl = process.env.EXPO_PUBLIC_API_URL;

    const checkLogin = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token && decodeToken()) {
				const decoded = jwtDecode(token);
				console.log(decoded);
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

	const query = async () => {

		try {
			const token = await AsyncStorage.getItem("token");
			if (!token) {
				navigation.navigate("Login");
			}
			await axios
				.get(`${apiUrl}/user/monprofil`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
				.then((res) => {
					if (res.status === 200) {
						console.log(res.data);
						setUser(res.data.data);
						setLoading(false);
					}
				});
		} catch (err) {
			console.log(err);
			setLoading(false);
			setError(err);
		}
	};

	useEffect(() => {
        checkLogin();
		query();
	}, []);

	if (loading) {
		return <Text>En cours de chargement...</Text>;
	} else if (error) {
		return <Text>Server Error : {error}</Text>;
	} else {
		return (
			<View>
				<Text>Nom : {user.name} </Text>
				<Text>Email : {user.email} </Text>
				<Text>Créé le : {user.createdAt} </Text>

				<TouchableOpacity
					onPress={() => {
						navigation.navigate("CreatePost");
					}}
                    style={styles.button}
				>
					<Text>Créer un post</Text>
				</TouchableOpacity>
			</View>
		);
	}
};


const styles = StyleSheet.create({
    button: {
        marginTop: 24,
    }
})