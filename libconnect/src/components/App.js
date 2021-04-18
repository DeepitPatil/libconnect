import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import Home from './Home/Home.js';
import Navbar from './Home/Navbar.js';
import BookInfo from './Home/BookInfo.js';
import Librarian from './Librarian/Librarian.js';
import AddBook from './Librarian/AddBook.js';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom"
import { Container } from "react-bootstrap"

function App() {
  return (
    <div>
      <div>
        <Router>
          <AuthProvider>
          <Navbar/>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              {/*<PrivateRoute path="/update-profile" component={UpdateProfile} />*/}
              <Route path="/sign-up" component={SignUp} />
              <Route path="/signin" component={SignIn} />
              <Route path="/home/:search" component={Home} />
              <Route path="/books/:isbn" component={BookInfo} />
              <Route path="/librarian/add-book" component={AddBook} />
              <Route path="/librarian" component={Librarian} />
              
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  )
}

export default App;
