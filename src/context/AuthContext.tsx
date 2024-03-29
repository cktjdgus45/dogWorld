import { useNavigate } from 'react-router-dom';
import { createContext, createRef, useCallback, useContext, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import React from 'react';
import AuthService from '../service/auth';
import AuthForm from '../pages/auth/AuthForm.tsx';
import { IAuthHandler, IAuthorizedUser } from '../types';
import Loader from '../components/UI/Loader.tsx';


export const AuthContext = createContext({} as IAuthHandler);

const contextRef = createRef();
interface IAuthProviderProps {
    authService: AuthService;
    children: React.ReactNode;
    authErrorEventBus: AuthErrorEventBus;
    serverErrorEventBus: ServerErrorEventBus;
}

export const AuthProvider = ({ authService, children, authErrorEventBus, serverErrorEventBus }: IAuthProviderProps) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<IAuthorizedUser | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useImperativeHandle(contextRef, () => (user ? user.token : undefined));

    useEffect(() => {
        authErrorEventBus.listen((error) => {
            setLoading(false);
            setError(error.toString());
            setUser(undefined);
            setTimeout(() => {
                setError('');
            }, 3000);
        })
    }, [authErrorEventBus, error]);
    useEffect(() => {
        // Listen to server errors
        serverErrorEventBus.listen((error) => {
            setLoading(false);
            setError(error.toString());
            setTimeout(() => {
                setError('');
            }, 3000);
        });
    }, [error, serverErrorEventBus]);
    useEffect(() => {
        authService.me()
            .then((fetchedUser) => {
                setUser(fetchedUser);
                setLoading(false);
            })
            .catch(console.error);
    }, [authService]);
    const onError = (error) => {
        setError(error.toString());
        setTimeout(() => {
            setError('');
        }, 3000);
    }
    const signUp = useCallback(
        async (username, password, passwordCheck, name, email, url) =>
            authService.signup(username, password, passwordCheck, name, email, url)
                .then((user) => {
                    console.log(user);
                    setUser(user)
                }), [authService]
    );
    const login = useCallback(
        async (username, password) =>
            authService.login(username, password).then((user) => {
                setUser(user);
                navigate('/dogWorld');
            })
        , [authService, navigate]
    );
    const update = useCallback(
        async (username, file, existUrl) =>
            authService.update(username, file, existUrl).then((user) => {
                setUser(user);
                navigate('/dogWorld');
            })
        , [authService, navigate]
    );
    const logout = useCallback(
        async () => authService.logout().then(() => setUser(undefined)) //callback memoizaion. 재선언 방지.
        , [authService]
    );

    const context = useMemo( // what i want to send data 
        () => ({
            user,
            signUp,
            login,
            logout,
            update,
            error: { error, onError }
        })
        , [user, signUp, login, logout, update, error]
    );
    return (
        <AuthContext.Provider value={context}>
            {loading ? (
                <div className='w-screen h-screen flex justify-center'>
                    <div className='bg-sub-color flex items-center justify-center w-[880px] h-screen'>
                        <Loader isLoading={loading} color='#776B5D' kind='grid' />
                    </div>
                </div>
            ) : user ? (
                children
            ) : (
                <>
                    <AuthForm onSignUp={signUp} onLogin={login} />
                </>
            )}
        </AuthContext.Provider>
    )
}

export class AuthErrorEventBus {
    callback;
    listen(callback) {
        this.callback = callback;
    }
    notify(error) {
        this.callback(error);
    }
}
export class ServerErrorEventBus {
    callback;
    listen(callback) {
        this.callback = callback;
    }
    notify(error) {
        this.callback(error);
    }
}

export default AuthContext;
export const fetchToken = () => contextRef.current;
export const useAuth = (): IAuthHandler => useContext(AuthContext);