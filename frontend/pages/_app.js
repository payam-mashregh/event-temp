// upto/frontend/pages/_app.js
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import 'react-quill/dist/quill.snow.css'; // **فایل CSS ویرایشگر اضافه شد**
import { Toaster } from 'react-hot-toast';

function MyApp({ Component, pageProps }) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <AuthProvider>
      {getLayout(<Component {...pageProps} />)}
      <Toaster position="bottom-center" />
    </AuthProvider>
  );
}

export default MyApp;