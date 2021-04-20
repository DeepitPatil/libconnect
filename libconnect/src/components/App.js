import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import Admin from './Admin.js';
import Home from './Home/Home.js';
import Navbar from './Home/Navbar.js';
import BookInfo from './Home/BookInfo.js';
import Account from './Home/Account.js';
import Librarian from './Librarian/Librarian.js';
import AddBook from './Librarian/AddBook.js';
import BookIssue from './Librarian/BookIssue.js';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route, useParams } from "react-router-dom"
import { Container } from "react-bootstrap"
import EditBook from './Home/EditBook.js';

function App() {
  return (
    <div>
      <div>
        <Router>
          <AuthProvider>
          <Navbar/>
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
              <Route path="/sign-up" component={SignUp} />
              <Route path="/signin" component={SignIn} />
              <Route path="/home/:search" component={Home} />
              <Route path="/books/:isbn" component={BookInfo} />
              <Route path="/edit/:isbn" component={EditBook} />
              <Route path="/librarian/add-book" component={AddBook} />
              <Route path="/librarian/book-issue" component={BookIssue} />
              <Route path="/librarian" component={Librarian} />
              <Route path="/account" component={Account} />
              <Route path="/admin" component={Admin} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  )
}

export default App;
