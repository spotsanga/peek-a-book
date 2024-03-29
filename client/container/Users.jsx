import React, { Component } from 'react';
import api from 'axios';
import _ from 'lodash';
import { toastr } from 'react-redux-toastr'

const options = { transitionIn: 'bounceInDown', transitionOut: 'bounceOutUp' };

class Users extends Component {
    constructor() {
        super();
        this.state = {
            results: [],
            filterKeyValues: { name: "-" }
        }
        this.getResults = this.getResults.bind(this);
        this.filteredResults = this.filteredResults.bind(this);
        this.getRenderData = this.getRenderData.bind(this);
    }
    getResults() {
        api.get('/api/v1/users/all').then(res => {
            this.setState({ results: res.data.results, filteredResults: res.data.data });
        })
    }
    filteredResults() {
        let filterKeyValues = this.state.filterKeyValues;
        let ans = _.filter(this.state.results, (entry) => {
            for (let [key, val] in Object.entries(filterKeyValues)) {
                return true;
                if (!user[key] || user[key].indexOf(val) == -1) return false;
            }
            return true;
        })
        return ans;
    }
    confirmDeleteEntry(_id) {
        let url = `/api/v1/user/${_id}`;
        api.delete(url).then(res => {
            toastr.success('Success', res.data.message, options);
            this.getResults();
        }).catch(err => {
            console.error("ERR", err);
            toastr.error('Error', err.message, options);
        });
    }
    deleteEntry(_id) {
        toastr.confirm('Are you sure?', { onOk: () => { this.confirmDeleteEntry(_id) } })
    }
    getRenderData() {
        return this.filteredResults().map((entry, index) => {
            return (
                <div className="card" key={index}>
                    <div className="d-flex detail">
                        <div className="icon"><i className="far fa-user"></i></div>
                        <div className="text">{entry.name} <small>({entry.rollNo})</small></div>
                    </div>
                    <div className="d-flex detail">
                        <div className="icon"><i className="fas fa-mobile-alt"></i></div>
                        <div className="text">{entry.phone}</div>
                    </div>
                    <div className="d-flex detail">
                        <div className="icon"><i className="far fa-envelope-open"></i></div>
                        <div className="text">{entry.email}</div>
                    </div>
                    <div className="d-flex detail">
                        <div className="icon"><i className="far fa-envelope-open"></i></div>
                        <div className="text">{entry.year}</div>
                    </div>
                    <div className="d-flex detail">
                        <div className="icon"><i className="far fa-envelope-open"></i></div>
                        <div className="text">{entry.campus}</div>
                    </div>
                    <div className="d-flex detail">
                        <div className="icon"><i className="far fa-envelope-open"></i></div>
                        <div className="text">{entry.stayType}</div>
                    </div>
                    <div className="d-flex">
                        <div className="detail card-btn left-btn"
                            onClick={() => { this.props.editPopup('user', entry) }}>Edit</div>
                        <div className="detail card-btn right-btn"
                            onClick={() => { this.deleteEntry(entry._id) }}>Del</div>
                    </div>
                </div>
            );
        })
    }
    componentDidMount() {
        this.getResults();
    }
    render() {
        return (
            <div className="flex-row">
                {this.getRenderData()}
            </div>
        );
    }
}
export default Users;