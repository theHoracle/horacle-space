import { View, TextInput, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import {icons} from "../constants"
import { router, usePathname } from 'expo-router'

const SearchInput = ({title, placeholder, initialQuery, handleChangeText, otherStyles, ...props}) => {
    const [query, setQuery] = useState(initialQuery || "")
    const pahtname = usePathname()
  return (
      <View className={`w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl items-center flex-row
       focus:border-secondary space-x-4 ${otherStyles}`}>
        <TextInput className="flex-1 mt-0.5 text-white font-pregular text-base" 
        placeholder="Search for a video topic" placeholderTextColor="#cdcde0" 
        value={query}
        onChangeText={(e) => setQuery(e)}

         />
        
            <TouchableOpacity 
            onPress={() => {
                if(!query) {
                    Alert.alert('Missing query', 'Please input something to search')
                    return
                }
                if(pahtname.startsWith('/search')) router.setParams({query})
                    else {
                        router.push(`/search/${query}`)
                    }
            }}
            >
                <Image
                source={icons.search}
                className="w-5 h-5"
                resizeMode='contain'
                />
            </TouchableOpacity>
      </View>
   
  )
}

export default SearchInput