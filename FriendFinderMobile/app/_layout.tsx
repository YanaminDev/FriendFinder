import { Stack, useSegments, useRouter } from 'expo-router';
import { Provider } from 'react-redux';
import { useEffect } from 'react';
import { store } from '../src/redux/store';
import { useAppSelector } from '../src/redux/hooks';

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

  useEffect(() => {
    const segmentsArray = segments as string[];
    const isInTabs = segmentsArray[0] === '(tabs)';
    const isPublicPage = segmentsArray[0] === 'page' && segmentsArray.length > 1 && PUBLIC_PAGE_SEGMENTS.has(segmentsArray[1]);
    const isProtected = isInTabs || (segmentsArray[0] === 'page' && !isPublicPage);

    if (!isAuthenticated && isProtected) {
      router.replace('/page/splash');
    }
  }, [isAuthenticated, segments]);

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
  return (
    <Provider store={store}>
      <AuthGuard />
    </Provider>
  );
}