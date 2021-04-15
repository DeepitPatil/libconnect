import SignIn from './SignIn.js';
import SignUp from './SignUp.js';
import PrivateRoute from './PrivateRoute';
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import { Container } from "react-bootstrap"

function App() {
  return (
    <div>
      <div>
        <Router>
          <AuthProvider>
            <Switch>
              <PrivateRoute exact path="/" component={SignUp} />
              {/*<PrivateRoute path="/update-profile" component={UpdateProfile} />*/}
              <Route path="/signup" component={SignUp} />
              <Route path="/signin" component={SignIn} />
            </Switch>
          </AuthProvider>
        </Router>
      </div>
    </div>
  )
}

export default App;
