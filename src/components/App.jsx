import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { getCategories, getPosts, getComments } from '../utils/api'
import { addPosts, addCategories, addComments } from '../actions'
import ListView from './ListView'
import Navbar from './Navbar'
import PostDetail from './PostDetail'
import '../App.css'

class App extends Component {
  state = {
    loadingPosts:false
  }

  componentDidMount(){
    const {addAllCategories, addAllPosts, addAllComments} = this.props

    this.setState({
      loadingPosts:true
    })

    getCategories().then((categories) => {
      addAllCategories(categories)
    })

    getPosts()
    .then((posts) => {
      addAllPosts(posts)
      return posts
    })
    .then((posts) => {
      posts.map((post) => {
        getComments(post.id)
        .then((comments) => {          
          addAllComments({
            id: post.id,
            comments
          })
        })
      })
    })
    .then(() => {
      this.setState({
        loadingPosts: false
      })
    })
  }

  render() {
    const {loadingPosts } = this.state
    const {posts, categories} = this.props

    return (
      <div>
        <Navbar title="Readable" categories={categories} />
        <div className="container">
          {categories.map((category) => (
            <Switch key={category.name}>
              <Route
                exact
                path={'/'+category.path}
                render={() => (
                  <ListView
                    category={category.name}
                    posts={posts}
                    loadingPosts={loadingPosts}
                  />
              )}/>
              <Route
                exact
                path={'/'+category.path+'/:id'}
                render={({match}) => (
                  <PostDetail id={match.params.id}/>
              )}/>
            </Switch>
          ))}
          <Route exact path="/" render={() => (
            <ListView
              category="All"
              posts={posts}
              loadingPosts={loadingPosts}/>
          )}/>
        </div>
      </div>
    )
  }
}

function mapStateToProps ({ categories, posts }) {
  return { categories, posts }
}

function mapDispatchToProps (dispatch) {
  return {
    addAllCategories: (data) => dispatch(addCategories(data)),
    addAllPosts: (data) => dispatch(addPosts(data)),
    addAllComments: (data) => dispatch(addComments(data))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
