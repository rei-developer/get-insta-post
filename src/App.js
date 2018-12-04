import React, { Component } from 'react'
import axios from 'axios'
import {
  InputGroup,
  InputGroupAddon,
  Input,
  Button
} from 'reactstrap'
import { ToastContainer, toast } from 'react-toastify'
import './App.css'

class App extends Component {
  state = {
    loading: false,
    inputText: '',
    result: ''
  }

  setInputText = (e) => {
    this.setState({
      inputText: e.target.value
    })
  }

  enter = (e) => {
    if (e.which === 13) {
      e.preventDefault()
      this.extract()
    }
  }

  extract = async () => {
    const { loading, inputText } = this.state
    if (loading) return
    if (inputText === '') return toast.error('빈 칸을 입력하세요.')
    this.setState({
      loading: true
    }, async () => {
      try {
        const response = await axios.get(`${inputText}?__a=1`)
        const data = await response.data
        const context = data.graphql.shortcode_media.edge_media_to_caption.edges[0].node.text
        this.setState({
          loading: false,
          result: context
        }, () => {
          toast.success('성공적으로 추출을 완료했습니다.')
        })
      } catch (e) {
        this.setState({
          loading: false
        }, () => {
          toast.error('잘못된 형식이거나 존재하지 않는 주소입니다.')
        })
      }
    })
  }

  render() {
    const { result } = this.state
    return (
      <div className='App'>
        <ToastContainer
          position='top-center'
          autoClose={2000}
        />
        <InputGroup>
          <Input
            type='text'
            onChange={this.setInputText}
            onKeyPress={this.enter}
            placeholder='이곳에 인스타그램 포스트 주소를 입력하세요...'
            autoFocus
          />
          <InputGroupAddon addonType='append'>
            <Button
              color='primary'
              onClick={this.extract}
            >
              추출
            </Button>
          </InputGroupAddon>
        </InputGroup>
        {result !== '' ? (
          <>
            <br />
            <Input
              type='textarea'
              defaultValue={result}
              rows={20}
            />
          </>
        ) : ''}
      </div>
    )
  }
}

export default App