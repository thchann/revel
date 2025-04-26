import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { PostStackParamList } from './postNav';

const defaultImages = [
  require('../../assets/spider_man.png'),
  require('../../assets/spider_man2.jpeg'),
  require('../../assets/spider_man3.jpeg'),
  require('../../assets/spider_man4.jpeg'),
  require('../../assets/spider_man.png'),
  require('../../assets/spider_man2.jpeg'),
  require('../../assets/spider_man3.jpeg'),

];

export default function ImageSelectorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<PostStackParamList>>();

  const handleDefaultSelect = (img: any) => {
    const uri = Image.resolveAssetSource(img).uri;
    navigation.navigate('PostForm', { imageUri: uri });
  };

  const openImagePicker = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const selected = result.assets[0].uri;
      navigation.navigate('PostForm', { imageUri: selected });
    }
  };

  // Combine the gallery button as the first item in the list
  const imagesWithUpload = ['upload', ...defaultImages];

  return (
    <View style={styles.container}>
      <FlatList
        data={imagesWithUpload}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) =>
          item === 'upload' ? (
            <TouchableOpacity onPress={openImagePicker} style={styles.uploadBox}>
              <Text style={styles.plusIcon}>+</Text>
              <Text style={styles.uploadLabel}>Upload</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => handleDefaultSelect(item)}
              style={styles.imageWrapper}
            >
              <Image source={item} style={styles.image} />
            </TouchableOpacity>
          )
        }
        contentContainerStyle={styles.gallery}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  gallery: {
    paddingVertical: 12,
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  uploadBox: {
    flex: 1,
    aspectRatio: 1,
    margin: 8,
    borderRadius: 10,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plusIcon: {
    fontSize: 32,
    color: '#999999',
    marginBottom: 4,
  },
  uploadLabel: {
    fontSize: 14,
    color: '#999999',
    fontWeight:'bold'
  },
});
