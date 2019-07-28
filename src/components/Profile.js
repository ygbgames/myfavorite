import React, { Component } from 'react'
import { UserSession, Person } from 'blockstack'
import NavBar from './NavBar'
import Card from './Card'
import {jsonCopy, remove, add, check} from '../assets/utils'
import { appConfig, TASKS_FILENAME } from '../assets/constants'
import '../styles/Profile.css'

class Profile extends Component {
  constructor(props) {
  	super(props);

  	this.state = {
      tasks: [],
      value: '',
      catagory: 'Random',
      catagoryMap:[]
    }
    this.catagoryList = ["Food","Random","Drinks","Travel","Games","Cars"];
    this.loadTasks = this.loadTasks.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCatagoryChange = this.handleCatagoryChange.bind(this);
    this.addTask = this.addTask.bind(this);
    this.updateCatagoryMap = this.updateCatagoryMap.bind(this);
    //this.removeTask = this.removeTask.bind(this);
    //this.checkTask = this.checkTask.bind(this);
  }

  componentWillMount() {
    this.loadTasks();
  }

  componentWillReceiveProps(nextProps) {
    const nextTasks = nextProps.tasks;
    if(nextTasks) {
      if (nextTasks.length !== this.state.tasks.length) {
        this.setState({ tasks: jsonCopy(nextTasks) });
      }
    }
  }

  loadTasks() {
    const options = { decrypt: true };
    this.props.userSession.getFile(TASKS_FILENAME, options)
    .then((content) => {
      if(content) {
        const tasks = JSON.parse(content);
        // map it with catagory
        this.setState({tasks:tasks});
        this.updateCatagoryMap(tasks);
      }
    })
  }

  updateCatagoryMap(tasks){
    const catagoryMap = [];
    tasks.map((task) => {
          var catagory = task[0].catagory;
          var value = task[0].value;
          if(catagory in catagoryMap){
              catagoryMap[catagory].push(value);
          }
          else {
            catagoryMap[catagory] = [value];
          }
          console.log(catagoryMap);
    });
    this.setState({catagoryMap: catagoryMap});
  }
  saveTasks(tasks) {
    const options = { encrypt: true };
    this.props.userSession.putFile(TASKS_FILENAME, JSON.stringify(tasks), options);
    this.updateCatagoryMap(tasks);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
   }

   handleCatagoryChange(event) {
     this.setState({catagory: event.target.value});
    }

  /*removeTask(e) {
    e.preventDefault();
    const tasks = remove(e.target.dataset.index, this.state);
    this.setState({ tasks });
    this.saveTasks(tasks);
  }*/

  addTask(e) {
    e.preventDefault();
    const tasks = add(this.state);
    this.setState({value: '', tasks});
    this.saveTasks(tasks);
  }

  checkTask(e) {
    const tasks = check(e.target.dataset.index, this.state);
    this.setState({ tasks });
    this.saveTasks(tasks);
  }

  render() {
    const username = this.props.userSession.loadUserData().username;
    const profile = this.props.userSession.loadUserData();
    const person = new Person(profile);
    return (
      <div className="Dashboard">
      <NavBar username={username} user={person} signOut={this.props.handleSignOut}/>
        <div className="row justify-content-center"id="header">
          <h3 className="user-info">
            {username}'s favorites
          </h3>
        </div>
        <br></br>
        <div className="row justify-content-center">
          <div
            id="addTask"
            className="frame"
            style={{borderColor: '#f8f9fa'}}
          >
          <form onSubmit={this.addTask} className="input-group">
            <select class="form-control" id="catagorySelectId" value={this.state.catagory} onChange={this.handleCatagoryChange}>
              {this.catagoryList.map((catagory) =>
                  <option value={catagory}>{catagory}</option>
              )}
            </select>
            <input
                className="form-control"
                type="text"
                onChange={this.handleChange}
                value={this.state.value}
                required
                placeholder="To-do..."
                autoFocus={true}
              />
              <div className="input-group-append" id="add-task">
                <input type="submit" className="btn btn-primary" value="Add"/>
              </div>
            </form>
            </div>
          </div>
        <br></br>
        <div className="row justify-content-center">
          <div className="frame">
            {this.catagoryList.map( (catagory , index ) =>
                <Card catagory={catagory} values={this.state.catagoryMap[catagory]}/>
            )}
          </div>
      </div>
    </div>
  );
  }

}

// Made this a default prop (instead of using this.userSession) so a dummy userSession
// can be passed in for testing purposes
Profile.defaultProps = {
  userSession: new UserSession(appConfig)
};

export default Profile
