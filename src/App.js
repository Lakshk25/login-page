import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import Login from './Components/Login'
import Signup from './Components/Signup'
import Landing from './Components/Landing'
function App() {
  const seePass = () => {
    let pass = document.querySelector('#password');
    let eye = document.querySelector('#togglePassword');
    if (pass.type === 'password') {
        eye.classList.remove('fa-eye')
        eye.classList.add('fa-eye-slash')
        pass.type = 'text';
    }
    else {
        eye.classList.remove('fa-eye-slash')
        eye.classList.add('fa-eye')
        pass.type = 'password';
    }
}
  return (
    <div>
      <Navbar/>
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/login" element={<Login seePass={seePass}/>}/>
      <Route path="/signup" element={<Signup seePass={seePass}/>}/>
    </Routes>
    </div>
  );
}

export default App;
