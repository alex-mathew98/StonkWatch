import React from 'react'; 
// import { Router, Switch } from 'react-router';
import './App.css';
import Nav_bar from "./components/NavBar/Navbar"
import { BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import Dashboard from './components/Pages/Dashboard'
import News from './components/Pages/News'
import Portfolio from './components/Pages/Portfolio'
import TrendingStockTickers from './components/Pages/TrendingStockTickers'
import TickerPage from './components/Pages/TickerPage';
import Login from './components/Pages/Login';
import TrendingCrypto from './components/Pages/TrendingCrypto';
import SignUp from './components/Pages/SignUp';
import EditEntry from './components/Pages/EditEntry';


function App() {
  return (
    <Router >
      <Switch>
        {/* <Route path='/login' exact component={Login}/>
        <Route path='/sign-up' exact component={SignUp}/> */}
         <div>
          <Nav_bar/>
          <Route path='/' exact component={Dashboard}/>
          <Route path='/news' exact component={News}/>
          <Route path='/portfolio' exact component={Portfolio}/>
          <Route exact path='/EditEntry/editID/:id' exact component={EditEntry}/>
          <Route path='/trending/tickers' exact component={TrendingStockTickers}/>
          <Route path='/trending/crypto' exact component={TrendingCrypto}/>
          <Route path='/ticker/:ticker' exact component={TickerPage}></Route>
          </div>
        </Switch>
    </Router>
  );
}

export default App;
