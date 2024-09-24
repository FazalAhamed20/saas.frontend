
import  { Suspense } from 'react';
import LoadingSpinner from './utils/modal/LoadingSpinner';
import RouteConfig from './routes/RouteConfig';


function App() {


  return (
    <>
    <Suspense fallback={<LoadingSpinner />}>
      <RouteConfig />
    </Suspense>
  
     
    </>
  )
}

export default App
