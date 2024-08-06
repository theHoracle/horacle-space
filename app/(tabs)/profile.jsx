import { FlatList, Image, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import EmptyState from "../../components/EmptyState"
import { getUserPosts, signOut } from "../../lib/appwrite"
import useAppwrite from "../../lib/useAppWrite"
import { icons } from "../../constants"
import VideoCard from "../../components/VideoCard"
import { useGlobalContext } from "../../context/GlobalProvider"
import InfoBox from "../../components/InfoBox"
import { router } from "expo-router"


const Profile = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const userId = user?.$id
    const {data: posts, refetch} = useAppwrite(() => getUserPosts(userId))
    
    const logOut = async () => {
        await signOut()
        setUser(null)
        setIsLoggedIn(false)
        router.replace('/sign-in')
    }

    return (
        <SafeAreaView  className="bg-primary h-full">
            <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({item}) => (
                <VideoCard key={item.id} video={item} />
            )}   
            ListHeaderComponent={() => (
                <View className="w-full items-center justify-center mt-6 mb-12
                 px-4" >
                    <TouchableOpacity className="w-full items-end mb-10" 
                    onPress={logOut}
                    >
                        <Image
                        source={icons.logout}
                        className="w-6 h-6 "
                        resizeMode="contain"
                        />
                    </TouchableOpacity>
                    <View 
                    className="w-16 h-16 border border-secondary rounded-lg justify-center items-center"
                    >
                        <Image
                        source={{uri: user?.avatar}}
                        className="w-[90%] rounded-lg h-[90%]"
                        resizeMode="contain"
                        />

                    </View>
                    <InfoBox user={user}
                    title={user?.username}
                    containerStyles="mt-5"
                    titleStyles="text-lg" />
                    <View className="mt-5 flex-row" >
                    {/* no of post */}
                    <InfoBox user={user}
                    title={posts.length || 0}
                    subtitle ="Posts"
                    containerStyles="mr-10"
                    titleStyles="text-xl" />

                    {/* total likes */}
                    <InfoBox user={user}
                    title={"8.8k"}
                    subtitle="Followers"
                    titleStyles="text-xl" />
                     
                    </View>
                </View>
            )}
            ListEmptyComponent={() => (
                    <EmptyState 
                    title="No videos found"
                    subtitle="No videos found for this Profile query"
                    
                    />
               
            )}
            />


        </SafeAreaView>
    )
}
export default Profile