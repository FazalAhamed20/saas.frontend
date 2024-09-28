import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';

interface Product {
  id: string;
  _id?: string | null;
  name: string;
  category: string;
  image: File | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (product: Product) => Promise<void>;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  category: Yup.string().required('Category is required'),
  image: Yup.mixed().required('Image is required')
});

const AddProductModal: React.FC<Props> = ({ isOpen, onClose, onAddItem }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { darkMode } = useTheme();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: (field: string, value: any) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFieldValue('image', file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`bg-white ${darkMode ? 'dark:bg-gray-800 dark:text-gray-300' : ''} rounded-lg p-6 shadow-md`}>
        <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'dark:text-white' : ''}`}>Add New Item</h3>
        <Formik
          initialValues={{ id: '', name: '', category: '', image: null }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            await onAddItem({ ...values, id: Date.now().toString() });
            resetForm();
            setImagePreview(null);
            onClose();
            setSubmitting(false);
          }}
        >
          {({ isSubmitting, setFieldValue }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'}`}>Item Name</label>
                <Field
                  type="text"
                  name="name"
                  className={`mt-1 block w-full border-gray-300 rounded-md ${darkMode ? 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}`}
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="category" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'}`}>Category</label>
                <Field
                  type="text"
                  name="category"
                  className={`mt-1 block w-full border-gray-300 rounded-md ${darkMode ? 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}`}
                />
                <ErrorMessage name="category" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="image" className={`block text-sm font-medium ${darkMode ? 'dark:text-gray-300' : 'text-gray-700'}`}>Upload Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setFieldValue)}
                  className={`mt-1 block w-full border-gray-300 rounded-md ${darkMode ? 'dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300' : ''}`}
                />
                <ErrorMessage name="image" component="div" className="text-red-500 text-sm" />
              </div>

              {imagePreview && (
                <div className="mb-4">
                  <img src={imagePreview} alt="Image Preview" className="w-full h-52 rounded-md" />
                </div>
              )}

              <div className="flex justify-end">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2 dark:bg-gray-600 dark:text-white">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`px-4 py-2 ${isSubmitting ? 'bg-blue-300' : 'bg-blue-500'} text-white rounded ${isSubmitting ? 'dark:bg-blue-300' : 'dark:bg-blue-600'}`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </div>
                  ) : 'Add Item'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddProductModal;