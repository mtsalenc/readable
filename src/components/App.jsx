import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux';
import { getCategories, getPosts, getComments } from '../utils/api'
import { addPosts, addCategories, addComments } from '../actions'
import ListView from './ListView'
import Navbar from './Navbar'
import PostDetailContainer from './PostDetailContainer'
import '../App.css'

class App extends Component {
  state = {
    loadingPosts:false
  }

  componentDidMount(){
    const {addCategories, addPosts, addComments} = this.props

    this.setState({
      loadingPosts:true
    })

    // Fetch all categories from api and store in redux store
    getCategories().then((categories) => {
      addCategories(categories)
    })

    // Fetch all posts from api and store in redux store
    getPosts()
    .then((posts) => {
      addPosts(posts)
      return posts
    })
    .then((posts) => {
      posts.map((post) => {
        // Fetch the post's comments from api and store in redux store
        getComments(post.id)
        .then((comments) => {
          addComments({
            id: post.id,
            comments
          })
        })
        return post
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
                  <PostDetailContainer id={match.params.id}/>
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

export default connect(
  mapStateToProps,
  {addCategories,addPosts,addComments}
)(App)
