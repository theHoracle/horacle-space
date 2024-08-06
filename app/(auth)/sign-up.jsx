import { Alert, Image, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { router } from "expo-router"
import { useState } from "react"
import {images} from "../../constants"
import FormField from "../../components/FormField"
import CustomButton from "../../components/CustomButton"
import { Link } from "expo-router"
import { createUser, getCurrentUser } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"

const SignUpScreen = () => {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: ""
    })
    const {  setUser, setIsLoggedIn } = useGlobalContext()
    const [isLoading, setisLoading] = useState(false)

    const submit = async () => {
        setisLoading(true)
        if(!form.email || !form.username || !form.password) {
            Alert.alert('Error', "Please fill in all fields")
        }
        try {
            await createUser(form)
            // will set to global state using context
            const result = await getCurrentUser()
            setUser(result)
            setIsLoggedIn(true)
            router.replace("/home")
        } catch (error) {
            Alert.alert("Error", error.message)
        } finally {
            setisLoading(false)
        }
    }

    return (
        <SafeAreaView className="bg-primary h-full" >
            <ScrollView>
                <View className="w-full justify-center min-h-[85vh] px-4 my-6">
                    <Image
                    source={images.logo}
                    resizeMode="contain"
                    className="w-[115px] h-[35px]"
                    />
                    <Text className="text-2xl text-white font-psemibold mt-10">Sign up to theHoracle Space</Text>
                    <FormField
                    title="Username"
                    value={form.username}
                    handleChangeText={(e) => setForm({...form, username: e})}
                    otherStyles="mt-7"
                    />
                    <FormField
                    title="Email"
                    value={form.email}
                    handleChangeText={(e) => setForm({...form, email: e})}
                    otherStyles="my-7"
                    keyboardType="email-address"
                    />
                     <FormField
                    title="Password"
                    value={form.password}
                    handleChangeText={(e) => setForm({...form, password: e})}
                    otherStyles="my-2"
                    />
                    <CustomButton 
                    title="Sign up"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={isLoading}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">Already have an account?</Text>
                        <Link href="/sign-in" className="text-lg font-psemibold text-secondary">Sign in</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignUpScreen