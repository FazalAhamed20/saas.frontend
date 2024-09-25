import React, { useEffect, useState } from 'react';
import { AppDispatch } from '../../redux/Store';
import { useDispatch, useSelector } from 'react-redux';
import { fetchItem } from '../../redux/actions/InventoryActions';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

interface Item {
  id: string;
  name: string;
  quantity: number;
  description: string;
  price: number;
  category: string;
  userId: string;
}

interface AvailableItem {
  name: string;
  category: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Item) => void;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Item name is required'),
  quantity: Yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
  price: Yup.number().min(0, 'Price must be non-negative').required('Price is required'),
  description: Yup.string().required('Description is required'),
});

const AddItemModal: React.FC<Props> = ({ isOpen, onClose, onAddItem }) => {
  const [availableItems, setAvailableItems] = useState<AvailableItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const dispatch: AppDispatch = useDispatch();
  const userId = useSelector((state: any) => state.auth.user?.user?.UserId);

  useEffect(() => {
    if (isOpen) {
      fetchItems();
    }
  }, [isOpen]);

  const fetchItems = async () => {
    const response = await dispatch(fetchItem());
    setAvailableItems(response.payload?.data?.categories || []);
  }

  const handleSubmit = async (values: Item, { resetForm }: any) => {
    setIsLoading(true);
    await onAddItem({ ...values, id: Date.now().toString(), userId: userId });
    resetForm();
    onClose();
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg p-6 shadow-md'>
        <h3 className='text-lg font-bold mb-4'>Add New Item</h3>
        <Formik
          initialValues={{
            id: '',
            name: '',
            quantity: 0,
            description: '',
            price: 0,
            category: '',
            userId: ''
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue }) => (
            <Form>
              <div className='mb-4'>
                <label className="block text-sm font-medium text-gray-700">Select Item</label>
                <Field
                  as="select"
                  name="name"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    const selectedName = e.target.value;
                    const selectedItemData = availableItems.find(item => item.name === selectedName);
                    if (selectedItemData) {
                      setFieldValue('name', selectedItemData.name);
                      setFieldValue('category', selectedItemData.category);
                    }
                  }}
                >
                  <option value="">Select an Item</option>
                  {availableItems.map((item) => (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Category</label>
                <Field
                  type='text'
                  name="category"
                  readOnly
                  className='mt-1 block w-full border-gray-300 rounded-md bg-gray-100'
                />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Quantity</label>
                <Field
                  type='number'
                  name="quantity"
                  className='mt-1 block w-full border-gray-300 rounded-md'
                  min={1}
                />
                <ErrorMessage name="quantity" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Price</label>
                <Field
                  type='number'
                  name="price"
                  className='mt-1 block w-full border-gray-300 rounded-md'
                  min={0}
                  step="0.01"
                />
                <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700'>Description</label>
                <Field
                  as="textarea"
                  name="description"
                  className='mt-1 block w-full border-gray-300 rounded-md'
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className='flex justify-end'>
                <button type='button' onClick={onClose} className='px-4 py-2 bg-gray-300 text-gray-700 rounded mr-2'>
                  Cancel
                </button>
                <button type='submit' className='px-4 py-2 bg-blue-500 text-white rounded' disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Item'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default AddItemModal;