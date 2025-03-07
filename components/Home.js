import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import {
	FlatList,
	Text,
	View,
	StyleSheet,
	TouchableOpacity,
} from "react-native";

export const Home = () => {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);

	const navigation = useNavigation();

	const apiUrl = process.env.EXPO_PUBLIC_API_URL;

	const query = () => {
		try {
			axios
				.get(`${apiUrl}/post/all`)
				.then((res) => {
					console.log(res.data);
					setPosts(res.data.data);
                    setLoading(false)
				})
				.catch((err) => {
					console.log(err);
                    setLoading(false);
				});
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		query();
	}, []);

	if (loading) {
		return <Text>Chargement...</Text>;
	} else {
		return (
			<View style={styles.container}>
				<FlatList
					data={posts}
					keyExtractor={(item) => item.id}
					renderItem={({ item }) => (
						<TouchableOpacity
							style={styles.postCard}
							onPress={() => {
								navigation.navigate("PostDetail", { id: item.id });
							}}
						>
							<View style={styles.header}>
								<Text style={styles.title}> {item.title} </Text>
							</View>
							<Text style={styles.content}> {item.content} </Text>
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	}
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 10,
	},
	postCard: {
		backgroundColor: "#fff",
		borderRadius: 10,
		padding: 10,
		marginBottom: 15,
		shadowColor: "#000",
		shadowOpacity: 0.1,
		shadowOffset: { width: 0, height: 2 },
		shadowRadius: 4,
		elevation: 3,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 5,
	},
	title: {
		fontSize: 16,
		fontWeight: "bold",
	},
	content: {
		fontSize: 14,
		marginBottom: 10,
	},
});
