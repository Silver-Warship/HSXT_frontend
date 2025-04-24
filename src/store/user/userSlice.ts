import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// 定义初始状态
interface UserState {
  uid: string;
  nickname: string;
  email: string;
  gender: GenderType | null;
  usertype: UserType | null;
}

const initialState: UserState = {
  uid: '',
  nickname: '',
  email: '',
  gender: null,
  usertype: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo(
      state,
      action: PayloadAction<{
        uid?: string;
        nickname?: string;
        email?: string;
        gender?: GenderType;
        usertype?: UserType;
      }>,
    ) {
      const { uid, nickname, email, gender, usertype } = action.payload ?? {};
      if (uid) state.uid = uid;
      if (nickname) state.nickname = nickname;
      if (email) state.email = email;
      if (gender) state.gender = gender;
      if (usertype) state.usertype = usertype;
    },
  },
});

export const { setUserInfo } = userSlice.actions;

export default persistReducer({ key: 'user', storage }, userSlice.reducer);
