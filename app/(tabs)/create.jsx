import { Alert, Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import FormField from "../../components/FormField"
import { useState } from "react"
import { ResizeMode, Video } from "expo-av"
import CustomButton from "../../components/CustomButton"
import { icons } from "../../constants"
import * as ImagePicker from 'expo-image-picker'
import { router } from "expo-router"
import { createVideo } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"

const Create = () => {
    const { user } = useGlobalContext()
    const [uploading, setUploading] = useState(false)
    const [form, setForm] = useState({
        title: '',
        video: null,
        thumbnail: null,
        prompt: '',
    })

    const openPicker = async (selectType) => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: selectType === 'image' ? ImagePicker.MediaTypeOptions.Images : ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        })

        if(!result.canceled) {
            if(selectType === 'image') {
                setForm({ ...form, thumbnail: result.assets[0] })
            }
            if(selectType === 'video') {
                setForm({ ...form, video: result.assets[0] })
            }
        }
    }

    const submit = async () => {
        if(!form.prompt || !form.title || !form.video || !form.thumbnail) {
            return Alert.alert('Missing required fields', 'Please fill in all the fields')
        }
        setUploading(true)
        try {
            await createVideo({
                ...form, userId: user.$id
            })
            Alert.alert('Success', 'Post uploaded')
            router.push('/home') 
        } catch (error) {
            Alert.alert('Error', error.message)
            
        } finally {
            setForm({
                title: '',
                video: null,
                thumbnail: null,
                prompt: '',
            })
            setUploading(false)

        }

    }

    return (
        <SafeAreaView className="bg-primary h-full" >
            <ScrollView className="px-4 my-6">
                <Text className="text-2xl text-white" >Upload video</Text>
               
                <FormField title="Video title"
                value={form.title} placeholder="Give your video a catchy title..."
                handleChangeText={(e) => setForm({
                    ...form, title: e
                })} otherStyles="mt-10" />
                
                <View className="mt-7 space-y-2">
                    <Text className="text-base text-gray-100 font-pmedium">Upload video</Text>
                    <TouchableOpacity onPress={() => openPicker('video')} >
                        {form.video ? (
                            <Video
                            source={{uri: form.video.uri}}
                            className="w-full h-64 rounded-2xl"
                            resizeMode={ResizeMode.COVER}
                            />

                        ) : (
                            <View className="w-full h-40 px-4 bg-black-100 rounded-2xl justify-center items-center">
                                <View className="border border-dashed h-14 w-14 border-secondary justify-center items-center">
                                <Image
                                source={icons.upload}
                                resizeMode="contain"
                                className="w-1/2 h-1/2"
                                />
                                </View>
                            </View>

                        ) }
                    </TouchableOpacity>
                </View>

                <View className="mt-7 space-y-2"> 
                <Text className="text-base text-gray-100 font-pmedium">Thumbnail image</Text> 
                <TouchableOpacity onPress={() => openPicker('image')} >
                        {form.thumbnail ? (
                            <Image
                            source={{uri: form.thumbnail.uri}}
                            className="w-full h-64 rounded-2xl"
                            resizeMode="cover"
                            />
                        ) : (
                                <View className="border-2 h-16 w-full px-4 flex-row space-x-2 border-black-200 justify-center items-center">
                                <Image
                                source={icons.upload}
                                resizeMode="contain"
                                className="w-5 h-5"
                                />
                                <Text className="text-sm text-gray-100 font-pmedium">Choose a file</Text>
                                </View>

                        ) }
                    </TouchableOpacity>
                </View>

                <FormField title="Video prompt"
                value={form.prompt} placeholder="Prompt used to create video..."
                handleChangeText={(e) => setForm({
                    ...form, prompt: e
                })} otherStyles="mt-7" />

                <CustomButton 
                title="Submit & Publish"
                handlePress={submit}
                containerStyles="mt-7"
                isLoading={uploading}
                />

            </ScrollView>
        </SafeAreaView>
    )
}
export default Create