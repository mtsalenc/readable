import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addPost } from '../actions'
import { addPost as addPostApi } from '../utils/api'
import Modal from 'react-bootstrap/lib/Modal'
import Button from 'react-bootstrap/lib/Button'
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'
import Form from 'react-bootstrap/lib/Form'
import FormGroup from 'react-bootstrap/lib/FormGroup'
import FormControl from 'react-bootstrap/lib/FormControl'
import ControlLabel from 'react-bootstrap/lib/ControlLabel'
import Col from 'react-bootstrap/lib/Col'

class NewPostModal extends Component {
  state = {
    title:'',
    author:'',
    category:'',
    body:''
  }

  onAddClick = (e) => {
    e.preventDefault()
    const {title, author, body, category} = this.state
    const {publishPost, closeClick} = this.props

    const post = {
      id: Math.random().toString(36).substr(-8),
      timestamp: Date.now(),
      category,
      title,
      author,
      body
    }
    addPostApi(post)
    publishPost(post)
    closeClick()
  }

  updateTitle(title){
    this.setState({title})
  }

  updateAuthor(author){
    this.setState({author})
  }

  updateBody(body){
    this.setState({body})
  }

  onCategorySelect = (category) => {
    this.setState({category})
  }

  componentWillReceiveProps(){
    this.setState({
      title:'',
      author:'',
      category:'',
      body:''
    })
  }

  render() {
    const {isOpen,closeClick,categories} = this.props
    const {category} = this.state

    return (
      <Modal show={isOpen} onHide={closeClick}>
        <Modal.Header closeButton>
          <Modal.Title>New</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form horizontal>
          <FormGroup controlId="formHorizontalTitle">
            <Col componentClass={ControlLabel} sm={2}>
              Title
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Ground Control To Major Tom..."
                onChange={(event) => this.updateTitle(event.target.value)}/>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalAuthor">
            <Col componentClass={ControlLabel} sm={2}>
              Category: {category}
            </Col>
            <Col sm={10}>
              <ButtonToolbar>
                <DropdownButton
                  bsSize="small"
                  title="Select..."
                  id="dropdown-size-large"
                >
                  {categories.map((category) => (
                    <MenuItem
                      eventKey={category.name}
                      key={category.name}
                      onSelect={this.onCategorySelect}>
                      {category.name}
                    </MenuItem>
                  ))}
                </DropdownButton>
              </ButtonToolbar>
            </Col>
          </FormGroup>
          <FormGroup controlId="formHorizontalAuthor">
            <Col componentClass={ControlLabel} sm={2}>
              Author
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                placeholder="Elon Molusk"
                onChange={(event) => this.updateAuthor(event.target.value)}
              />
            </Col>
          </FormGroup>
          <FormGroup controlId="formControlsTextarea">
            <Col componentClass={ControlLabel} sm={2}>
              Body
            </Col>
            <Col sm={10}>
              <FormControl
                type="text"
                componentClass="textarea"
                placeholder="This is Major Tom to ground control..."
                onChange={(event) => this.updateBody(event.target.value)}/>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col smOffset={2} sm={10}>
              <Button
                type="submit"
                bsStyle="primary"
                onClick={this.onAddClick}>Publish</Button>
            </Col>
          </FormGroup>
          </Form>
        </Modal.Body>
      </Modal>
    )
  }
}

function mapDispatchToProps (dispatch) {
  return {
    publishPost: (data) => dispatch(addPost(data))
  }
}

function mapStateToProps ({categories}){
  return {categories}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewPostModal)