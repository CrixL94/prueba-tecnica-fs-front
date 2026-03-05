import { PrimeReactProvider } from "primereact/api";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./router/Routes";


function App() {
  return (
    <>
      <PrimeReactProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </PrimeReactProvider>
    </>
  );
}

export default App;
