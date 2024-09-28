import React, { useRef, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { KeyRound } from 'lucide-react';
import { AppDispatch } from '../redux/Store';
import { useDispatch } from 'react-redux';
import { Verify } from '../redux/actions/AuthActions';
import { useNavigate } from 'react-router-dom';

interface OTPValues {
  digit1: string;
  digit2: string;
  digit3: string;
  digit4: string;
  digit5: string;
  digit6: string;
}

const OTPSchema = Yup.object().shape({
  digit1: Yup.string().length(1, 'Required').required('Required'),
  digit2: Yup.string().length(1, 'Required').required('Required'),
  digit3: Yup.string().length(1, 'Required').required('Required'),
  digit4: Yup.string().length(1, 'Required').required('Required'),
  digit5: Yup.string().length(1, 'Required').required('Required'),
  digit6: Yup.string().length(1, 'Required').required('Required'),
});

// const navigate = useNavigate();

interface OTPVerificationFormProps {
  data: any;
  
}

const OTPVerificationForm: React.FC<OTPVerificationFormProps> = ({ data }) => {
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length === 1 && index < 5 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  const handleSubmit = async(values: OTPValues, { setSubmitting }: FormikHelpers<OTPValues>) => {
    const otp = Object.values(values).join('');
    console.log({ otp, data });
    data.otp=otp
    const response = await dispatch(Verify(data));
    console.log(response);
    if (response.payload?.success == true) {
       navigate('/home')
       
      }
    
    setSubmitting(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <KeyRound className="text-blue-500" size={48} />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Verify Your Account</h2>
        <p className="text-center text-gray-600 mb-6">
          We've sent a 6-digit code to your email. Enter the code below to confirm your account.
        </p>
        <Formik
          initialValues={{ digit1: '', digit2: '', digit3: '', digit4: '', digit5: '', digit6: '' }}
          validationSchema={OTPSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <div className="flex justify-between mb-4">
                {[1, 2, 3, 4, 5, 6].map((digit, index) => (
                  <Field
                    key={`digit${digit}`}
                    name={`digit${digit}`}
                    type="text"
                    maxLength={1}
                    innerRef={inputRefs[index]}
                    onInput={(e: React.ChangeEvent<HTMLInputElement>) => handleInput(e, index)}
                    className={`w-12 h-12 text-center text-2xl font-bold rounded-lg border ${
                      errors[`digit${digit}` as keyof OTPValues] && touched[`digit${digit}` as keyof OTPValues]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    } focus:outline-none focus:border-blue-500`}
                  />
                ))}
              </div>
              <ErrorMessage name="digit1" component="div" className="text-red-500 text-sm mt-1" />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300 mt-6"
              >
                {isSubmitting ? 'Verifying...' : 'Verify'}
              </button>
            </Form>
          )}
        </Formik>
       
      </div>
    </div>
  );
};

export default OTPVerificationForm;