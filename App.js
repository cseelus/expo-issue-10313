import React, { useEffect, useState } from 'react'
import { Button, Image, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native'
import * as ImagePicker from 'expo-image-picker'

export default function App() {
  const [filename, setFilename] = useState('')
  const [image, setImage] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync()
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!')
      }
    })()
  }, [])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.cancelled) {
      setImage(result.uri)
    }
  }

  async function submit() {
    if (image !== null) {
      let fd = new FormData()

      fd.append('image', { uri: image, name: filename, type: 'multipart/form-data' })
      fd.append('key', '<Imgur API key>')

      console.log('Posting formdata ' + JSON.stringify(fd))

      const response = await fetch('https://api.imgur.com/3/image', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: fd
      })
      const content = await response.json()

      console.log(content)
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        onChangeText={text => setFilename(text)}
        onSubmitEditing={() => submit()}
        placeholder='Filename'
        placeholderTextColor='#878787'
        style={styles.textInput}
        underlineColorAndroid='transparent'
        value={filename}
      />
      {!image &&
        <Button
          title='Pick an image from camera roll'
          onPress={pickImage}
        />
      }
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}

      <Pressable
        style={({ pressed }) => ({
          opacity: pressed ? 0.5 : 1,
          margin: 10,
          padding: 10,
          backgroundColor: '#478bdb',
          borderRadius: 5
        })
        }
        onPress={() => submit()}
      >
        <Text style={{color: 'white'}}>
          Submit
        </Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    height: 45,
    width: 200,
    marginBottom: 10,
    paddingTop: 3,
    paddingRight: 15,
    paddingBottom: 3,
    paddingLeft: 15,
    backgroundColor: '#f7f7f7',
    borderColor: '#ced1e1',
    borderWidth: 1,
    borderRadius: 5
  }
})
