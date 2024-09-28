import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../redux/Store';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/AuthActions';
import { useTheme } from '../context/ThemeContext';
import { Player } from "@lottiefiles/react-lottie-player";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      console.log(values);
      const response = await dispatch(login(values));

      if (response.payload?.success) {
        navigate('/dashboard');
      } 
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
    <div className="flex flex-col md:flex-row w-full max-w-5xl p-4 md:p-0">
      <div className="w-full md:w-1/2 flex items-center justify-center md:order-1">
      <Player
            autoplay
            loop
            src="https://lottie.host/055e24ed-b8b0-4f52-8ae2-c8595af1cbf0/zA7OVHuz3b.json" 
            style={{ height: "80%", width: "80%" }}
          />
      </div>
      <div className={`w-full md:w-1/2 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg md:rounded-l-none shadow-md order-2 md:order-2`}>
        <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Welcome to Inventory Pro</h2>
        <Formik
          initialValues={{  email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className="space-y-4">
           
              <div className="relative">
                <Mail className={`absolute top-3 left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                <Field
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                    errors.email && touched.email ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'
                  } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:border-blue-500`}
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <div className="relative">
                <Lock className={`absolute top-3 left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                <Field
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                    errors.password && touched.password ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'
                  } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:border-blue-500`}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className={`absolute top-3 right-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
              >
                {isSubmitting ? 'Logging In...' : 'Log In'}
              </button>
            </Form>
          )}
        </Formik>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
