import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTheme } from '../../context/ThemeContext';

interface Item {
  id?: string;
  _id?: string | null;
  name?: string;
  quantity?: number;
  description?: string;
  price?: number;
  category?: string;
}

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEditItem: (editedItem: Item) => Promise<void>;
  item: Item | null;
}

const validationSchema = Yup.object().shape({
  quantity: Yup.number().required('Quantity is required').min(0, 'Quantity must be at least 0'),
  price: Yup.number().required('Price is required').min(0, 'Price must be at least 0'),
  description: Yup.string().required('Description is required'),
});

const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, onClose, onEditItem, item }) => {
  if (!isOpen || !item) return null;
  const { darkMode } = useTheme();

  return (
    <div className={`fixed inset-0 ${darkMode ? 'bg-gray-800 bg-opacity-70' : 'bg-gray-600 bg-opacity-50'} overflow-y-auto h-full w-full`}>
  <div className={`relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md ${darkMode ? 'bg-gray-700' : 'bg-white'}`}>
    <h3 className={`text-lg font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Edit Item</h3>
    <Formik
      initialValues={{
        quantity: item.quantity || 0,
        price: item.price || 0,
        description: item.description || '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        await onEditItem({ ...item, ...values });
        setSubmitting(false);
        onClose();
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <div className="mb-4">
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="quantity">
              Quantity
            </label>
            <Field
              type="number"
              id="quantity"
              name="quantity"
              className={`shadow appearance-none border rounded w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
            />
            <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm" />
          </div>
          <div className="mb-4">
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="price">
              Price
            </label>
            <Field
              type="number"
              id="price"
              name="price"
              step="0.01"
              className={`shadow appearance-none border rounded w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
            />
            <ErrorMessage name="price" component="div" className="text-red-500 text-sm" />
          </div>
          <div className="mb-4">
            <label className={`block ${darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="description">
              Description
            </label>
            <Field
              as="textarea"
              id="description"
              name="description"
              className={`shadow appearance-none border rounded w-full py-2 px-3 ${darkMode ? 'bg-gray-600 text-white border-gray-500' : 'text-gray-700'} leading-tight focus:outline-none focus:shadow-outline`}
            />
            <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
            >
              Cancel
            </button>
          </div>
        </Form>
      )}
    </Formik>
  </div>
</div>

  );
};

export default EditItemModal;