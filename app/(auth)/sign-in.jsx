import { Alert, Image, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useState } from "react"
import {images} from "../../constants"
import FormField from "../../components/FormField"
import CustomButton from "../../components/CustomButton"
import { Link, router } from "expo-router"
import { getCurrentUser, signIn } from "../../lib/appwrite"
import { useGlobalContext } from "../../context/GlobalProvider"

const SignInScreen = () => {
    const [form, setForm] = useState({
        email: "",
        password: ""
    })
    const { setUser, setIsLoggedIn } = useGlobalContext()
    const [isLoading, setisLoading] = useState(false)
    const submit = async () => {
        setisLoading(true)
        if(!form.email || !form.password) {
            Alert.alert('Error', "Please fill in all fields")
        }
        try {
            await signIn(form.email, form.password)
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
                    <Text className="text-2xl text-white font-psemibold mt-10">Sign in to theHoracle Space</Text>
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
                    title="Sign in"
                    handlePress={submit}
                    containerStyles="mt-7"
                    isLoading={isLoading}
                    />

                    <View className="justify-center pt-5 flex-row gap-2">
                        <Text className="text-lg text-gray-100 font-pregular">Don't have an account?</Text>
                        <Link href="/sign-up" className="text-lg font-psemibold text-secondary">Sign up</Link>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
export default SignInScreen