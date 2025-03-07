import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import {
	Image,
	Modal,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import { Home } from "./components/Home";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Profile } from "./components/Profile";
import { Login } from "./components/Login";
import { Register } from "./components/Register";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CreatePost } from "./components/CreatePost";
import { PostDetail } from "./components/PostDetails";
import { EditPost } from "./components/EditPost";

const Stack = createNativeStackNavigator();

const Header = () => {
	const [menuVisible, setMenuVisible] = useState(false);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigation = useNavigation();

	const checkLogin = async () => {
		try {
			const token = await AsyncStorage.getItem("token");
			if (token && decodeToken()) {
				const decoded = jwtDecode(token);
				console.log(decoded);
				setIsLoggedIn(true);
			} else {
				console.log("pas de token");
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

	const logOut = async () => {
		await AsyncStorage.removeItem("token");
		setMenuVisible(false);
		setIsLoggedIn(false);
		navigation.navigate("Home");
	};

	useEffect(() => {
		checkLogin();
	}, []);

	return (
		<View style={styles.header}>
			{/* <Image /> */}
			<Text style={styles.headerMenu}>Postagram</Text>
			<TouchableOpacity onPress={() => setMenuVisible(true)}>
				<Ionicons name="menu-outline" style={styles.headerMenu} />
			</TouchableOpacity>
			<Modal animationType="slide" transparent={true} visible={menuVisible}>
				<View style={styles.modalContainer}>
					<Ionicons
						onPress={() => setMenuVisible(false)}
						name="close"
						size={24}
						color="black"
						style={styles.closeButton}
					/>
					<TouchableOpacity
						onPress={() => {
							navigation.navigate("Home");
							setMenuVisible(false);
						}}
					>
						<Text style={styles.menuItem}>Home</Text>
					</TouchableOpacity>
					{isLoggedIn ? (
						<>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("Profile");
									setMenuVisible(false);
								}}
							>
								<Text style={styles.menuItem}>Profile</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={() => logOut()}>
								<Text style={styles.menuItem}>Log Out</Text>
							</TouchableOpacity>
						</>
					) : (
						<>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("Login");
									setMenuVisible(false);
								}}
							>
								<Text style={styles.menuItem}>Login</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={() => {
									navigation.navigate("Register");
									setMenuVisible(false);
								}}
							>
								<Text style={styles.menuItem}>Register</Text>
							</TouchableOpacity>
						</>
					)}
				</View>
			</Modal>
		</View>
	);
};

export default function App() {
	return (
		<NavigationContainer>
			<Stack.Navigator
				screenOptions={{ header: (props) => <Header {...props}></Header> }}
			>
				<Stack.Screen
					name="Home"
					component={Home}
					options={{ title: "Home" }}
				/>
				<Stack.Screen
					name="Profile"
					component={Profile}
					options={{ title: "Profile" }}
				/>
				<Stack.Screen
					name="Login"
					component={Login}
					options={{ title: "Login" }}
				/>
				<Stack.Screen
					name="Register"
					component={Register}
					options={{ title: "Register" }}
				/>
				<Stack.Screen
					name="CreatePost"
					component={CreatePost}
					options={{ title: "CreatePost" }}
				/>
				<Stack.Screen
					name="EditPost"
					component={EditPost}
					options={{ title: "EditPost" }}
				/>
				<Stack.Screen
					name="PostDetail"
					component={PostDetail}
					options={{ title: "Détail du Post" }}
				/>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	header: {
		paddingTop: 40,
		paddingHorizontal: 20,
		backgroundColor: "#6200ee",
		height: 100,
		flexDirection: "row",
		justifyContent: "space-between",
	},
	headerMenu: {
		marginTop: 12,
		color: "white",
		fontSize: 20,
		fontWeight: "bold",
		fontFamily: "futura",
	},
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		width: 250,
		maxHeight: 170,
		margin: "auto",
		backgroundColor: "white",
		borderRadius: 15,
	},
	menuItem: {
		fontSize: 24,
		marginBottom: 15,
	},
	closeButton: {
		alignSelf: "flex-end",
		marginRight: 10,
	},
});
