import  { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import OTPVerificationForm from './Otp';
import { AppDispatch } from '../redux/Store';
import { useDispatch } from 'react-redux';
import { Player } from "@lottiefiles/react-lottie-player";
import { SignUp } from '../redux/actions/AuthActions';
import { useTheme } from '../context/ThemeContext';

const SignupSchema = Yup.object().shape({
  fullName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Required'),
});

const SignupForm = () => {
  const { darkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showOtpPage, setShowOtpPage] = useState(false);
  const [data, setData] = useState({
    username: '',
    email: '',
    password: '',
    otp: '',
  });

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const test = (payload: any) => {
    setData({
      username: payload.fullName,
      email: payload.email,
      password: payload.password,
      otp: '',
    });
  };
  const dispatch: AppDispatch = useDispatch();
  

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
     
      test(values);
      const response = await dispatch(SignUp(values.email));
      console.log(response);
      
     
      if (response.payload?.success == true) {
        setShowOtpPage(true);
       
      }
    } finally {
      setLoading(false);
    }
  };

  if (showOtpPage) {
    return <OTPVerificationForm data={data} />;
  }

  return (
    <div className={`flex items-center justify-center min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
      <div className="flex flex-col md:flex-row w-full max-w-5xl p-4 md:p-0">
        <div className="w-full md:w-1/2 flex items-center justify-center md:order-1">
        <Player
              autoplay
              loop
              src="https://lottie.host/0089c8de-ca29-4463-9cb6-b17eac12e1b3/LAm9zDAcBg.json" 
              style={{ height: "80%", width: "80%" }}
            />
        </div>
        <div className={`w-full md:w-1/2 p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg md:rounded-l-none shadow-md order-2 md:order-2`}>
          <h2 className={`text-2xl font-bold text-center ${darkMode ? 'text-white' : 'text-gray-800'} mb-6`}>Welcome to Inventory Pro</h2>
          <Formik
            initialValues={{ fullName: '', email: '', password: '' }}
            validationSchema={SignupSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched, isSubmitting }) => (
              <Form className="space-y-4">
                <div className="relative">
                  <User className={`absolute top-3 left-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} size={20} />
                  <Field
                    name="fullName"
                    type="text"
                    placeholder="Full Name"
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                      errors.fullName && touched.fullName ? 'border-red-500' : darkMode ? 'border-gray-600' : 'border-gray-300'
                    } ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} focus:outline-none focus:border-blue-500`}
                  />
                  <ErrorMessage name="fullName" component="div" className="text-red-500 text-sm mt-1" />
                </div>
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
                  disabled={isSubmitting || loading}
                  className={`w-full ${darkMode ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 rounded-lg transition-colors disabled:bg-blue-300`}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
              </Form>
            )}
          </Formik>
          <p className={`mt-4 text-center text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Already have an account?{' '}
            <a href="/login" className="text-blue-500 hover:underline">
              Log in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};
export default SignupForm;