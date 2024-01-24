import React, { useEffect, useState } from 'react';
import { IPost } from '../types';
import { useAuth } from '../context/AuthContext.tsx';
import Banner from '../components/UI/Banner.tsx';
import PostCard from '../components/community/PostCard.tsx';
import PostService from '../service/post.ts';
import NewPostForm from '../components/community/NewPostForm.tsx';

interface ICommunityProps {
    postService: PostService;
    isAddPostFormOpen: boolean;
    setAddPostForm: React.Dispatch<React.SetStateAction<boolean>>;
}

const Community = ({ postService, isAddPostFormOpen, setAddPostForm }: ICommunityProps) => {
    const [posts, setPosts] = useState<IPost[]>();
    const [error, setError] = useState('');
    const { user } = useAuth();
    console.log(posts);
    useEffect(() => {
        postService.getPosts()
            .then((posts) => setPosts([...posts]))
            .catch((error) => onError(error));
    }, [postService, user]);

    const onError = (error) => {
        setError(error.toString());
        setTimeout(() => {
            setError('');
        }, 3000);
    }
    return (
        <div className='w-full h-full bg-sub-color'>
            {error && <Banner text={error} isAlert={true} />}
            {isAddPostFormOpen && (<NewPostForm setPosts={setPosts} postService={postService} onError={onError} setAddPostForm={setAddPostForm} />)}
            {posts?.length === 0 && <p className=''>No Posts Yet</p>}
            <div className='flex flex-col items-center gap-5'>
                {posts?.map((post) => (
                    <PostCard post={post} setPosts={setPosts} postService={postService} onError={onError} />
                ))}
            </div>
        </div>
    )
}

export default Community;