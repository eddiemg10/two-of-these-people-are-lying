import { Query, QuerySnapshot } from "@firebase/firestore";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";
import TodoForm from "./components/ArticleForm";
import ArticleList from "./components/ArticleList";
import firebase from "./firebase";
import db from "./database/users";
import { RiH1 } from "react-icons/ri";
import Home from "./components/Home";
import NotFound from "./components/NotFound";
// import { ReactNotification, Store } from "react-notifications-component";
// import "react-notifications-component/dist/theme.css";
// import "animate.css/animate.min.css";

function App() {
  const [user, setUser] = useState("");

  // console.log(users);

  // return <h1>{users?.[0]?.username ?? (() => typeof users?.[0])()}</h1>;
  // return <h1>hello</h1>;
  useEffect(() => {
    db.useSetUser().then((user) => {
      setUser(user);
    });
  }, []);

  return (
    <Router>
      {/* <ReactNotification /> */}
      <div className="article-apps">
        <Switch>
          <Route path="/room/:id">
            <ArticleList />
          </Route>

          <Route exact path="/">
            <Home />
          </Route>

          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
