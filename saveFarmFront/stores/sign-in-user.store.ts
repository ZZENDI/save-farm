import SignInUser from "@/types/sign-in-user.interface";
import {create} from "zustand";

interface SignInUserStore {
    signInUser: SignInUser | null;
    setSignInUser: (signInUser: SignInUser | null) => void;
    
}

const useStore = create<SignInUserStore>(set => ({
    signInUser: null,
    setSignInUser: (signInUser: SignInUser | null)  => set(state => ({ ...state, signInUser }))     // state를 똑같이 가져오고 signInUser 값만 새로 받아온 것으로 변경하기
}));

export default useStore;