import { BrowserRouter, Routes } from "react-router";
import { Toaster } from "sonner";
import SignInPage from "./pages/SignInPage.tsx";
import SignUpPage from "./pages/SignUpPage.tsx";
import ChatAppPage from "./pages/ChatAppPage.tsx";

function App() {

    return <>
        <Toaster richColors />
        <BrowserRouter>
            <Routes>
                {/* public routes */}
                <Route path="/signin"
                    element={<SignInPage />}
                />

                {/* private routes  */}
                <Route path="/signup"
                    element={<SignUpPage />}
                />

                {/* protectect routes */}
                <Route path="/"
                    element={<ChatAppPage />}
                />
            </Routes>
        </BrowserRouter>

    </>;
}

export default App
