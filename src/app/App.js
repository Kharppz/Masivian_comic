import React, { Component } from 'react'
class App extends Component {

    constructor() {
        super()
        this.state = {
            title: '',
            image: '',
            task: [],
            check: false,
            _id: '',
            init_score: '',
            score_saved: 0

        }
        this.getTask = this.getTask.bind(this)
        this.randomComic = this.randomComic.bind(this)
        this.addTask = this.addTask.bind(this)
    }

    getTask(title, image, score, _id) {
        this.setState({
            _id: _id,
            title: title,
            image: image,
            init_score: score,
            check: true
        })
    }

    addTask() {
        if (this.state.score_saved != 0) {
            if (this.state.check) {
                fetch(`./api/task/${this.state._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => res.json())
                    .then(data => {
                        const score = parseInt((this.state.init_score + this.state.score_saved) / 2)
                        this.setState({ score_saved: score })
                        const update = []
                        for (let i = 0; i < this.state.task.length; i++) {
                            if (this.state.task[i].title == this.state.title) {
                                update[i] = {
                                    _id: this.state.task[i]._id,
                                    title: this.state.title,
                                    image: this.state.task[i].image,
                                    total_score: score
                                }
                            } else {
                                update[i] = this.state.task[i]
                            }
                        }
                        this.setState({ tasks: update })
                        M.toast({ html: 'Score saved ;)' })
                        const starsScore = document.getElementsByName('starsScore');
                        for (let i = 0; i < starsScore.length; i++) {
                            if (starsScore[i].checked) {
                                starsScore[i].checked = !starsScore[i].checked
                            }
                        }
                    })
            } else {

                fetch('./api/task', {
                    method: 'POST',
                    body: JSON.stringify(this.state),
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                }).then(res => res.json())
                    .then(data => {
                        const sco = this.state.score_saved
                        this.setState({ init_score: sco })
                        const starsScore = document.getElementsByName('starsScore')
                        for (let i = 0; i < starsScore.length; i++) {
                            if (starsScore[i].checked) {
                                starsScore[i].checked = !starsScore[i].checked
                            }
                        }
                        M.toast({ html: 'Score saved ;)' })
                    })
                    .catch(err => console.log(err))
            }
        } else {
            M.toast({ html: 'Comic score has not been selected' })
        }
    }

    componentDidMount() {
        fetch('./api/task')
            .then(res => res.json())
            .then(data => {
                this.setState({ tasks: data })
            }).catch(err => {
                console.error(err)
            });

        let random = parseInt(Math.random() * (2105 - 1) + 1)
        const proxyurl = "https://protected-peak-24614.herokuapp.com/"
        const url = ("https://xkcd.com/" + random + "/info.0.json")
        fetch(proxyurl + url)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    title: data.title,
                    image: data.img
                })
            })
            .catch(err => {
                console.error(err)
            })
    }

    randomComic() {
        fetch('./api/task')
            .then(res => res.json())
            .then(data => {
                this.setState({ tasks: data })
            }).catch(err => {
                console.error(err)
            })

        let random = parseInt(Math.random() * (2105 - 1) + 1)
        const proxyurl = "https://protected-peak-24614.herokuapp.com/"
        const url = ("https://xkcd.com/" + random + "/info.0.json")
        fetch(proxyurl + url)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    title: data.title,
                    image: data.img
                })
                fetch(`./api/task/${data.title}`)
                    .then(rs => rs.json())
                    .then(data => {
                        if (data.length > 0) {
                            this.setState({
                                _id: data[0]._id,
                                init_score: data[0].score,
                                check: true
                            })
                        } else {
                            this.setState({
                                _id: "",
                                init_score: "",
                                check: false
                            })
                        }
                    })
            })
            .catch(err => {
                console.error(err)
            })

    }


    render() {
        return (
            <div>
                {/* Navegation */}
                <nav className="blue darken-1">
                    <div className="container">
                        <a className="brand-logo center" href="/">A daily XKCD comic</a>
                    </div>
                </nav>
                
                <div className="container">
                    <div className="row">

                        <div className="col s12 center">
                            <h1>{this.state.title}</h1>
                        </div>

                        <div className="col s12 center">
                            <img src={this.state.image}></img>
                        </div>

                        <div>
                            <span>
                                {(() => {
                                    switch (this.state.init_score) {
                                        case 1: return <i className="material-icons">star</i>
                                        case 2: return <i className="material-icons">star</i> * 2
                                        case 3: return <i className="material-icons">star</i> * 3
                                        case 4: return <i className="material-icons">star</i> * 4
                                        case 5: return <i className="material-icons">star</i> * 5
                                        default: return ""
                                    }
                                })()}
                            </span>
                        </div>

                        <div className="col s12 center">
                            <form>
                                <p className="score">
                                    <input id="radio1" type="radio" name="starsScore" value="5" onClick={() => this.setState({ score_saved: 5 })} />
                                    <label htmlFor="radio1"><i className="material-icons">star</i></label>
                                    <input id="radio2" type="radio" name="starsScore" value="4" onClick={() => this.setState({ score_saved: 4 })} />
                                    <label htmlFor="radio2"><i className="material-icons">star</i></label>
                                    <input id="radio3" type="radio" name="starsScore" value="3" onClick={() => this.setState({ score_saved: 3 })} />
                                    <label htmlFor="radio3"><i className="material-icons">star</i></label>
                                    <input id="radio4" type="radio" name="starsScore" value="2" onClick={() => this.setState({ score_saved: 2 })} />
                                    <label htmlFor="radio4"><i className="material-icons">star</i></label>
                                    <input id="radio5" type="radio" name="starsScore" value="1" onClick={() => this.setState({ score_saved: 1 })} />
                                    <label htmlFor="radio5"><i className="material-icons">star</i></label>
                                </p>
                            </form>
                        </div>

                        <div className="col s12 center">
                            <button className="btn blue darken-1" onClick={() => this.addTask()}>Send Score</button>
                            <button className="btn blue darken-1" onClick={() => this.randomComic()}  style={{ margin: '4px' }}>Random Comic</button>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default App