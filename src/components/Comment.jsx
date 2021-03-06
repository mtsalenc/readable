import React, { Component } from 'react'
import { connect } from 'react-redux'
import Button from 'react-bootstrap/lib/Button'
import Media from 'react-bootstrap/lib/Media'
import Label from 'react-bootstrap/lib/Label'
import {
  removeComment,
  upVoteComment,
  downVoteComment
} from '../actions'
import {
  removeComment as removeCommentApi,
  voteComment as voteApi,
} from '../utils/api'

class Comment extends Component {
  onEditCommentClick = (e) => {
    e.preventDefault()
    const {id,parentId,posts,onEditClick} = this.props
    const comment = posts[parentId].comments[id]

    onEditClick(comment)
  }

  onRemoveCommentClick = (e) => {
    e.preventDefault()
    const {id, removeComment, parentId} = this.props
    removeCommentApi(id)
    removeComment({id,parentId})
  }

  onUpVoteCommentClick = (e) => {
    e.preventDefault()
    const {id,parentId,upVoteComment} = this.props
    voteApi(id,'upVote')
    upVoteComment({id,parentId})
  }

  onDownVoteCommentClick = (e) => {
    e.preventDefault()
    const {id,parentId,downVoteComment} = this.props
    voteApi(id,'downVote')
    downVoteComment({id,parentId})
  }

  render() {
    const {id,parentId,posts} = this.props
    const comment = posts[parentId].comments[id]

    return (
      <Media>
        <Media.Body>
          <p>
            {comment.author}
            <small> - </small>
            <small><Label>{comment.voteScore}</Label></small>
          </p>
          <h6>{comment.body}</h6>
        </Media.Body>
        <Media.Right>
          <Button
            onClick={this.onEditCommentClick}
            className="glyphicon glyphicon-pencil"
            bsSize="small" />
        </Media.Right>
        <Media.Right>
          <Button
            onClick={this.onRemoveCommentClick}
            className="glyphicon glyphicon-trash"
            bsSize="small" />
        </Media.Right>
        <Media.Right>
          <Button
            onClick={this.onUpVoteCommentClick}
            className="glyphicon glyphicon-chevron-up"
            bsSize="small" />
          <Button
            onClick={this.onDownVoteCommentClick}
            className="glyphicon glyphicon-chevron-down"
            bsSize="small" />
        </Media.Right>
      </Media>
    )
  }
}

function mapStateToProps({posts}){
  return {posts}
}

export default connect(
  mapStateToProps,
  {removeComment,upVoteComment,downVoteComment}
)(Comment)
