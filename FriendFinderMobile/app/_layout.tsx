import { Stack, useSegments, useRouter } from 'expo-router';
import { Provider, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { store } from '../src/redux/store';
import { useAppSelector } from '../src/redux/hooks';
import { setAccessToken, setRefreshToken, setIsAuthenticated } from '../src/redux/authSlice';
import { setUserId } from '../src/redux/userSlice';
import { getAuthData } from '../src/utils/tokenStorage';

// @ts-ignore
require('../global.css');

const PUBLIC_PAGE_SEGMENTS = new Set([
  'splash', 'login', 'password',
  'user-info', 'gender', 'birthday', 'interested-gender',
  'looking-for', 'language', 'blood-type', 'height',
  'education', 'smoking', 'drinking', 'exercise', 'pets',
]);

function AuthGuard() {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const segments = useSegments();
  const router = useRouter();
  const dispatch = useDispatch();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // restore auth จาก SecureStore ตอน app เปิด
  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const { accessToken, refreshToken, userId } = await getAuthData();
        if (accessToken && userId) {
          dispatch(setAccessToken(accessToken));
          if (refreshToken) dispatch(setRefreshToken(refreshToken));
          dispatch(setUserId(userId));
          dispatch(setIsAuthenticated(true));
        }
      } catch {
        // ถ้าอ่านไม่ได้ก็ปล่อยให้ไปหน้า splash ตามปกติ
      } finally {
        setIsCheckingAuth(false);
      }
    };
    restoreAuth();
  }, []);

  useEffect(() => {
    if (isCheckingAuth) return;
    const segmentsArray = segments as string[];
    const isInTabs = segmentsArray[0] === '(tabs)';
    const isPublicPage = segmentsArray[0] === 'page' && segmentsArray.length > 1 && PUBLIC_PAGE_SEGMENTS.has(segmentsArray[1]);
    const isProtected = isInTabs || (segmentsArray[0] === 'page' && !isPublicPage);

    if (!isAuthenticated && isProtected) {
      router.replace('/page/splash');
    } else if (isAuthenticated && isPublicPage) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, segments, isCheckingAuth]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthGuard />
    </Provider>
  );
}