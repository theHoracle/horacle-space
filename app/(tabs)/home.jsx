import { Alert, FlatList, Image, RefreshControl, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import {images} from "../../constants"
import SearchInput from "../../components/SearchInput"
import Trending from "../../components/Trending"
import EmptyState from "../../components/EmptyState"
import { useEffect, useState } from "react"
import { getAllPosts, getLatestPosts } from "../../lib/appwrite"
import useAppwrite from "../../lib/useAppWrite"
import VideoCard from "../../components/VideoCard"
import { useGlobalContext } from "../../context/GlobalProvider"

const Home = () => {
    const { user, setUser, setIsLoggedIn } = useGlobalContext()
    const {data: posts, isLoading, refetch} = useAppwrite(getAllPosts)
    const {data: latestPost, } = useAppwrite(getLatestPosts)

    const [refreshing, setRefreshing] = useState(false)
    const onRefersh = async () => {
        setRefreshing(true)
        // recall vidoes
            await refetch()
        setRefreshing(false)
    }
    

    const data = [{id: 1}, {id: 2}, {id: 3}]
    return (
        <SafeAreaView  className="bg-primary h-full">
            <FlatList
            data={posts}
            keyExtractor={(item) => item.$id}
            renderItem={({item}) => (
                <VideoCard key={item.id} video={item} />
            )}   
            ListHeaderComponent={() => (
            <View className="my-6 px-4 space-y-6">
                <View className="justify-between items-start flex-row mb-6">
                    <View>
                        <Text className="font-pmedium text-sm text-gray-100">
                            Welcome back,
                        </Text>
                        <Text className="text-2xl font-psemibold text-white">
                            {user?.username}
                        </Text>
                    </View>
                    <View className="mt-1.5">
                        <Image
                        source={images.logoSmall}
                        className="w-9 h-10"
                        resizeMode="contain"
                        />
                    </View>
                </View>
                <SearchInput />

                <View className="w-full flex-1 pt-5 pb-8">
                    <Text className="text-gray-100 text-lg font-pregular">Trending videos</Text>
                    <Trending posts={latestPost ?? []} />
                </View>
            </View>)}
            ListEmptyComponent={() => (
                    <EmptyState 
                    title="No videos found"
                    subtitle="Be the first to upload a video"
                    
                    />
               
            )}
            refreshControl={<RefreshControl
                refreshing={refreshing} onRefresh={onRefersh}
                 />}
            />
            
        </SafeAreaView>
    )
}
export default Home