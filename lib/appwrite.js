import { Client, Account, ID, Avatars, Databases, Query, Storage } from 'react-native-appwrite';
export const config = {
    endpoint: "https://cloud.appwrite.io/v1",
    platform: "com.theHoracle.space",
    projectId: "66aef9cd0035d09d5f25",
    databaseId: "66aefb9f00034f0e243a",
    userCollectionId: "66aefbf2003d31d9444a",
    videoCollectionId: "66aefc2f001ea26d4c08",
    storageId: "66aefdc600308ba68bc2"
}

const {databaseId,
    endpoint,
    platform,
    projectId,
    storageId,
    userCollectionId,
    videoCollectionId} = config

// Init your React Native SDK
const client = new Client();


client
    .setEndpoint(endpoint) // Your Appwrite Endpoint
    .setProject(projectId) // Your project ID
    .setPlatform(platform) // Your application ID or bundle ID.
;

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);
const storage = new Storage(client)


// Register User
export const createUser = async ({email, password, username}) => {
    try {
        const newAccount = await  account.create(ID.unique(), email, password, username)
        if(!newAccount) throw Error   
        const avatarUrl = avatars.getInitials(username)
        await signIn(email, password)    
         const newUser = await databases.createDocument(
            databaseId,
            userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email: email,
                username: username,
                avatar: avatarUrl,
            }
         )
         return newUser;
    } catch (error) {
        
    }
    
}

// sign in user
export async function signIn(email, password) {
    try {
        const session  = await account.createEmailPasswordSession(email, password)
        return session
    } catch (error) {
        throw new Error(error)
    }

}

// get user sessiom
export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()
        if(!currentAccount) throw new Error("NO current account found")

        const currentUser = await databases.listDocuments(
            databaseId,
            userCollectionId,
            [Query.equal('accountId', currentAccount.$id)],
        )

        if(!currentUser) throw new Error("NO current user found")
        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export const signOut = async ( ) => {
    try {
        const session = await account.deleteSession('current')
        return session
    } catch (error) {
        throw new Error(error)
    }
}


// get all posts
export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt')]
        )
        return posts.documents
        
    } catch (error) {
        throw new Error(error)
    }
}

// get latest post
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        )
        return posts.documents
        
    } catch (error) {
        throw new Error(error)
    }
}

// search post
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.search('title', query)]
        )
        return posts.documents
        
    } catch (error) {
        throw new Error(error)
    }
}

// search post
export const getUserPosts = async (userId) => {
    try {
        const posts = await databases.listDocuments(
            databaseId,
            videoCollectionId,
            [Query.equal('creator', userId)]
        )
        return posts.documents
        
    } catch (error) {
        throw new Error(error)
    }
}


// get file preview
const getFilePreview = async (fileId, type) => {
    let fileUrl;
    try {
        if(type === 'video') {
            fileUrl = storage.getFileView(storageId, fileId)

        } else if(type === 'image') {
            fileUrl === storage.getFilePreview(storageId, fileId, 2000, 2000, 'top', 100)
        } else {
            throw new Error("Invalid file type")
        }
        if(!fileUrl) {
            throw new Error("File not found")
        }
        return fileUrl
    } catch (error) {
        throw new Error(error)
    }
} 

// upload file
export const uploadFile = async (file, type) => {
    if(!file) {
        console.log("No file selected")
        return
    }
  const asset = { 
    name: file.fileName,
    type: file.mimeType, 
    size: file.fileSize,
    uri: file.uri
   };
    try {
        const uploadedFile = await storage.createFile(
            storageId,
            ID.unique(),
            asset
        )
        console.log("We got here  :", uploadedFile)
        const fileUrl = await getFilePreview(uploadedFile.$id, type)
        console.log("We got here  :",uploadedFile, fileUrl)
        return fileUrl
    } catch (error) {
        console.log(error)
    }
}
// add new video
export const createVideo = async (form) => {
    try {
        const [thumbnaillUrl, videoUrl] = Promise.all([
            uploadFile(form.thumbnail, 'image'),
            uploadFile(form.video, 'video')
        ])

        const newPost = await databases.createDocument(
            databaseId,
            videoCollectionId,
            ID.unique(),
            {
                creator: form.userId,
                title: form.title,
                thumbnail: thumbnaillUrl,
                video: videoUrl,
                prompt: form.prompt,
            }
        )

        return newPost
    } catch (error) {
        throw new Error(error)
    }
}