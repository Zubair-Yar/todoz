import 'materialize-css/dist/css/materialize.min.css';
import React from 'react';
import axios from 'axios';
import './style.css'
import "../css/material-icons.css"
import "../css/animation.css"


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            isEdit: false,
            show: 0,
            data: [],
            id: null,
            task: '',
            description: '',
            done: [],
            detailsId: null,
            detailsTask: '',
            detailsDescription: '',
         }
    }

    details = (data) => {
        
        this.setState({
            detailsId: data.id,
            detailsTask: data.task,
            detailsDescription: data.description,
            show: 3,
        }, () => {
            console.log(this.state.detailsDescription);
        });

       
    }


    onEdit = (data) => {
        this.setState({
            isEdit: true,
            id: data.id,
            task: data.task,
            description: data.description,
            show: 1,
            
        })
    }


    onTaskDelete = (id) =>{
        this.setState({id: id})
        axios.delete(`http://localhost/api/tasks/${id}`).then(() => {
            
            this.setState({
                data: this.state.data.filter((x) =>x.id !== id)
            });
        });
    }


    onDoneDelete = (id) =>{
        this.setState({id: id})
        axios.delete(`http://localhost/api/done/${id}`).then(() => {
            
            this.setState({
                done: this.state.done.filter((x) =>x.id !== id)
            })
        });
    }


    
    swipeToDone = (data) => {
        this.state.done.push(data);

        axios.post(`http://localhost/api/done`,{task: data.task, description: data.description}).then(() => {
            this.getData();
        });

        axios.delete(`http://localhost/api/tasks/${data.id}`).then(() => {
            
            this.setState({
                data: this.state.data.filter((x) =>x.id !== data.id)
            });
        });
        
    }



    swipeToTask = (data) => {
        this.state.data.push(data);
        
        axios.post(`http://localhost/api/tasks`,{task: data.task, description: data.description}).then(() => {
            this.getData();
        });

        axios.delete(`http://localhost/api/done/${data.id}`).then(() => {
     
            this.setState({
                done: this.state.done.filter((x) =>  x.id !== data.id)
            })
        });

    }
     

    getData = () => {
        axios.get(`http://localhost/api/tasks`).then(data => {
            this.setState({data: data.data});
        });

        axios.get(`http://localhost/api/done`).then(data => {
            this.setState({done: data.data})
        })
    }

    
    componentDidMount() {
        this.getData();
    }


    backAndReset = () => {  
        this.setState({
            show: 0,
            task: '',
            description: '',
            id: null,
            isEdit: false,
        });
    }


    handleSubmit  = (e) => {
        e.preventDefault();
        let data = {
            task: this.state.task,
            description: this.state.description,
            id: this.state.id,
        }

        if(!this.state.isEdit){
            if(this.state.task != ""){
                axios.post(`http://localhost/api/tasks`, data).then(() => {
                    this.getData();
                    this.backAndReset();
                });
            }else{this.backAndReset();}
        }else{
            if(this.state.task != ""){
                axios.put(`http://localhost/api/tasks/${data.id}`, data).then(() => {
                    this.getData();
                    this.backAndReset();
                    console.log("update");
                    
                });
            }else{this.backAndReset();}
        }
    }
    
    
    render() { 
        // The Task Tab
        if(this.state.show === 0){
            return (
                <React.Fragment>           
                {/* Start of Navigation  */}
                    <nav class="nav-extended blue">
                        <div class="nav-wrapper">
                        <a href="#" class="brand-logo">ToDoZ</a>
                        </div>
                        <div class="nav-content">
                        <ul class="tabs tabs-transparent row">
                            <li class="tab col s6" onClick={() => {this.setState({show: 0})}}><a class="active" href="#test1">Tasks</a></li>
                            <li class="tab col s6" onClick={() => {this.setState({show: 2})}}><a  href="#test2">Done</a></li>
                        </ul>
                        </div>
                    </nav>
                {/* End of Navigation */}
                    <a class="btn-floating btn-large waves-effect waves-light blue add" onClick={() => this.setState({show: 1,})}><i class="large material-icons">add</i></a>

                    <div className="container">  
                        {/* Start of Table */}
                        <table className="highlight">
                            <tbody>
                                {this.state.data.map((r, i) => {
                                    return(
                                        <tr key={i} className="row animated fadeIn">
                                            <td>
                                                <i class="material-icons col s1 " onClick={() => {this.swipeToDone(r)}}>done</i>
                                                <div className='select' onClick={() => {this.details(r)}}>
                                                    <span className="select2">
                                                        <span className='background'>{r.task}</span>
                                                    </span>
                                                </div>
                                                
                                                <i class="material-icons col right" onClick={() => {this.onEdit(r)}}>edit</i>
                                                <i class="material-icons col right" onClick={() => {this.onTaskDelete(r.id)}}>delete</i>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                        {/* End of Table */}
                    </div>
                </React.Fragment>
            );

        }else if(this.state.show === 1){
            // The Form Tab
            return(
                <React.Fragment>

                    {/* Start of Navigation */}
                    <nav>
                        <div class="nav-wrapper blue">
                            <i class="large material-icons left brand-logo" onClick={this.backAndReset}>arrow_back</i>   
                            {/* The Back Button */}
                        </div>
                    </nav>
                    {/* End of Navigation */}
                    <div className="container">
                        {/* Start of Form */}
                        <form onSubmit={this.handleSubmit}>
                            <div className='row'>
                                <div className='input-field col s12'>
                                    <input type='text' placeholder = "Name of the task" autoFocus name="task" value={this.state.task} onChange={(e) =>{this.setState({task: e.target.value})}} />
                                </div>
                            </div>
                            <div className='row'>
                                <div className='input-field col s12'>
                                    <textarea className="materialize-textarea" placeholder = "Description (optional)" name="description" value={this.state.description} onChange={(e) =>{this.setState({ description: e.target.value})}}>
                                    </textarea>
                                </div>
                            </div>
                            <div className='row'>
                                <div className="row col s10">
                                    <button class="btn waves-effect waves-light blue " type="submit" name="submit" >{this.state.isEdit ? 'update' : 'save'}
                                        <i class="large material-icons right">send</i>
                                    </button>    
                                </div>
                            </div>    
                        </form>
                        {/* End of Form */}
                    </div>
                </React.Fragment>
            );

        }else if(this.state.show === 2){
            // The Done Tab
            return(
                <React.Fragment>
                    {/* Start of Navigation */}
                    <nav class="nav-extended blue">
                        <div class="nav-wrapper">
                        <a href="#" class="brand-logo">ToDoZ</a>
                        </div>
                        <div class="nav-content">
                        <ul class="tabs tabs-transparent row">
                            <li class="tab col s6" onClick={() => {this.setState({show: 0})}}><a class="active" href="#test1">Tasks</a></li>
                            <li class="tab col s6" onClick={() => {this.setState({show: 2})}}><a  href="#test2">Done</a></li>
                        </ul>
                        </div>
                    </nav>
                    {/* End of Navigation  */}
                    <div className="container">                    
                    {/* Start of Table */}
                        <table className="highlight">
                            <tbody>
                                {this.state.done.map((r, i) => {
                                    return(
                                        <tr key={i} className="row animated fadeIn">
                                            <td>
                                                <i class="material-icons col s1" onClick={() => {this.swipeToTask(r)}}>done_all</i>
                                                <div className='select'>
                                                    <span className="select2">
                                                        <span className='background2'>{r.task}</span>
                                                    </span>
                                                </div>
                                                <i class="material-icons col right" onClick={() => {this.onDoneDelete(r.id)}}>delete</i>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    {/* End of Table */}
                    </div>
                </React.Fragment>
             
            );
        }else if(this.state.show === 3){
            // The Done Tab
            return(
                <React.Fragment>
                    {/* Start of Navigation */}
                    <nav>
                        <div class="nav-wrapper blue">
                            <i class="large material-icons left brand-logo" onClick={this.backAndReset}>arrow_back</i>   
                            {/* The Back Button */}
                        </div>
                    </nav>
                    {/* End of Navigation  */}
                    <div className="container">                    
                    {/* Start of Table */}
                        <table className="highlight">
                            <tbody>
                                <tr className="row animated fadeIn">
                                    <td>
                                        <div className='select'>
                                            <span className="select2">
                                                <span className="background">{this.state.detailsTask}</span>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                                <tr className="row animated fadeIn">
                                    <td>
                                        <div className='select'>
                                            <span >
                                                <span>{this.state.detailsDescription}</span>
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    {/* End of Table */}
                    </div>
                </React.Fragment>
             
            );
        }
        
    
    }
}
 
export default App;
